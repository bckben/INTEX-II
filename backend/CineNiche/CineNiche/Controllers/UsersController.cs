using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<movies_user>>> GetUsers()
        {
            return await _context.movies_users.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<movies_user>> GetUser(int id)
        {
            var user = await _context.movies_users.FirstOrDefaultAsync(u => u.user_id == id);
            if (user == null) return NotFound();
            return user;
        }
    }
}