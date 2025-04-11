using CineNiche.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CineNiche.Controllers;

[Route("Role")]
[ApiController]
[Authorize(Roles = "admin")]
public class RoleController : ControllerBase
{
    private readonly RoleManager<IdentityRole<int>> _roleManager;
    private readonly UserManager<AppIdentityUser> _userManager;

    public RoleController(RoleManager<IdentityRole<int>> roleManager, UserManager<AppIdentityUser> userManager)
    {
        _roleManager = roleManager;
        _userManager = userManager;
    }

    [HttpPost("AddRole")]
    public async Task<IActionResult> AddRole([FromQuery] string roleName)
    {
        if (string.IsNullOrWhiteSpace(roleName))
            return BadRequest("Role name cannot be empty.");

        if (await _roleManager.RoleExistsAsync(roleName))
            return Conflict("Role already exists.");

        var result = await _roleManager.CreateAsync(new IdentityRole<int>(roleName));
        return result.Succeeded
            ? Ok($"Role '{roleName}' created.")
            : StatusCode(500, "Error creating role.");
    }

    [HttpPost("AssignRoleToUser")]
    public async Task<IActionResult> AssignRoleToUser([FromBody] RoleAssignmentRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.UserEmail) || string.IsNullOrWhiteSpace(request.RoleName))
            return BadRequest("Missing email or role.");

        var user = await _userManager.FindByEmailAsync(request.UserEmail);
        if (user == null) return NotFound("User not found.");

        if (!await _roleManager.RoleExistsAsync(request.RoleName))
            return NotFound("Role not found.");

        var result = await _userManager.AddToRoleAsync(user, request.RoleName);
        return result.Succeeded
            ? Ok($"Role '{request.RoleName}' assigned to '{request.UserEmail}'.")
            : StatusCode(500, "Error assigning role.");
    }

    [HttpPost("set-or-reset-password")]
    public async Task<IActionResult> SetOrResetPassword([FromBody] Login model)
    {
        var user = await _userManager.FindByEmailAsync(model.Email);
        if (user == null) return NotFound("User not found");

        IdentityResult result;
        if (await _userManager.HasPasswordAsync(user))
        {
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            result = await _userManager.ResetPasswordAsync(user, token, model.Password);
        }
        else
        {
            result = await _userManager.AddPasswordAsync(user, model.Password);
        }

        return result.Succeeded
            ? Ok("Password updated.")
            : BadRequest(result.Errors.Select(e => e.Description));
    }
}