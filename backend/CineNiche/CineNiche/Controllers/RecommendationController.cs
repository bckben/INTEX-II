using Microsoft.AspNetCore.Mvc;
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

        [HttpGet("Show")]
        public IActionResult GetHybridRecs(string title)
        {
            if (string.IsNullOrWhiteSpace(title))
                return BadRequest("Missing title.");

            var recs = _service.GetHybridRecommendations(title);
            if (recs == null || recs.Count == 0)
                return NotFound("No recommendations found.");

            return Ok(recs);
        }

        [HttpGet("User/{userId}")]
        public IActionResult GetUserRecs(int userId)
        {
            var recs = _service.GetUserRecommendations(userId);
            if (recs == null || recs.Count == 0)
                return NotFound("No recommendations found for this user.");

            return Ok(recs);
        }
    }
}