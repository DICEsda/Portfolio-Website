using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using FinanceTracker.DataAccess;
using FinanceTracker.Models;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace FinanceTracker.Tests.DataAccess;

// ───────────────────────────────────────────────────────────────
// Tests for the generic DataAccessService<T>.
//
// ▸  Covers every public method.
// ▸  Each test is kept short & intention-revealing.
// ▸  Comments are minimal yet meaningful.
// ───────────────────────────────────────────────────────────────
[TestFixture]
public class DataAccessServiceTest
{
    // New database name each time → true isolation, no shared state.
    private DbContextOptions<FinanceTrackerContext> _options;

    [SetUp]
    public void Setup()
    {
        _options = new DbContextOptionsBuilder<FinanceTrackerContext>()
                   .UseInMemoryDatabase(Guid.NewGuid().ToString())
                   .Options;
    }

    // ------------------------------------------------------------------
    // Helper factories – keep the test code lean.
    // ------------------------------------------------------------------
    private DataAccessService<Job> CreateSut()
        => new(new FinanceTrackerContext(_options));

    private static Job NewJob(
        string company = "Acme",
        string userId = "user-1",
        decimal hourlyRate = 150M)
        => new()
        {
            CompanyName = company,
            UserId = userId,
            HourlyRate = hourlyRate
        };

    // ────────────────────────────────
    // Z  → Zero records / not-found
    // ────────────────────────────────
    [Test]
    public async Task GetAllAsync_WhenEmpty_ReturnsEmptyCollection()
    {
        var sut = CreateSut();

        var result = await sut.GetAllAsync();

        Assert.IsEmpty(result);                     // EP: “zero” partition
    }

    // ────────────────────────────────
    // O  → One happy-path record
    // ────────────────────────────────
    [Test]
    public async Task AddAsync_ThenGetByIdAsync_ReturnsPersistedEntity()
    {
        var sut = CreateSut();
        var job = NewJob();

        await sut.AddAsync(job);

        var fetched = await sut.GetByIdAsync(job.CompanyName, job.UserId);
        Assert.NotNull(fetched);
        Assert.AreEqual(job.CompanyName, fetched!.CompanyName);
    }

    // ────────────────────────────────
    // M  → Many records
    // ────────────────────────────────
    [Test]
    public async Task GetAllAsync_WithThreeRows_ReturnsAll()
    {
        var sut = CreateSut();
        await sut.AddAsync(NewJob("A"));
        await sut.AddAsync(NewJob("B"));
        await sut.AddAsync(NewJob("C"));

        var result = (await sut.GetAllAsync()).ToList();

        Assert.AreEqual(3, result.Count);          // EP: “many” partition
    }

    // ────────────────────────────────
    // I  → Interface (API contract)
    //     - filtering delegates work
    // ────────────────────────────────
    [Test]
    public async Task GetFilteredAsync_ReturnsOnlyMatchingRows()
    {
        var sut = CreateSut();
        await sut.AddAsync(NewJob("Match"));
        await sut.AddAsync(NewJob("Nope"));

        Expression<Func<Job, bool>> predicate = j => j.CompanyName == "Match";
        var filtered = (await sut.GetFilteredAsync(predicate)).ToList();

        Assert.That(filtered, Has.Count.EqualTo(1));
        Assert.AreEqual("Match", filtered[0].CompanyName);
    }

    // ────────────────────────────────
    // E  → Exceptional / error paths
    // ────────────────────────────────
    [Test]
    public void AddAsync_NullEntity_ThrowsArgumentNull()
    {
        var sut = CreateSut();
        // White-box knowledge: EF will throw for null.
        Assert.ThrowsAsync<ArgumentNullException>(() => sut.AddAsync(null!));
    }

    // ------------------------------------------------------------
    // CRUD remainder: Update & Delete (white-box state checks)
    // ------------------------------------------------------------
    [Test]
    public async Task UpdateAsync_ModifiesPersistedEntity()
    {
        var sut = CreateSut();
        var job = NewJob(hourlyRate: 123);
        await sut.AddAsync(job);

        job.HourlyRate = 321;                      // mutate
        await sut.UpdateAsync(job);

        var updated = await sut.GetByIdAsync(job.CompanyName, job.UserId);
        Assert.AreEqual(321, updated!.HourlyRate);
    }

    [Test]
    public async Task DeleteAsync_RemovesEntity()
    {
        var sut = CreateSut();
        var job = NewJob();
        await sut.AddAsync(job);

        await sut.DeleteAsync(job);
        var gone = await sut.GetByIdAsync(job.CompanyName, job.UserId);

        Assert.IsNull(gone);
    }

    // ------------------------------------------------------------
    // FirstOrDefault – proves correct short-circuit behaviour.
    // ------------------------------------------------------------
    [Test]
    public async Task GetFirstOrDefaultAsync_ReturnsFirstMatch()
    {
        var sut = CreateSut();
        await sut.AddAsync(NewJob("X", userId: "user-1"));  // first row
        await sut.AddAsync(NewJob("X", userId: "user-2"));  // second row - unique key

        Expression<Func<Job, bool>> filter = j => j.CompanyName == "X";

        var first = await sut.GetFirstOrDefaultAsync(filter);

        Assert.NotNull(first);
        Assert.AreEqual("X", first!.CompanyName);
    }
}
