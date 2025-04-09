import sqlite3
import pandas as pd
import json

# Connect to your SQLite DB (adjust relative path if needed)
conn = sqlite3.connect('/Users/bckben/RiderProjects/CineNiche-INTEX/backend/CineNiche/CineNiche/Data/Movies.db')
cursor = conn.cursor()

# Load ratings from CSV (you can also pull from the existing DB table instead if preferred)
ratings_df = pd.read_csv('movies_ratings.csv')

# Group by user, get top 5 highest-rated show_ids
recommendations = (
    ratings_df.sort_values(['user_id', 'rating'], ascending=[True, False])
    .groupby('user_id')['show_id']
    .apply(lambda x: x.head(5).tolist())
    .reset_index()
)

# Prepare the table if not already there
cursor.execute('''
    CREATE TABLE IF NOT EXISTS user_recommendations (
        user_id INTEGER PRIMARY KEY,
        recommendation TEXT
    )
''')

# Clear out old data (optional: comment out if you want to append)
cursor.execute('DELETE FROM user_recommendations')

# Insert each user's top 5 recommendations
for _, row in recommendations.iterrows():
    user_id = int(row['user_id'])
    recs_json = json.dumps(row['show_id'])
    cursor.execute(
        'INSERT INTO user_recommendations (user_id, recommendation) VALUES (?, ?)',
        (user_id, recs_json)
    )

# Commit and close
conn.commit()
conn.close()

print("✅ User-based recommendations populated.")