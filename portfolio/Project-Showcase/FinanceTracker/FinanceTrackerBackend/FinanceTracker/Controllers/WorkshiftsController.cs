using FinanceTracker.DTO;
using FinanceTracker.Models;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FinanceTracker.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class WorkshiftsController : ControllerBase
    {
        private readonly IDataAccessService<WorkShift> _workShift;

        private readonly IDataAccessService<FinanceUser> _user;

        public WorkshiftsController(IDataAccessService<WorkShift> workShift, IDataAccessService<FinanceUser> user)
        {
            _workShift = workShift;
            _user = user;
        }

        [HttpPost]
        [Authorize]
        [ResponseCache(CacheProfileName = "NoCache")]
        public async Task<IActionResult> RegisterWorkShift(WorkShiftDTO workshift)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid model");
            }
            var user = await _user.GetByIdAsync(userId);

            var newWorkshift = workshift.Adapt<WorkShift>();
            newWorkshift.UserId = user.Id;
            newWorkshift.User = user;

            await _workShift.AddAsync(newWorkshift);

            return CreatedAtAction(nameof(RegisterWorkShift), newWorkshift);

        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllWorkShiftsForUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var workshifts = await _workShift.GetFilteredAsync(x => x.UserId == userId);

            return Ok(workshifts);
        }

    }
}
