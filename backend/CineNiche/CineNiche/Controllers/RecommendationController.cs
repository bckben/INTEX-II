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

        // Secure: only logged-in users can access user-specific recommendations
        [HttpGet("User/{userId}")]
        [Authorize]
        public IActionResult GetUserRecs(int userId)
        {
            var recs = _service.GetUserRecommendations(userId);
            if (recs == null || recs.Count == 0)
                return NotFound("No recommendations found for this user.");

            return Ok(recs);
        }
    }
}