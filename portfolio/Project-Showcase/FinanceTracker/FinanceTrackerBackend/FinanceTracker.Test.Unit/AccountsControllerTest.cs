using FinanceTracker.Controllers;
using FinanceTracker.DTO;
using FinanceTracker.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.Extensions.Options;
using NUnit.Framework;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Threading;
using System.Threading.Tasks;

namespace FinanceTracker.Tests.Controllers;

[TestFixture]
public sealed class AccountsControllerTests
{
    private FakeUserManager _users;
    private AccountsController _sut;      // SUT = System-Under-Test

    #region ─── test life-cycle ───────────────────────────────────────
    [SetUp]
    public void SetUp()
    {
        _users = new FakeUserManager();

        var cfg = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string>
            {
                ["JWT:Issuer"] = "issuer",
                ["JWT:Audience"] = "audience",
                ["JWT:SigningKey"] = "Khizer8!Khizer8!Khizer8!Khizer8!Khizer8!"
			})
            .Build();

        _sut = new AccountsController(NullLogger<AccountsController>.Instance, cfg, _users, signInManager: null!)
        {
            ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext() }
        };
    }

    [TearDown] public void Dispose() => _users.Dispose();
    #endregion

    // ───────────────────────── REGISTER ─────────────────────────────
    [Test]                         // EP – valid input, Z=0 errors
    public async Task Register_OK()
    {
        var dto = new RegisterDTO { Email = "a@b.c", Password = "P@ssw0rd!" };

        var res = await _sut.Register(dto) as ObjectResult;

        Assert.That(res!.StatusCode, Is.EqualTo(StatusCodes.Status201Created));
    }

    [Test]                         // BVA – ModelState just turns invalid
    public async Task Register_BadModel()
    {
        _sut.ModelState.AddModelError("x", "y");

        var res = await _sut.Register(new RegisterDTO()) as BadRequestObjectResult;

        Assert.That(res!.StatusCode, Is.EqualTo(StatusCodes.Status400BadRequest));
    }

    [Test]                         // Z – many Identity errors
    public async Task Register_IdentityFailure()
    {
        _users.CreateResult = IdentityResult.Failed(
            new IdentityError { Description = "e1" },
            new IdentityError { Description = "e2" });

        var res = await _sut.Register(new RegisterDTO { Email = "x@y.z", Password = "p" }) as ObjectResult;

        Assert.That(res!.StatusCode, Is.EqualTo(StatusCodes.Status500InternalServerError));
    }

    // ───────────────────────── LOGIN ────────────────────────────────
    [Test]                         // Z=0 happy path
    public async Task Login_OK_ReturnsJwt()
    {
        var dto = new LoginDTO { Username = "a@b.c", Password = "P@ssw0rd!" };

        var res = await _sut.Login(dto) as ObjectResult;

        Assert.That(res!.StatusCode, Is.EqualTo(StatusCodes.Status200OK));
        Assert.DoesNotThrow(() => new JwtSecurityTokenHandler().ReadJwtToken(res.Value!.ToString()));
    }

    [Test]                         // BVA – invalid model
    public async Task Login_BadModel()
    {
        _sut.ModelState.AddModelError("u", "Required");

        var res = await _sut.Login(new LoginDTO()) as BadRequestObjectResult;

        Assert.That(res!.StatusCode, Is.EqualTo(StatusCodes.Status400BadRequest));
    }

    [Test]                         // Z=1 – wrong password
    public async Task Login_WrongPassword()
    {
        _users.PasswordCorrect = false;

        var dto = new LoginDTO { Username = "john@example.com", Password = "nope" };
        var res = await _sut.Login(dto) as ObjectResult;

        Assert.That(res!.StatusCode, Is.EqualTo(StatusCodes.Status401Unauthorized));
    }

    // ────────────────────── minimal fakes ───────────────────────────
    private sealed class FakeUserManager : UserManager<FinanceUser>
    {
        public IdentityResult CreateResult = IdentityResult.Success;
        public bool PasswordCorrect = true;

        private static readonly FinanceUser _john = new()
        { Id = "uid-1", UserName = "john@example.com", Email = "john@example.com" };

        public FakeUserManager() : base(new DummyStore(),
            new OptionsWrapper<IdentityOptions>(new IdentityOptions()),
            new PasswordHasher<FinanceUser>(),
            [], [], new UpperInvariantLookupNormalizer(),
            new IdentityErrorDescriber(), null, NullLogger<UserManager<FinanceUser>>.Instance)
        { }

        public override Task<IdentityResult> CreateAsync(FinanceUser u, string p) => Task.FromResult(CreateResult);
        public override Task<FinanceUser?> FindByNameAsync(string n) => Task.FromResult<FinanceUser?>(_john);
        public override Task<bool> CheckPasswordAsync(FinanceUser u, string p) => Task.FromResult(PasswordCorrect);

        private sealed class DummyStore : IUserStore<FinanceUser>
        {
            public Task<IdentityResult> CreateAsync(FinanceUser u, CancellationToken t) => Done();
            public Task<IdentityResult> DeleteAsync(FinanceUser u, CancellationToken t) => Done();
            public Task<FinanceUser?> FindByIdAsync(string id, CancellationToken t) => Task.FromResult<FinanceUser?>(null);
            public Task<FinanceUser?> FindByNameAsync(string n, CancellationToken t) => Task.FromResult<FinanceUser?>(null);
            public Task<string?> GetNormalizedUserNameAsync(FinanceUser u, CancellationToken t) => Task.FromResult<string?>(null);
            public Task<string?> GetUserIdAsync(FinanceUser u, CancellationToken t) => Task.FromResult(u.Id);
            public Task<string?> GetUserNameAsync(FinanceUser u, CancellationToken t) => Task.FromResult(u.UserName);
            public Task SetNormalizedUserNameAsync(FinanceUser u, string? n, CancellationToken t) => Done();
            public Task SetUserNameAsync(FinanceUser u, string? n, CancellationToken t) => Done();
            public Task<IdentityResult> UpdateAsync(FinanceUser u, CancellationToken t) => Done();
            public void Dispose() { }
            static Task<IdentityResult> Done() => Task.FromResult(IdentityResult.Success);
        }
    }
}
