using FinanceTracker.DTO;
using FinanceTracker.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Mapster;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace FinanceTracker.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class SupplementDetailsController : ControllerBase
    {
        private readonly IDataAccessService<Job> _jobService;

        private readonly IDataAccessService<SupplementDetails> _supplementDetails;
        public SupplementDetailsController(IDataAccessService<Job> jobService, IDataAccessService<SupplementDetails> supplementDetails)
        {
            _jobService = jobService;
            _supplementDetails = supplementDetails;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> RegisterSupplementPay(List<SupplementDetailsDTO> supplementDetailsDTO, string companyName)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid model");
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            foreach (var item in supplementDetailsDTO)
            {


                var supplementDetail = await _supplementDetails.GetByIdAsync(item.Weekday, companyName);

                if (supplementDetail == null)
                {
                    supplementDetail = item.Adapt<SupplementDetails>();

                    var job = await _jobService.GetByIdAsync(companyName, userId);


                    supplementDetail.CompanyName = companyName;
                    supplementDetail.Job = job;
                    await _supplementDetails.AddAsync(supplementDetail);
                }
                else
                {
                    supplementDetailsDTO.Adapt(supplementDetail);
                    await _supplementDetails.UpdateAsync(supplementDetail);
                }
            }
            return Ok(supplementDetailsDTO);
        }
    }
}
