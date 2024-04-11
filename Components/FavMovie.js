import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getFirestore, collection, onSnapshot, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebase from './FirebaseConfig';

const FavouriteMovies = () => {
  const [favouriteMovies, setFavouriteMovies] = useState([]);
  const db = getFirestore();
  const auth = getAuth();
  
  useEffect(() => {
    const userId = auth.currentUser.uid;
    
    const q = query(collection(db, 'movies'), where('userId', '==', userId), where('favourite', '==', true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const movieList = [];
      snapshot.forEach((doc) => {
        movieList.push({ id: doc.id, ...doc.data() });
      });
      setFavouriteMovies(movieList);
    });
    return () => unsubscribe();
  }, []);

  const renderMovieItem = ({ item }) => (
    <View style={[styles.movieItem, { backgroundColor: '#ADD8E6' }]}>
      <Text style={styles.movieName}>{item.name}</Text>
      <Text style={styles.movieInfo}>Director: {item.director}</Text>
      <Text style={styles.movieInfo}>Genre: {item.genre}</Text>
      <Text style={styles.movieInfo}>Watched: {item.watched ? 'Yes' : 'No'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favourite Movies</Text>
      <FlatList
        data={favouriteMovies}
        keyExtractor={(item) => item.id}
        renderItem={renderMovieItem}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
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
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
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
});

export default FavouriteMovies;
