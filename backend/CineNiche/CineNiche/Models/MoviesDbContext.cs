using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace CineNiche.Models;

public partial class MoviesDbContext : DbContext
{
    public MoviesDbContext(DbContextOptions<MoviesDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<movies_rating> movies_ratings { get; set; }

    public virtual DbSet<movies_title> movies_titles { get; set; }

    public virtual DbSet<movies_user> movies_users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<movies_rating>(entity =>
        {
            entity.HasNoKey();
        });

        modelBuilder.Entity<movies_title>(entity =>
        {
            entity.HasNoKey();

            entity.Property(e => e.Anime_Series_International_TV_Shows).HasColumnName("Anime Series International TV Shows");
            entity.Property(e => e.British_TV_Shows_Docuseries_International_TV_Shows).HasColumnName("British TV Shows Docuseries International TV Shows");
            entity.Property(e => e.Comedies_Dramas_International_Movies).HasColumnName("Comedies Dramas International Movies");
            entity.Property(e => e.Comedies_International_Movies).HasColumnName("Comedies International Movies");
            entity.Property(e => e.Comedies_Romantic_Movies).HasColumnName("Comedies Romantic Movies");
            entity.Property(e => e.Crime_TV_Shows_Docuseries).HasColumnName("Crime TV Shows Docuseries");
            entity.Property(e => e.Documentaries_International_Movies).HasColumnName("Documentaries International Movies");
            entity.Property(e => e.Dramas_International_Movies).HasColumnName("Dramas International Movies");
            entity.Property(e => e.Dramas_Romantic_Movies).HasColumnName("Dramas Romantic Movies");
            entity.Property(e => e.Family_Movies).HasColumnName("Family Movies");
            entity.Property(e => e.Horror_Movies).HasColumnName("Horror Movies");
            entity.Property(e => e.International_Movies_Thrillers).HasColumnName("International Movies Thrillers");
            entity.Property(e => e.International_TV_Shows_Romantic_TV_Shows_TV_Dramas).HasColumnName("International TV Shows Romantic TV Shows TV Dramas");
            entity.Property(e => e.Kids__TV).HasColumnName("Kids' TV");
            entity.Property(e => e.Language_TV_Shows).HasColumnName("Language TV Shows");
            entity.Property(e => e.Nature_TV).HasColumnName("Nature TV");
            entity.Property(e => e.Reality_TV).HasColumnName("Reality TV");
            entity.Property(e => e.TV_Action).HasColumnName("TV Action");
            entity.Property(e => e.TV_Comedies).HasColumnName("TV Comedies");
            entity.Property(e => e.TV_Dramas).HasColumnName("TV Dramas");
            entity.Property(e => e.Talk_Shows_TV_Comedies).HasColumnName("Talk Shows TV Comedies");
        });

        modelBuilder.Entity<movies_user>(entity =>
        {
            entity.HasNoKey();

            entity.Property(e => e.Amazon_Prime).HasColumnName("Amazon Prime");
            entity.Property(e => e.Apple_TV_).HasColumnName("Apple TV+");
            entity.Property(e => e.Disney_).HasColumnName("Disney+");
            entity.Property(e => e.Paramount_).HasColumnName("Paramount+");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
