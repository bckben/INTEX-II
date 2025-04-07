using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CineNiche.Models;

namespace CineNiche.Controllers
{
    [ApiController]
    [Route("genres")]
    public class GenreController : ControllerBase
    {
        private readonly MoviesDbContext _context;

        public GenreController(MoviesDbContext context)
        {
            _context = context;
        }

        [HttpGet("{genreName}")]
        public async Task<ActionResult<IEnumerable<movies_title>>> GetByGenre(string genreName)
        {
            var movies = await _context.movies_titles.ToListAsync();
            var filtered = movies.Where(m =>
            {
                var prop = typeof(movies_title).GetProperty(genreName);
                if (prop != null)
                {
                    var value = prop.GetValue(m) as int?;
                    return value == 1;
                }
                return false;
            }).ToList();

            return filtered;
        }
    }
}