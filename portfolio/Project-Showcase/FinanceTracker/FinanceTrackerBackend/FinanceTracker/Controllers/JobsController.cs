using System.Security.Claims;
using FinanceTracker.DTO;
using FinanceTracker.Models;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using Microsoft.IdentityModel.Tokens;

namespace FinanceTracker.Controllers
{
    [Route("[controller]")]
    [ApiController]

    public class JobsController : ControllerBase
    {
        private readonly IDataAccessService<Job> _job;
        private readonly IDataAccessService<FinanceUser> _user;

        public JobsController(IDataAccessService<Job> job, IDataAccessService<FinanceUser> financeUser)
        {
            _job = job;
            _user = financeUser;
        }



        [HttpPost]
        [Authorize]
        [ResponseCache(CacheProfileName = "NoCache")]
        public async Task<ActionResult> RegisterJob(JobDTO jobDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid model");
            }
            var user = await _user.GetByIdAsync(userId);


            var entity = jobDto.Adapt<Job>();
            entity.User = user;
            entity.UserId = userId;

            await _job.AddAsync(entity);
            return Ok(entity);
        }

        [HttpPut("{companyName}")]
        [Authorize]
        [ResponseCache(CacheProfileName = "NoCache")]
        public async Task<ActionResult> UpdateJob(string companyName, JobDTO jobDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid model");
            }
            var jobToUpdate = await _job.GetFirstOrDefaultAsync(x => x.UserId == userId && x.CompanyName == companyName);
            if (jobToUpdate == null)
            {
                return NotFound("Job not found");
            }

            jobDto.Adapt(jobToUpdate);

            await _job.UpdateAsync(jobToUpdate);
            return Ok(jobToUpdate);
        }

        [HttpGet]
        [Authorize]
        [ResponseCache(CacheProfileName = "NoCache")]
        public async Task<IActionResult> GetAllJobsForUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!ModelState.IsValid)
            {
                return BadRequest("error bad model");
            }
            var userJobs = await _job.GetFilteredAsync(x => x.UserId == userId);
            if (userJobs == null)
            {
                return NotFound("Job not found for ");
            }
            var userJobsDto = userJobs.Adapt<IEnumerable<JobDTO>>();

            return Ok(userJobsDto);

        }

        [HttpDelete("{companyName}")]
        [Authorize]
        [ResponseCache(CacheProfileName = "NoCache")]
        public async Task<IActionResult> DeleteJob([FromQuery] string companyName)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (companyName.IsNullOrEmpty()) return BadRequest("error please provide a company name");
            var jobToDelete = await _job.GetByIdAsync(companyName, userId);
            if (jobToDelete == null) return NotFound("Job not found");
            await _job.DeleteAsync(jobToDelete);
            return Ok();
        }

    }
}
