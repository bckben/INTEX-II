using System.Security.Claims;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using CineNiche.Models;

namespace CineNiche.Services
{
    public class CustomUserClaimsPrincipalFactory : UserClaimsPrincipalFactory<AppIdentityUser, IdentityRole<int>>
    {
        public CustomUserClaimsPrincipalFactory(
            UserManager<AppIdentityUser> userManager,
            RoleManager<IdentityRole<int>> roleManager,
            IOptions<IdentityOptions> optionsAccessor)
            : base(userManager, roleManager, optionsAccessor)
        { }

        public override async Task<ClaimsPrincipal> CreateAsync(AppIdentityUser user)
        {
            var principal = await base.CreateAsync(user);

            // Add role claims explicitly
            var roles = await UserManager.GetRolesAsync(user);
            var roleClaims = roles.Distinct().Select(role => new Claim(ClaimTypes.Role, role));

            ((ClaimsIdentity)principal.Identity).AddClaims(roleClaims);

            return principal;
        }
    }
}