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
public sealed class PaychecksControllerTests
{
    private const string UserId = "uid-1";

    private FakeData<WorkShift> _shifts = null!;
    private FakeData<Job> _jobs = null!;
    private FakeData<SupplementDetails> _supps = null!;
    private PaychecksController _sut = null!;

    #region ─── Set-up / tear-down ────────────────────────────────────
    [SetUp]
    public void SetUp()
    {
        _shifts = new FakeData<WorkShift>();
        _jobs = new FakeData<Job>();
        _supps = new FakeData<SupplementDetails>();

        _sut = new PaychecksController(_shifts, _jobs, _supps)
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

    // ─────────────────────── GeneratePaycheck ───────────────────────
    [Test]                                   // EP – happy path
    public async Task GeneratePaycheck_OK()
    {
        var job = new Job { CompanyName = "Acme", HourlyRate = 100, UserId = UserId };
        _jobs.Storage.Add(job);

        _shifts.Storage.Add(new WorkShift
        {
            StartTime = new DateTime(2025, 5, 10, 9, 0, 0),
            EndTime = new DateTime(2025, 5, 10, 17, 0, 0),
            UserId = UserId
        });

        var res = await _sut.GeneratePayCheckForMonth("Acme", 5) as OkObjectResult;

        Assert.That(res, Is.Not.Null);
        var pay = res!.Value as Paycheck;
        Assert.Multiple(() =>
        {
            Assert.That(pay!.WorkedHours, Is.EqualTo(8).Within(0.01));
            Assert.That(pay.SalaryBeforeTax, Is.EqualTo(800));
            Assert.That(pay.VacationPay, Is.EqualTo(100));   // 12.5 % of 800
        });
    }

    [Test]                                   // BVA – ModelState just invalid
    public async Task GeneratePaycheck_BadModel()
    {
        _sut.ModelState.AddModelError("x", "y");

        var res = await _sut.GeneratePayCheckForMonth("Acme", 5) as BadRequestObjectResult;

        Assert.That(res!.StatusCode, Is.EqualTo(StatusCodes.Status400BadRequest));
    }

    [Test]                                   // Z-1 – job not found
    public async Task GeneratePaycheck_JobMissing()
    {
        var res = await _sut.GeneratePayCheckForMonth("Nope", 5) as NotFoundObjectResult;

        Assert.That(res!.StatusCode, Is.EqualTo(StatusCodes.Status404NotFound));
    }

    // ─────────────────────── VacationPay ────────────────────────────
    [Test]                                   // EP – happy path
    public async Task VacationPay_OK()
    {
        var job = new Job { CompanyName = "Acme", HourlyRate = 80, UserId = UserId };
        _jobs.Storage.Add(job);

        _shifts.Storage.Add(new WorkShift
        {
            StartTime = new DateTime(2025, 3, 1, 8, 0, 0),
            EndTime = new DateTime(2025, 3, 1, 16, 0, 0),
            UserId = UserId
        });

        var res = await _sut.GetTotalVacationPay("Acme", 2025) as OkObjectResult;

        var dto = res!.Value as VacationPayDTO;
        Assert.That(dto!.VacationPay, Is.EqualTo(80 * 8 * 0.125m));   // 12.5 %
    }

    [Test]                                   // BVA – ModelState invalid
    public async Task VacationPay_BadModel()
    {
        _sut.ModelState.AddModelError("x", "y");

        var res = await _sut.GetTotalVacationPay("Acme", 2025) as BadRequestObjectResult;

        Assert.That(res!.StatusCode, Is.EqualTo(StatusCodes.Status400BadRequest));
    }

    [Test]                                   // Z-1 – job not found
    public async Task VacationPay_JobMissing()
    {
        var res = await _sut.GetTotalVacationPay("Missing", 2025) as NotFoundResult;

        Assert.That(res!.StatusCode, Is.EqualTo(StatusCodes.Status404NotFound));
    }

    // ────────────────────── in-memory fake DAL ──────────────────────
    private sealed class FakeData<T> : IDataAccessService<T> where T : class
    {
        public readonly List<T> Storage = new();
        public bool ReturnNull { get; set; }

        public Task AddAsync(T e) { Storage.Add(e); return Task.CompletedTask; }
        public Task DeleteAsync(T e) { Storage.Remove(e); return Task.CompletedTask; }
        public Task UpdateAsync(T e) => Task.CompletedTask;

        public Task<T?> GetByIdAsync(params object[] _) =>
            Task.FromResult(Storage.FirstOrDefault());

        public Task<IEnumerable<T>> GetAllAsync() =>
            Task.FromResult(Storage.AsEnumerable());

        public Task<IEnumerable<T>> GetFilteredAsync(
            System.Linq.Expressions.Expression<System.Func<T, bool>> predicate)
        {
            if (ReturnNull) return Task.FromResult<IEnumerable<T>?>(null!)!;
            return Task.FromResult(Storage.AsQueryable().Where(predicate).AsEnumerable());
        }

        public Task<T?> GetFirstOrDefaultAsync(
            System.Linq.Expressions.Expression<System.Func<T, bool>> predicate) =>
            Task.FromResult(Storage.AsQueryable().FirstOrDefault(predicate));
    }
}
