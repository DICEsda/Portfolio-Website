using System.Security.Claims;

namespace FinanceTracker.Models
{
    public class JwtClaims
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Id { get; set; }



    }
}

