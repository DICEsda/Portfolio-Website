using FinanceTracker.Controllers;
using FinanceTracker.DTO;
using FinanceTracker.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NUnit.Framework;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace FinanceTracker.Tests.Controllers;

[TestFixture]
public sealed class JobsControllerTests
{
    private const string UserId = "uid-1";

    private FakeData<Job> _jobs = null!;
    private FakeData<FinanceUser> _users = null!;
    private JobsController _sut = null!;

    #region ─── Set-up / tear-down ────────────────────────────────────
    [SetUp]
    public void SetUp()
    {
        _jobs = new FakeData<Job>();
        _users = new FakeData<FinanceUser>();
        _users.Storage.Add(new FinanceUser { Id = UserId, UserName = "john" });

        _sut = new JobsController(_jobs, _users)
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

    // ─────────────────────── RegisterJob ────────────────────────────
    [Test]                         // EP – valid input
    public async Task RegisterJob_OK()
    {
        var dto = new JobDTO { CompanyName = "Acme", HourlyRate = 100 };

        var res = await _sut.RegisterJob(dto) as OkObjectResult;

        Assert.That(res, Is.Not.Null);
        Assert.That(_jobs.Storage, Has.Count.EqualTo(1));
        Assert.That(_jobs.Storage.First().CompanyName, Is.EqualTo("Acme"));
    }

    [Test]                         // BVA – model just invalid
    public async Task RegisterJob_BadModel()
    {
        _sut.ModelState.AddModelError("x", "y");

        var res = await _sut.RegisterJob(new JobDTO()) as BadRequestObjectResult;

        Assert.That(res!.StatusCode, Is.EqualTo(StatusCodes.Status400BadRequest));
    }

    // ─────────────────────── UpdateJob ──────────────────────────────
    [Test]                         // Z-0 happy path
    public async Task UpdateJob_OK()
    {
        _jobs.Storage.Add(new Job { CompanyName = "Acme", HourlyRate = 100, UserId = UserId });

        var dto = new JobDTO { CompanyName = "Acme", HourlyRate = 200 };

        var res = await _sut.UpdateJob("Acme", dto) as OkObjectResult;

        Assert.That(res, Is.Not.Null);
        Assert.That(_jobs.Storage.First().HourlyRate, Is.EqualTo(200));
    }

    [Test]                         // Z-1 not found
    public async Task UpdateJob_NotFound()
    {
        var res = await _sut.UpdateJob("Nope", new JobDTO()) as NotFoundObjectResult;

        Assert.That(res!.StatusCode, Is.EqualTo(StatusCodes.Status404NotFound));
    }

    [Test]                         // BVA – invalid model
    public async Task UpdateJob_BadModel()
    {
        _sut.ModelState.AddModelError("x", "y");

        var res = await _sut.UpdateJob("Acme", new JobDTO()) as BadRequestObjectResult;

        Assert.That(res!.StatusCode, Is.EqualTo(StatusCodes.Status400BadRequest));
    }

    // ─────────────────────── GetAllJobsForUser ──────────────────────
    [Test]                         // EP – at least one job
    public async Task GetAllJobs_OK()
    {
        _jobs.Storage.Add(new Job { CompanyName = "A", HourlyRate = 1, UserId = UserId });
        _jobs.Storage.Add(new Job { CompanyName = "B", HourlyRate = 2, UserId = UserId });

        var res = await _sut.GetAllJobsForUser() as OkObjectResult;
        var jobs = (res!.Value as IEnumerable<JobDTO>)!.ToList();   // 🔧 FIX
        Assert.That(jobs.Count, Is.EqualTo(2));                       // 🔧 FIX
    }

    [Test]                         // Z-1 – null triggers 404 branch
    public async Task GetAllJobs_NotFound()
    {
        _jobs.ReturnNull = true;

        var res = await _sut.GetAllJobsForUser() as NotFoundObjectResult;

        Assert.That(res!.StatusCode, Is.EqualTo(StatusCodes.Status404NotFound));
    }

    [Test]                         // BVA – invalid model
    public async Task GetAllJobs_BadModel()
    {
        _sut.ModelState.AddModelError("x", "y");

        var res = await _sut.GetAllJobsForUser() as BadRequestObjectResult;

        Assert.That(res!.StatusCode, Is.EqualTo(StatusCodes.Status400BadRequest));
    }

    // ─────────────────────── DeleteJob ──────────────────────────────
    [Test]                         // EP – happy delete
    public async Task DeleteJob_OK()
    {
        _jobs.Storage.Add(new Job { CompanyName = "Acme", UserId = UserId });

        var res = await _sut.DeleteJob("Acme") as OkResult;

        Assert.That(res!.StatusCode, Is.EqualTo(StatusCodes.Status200OK));
        Assert.That(_jobs.Storage, Is.Empty);
    }

    [Test]                         // BVA – empty company name
    public async Task DeleteJob_BadCompanyName()
    {
        var res = await _sut.DeleteJob(string.Empty) as BadRequestObjectResult;

        Assert.That(res!.StatusCode, Is.EqualTo(StatusCodes.Status400BadRequest));
    }

    [Test]                         // Z-1 – job missing
    public async Task DeleteJob_NotFound()
    {
        var res = await _sut.DeleteJob("Missing") as NotFoundObjectResult;

        Assert.That(res!.StatusCode, Is.EqualTo(StatusCodes.Status404NotFound));
    }

    // ─────────────────────── in-memory fake DAL ─────────────────────
    private sealed class FakeData<T> : IDataAccessService<T> where T : class
    {
        public readonly List<T> Storage = new();
        public bool ReturnNull { get; set; }

        public Task AddAsync(T e) { Storage.Add(e); return Task.CompletedTask; }
        public Task DeleteAsync(T e) { Storage.Remove(e); return Task.CompletedTask; }
        public Task<IEnumerable<T>> GetAllAsync() => Task.FromResult(Storage.AsEnumerable());
        public Task<T?> GetByIdAsync(params object[] _) => Task.FromResult(Storage.FirstOrDefault());
        public Task<IEnumerable<T>> GetFilteredAsync(System.Linq.Expressions.Expression<System.Func<T, bool>> p)
            => Task.FromResult(ReturnNull ? null! : Storage.AsQueryable().Where(p).AsEnumerable());
        public Task<T?> GetFirstOrDefaultAsync(System.Linq.Expressions.Expression<System.Func<T, bool>> p)
            => Task.FromResult(Storage.AsQueryable().FirstOrDefault(p));
        public Task UpdateAsync(T _) => Task.CompletedTask;
    }
}
