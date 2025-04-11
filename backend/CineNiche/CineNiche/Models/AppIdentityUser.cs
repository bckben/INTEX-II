using Microsoft.AspNetCore.Identity;

namespace CineNiche.Models
{
    public class AppIdentityUser : IdentityUser<int>
    {
        // Matching schema from movies_users table
        public string Name { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;

        // INTEGER fields in SQLite
        public int? Zip { get; set; }
        public int? Age { get; set; }

        // Streaming services
        public bool? Netflix { get; set; }
        public bool? AmazonPrime { get; set; }
        public bool? Disney { get; set; }
        public bool? Paramount { get; set; }
        public bool? Max { get; set; }
        public bool? Hulu { get; set; }
        public bool? AppleTV { get; set; }
        public bool? Peacock { get; set; }
    }
}