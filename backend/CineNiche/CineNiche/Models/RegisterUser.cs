using System.ComponentModel.DataAnnotations;

namespace CineNiche.Models
{
    public class RegisterUser
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = null!;

        [Required]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters.")]
        public string Password { get; set; } = null!;

        [Required]
        public string Name { get; set; } = null!;

        public string? City { get; set; }

        public string? State { get; set; }

        public int? Zip { get; set; }

        public int? Age { get; set; }

        // Optional streaming service preferences
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