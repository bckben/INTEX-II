using System.Collections.Generic;
using System.Text.Json;
using Microsoft.Data.Sqlite;

namespace CineNiche.Data
{
    public class RecommendationService
    {
        private readonly string _connectionString = "Data Source=Data/Movies.db";

        public List<string> GetHybridRecommendations(string title)
        {
            var results = new List<string>();

            using var connection = new SqliteConnection(_connectionString);
            connection.Open();

            using var command = connection.CreateCommand();
            command.CommandText = @"
                SELECT recommendation
                FROM hybrid_recommendations
                WHERE title = @title
            ";
            command.Parameters.AddWithValue("@title", title);

            using var reader = command.ExecuteReader();
            if (reader.Read())
            {
                var json = reader.GetString(0);
                try
                {
                    var recs = JsonSerializer.Deserialize<List<string>>(json);
                    if (recs != null)
                    {
                        results = recs;
                    }
                }
                catch
                {
                    // Optional: log or handle error
                }
            }

            return results;
        }

        public List<string> GetUserRecommendations(int userId)
        {
            var results = new List<string>();

            using var connection = new SqliteConnection(_connectionString);
            connection.Open();

            using var command = connection.CreateCommand();
            command.CommandText = @"
                SELECT recommendation
                FROM user_recommendations
                WHERE user_id = @userId
            ";
            command.Parameters.AddWithValue("@userId", userId);

            using var reader = command.ExecuteReader();
            if (reader.Read())
            {
                var json = reader.GetString(0);
                try
                {
                    var recs = JsonSerializer.Deserialize<List<string>>(json);
                    if (recs != null)
                    {
                        results = recs;
                    }
                }
                catch
                {
                    // Optional: log or handle error
                }
            }

            return results;
        }
    }
}