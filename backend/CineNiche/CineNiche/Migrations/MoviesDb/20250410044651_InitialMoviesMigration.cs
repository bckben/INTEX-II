using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CineNiche.Migrations.MoviesDb
{
    /// <inheritdoc />
    public partial class InitialMoviesMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "movies_ratings",
                columns: table => new
                {
                    user_id = table.Column<int>(type: "INTEGER", nullable: true),
                    show_id = table.Column<string>(type: "TEXT", nullable: true),
                    rating = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "movies_titles",
                columns: table => new
                {
                    show_id = table.Column<string>(type: "TEXT", nullable: true),
                    type = table.Column<string>(type: "TEXT", nullable: true),
                    title = table.Column<string>(type: "TEXT", nullable: true),
                    director = table.Column<string>(type: "TEXT", nullable: true),
                    cast = table.Column<string>(type: "TEXT", nullable: true),
                    country = table.Column<string>(type: "TEXT", nullable: true),
                    release_year = table.Column<int>(type: "INTEGER", nullable: true),
                    rating = table.Column<string>(type: "TEXT", nullable: true),
                    duration = table.Column<string>(type: "TEXT", nullable: true),
                    description = table.Column<string>(type: "TEXT", nullable: true),
                    Action = table.Column<int>(type: "INTEGER", nullable: true),
                    Adventure = table.Column<int>(type: "INTEGER", nullable: true),
                    AnimeSeriesInternationalTVShows = table.Column<int>(name: "Anime Series International TV Shows", type: "INTEGER", nullable: true),
                    BritishTVShowsDocuseriesInternationalTVShows = table.Column<int>(name: "British TV Shows Docuseries International TV Shows", type: "INTEGER", nullable: true),
                    Children = table.Column<int>(type: "INTEGER", nullable: true),
                    Comedies = table.Column<int>(type: "INTEGER", nullable: true),
                    ComediesDramasInternationalMovies = table.Column<int>(name: "Comedies Dramas International Movies", type: "INTEGER", nullable: true),
                    ComediesInternationalMovies = table.Column<int>(name: "Comedies International Movies", type: "INTEGER", nullable: true),
                    ComediesRomanticMovies = table.Column<int>(name: "Comedies Romantic Movies", type: "INTEGER", nullable: true),
                    CrimeTVShowsDocuseries = table.Column<int>(name: "Crime TV Shows Docuseries", type: "INTEGER", nullable: true),
                    Documentaries = table.Column<int>(type: "INTEGER", nullable: true),
                    DocumentariesInternationalMovies = table.Column<int>(name: "Documentaries International Movies", type: "INTEGER", nullable: true),
                    Docuseries = table.Column<int>(type: "INTEGER", nullable: true),
                    Dramas = table.Column<int>(type: "INTEGER", nullable: true),
                    DramasInternationalMovies = table.Column<int>(name: "Dramas International Movies", type: "INTEGER", nullable: true),
                    DramasRomanticMovies = table.Column<int>(name: "Dramas Romantic Movies", type: "INTEGER", nullable: true),
                    FamilyMovies = table.Column<int>(name: "Family Movies", type: "INTEGER", nullable: true),
                    Fantasy = table.Column<int>(type: "INTEGER", nullable: true),
                    HorrorMovies = table.Column<int>(name: "Horror Movies", type: "INTEGER", nullable: true),
                    InternationalMoviesThrillers = table.Column<int>(name: "International Movies Thrillers", type: "INTEGER", nullable: true),
                    InternationalTVShowsRomanticTVShowsTVDramas = table.Column<int>(name: "International TV Shows Romantic TV Shows TV Dramas", type: "INTEGER", nullable: true),
                    KidsTV = table.Column<int>(name: "Kids' TV", type: "INTEGER", nullable: true),
                    LanguageTVShows = table.Column<int>(name: "Language TV Shows", type: "INTEGER", nullable: true),
                    Musicals = table.Column<int>(type: "INTEGER", nullable: true),
                    NatureTV = table.Column<int>(name: "Nature TV", type: "INTEGER", nullable: true),
                    RealityTV = table.Column<int>(name: "Reality TV", type: "INTEGER", nullable: true),
                    Spirituality = table.Column<int>(type: "INTEGER", nullable: true),
                    TVAction = table.Column<int>(name: "TV Action", type: "INTEGER", nullable: true),
                    TVComedies = table.Column<int>(name: "TV Comedies", type: "INTEGER", nullable: true),
                    TVDramas = table.Column<int>(name: "TV Dramas", type: "INTEGER", nullable: true),
                    TalkShowsTVComedies = table.Column<int>(name: "Talk Shows TV Comedies", type: "INTEGER", nullable: true),
                    Thrillers = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                });

            migrationBuilder.CreateTable(
                name: "movies_users",
                columns: table => new
                {
                    user_id = table.Column<int>(type: "INTEGER", nullable: true),
                    name = table.Column<string>(type: "TEXT", nullable: true),
                    phone = table.Column<string>(type: "TEXT", nullable: true),
                    email = table.Column<string>(type: "TEXT", nullable: true),
                    age = table.Column<int>(type: "INTEGER", nullable: true),
                    gender = table.Column<string>(type: "TEXT", nullable: true),
                    Netflix = table.Column<int>(type: "INTEGER", nullable: true),
                    AmazonPrime = table.Column<int>(name: "Amazon Prime", type: "INTEGER", nullable: true),
                    Disney = table.Column<int>(name: "Disney+", type: "INTEGER", nullable: true),
                    Paramount = table.Column<int>(name: "Paramount+", type: "INTEGER", nullable: true),
                    Max = table.Column<int>(type: "INTEGER", nullable: true),
                    Hulu = table.Column<int>(type: "INTEGER", nullable: true),
                    AppleTV = table.Column<int>(name: "Apple TV+", type: "INTEGER", nullable: true),
                    Peacock = table.Column<int>(type: "INTEGER", nullable: true),
                    city = table.Column<string>(type: "TEXT", nullable: true),
                    state = table.Column<string>(type: "TEXT", nullable: true),
                    zip = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "movies_ratings");

            migrationBuilder.DropTable(
                name: "movies_titles");

            migrationBuilder.DropTable(
                name: "movies_users");
        }
    }
}
