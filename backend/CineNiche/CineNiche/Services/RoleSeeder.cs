using CineNiche.Models;
using Microsoft.AspNetCore.Identity;

namespace CineNiche.Services;

public class RoleSeeder
{
    public static void SeedRoles(RoleManager<IdentityRole<int>> roleManager)
    {
        string[] roleNames = { "Admin", "User" };

        foreach (var roleName in roleNames)
        {
            var roleExist = roleManager.RoleExistsAsync(roleName).Result;
            if (!roleExist)
            {
                var role = new IdentityRole<int>
                {
                    Name = roleName,
                    NormalizedName = roleName.ToUpper()
                };
                var result = roleManager.CreateAsync(role).Result;
            }
        }
    }
}