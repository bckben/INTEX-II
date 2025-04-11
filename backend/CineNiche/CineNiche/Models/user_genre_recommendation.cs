using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CineNiche.Models
{
    [Table("user_genre_recommendations")]
    public class user_genre_recommendation
    {
        [Key]
        [Column(Order = 0)]
        public int user_id { get; set; }

        [Key]
        [Column(Order = 1)]
        public string genre { get; set; }

        public string recommendations { get; set; }
    }
}