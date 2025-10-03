using FinanceTracker.Controllers;
using FinanceTracker.DTO;
using FinanceTracker.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace FinanceTracker.Tests.Controllers;

[TestFixture]
public sealed class SupplementDetailsControllerTests
{
    private const string UserId = "uid-1";
    private const string CompanyName = "Acme";

    private FakeData<Job> _jobs = null!;
    private FakeData<SupplementDetails> _supps = null!;
    private SupplementDetailsController _sut = null!;

    #region ─── test life-cycle ───────────────────────────────────────
    [SetUp]
    public void SetUp()
    {
        _jobs = new FakeData<Job>();
        _supps = new FakeData<SupplementDetails>();

        _jobs.Storage.Add(new Job { CompanyName = CompanyName, HourlyRate = 100, UserId = UserId });

        _sut = new SupplementDetailsController(_jobs, _supps)
        {
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    User = new ClaimsPrincipal(
                               new ClaimsIdentity(
                                   new[] { new Claim(ClaimTypes.NameIdentifier, UserId) }, "test"))
                }
            }
        };
    }
    #endregion

    // ───────────────────── RegisterSupplementPay ────────────────────
    [Test]                         // EP – happy path, Z=0 errors
    public async Task RegisterSupplement_OK()
    {
        var dtoList = new List<SupplementDetailsDTO>
        {
            new()
            {
                Weekday   = DayOfWeek.Monday,
                Amount    = 30,
                StartTime = new DateTime(1,1,1,18,0,0),
                EndTime   = new DateTime(1,1,1,23,0,0)
            }
        };

        var res = await _sut.RegisterSupplementPay(dtoList, CompanyName) as OkObjectResult;

        Assert.That(res, Is.Not.Null);
        Assert.That(_supps.Storage, Has.Count.EqualTo(dtoList.Count));
        Assert.That(_supps.Storage.First().CompanyName, Is.EqualTo(CompanyName));
    }

    [Test]                         // BVA – ModelState just invalid
    public async Task RegisterSupplement_BadModel()
    {
        _sut.ModelState.AddModelError("x", "y");

        var res = await _sut.RegisterSupplementPay(new List<SupplementDetailsDTO>(), CompanyName)
                  as BadRequestObjectResult;

        Assert.That(res!.StatusCode, Is.EqualTo(StatusCodes.Status400BadRequest));
    }

    [Test]                         // Z-one – job not found (controller still returns OK)
        public async Task RegisterSupplement_JobMissing()
    {
        var dto = new List<SupplementDetailsDTO>
        {
            new() { Weekday = DayOfWeek.Sunday, Amount = 50,
                    StartTime = DateTime.MinValue, EndTime = DateTime.MinValue }
        };

        var res = await _sut.RegisterSupplementPay(dto, "NoSuchCompany") as OkObjectResult;

        Assert.That(res, Is.Not.Null);                       // action falls through
        Assert.That(_supps.Storage, Has.Count.EqualTo(1));   // items still stored
    }

    [Test]                         // BVA – empty DTO list
    public async Task RegisterSupplement_EmptyList()
    {
        var res = await _sut.RegisterSupplementPay(new List<SupplementDetailsDTO>(), CompanyName)
                  as OkObjectResult;

        Assert.That(res, Is.Not.Null);
        Assert.That(_supps.Storage, Is.Empty);
    }

    // ─────────────────────── in-memory fake DAL ─────────────────────
    private sealed class FakeData<T> : IDataAccessService<T> where T : class
    {
        public readonly List<T> Storage = new();

        public Task AddAsync(T e) { Storage.Add(e); return Task.CompletedTask; }
        public Task DeleteAsync(T e) { Storage.Remove(e); return Task.CompletedTask; }
        public Task UpdateAsync(T e) => Task.CompletedTask;
        public Task<IEnumerable<T>> GetAllAsync() => Task.FromResult(Storage.AsEnumerable());
        public Task<T?> GetByIdAsync(params object[] _) => Task.FromResult(Storage.FirstOrDefault());
        public Task<IEnumerable<T>> GetFilteredAsync(
            System.Linq.Expressions.Expression<Func<T, bool>> p) =>
            Task.FromResult(Storage.AsQueryable().Where(p).AsEnumerable());
        public Task<T?> GetFirstOrDefaultAsync(
            System.Linq.Expressions.Expression<Func<T, bool>> p) =>
            Task.FromResult(Storage.AsQueryable().FirstOrDefault(p));
    }
}
