using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;
using CineNiche.Data;
using CineNiche.Models;
using CineNiche.Services;

var builder = WebApplication.CreateBuilder(args);

// ==========================
// CONTROLLERS & SWAGGER
// ==========================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ==========================
// DB CONTEXTS
// ==========================
builder.Services.AddDbContext<MoviesDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MovieConnection")));

builder.Services.AddDbContext<AuthDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("AuthConnection")));

// ==========================
// IDENTITY SETUP
// ==========================
builder.Services.AddIdentity<AppIdentityUser, IdentityRole<int>>(options =>
{
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 14;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;

    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;

    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedAccount = false;
    options.Tokens.ProviderMap.Clear(); // Disable token generation
})
.AddEntityFrameworkStores<AuthDbContext>()
.AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(options =>
{
    options.ClaimsIdentity.UserIdClaimType = ClaimTypes.NameIdentifier;
    options.ClaimsIdentity.UserNameClaimType = ClaimTypes.Email;
});

builder.Services.AddScoped<IUserClaimsPrincipalFactory<AppIdentityUser>, CustomUserClaimsPrincipalFactory>();

// ==========================
// COOKIE SETTINGS
// ==========================
builder.Services.ConfigureApplicationCookie(options =>
{
    options.Cookie.HttpOnly = true;
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.Name = ".AspNetCore.Identity.Application";
    options.LoginPath = "/login";
    options.LogoutPath = "/logout";
    options.AccessDeniedPath = "/login";
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
});

// ==========================
// CORS POLICY
// ==========================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173", 
            "https://happy-rock-014679d1e.6.azurestaticapps.net",
            "https://cine-niche.com"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials(); // 👈 IMPORTANT for Identity/Cookies
    });
});

// ==========================
// OTHER SERVICES
// ==========================
builder.Services.AddSingleton<RecommendationService>();
builder.Services.AddSingleton<IEmailSender<AppIdentityUser>, NoOpEmailSender<AppIdentityUser>>();

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("admin"));
    options.AddPolicy("UserOrAdmin", policy => policy.RequireRole("admin", "user"));
});

var app = builder.Build();

// ==========================
// SEED ROLES
// ==========================
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();
    await SeedRoles(roleManager);
}

static async Task SeedRoles(RoleManager<IdentityRole<int>> roleManager)
{
    string[] roleNames = { "Admin", "User" };
    foreach (var roleName in roleNames)
    {
        if (!await roleManager.RoleExistsAsync(roleName))
        {
            await roleManager.CreateAsync(new IdentityRole<int> { Name = roleName });
        }
    }
}

// ==========================
// MIDDLEWARE
// ==========================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp"); // ✅ CORRECT POSITION
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapIdentityApi<AppIdentityUser>();

// ==========================
// LOGOUT ENDPOINT
// ==========================
app.MapPost("/logout", async (HttpContext context, SignInManager<AppIdentityUser> signInManager) =>
{
    await signInManager.SignOutAsync();
    context.Response.Cookies.Delete(".AspNetCore.Identity.Application", new CookieOptions
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.None
    });
    context.Response.Cookies.Delete("cookie_consent_session", new CookieOptions
    {
        Path = "/",
        Secure = true,
        SameSite = SameSiteMode.None
    });

    return Results.Ok(new { message = "Logout successful", timestamp = DateTime.UtcNow });
}).RequireAuthorization();

// ==========================
// PING ENDPOINT
// ==========================
app.MapGet("/pingauth", (ClaimsPrincipal user) =>
{
    if (!user.Identity?.IsAuthenticated ?? false)
        return Results.Unauthorized();

    var email = user.FindFirstValue(ClaimTypes.Email) ?? "unknown@example.com";
    var roles = user.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();

    return Results.Json(new { email, roles });
}).RequireAuthorization();

app.Run();