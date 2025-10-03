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
public sealed class WorkshiftsControllerTests
{
    private const string UserId = "uid-1";

    private FakeData<WorkShift> _shifts = null!;
    private FakeData<FinanceUser> _users = null!;
    private WorkshiftsController _sut = null!;

    #region ─── Set-up / tear-down ────────────────────────────────────
    [SetUp]
    public void SetUp()
    {
        _shifts = new FakeData<WorkShift>();
        _users = new FakeData<FinanceUser>();

        // one user present for all tests
        _users.Storage.Add(new FinanceUser { Id = UserId, UserName = "john" });

        _sut = new WorkshiftsController(_shifts, _users)
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

    // ───────────────────── RegisterWorkShift ────────────────────────

    [Test]                               // EP – valid DTO
    public async Task RegisterWorkShift_OK()
    {
        var dto = new WorkShiftDTO
        {
            StartTime = new DateTime(2025, 6, 1, 9, 0, 0),
            EndTime = new DateTime(2025, 6, 1, 17, 0, 0)
        };

        var res = await _sut.RegisterWorkShift(dto) as CreatedAtActionResult;

        Assert.That(res, Is.Not.Null);
        Assert.That(_shifts.Storage, Has.Count.EqualTo(1));
        var stored = _shifts.Storage.First();
        Assert.Multiple(() =>
        {
            Assert.That(stored.UserId, Is.EqualTo(UserId));
            Assert.That(stored.StartTime, Is.EqualTo(dto.StartTime));
            Assert.That(stored.EndTime, Is.EqualTo(dto.EndTime));
        });
    }

    [Test]                               // BVA – ModelState just invalid
    public async Task RegisterWorkShift_BadModel()
    {
        _sut.ModelState.AddModelError("x", "y");

        var res = await _sut.RegisterWorkShift(new WorkShiftDTO()) as BadRequestObjectResult;

        Assert.That(res!.StatusCode, Is.EqualTo(StatusCodes.Status400BadRequest));
    }

    // ─────────────────── GetAllWorkShiftsForUser ────────────────────

    [Test]                               // EP – returns only caller’s shifts
    public async Task GetAllWorkShifts_OK()
    {
        // two shifts for the caller + one foreign shift
        _shifts.Storage.Add(new WorkShift { StartTime = DateTime.Today, EndTime = DateTime.Today, UserId = UserId });
        _shifts.Storage.Add(new WorkShift { StartTime = DateTime.Today, EndTime = DateTime.Today, UserId = UserId });
        _shifts.Storage.Add(new WorkShift { StartTime = DateTime.Today, EndTime = DateTime.Today, UserId = "other" });

        var res = await _sut.GetAllWorkShiftsForUser() as OkObjectResult;
        var list = (res!.Value as IEnumerable<WorkShift>)!.ToList();

        Assert.That(list.Count, Is.EqualTo(2));
        Assert.That(list.All(s => s.UserId == UserId));
    }

    [Test]                               // Z-case – no shifts for user
    public async Task GetAllWorkShifts_Empty()
    {
        var res = await _sut.GetAllWorkShiftsForUser() as OkObjectResult;
        var list = (res!.Value as IEnumerable<WorkShift>)!.ToList();

        Assert.That(list, Is.Empty);
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
