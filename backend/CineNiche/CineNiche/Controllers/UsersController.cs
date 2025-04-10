using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using CineNiche.Models;

namespace CineNiche.Controllers
{
    [ApiController]
    [Route("users")]
    public class UsersController : ControllerBase
    {
        private readonly MoviesDbContext _context;

        public UsersController(MoviesDbContext context)
        {
            _context = context;
        }

        // Admins only can see all users
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<movies_user>>> GetUsers()
        {
            return await _context.movies_users.ToListAsync();
        }

        // Admins only can look up users by ID
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<movies_user>> GetUser(int id)
        {
            var user = await _context.movies_users.FirstOrDefaultAsync(u => u.user_id == id);
            if (user == null) return NotFound();
            return user;
        }
    }
}