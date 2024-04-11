import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getFirestore, collection, onSnapshot, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebase from './FirebaseConfig';

const MovieSummary = () => {
  const [movies, setMovies] = useState([]);
  const [watchedCount, setWatchedCount] = useState(0);
  const [unwatchedCount, setUnwatchedCount] = useState(0);
  const [genresSummary, setGenresSummary] = useState({});
  const db = getFirestore(firebase);
  const auth = getAuth(firebase);
  
  useEffect(() => {
    const userId = auth.currentUser.uid;
    const q = query(collection(db, 'movies'), where('userId', '==', userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const movieList = [];
      let watched = 0;
      let unwatched = 0;
      const genres = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        movieList.push({ id: doc.id, ...data });

        if (data.watched) {
          watched++;
        } else {
          unwatched++;
        }

        if (genres[data.genre]) {
          genres[data.genre]++;
        } else {
          genres[data.genre] = 1;
        }
      });

      setMovies(movieList);
      setWatchedCount(watched);
      setUnwatchedCount(unwatched);
      setGenresSummary(genres);
    });
    return () => unsubscribe();
  }, []);

  const renderSummaryBox = (label, value, color) => (
    <View style={[styles.summaryBox, { backgroundColor: color }]}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Movie Summary</Text>
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          {renderSummaryBox('Total Movies', movies.length, '#ADD8E6')}
          {renderSummaryBox('Total Watched', watchedCount, '#C7F6C7')}
        </View>
        <View style={styles.summaryRow}>
          {renderSummaryBox('Total Unwatched', unwatchedCount, '#FFD6D7')}
          {renderSummaryBox('Most Watched Genre', Object.keys(genresSummary).reduce((a, b) => genresSummary[a] > genresSummary[b] ? a : b, ''), '#ADD8E6')}
        </View>
      </View>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id}
        renderItem={renderMovieItem}
        style={styles.list}
      />
    </View>
  );
};

const renderMovieItem = ({ item }) => (
  <View style={[styles.movieItem, { backgroundColor: item.watched ? '#C7F6C7' : '#FFD6D7' }]}>
      <Text style={styles.movieName}>{item.name}</Text>
      <Text style={styles.movieInfo}>Director: {item.director}</Text>
      <Text style={styles.movieInfo}>Genre: {item.genre}</Text>
      <Text style={styles.movieInfo}>Watched: {item.watched ? 'Yes' : 'No'}</Text>
      <Text style={styles.movieInfo}>Favourite: {item.favourite ? 'Yes' : 'No'}</Text>
    </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  list: {
    flexGrow: 1,
    width: '100%',
  },
  movieItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginHorizontal: 10,
  },
  movieName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  movieInfo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryBox: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginHorizontal: 5,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  summaryValue: {
    fontSize: 18,
    color: '#666',
  },
});

export default MovieSummary;
