using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CineNiche.Models;

namespace CineNiche.Controllers
{
    [ApiController]
    [Route("ratings")]
    public class RatingsController : ControllerBase
    {
        private readonly MoviesDbContext _context;

        public RatingsController(MoviesDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<movies_rating>>> GetRatings()
        {
            return await _context.movies_ratings.ToListAsync();
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<movies_rating>>> GetRatingsByUser(int userId)
        {
            return await _context.movies_ratings.Where(r => r.user_id == userId).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<movies_rating>> PostRating(movies_rating rating)
        {
            _context.movies_ratings.Add(rating);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetRatingsByUser), new { userId = rating.user_id }, rating);
        }
    }
}