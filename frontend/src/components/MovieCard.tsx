import React, { useEffect, useState } from 'react';
import { Movie, fetchRecommendations, fetchAllMovies } from '../api/movieApi';
import './MovieCard.css';

interface MovieCardProps {
  movie: Movie | null;
  onClose: () => void;
}

const genreMessages: Record<string, string[]> = {
  Action: [
    "The adrenaline keeps pumping!",
    "More high-stakes action on deck.",
    "If that got your blood pumping..."
  ],
  Adventure: [
    "More epic quests await!",
    "Adventure is just beginning...",
    "Grab your gear—more thrills ahead!"
  ],
  "Anime Series International TV Shows": [
    "Anime dreams unlocked!",
    "Global hits, anime vibes!",
    "Next-level stories from around the world."
  ],
  "British TV Shows Docuseries International TV Shows": [
    "Class, drama, and tea incoming.",
    "British brilliance continues...",
    "More UK gems just for you."
  ],
  Children: [
    "Wholesome fun continues!",
    "Big adventures for little hearts!",
    "Keep the smiles going!"
  ],
  Comedies: [
    "Keep the giggles going!",
    "More laughs on the way!",
    "Comedy gold, part two."
  ],
  "Comedies Dramas International Movies": [
    "Laugh. Cry. Repeat.",
    "Globally hilarious & heartfelt.",
    "The best of both moods—next up!"
  ],
  "Comedies International Movies": [
    "Across the globe, laughs continue!",
    "Next stop: global giggles.",
    "More international humor ahead!"
  ],
  "Comedies Romantic Movies": [
    "More swoon-worthy laughs ahead!",
    "Love and laughs? Say less.",
    "Your rom-com fix is back!"
  ],
  "Crime TV Shows Docuseries": [
    "More mysteries to uncover...",
    "Truth is stranger than fiction.",
    "Next case is ready. You in?"
  ],
  Documentaries: [
    "Get ready to learn something new.",
    "Real stories, deeper truths.",
    "More eye-opening tales await."
  ],
  "Documentaries International Movies": [
    "True stories from across the globe.",
    "Global docs, global impact.",
    "Witness the world through film."
  ],
  Docuseries: [
    "Binge-worthy truths continue.",
    "Facts. Drama. Rewatchable.",
    "Dig deeper into real life."
  ],
  Dramas: [
    "More gripping stories ahead...",
    "Ready to feel all the feels again?",
    "For fans of heart and soul."
  ],
  "Dramas International Movies": [
    "Global drama, universal emotions.",
    "Stories that speak every language.",
    "Tears, truths, and tales worldwide."
  ],
  "Dramas Romantic Movies": [
    "Love stories that linger...",
    "Drama + romance = can't miss.",
    "Your heart’s next obsession."
  ],
  "Family Movies": [
    "Wholesome picks for movie night!",
    "Perfect for all ages.",
    "The whole crew will love these!"
  ],
  Fantasy: [
    "More magic and mystery!",
    "Fantasy fans, your quest continues!",
    "Enchanted worlds await!"
  ],
  "Horror Movies": [
    "If you survived that, try these...",
    "Nightmares not over yet...",
    "Keep the terror rolling..."
  ],
  "International Movies Thrillers": [
    "Edge-of-your-seat... internationally.",
    "Globally suspenseful and gripping.",
    "Thrills with an international twist."
  ],
  "International TV Shows Romantic TV Shows TV Dramas": [
    "Global love stories incoming.",
    "Drama, romance, and subtitles? Yes.",
    "More international passion awaits."
  ],
  "Kids' TV": [
    "More fun for little movie buffs!",
    "Cartoons, magic, and smiles ahead!",
    "Kid-friendly picks you'll adore."
  ],
  "Language TV Shows": [
    "More shows to broaden your world.",
    "Discover stories across cultures.",
    "Subtitles never looked so good."
  ],
  Musicals: [
    "Sing along to your next favorite!",
    "More toe-tapping tunes await.",
    "Encore! Encore!"
  ],
  "Nature TV": [
    "Nature never stops wowing us.",
    "Explore Earth from your couch.",
    "Get wild with more amazing views."
  ],
  "Reality TV": [
    "The drama isn’t over yet...",
    "More unscripted chaos incoming!",
    "Guilty pleasures never looked better."
  ],
  Spirituality: [
    "Reflect. Discover. Connect.",
    "Your next soul-nourishing watch awaits.",
    "Find peace in these picks."
  ],
  "TV Action": [
    "Adrenaline-fueled episodes ahead!",
    "The action series you crave continues.",
    "Binge-worthy explosions incoming!"
  ],
  "TV Comedies": [
    "Laugh track ready.",
    "Binge-worthy funny business ahead.",
    "Your favorite sitcoms just got company."
  ],
  "TV Dramas": [
    "Episodes that hit hard.",
    "More character-driven greatness awaits.",
    "TV drama at its finest."
  ],
  "Talk Shows TV Comedies": [
    "Hot takes and hilarious guests.",
    "More late-night laughs await!",
    "Talk the talk with these picks."
  ],
  Thrillers: [
    "Edge-of-your-seat action continues...",
    "Still reeling? These will keep you guessing.",
    "More twists and turns await."
  ]
};

const genrePriority = [
  "Action", "Adventure", "Thrillers", "Drama", "Dramas", "Horror Movies", "Children", "Kids' TV",
  "Comedies", "Romance", "Family Movies", "Fantasy", "Anime",
  "Documentaries", "TV Action", "TV Dramas", "TV Comedies",
  "Talk Shows TV Comedies", "Docuseries", "Crime TV Shows Docuseries",
  "Reality TV", "Spirituality", "Musicals", "Language TV Shows", "Nature TV",
  "Comedies Romantic Movies", "Comedies Dramas International Movies",
  "British TV Shows Docuseries International TV Shows", "International Movies Thrillers",
  "Dramas International Movies", "Comedies International Movies",
  "Documentaries International Movies", "International TV Shows Romantic TV Shows TV Dramas"
];

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClose }) => {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(true);
  const [userRating, setUserRating] = useState<number>(0);
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(movie);
  const [showFullCast, setShowFullCast] = useState(false);
  const [recommendationMessage, setRecommendationMessage] = useState<string>("");

  const fallbackPoster = '/assets/movie_tape.jpg';

  useEffect(() => {
    const storedRatings = JSON.parse(localStorage.getItem('movieRatings') || '{}');
    if (selectedMovie?.show_id && storedRatings[selectedMovie.show_id]) {
      setUserRating(storedRatings[selectedMovie.show_id]);
    }
  }, [selectedMovie]);

  useEffect(() => {
    const loadAll = async () => {
      const all = await fetchAllMovies();
      setAllMovies(all);
    };
    loadAll();
  }, []);

  useEffect(() => {
    const loadRecs = async () => {
      if (selectedMovie?.title) {
        try {
          setLoadingRecs(true);
          const recs = await fetchRecommendations(selectedMovie.title);
          setRecommendations(recs);
        } catch (err) {
          console.error('Error loading recommendations:', err);
        } finally {
          setLoadingRecs(false);
        }
      }
    };
    loadRecs();
  }, [selectedMovie]);

  const getPosterUrl = (title: string) => {
    const normalizedTitle = title.replace(/[^a-zA-Z0-9 ]/g, '').trim();
    return `https://cineniche.blob.core.windows.net/posters/${normalizedTitle}.jpg`;
  };

  const getActiveGenres = () => {
    const genres: string[] = [];
    Object.entries(selectedMovie || {}).forEach(([key, value]) => {
      if (
        value === 1 &&
        !['show_id', 'title', 'type', 'director', 'cast', 'country', 'release_year', 'rating', 'duration', 'description'].includes(key)
      ) {
        const readable = key
          .replace(/_/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        genres.push(readable);
      }
    });
    return genres;
  };

  useEffect(() => {
    if (selectedMovie) {
      const activeGenres = getActiveGenres();

      // Find the first genre from the priority list that matches
      const bestGenre = genrePriority.find((priority) =>
        activeGenres.includes(priority)
      );

      if (bestGenre && genreMessages[bestGenre]) {
        const messages = genreMessages[bestGenre];
        const message = messages[Math.floor(Math.random() * messages.length)];
        setRecommendationMessage(message);
      } else {
        setRecommendationMessage("Movies you'll enjoy next...");
      }
    }
  }, [selectedMovie]);

  const handleRating = (num: number) => {
    const storedRatings = JSON.parse(localStorage.getItem('movieRatings') || '{}');
    const currentId = selectedMovie?.show_id!;
    if (userRating === num) {
      delete storedRatings[currentId];
      setUserRating(0);
    } else {
      storedRatings[currentId] = num;
      setUserRating(num);
    }
    localStorage.setItem('movieRatings', JSON.stringify(storedRatings));
  };

  if (!selectedMovie) return null;

  const activeGenres = getActiveGenres();
  const rawCast = selectedMovie.cast || '';
  const shouldTruncate = rawCast.length > 25;
  const visibleCast = showFullCast || !shouldTruncate ? rawCast : rawCast.slice(0, 25) + '...';

  return (
    <div className="movie-card-overlay" onClick={onClose}>
      <div className="movie-card-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        <div className="movie-card-content">
          <div className="movie-poster-container">
            <img
              src={getPosterUrl(selectedMovie.title)}
              alt={selectedMovie.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = fallbackPoster;
              }}
              className="movie-detail-poster"
            />
          </div>

          <div className="movie-details">
            <h2>{selectedMovie.title}</h2>
            <div className="movie-meta-details">
              <span className="year">{selectedMovie.release_year}</span>
              <span className="rating">{selectedMovie.rating}</span>
              <span className="duration">{selectedMovie.duration}</span>
            </div>
            <p className="movie-description">{selectedMovie.description}</p>

            {selectedMovie.director && (
              <p className="movie-director">
                <strong>Director:</strong> {selectedMovie.director}
              </p>
            )}

            {rawCast && (
              <p className="movie-cast">
                <strong>Cast:</strong> {visibleCast}{' '}
                {shouldTruncate && (
                  <span
                    className="see-more"
                    onClick={() => setShowFullCast(prev => !prev)}
                    style={{ color: '#999', cursor: 'pointer' }}
                  >
                    ({showFullCast ? 'see less' : 'see more'})
                  </span>
                )}
              </p>
            )}

            {activeGenres.length > 0 && (
              <div className="movie-genres">
                <span className="label">Genres:</span>
                <div className="genre-tags">
                  {activeGenres.map((genre, idx) => (
                    <span key={idx} className="genre-clip">{genre}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="rating-bar">
              <span className="label">Your Rating:</span>
              {[1, 2, 3, 4, 5].map((num) => (
                <span
                  key={num}
                  className={`star ${userRating >= num ? 'filled' : ''}`}
                  onClick={() => handleRating(num)}
                >
                  ★
                </span>
              ))}
            </div>

            <div className="recommendation-section">
              <h3>{recommendationMessage}</h3>
              {loadingRecs ? (
                <p className="rec-loading">Loading recommendations...</p>
              ) : (
                <div className="recommendation-carousel">
                  {recommendations.slice(0, 10).map((title, idx) => {
                    const match = allMovies.find(m => m.title === title);
                    return (
                      <div
                        className="rec-poster-card"
                        key={idx}
                        onClick={() => match && setSelectedMovie(match)}
                      >
                        <img
                          src={getPosterUrl(title)}
                          alt={title}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = fallbackPoster;
                          }}
                        />
                        <div className="rec-hover-title">{title}</div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;