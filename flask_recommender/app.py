from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.neighbors import NearestNeighbors
from scipy.sparse import csr_matrix

app = Flask(__name__)

# Load data
ratings_df = pd.read_csv("movies_ratings.csv")
titles_df = pd.read_csv("movies_titles.csv")
titles_df.fillna('', inplace=True)
titles_df['metadata'] = titles_df['cast'] + ' ' + titles_df['director'] + ' ' + titles_df['description']

# Content-based setup
vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = vectorizer.fit_transform(titles_df['metadata'])
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
indices = pd.Series(titles_df.index, index=titles_df['title']).drop_duplicates()

def recommend_content_based(title, top_n=10):
    if title not in indices:
        return []
    idx = indices[title]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:top_n+1]
    movie_indices = [i[0] for i in sim_scores]
    return titles_df['title'].iloc[movie_indices].tolist()

# Collaborative filtering setup
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

def recommend_collab(show_id, k=10):
    if show_id not in item_mapper:
        return []
    rec_ids = []
    item = item_mapper[show_id]
    item_vector = X[item]
    knn = NearestNeighbors(n_neighbors=k+1, algorithm="brute", metric="cosine").fit(X)
    rec = knn.kneighbors(item_vector.reshape(1, -1), return_distance=False)
    rec_indices = rec[0]
    for i in range(1, knn.n_neighbors):
        rec_ids.append(item_inv_mapper[rec_indices[i]])
    return rec_ids

@app.route('/recommend/hybrid')
def hybrid_recommend():
    title = request.args.get('title')
    k = int(request.args.get('k', 10))
    if title not in indices:
        return jsonify([])

    content_titles = recommend_content_based(title, top_n=k)

    try:
        show_id = titles_df[titles_df['title'] == title].iloc[0].name
        collab_ids = recommend_collab(show_id, k=k)
        collab_titles = [titles_df.loc[item_inv_mapper[i], 'title'] for i in collab_ids]
    except:
        collab_titles = []

    hybrid = list(dict.fromkeys(collab_titles + content_titles))[:k]
    return jsonify(hybrid)

if __name__ == '__main__':
    app.run(debug=True)