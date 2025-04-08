using CineNiche.Models;
using CineNiche.Data; // <-- Add this to use RecommendationService
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add DbContext with SQLite connection string from configuration
builder.Services.AddDbContext<MoviesDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register RecommendationService
builder.Services.AddSingleton<RecommendationService>();

// Add controllers and Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS setup (update with your frontend URLs)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://yourfrontend.azurewebsites.net")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// Middleware configuration

// Force HTTPS
app.UseHttpsRedirection();

// Enable Swagger (in all environments – change if you want it dev-only)
app.UseSwagger();
app.UseSwaggerUI();

// Use CORS
app.UseCors("AllowFrontend");

// Authorization (placeholder – needed for Identity)
app.UseAuthorization();

// Map controller endpoints
app.MapControllers();

app.Run();