using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using CineNiche.Models;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace CineNiche.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppIdentityUser> _userManager;
        private readonly ILogger<AuthController> _logger;

        public AuthController(UserManager<AppIdentityUser> userManager, ILogger<AuthController> logger)
        {
            _userManager = userManager;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUser model)
        {
            var user = new AppIdentityUser
            {
                Email = model.Email,
                UserName = model.Email,
                Name = model.Name ?? "",
                City = model.City ?? "",
                State = model.State ?? "",
                Zip = model.Zip,
                Age = model.Age
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!result.Succeeded)
            {
                _logger.LogError("User creation failed: {Errors}", result.Errors);
                return BadRequest(result.Errors);
            }

            _logger.LogInformation("User created successfully: {Email}", user.Email);
            return Ok(new { message = "User registered successfully!" });
        }
    }
}