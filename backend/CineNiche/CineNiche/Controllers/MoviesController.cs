using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using CineNiche.Models;

namespace CineNiche.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Authorize(Roles = "Admin")] // 🔐 This secures all endpoints unless overridden
    public class MoviesController : ControllerBase
    {
        private readonly MoviesDbContext _context;

        public MoviesController(MoviesDbContext context)
        {
            _context = context;
        }

        // ✅ Anyone can view the list of movies
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<movies_title>>> GetMovies()
        {
            return await _context.movies_titles.ToListAsync();
        }

        // ✅ Anyone can view a single movie
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<movies_title>> GetMovie(string id)
        {
            var movie = await _context.movies_titles.FindAsync(id);

            if (movie == null)
            {
                return NotFound();
            }

            return movie;
        }

        // ✅ Admins only can add new movies
        [HttpPost]
        public async Task<ActionResult<movies_title>> PostMovie(movies_title movie)
        {
            _context.movies_titles.Add(movie);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMovie), new { id = movie.show_id }, movie);
        }

        // ✅ Admins only can edit existing movies
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMovie(string id, movies_title movie)
        {
            if (id != movie.show_id)
            {
                return BadRequest("show_id mismatch");
            }

            _context.Entry(movie).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MovieExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // ✅ Admins only can delete movies
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMovie(string id)
        {
            var movie = await _context.movies_titles.FindAsync(id);
            if (movie == null)
            {
                return NotFound();
            }

            _context.movies_titles.Remove(movie);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MovieExists(string id)
        {
            return _context.movies_titles.Any(e => e.show_id == id);
        }
    }
}