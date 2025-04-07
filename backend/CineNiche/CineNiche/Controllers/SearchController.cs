using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CineNiche.Models;

namespace CineNiche.Controllers
{
    [ApiController]
    [Route("search")]
    public class SearchController : ControllerBase
    {
        private readonly MoviesDbContext _context;

        public SearchController(MoviesDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<movies_title>>> SearchByTitle([FromQuery] string title)
        {
            return await _context.movies_titles
                .Where(m => m.title != null && m.title.ToLower().Contains(title.ToLower()))
                .ToListAsync();
        }
    }
}