using System;
using System.Collections.Generic;

namespace CineNiche.Models;

public partial class movies_user
{
    public int? user_id { get; set; }

    public string? name { get; set; }

    public string? phone { get; set; }

    public string? email { get; set; }

    public int? age { get; set; }

    public string? gender { get; set; }

    public int? Netflix { get; set; }

    public int? Amazon_Prime { get; set; }

    public int? Disney_ { get; set; }

    public int? Paramount_ { get; set; }

    public int? Max { get; set; }

    public int? Hulu { get; set; }

    public int? Apple_TV_ { get; set; }

    public int? Peacock { get; set; }

    public string? city { get; set; }

    public string? state { get; set; }

    public int? zip { get; set; }
}
