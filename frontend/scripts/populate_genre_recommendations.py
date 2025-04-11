import pyodbc
import pandas as pd
import json

# Azure SQL Server connection string
conn_str = (
    "Driver={ODBC Driver 17 for SQL Server};"
    "Server=tcp:cinenichedbsql.database.windows.net,1433;"
    "Database=cinenicheDB;"
    "Uid=is414admin;"
    "Pwd=cineniche123!;"
    "Encrypt=yes;"
    "TrustServerCertificate=no;"
    "Connection Timeout=30;"
)

# Connect to Azure SQL
conn = pyodbc.connect(conn_str)
cursor = conn.cursor()

# Load local ratings CSV
ratings_df = pd.read_csv("movies_ratings.csv")
print("📄 Ratings CSV columns:", ratings_df.columns)

# Load movies table from Azure SQL
movies_df = pd.read_sql("SELECT * FROM movies_titles", conn)

# ✅ Normalize column names for consistency
movies_df.columns = [col.replace(" ", "_").replace("'", "") for col in movies_df.columns]
print("🧩 Cleaned Movies DF columns:", list(movies_df.columns))

# Genre group mappings
genre_groups = {
    'Action & Adventure': ['Action', 'Adventure', 'TV_Action'],
    'Comedy': ['Comedies', 'TV_Comedies', 'Talk_Shows_TV_Comedies'],
    'Drama': ['Dramas', 'TV_Dramas'],
    'Horror': ['Horror_Movies'],
    'Fantasy': ['Fantasy'],
    'Thriller': ['Thrillers', 'International_Movies_Thrillers'],
    'Documentary': ['Documentaries', 'Docuseries', 'Nature_TV'],
    'Anime': ['Anime_Series_International_TV_Shows'],
    'International': [
        'International_TV_Shows_Romantic_TV_Shows_TV_Dramas',
        'British_TV_Shows_Docuseries_International_TV_Shows',
        'Documentaries_International_Movies',
        'Dramas_International_Movies',
        'Comedies_International_Movies',
        'Comedies_Dramas_International_Movies'
    ]
}

# Drop and recreate the target table
cursor.execute("IF OBJECT_ID('dbo.user_genre_recommendations', 'U') IS NOT NULL DROP TABLE dbo.user_genre_recommendations;")
cursor.execute("""
    CREATE TABLE user_genre_recommendations (
        user_id INT,
        genre NVARCHAR(100),
        recommendations NVARCHAR(MAX),
        PRIMARY KEY (user_id, genre)
    )
""")

# Generate genre recommendations
for user_id, group in ratings_df.groupby('user_id'):
    user_rated_ids = set(group['show_id'])
    rated_movies = pd.merge(group, movies_df, on='show_id', suffixes=('_rating', '_movie'))

    for genre_label, genre_columns in genre_groups.items():
        # Skip if genre columns don't exist (edge-case fallback)
        if not all(col in rated_movies.columns for col in genre_columns):
            continue

        liked = rated_movies[
            (rated_movies['rating_rating'] >= 4) &
            (rated_movies[genre_columns].sum(axis=1) > 0)
        ]
        if liked.empty:
            continue

        candidates = movies_df[
            (movies_df[genre_columns].sum(axis=1) > 0) &
            (~movies_df['show_id'].isin(user_rated_ids))
        ]
        top_recs = candidates.head(5)['show_id'].tolist()

        cursor.execute(
            "INSERT INTO user_genre_recommendations (user_id, genre, recommendations) VALUES (?, ?, ?)",
            user_id, genre_label, json.dumps(top_recs)
        )

# Save changes and close connection
conn.commit()
conn.close()
print("✅ Genre-based recommendations saved to Azure SQL.")