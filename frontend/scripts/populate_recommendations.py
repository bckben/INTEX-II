import sqlite3
import pandas as pd
import numpy as np
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.neighbors import NearestNeighbors
from scipy.sparse import csr_matrix

# ========================
# Load & Prepare Data
# ========================

ratings_df = pd.read_csv("movies_ratings.csv")
titles_df = pd.read_csv("movies_titles.csv")

titles_df.fillna('', inplace=True)
titles_df['metadata'] = titles_df['cast'] + ' ' + titles_df['director'] + ' ' + titles_df['description']

# ========================
# Content-Based Filtering
# ========================

vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = vectorizer.fit_transform(titles_df['metadata'])
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
indices = pd.Series(titles_df.index, index=titles_df['title']).drop_duplicates()

def recommend_content_based(title, top_n=10):
    if title not in indices:
        return []
    idx = indices[title]
    sim_scores = list(enumerate(cosine_sim[idx].flatten()))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:top_n+1]
    movie_indices = [i[0] for i in sim_scores if i[0] < len(titles_df)]
    return titles_df['title'].iloc[movie_indices].tolist()

# ========================
# Collaborative Filtering
# ========================

movie_counts = ratings_df['show_id'].value_counts()
keep_movies = movie_counts[movie_counts >= 2].index
collab_df = ratings_df[ratings_df['show_id'].isin(keep_movies)].copy()

collab_df.drop_duplicates(subset=['user_id', 'show_id'], keep='first', inplace=True)
user_counts = collab_df['user_id'].value_counts()
collab_df = collab_df[collab_df['user_id'].isin(user_counts[user_counts >= 2].index)]

def create_matrix(df, user, item, rating):
    U = df[user].nunique()
    I = df[item].nunique()
    user_mapper = dict(zip(np.unique(df[user]), list(range(U))))
    item_mapper = dict(zip(np.unique(df[item]), list(range(I))))
    user_inv_mapper = dict(zip(list(range(U)), np.unique(df[user])))
    item_inv_mapper = dict(zip(list(range(I)), np.unique(df[item])))
    user_index = [user_mapper[i] for i in df[user]]
    item_index = [item_mapper[i] for i in df[item]]
    X = csr_matrix((df[rating], (item_index, user_index)), shape=(I, U))
    return X, user_mapper, item_mapper, user_inv_mapper, item_inv_mapper

X, user_mapper, item_mapper, user_inv_mapper, item_inv_mapper = create_matrix(
    collab_df, 'user_id', 'show_id', 'rating'
)

def recommend_collab(show_id, k=5):
    if show_id not in item_mapper:
        return []
    item = item_mapper[show_id]
    item_vector = X[item]
    knn = NearestNeighbors(n_neighbors=k+1, metric='cosine', algorithm='brute').fit(X)
    rec = knn.kneighbors(item_vector.reshape(1, -1), return_distance=False)
    rec_indices = rec[0][1:]
    rec_ids = [item_inv_mapper[i] for i in rec_indices]
    return [titles_df.loc[i, 'title'] for i in rec_ids if i in titles_df.index]

# ========================
# Hybrid + Write to SQLite
# ========================

def build_hybrid_recs(title, verbose=False):
    content = recommend_content_based(title)
    collab = []
    try:
        show_id = titles_df[titles_df['title'] == title].index[0]
        collab = recommend_collab(show_id)
    except Exception as e:
        if verbose:
            print(f"[!] Skipping collab for '{title}': {e}")
    return list(dict.fromkeys(collab + content))[:5]

# ========================
# SQLite Write
# ========================

db_path = "/Users/bckben/RiderProjects/CineNiche-INTEX/backend/CineNiche/CineNiche/Data/Movies.db"
conn = sqlite3.connect(db_path)
cur = conn.cursor()

cur.execute("DROP TABLE IF EXISTS hybrid_recommendations")
cur.execute("""
    CREATE TABLE hybrid_recommendations (
        title TEXT PRIMARY KEY,
        recommendation TEXT
    )
""")

for i, title in enumerate(titles_df['title'].unique()):
    recs = build_hybrid_recs(title)
    json_recs = json.dumps(recs)
    cur.execute("INSERT INTO hybrid_recommendations (title, recommendation) VALUES (?, ?)", (title, json_recs))

    if i % 100 == 0:
        print(f"✅ {i} titles processed...")

conn.commit()
conn.close()

print("🎉 Done! Recommendations written to hybrid_recommendations table.")