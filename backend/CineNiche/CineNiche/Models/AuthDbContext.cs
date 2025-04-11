using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CineNiche.Models
{
    public class AuthDbContext : IdentityDbContext<AppIdentityUser, IdentityRole<int>, int>
    {
        public AuthDbContext(DbContextOptions<AuthDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Explicitly specify the table names for Identity entities
            builder.Entity<AppIdentityUser>().ToTable("AspNetUsers");
            builder.Entity<IdentityRole<int>>().ToTable("AspNetRoles");
            builder.Entity<IdentityUserRole<int>>().ToTable("AspNetUserRoles");
            builder.Entity<IdentityUserClaim<int>>().ToTable("AspNetUserClaims");
            builder.Entity<IdentityUserLogin<int>>().ToTable("AspNetUserLogins");
            builder.Entity<IdentityRoleClaim<int>>().ToTable("AspNetRoleClaims");
            builder.Entity<IdentityUserToken<int>>().ToTable("AspNetUserTokens");
        }
    }
}