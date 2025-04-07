using System;
using System.Collections.Generic;

namespace CineNiche.Models;

public partial class movies_rating
{
    public int? user_id { get; set; }

    public string? show_id { get; set; }

    public int? rating { get; set; }
}
