using FinanceTracker.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;

namespace FinanceTracker.DataAccess
{
    public class Dbseeder
    {
        public static void Initialize(FinanceTrackerContext context)
        {

            if (context.Users.Any() || context.WorkShifts.Any() || context.Jobs.Any())
            {
                return;
            }

            // We need to manually create a FinanceUser and save it
            var user = new FinanceUser
            {
                UserName = "testuser@example.com",
                Email = "testuser@example.com",
                Age = 25,
                EmailConfirmed = true,
                NormalizedEmail = "TESTUSER@EXAMPLE.COM",
                NormalizedUserName = "TESTUSER@EXAMPLE.COM",
                SecurityStamp = Guid.NewGuid().ToString()
            };

            // Set a password hash (this is a placeholder - normally would use a password hasher)
            user.PasswordHash = new PasswordHasher<FinanceUser>().HashPassword(user, "Test@123");

            // Add the user directly to the context
            context.Users.Add(user);
            context.SaveChanges();

            //Get the user's ID
            var userId = user.Id;


            var workshift = new WorkShift
            {
                StartTime = new DateTime(2025, 4, 10, 9, 0, 0),
                EndTime = new DateTime(2025, 4, 10, 17, 0, 0),
                UserId = userId,
            };

            var workshift1 = new WorkShift
            {
                StartTime = new DateTime(2025, 4, 11, 9, 0, 0),
                EndTime = new DateTime(2025, 4, 11, 17, 0, 0),
                UserId = userId,
            };


            var workshift2 = new WorkShift
            {
                StartTime = new DateTime(2025, 5, 11, 9, 0, 0),
                EndTime = new DateTime(2025, 5, 11, 17, 0, 0),
                UserId = userId,
            };


            var workshift3 = new WorkShift
            {
                StartTime = new DateTime(2025, 6, 11, 9, 0, 0),
                EndTime = new DateTime(2025, 6, 11, 17, 0, 0),
                UserId = userId,
            };

            var job = new Job
            {
                CompanyName = "Demderveddet",
                HourlyRate = 150,
                UserId = userId
            };


            context.WorkShifts.Add(workshift);
            context.WorkShifts.Add(workshift1);
            context.Jobs.Add(job);

            context.SaveChanges();
        }
    }
}
