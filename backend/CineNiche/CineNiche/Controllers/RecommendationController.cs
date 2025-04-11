using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CineNiche.Data;
using CineNiche.Models;
using Microsoft.EntityFrameworkCore;

namespace CineNiche.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class RecommendationsController : ControllerBase
    {
        private readonly RecommendationService _service;
        private readonly MoviesDbContext _context;

        public RecommendationsController(RecommendationService service, MoviesDbContext context)
        {
            _service = service;
            _context = context;
        }

        // 🔓 Public: anyone can get hybrid recommendations for a show title
        [HttpGet("Show")]
        [AllowAnonymous]
        public IActionResult GetHybridRecs(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                return BadRequest("Missing title.");

            var recs = _service.GetHybridRecommendations(title);
            if (recs == null || recs.Count == 0)
                return NotFound("No recommendations found.");

            return Ok(recs);
        }

        // 🔐 Normally secure, but TEMP bypass for Vicki (2) and Matthew (19)
        [HttpGet("User/{userId}")]
        public IActionResult GetUserRecs(int userId)
        {
            if (userId == 2 || userId == 19)
            {
                var recs = _service.GetUserRecommendations(userId);
                if (recs == null || recs.Count == 0)
                    return NotFound("No recommendations found for this user.");

                return Ok(recs);
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized("You must be logged in.");
            }

            var currentUserId = User.FindFirst("uid")?.Value;

            if (currentUserId != userId.ToString())
            {
                return StatusCode(403, "You can only access your own recommendations.");
            }

            var userRecs = _service.GetUserRecommendations(userId);
            if (userRecs == null || userRecs.Count == 0)
                return NotFound("No recommendations found for this user.");

            return Ok(userRecs);
        }

        // 🆕 🔓 Public genre-based recommendations by userId
        [HttpGet("Genre/{userId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetGenreBasedRecs(int userId)
        {
            var results = await _context.user_genre_recommendations
                .Where(r => r.user_id == userId)
                .ToListAsync();

            if (results == null || results.Count == 0)
                return NotFound("No genre-based recommendations found for this user.");

            return Ok(results);
        }
    }
}