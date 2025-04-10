using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CineNiche.Data;

namespace CineNiche.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class RecommendationsController : ControllerBase
    {
        private readonly RecommendationService _service;

        public RecommendationsController(RecommendationService service)
        {
            _service = service;
        }

        // Public: anyone can get hybrid recommendations for a show title
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

        // 🔐 Normally secure, but bypass auth for Vicki (userId = 2)
        [HttpGet("User/{userId}")]
        public IActionResult GetUserRecs(int userId)
        {
            // 🛑 TEMP: Hybrid path for Vicki only (userId = 2)
            if (userId == 2)
            {
                var recs = _service.GetUserRecommendations(2);
                if (recs == null || recs.Count == 0)
                    return NotFound("No recommendations found for this user.");

                return Ok(recs);
            }

            // ✅ Normal secure path
            if (!User.Identity.IsAuthenticated)
            {
                return Unauthorized("You must be logged in.");
            }

            var currentUserId = User.FindFirst("uid")?.Value;

            if (currentUserId != userId.ToString())
            {
                return Forbid("You can only access your own recommendations.");
            }

            var userRecs = _service.GetUserRecommendations(userId);
            if (userRecs == null || userRecs.Count == 0)
                return NotFound("No recommendations found for this user.");

            return Ok(userRecs);
        }
    }
}