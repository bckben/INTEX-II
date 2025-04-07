using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CineNiche.Models;

namespace CineNiche.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MoviesController : ControllerBase
    {
        private readonly MoviesDbContext _context;

        public MoviesController(MoviesDbContext context)
        {
            _context = context;
        }

        // GET: /movies
        [HttpGet]
        public async Task<ActionResult<IEnumerable<movies_title>>> GetMovies()
        {
            return await _context.movies_titles.ToListAsync();
        }

        // GET: /movies/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<movies_title>> GetMovie(string id)
        {
            var movie = await _context.movies_titles.FindAsync(id);

            if (movie == null)
            {
                return NotFound();
            }

            return movie;
        }

        // POST: /movies
        [HttpPost]
        public async Task<ActionResult<movies_title>> PostMovie(movies_title movie)
        {
            _context.movies_titles.Add(movie);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMovie), new { id = movie.show_id }, movie);
        }

        // PUT: /movies/{id}
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

        // DELETE: /movies/{id}
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