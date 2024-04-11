import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Switch, StyleSheet } from 'react-native';
import { getFirestore, collection, addDoc, onSnapshot } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { doc, getDoc } from 'firebase/firestore';
import firebase from './FirebaseConfig';
import MovieSummary from './MovieSummary';
import FavouriteMovies from './FavMovie';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const HomeComponent = ({ navigation }) => {
  // const [movies, setMovies] = useState([]);
  // const [user, setUser] = useState(null); 
  const db = getFirestore();

  // useEffect(() => {
  //   const auth = getAuth(firebase);
  //   const unsubscribe = onSnapshot(collection(db, 'movies'), (snapshot) => {
  //     const movieList = [];
  //     snapshot.forEach((doc) => {
  //       movieList.push({ id: doc.id, ...doc.data() });
  //     });
  //     setMovies(movieList);
  //   });
  //   return () => unsubscribe();
  // }, []);

  const addMovie = async (userId, name, director, genre, watched, favourite) => {
    const docRef = await addDoc(collection(db, 'movies'), {
      userId,
      name,
      director,
      genre,
      watched,
      favourite,
    });
  };

  const HandleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
  <Tab.Navigator>
    <Tab.Screen 
      name="Home" 
      initialParams={{ addMovie }}
      options={{
        tabBarIcon: () => (
          <Ionicons name="film" size={24} color="black" />
        ),
      }}
    >
      {(props) => <HomeContent {...props} addMovie={addMovie} />}
    </Tab.Screen>
    <Tab.Screen 
      name="Summary" 
      component={MovieSummary} 
      options={{
        tabBarIcon: () => (
          <Ionicons name="film" size={24} color="black" />
        ),
      }}
    />
    <Tab.Screen 
      name="Favourites" 
      component={FavouriteMovies} 
      options={{
        tabBarIcon: () => (
          <Ionicons name="heart" size={24} color="black" />
        ),
      }}
    />
    <Tab.Screen 
      name="Logout" 
      component={HandleLogout} 
      listeners={({ navigation }) => ({
        tabPress: (e) => {
          e.preventDefault();
          HandleLogout();
        },
      })}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="log-out" size={24} color="black" />
        ),
      }}
    />
  </Tab.Navigator>
</View>

  );
};

const HomeContent = ({ addMovie }) => {
  const auth = getAuth(firebase);
  const [name, setName] = useState('');
  const [director, setDirector] = useState('');
  const [genre, setGenre] = useState('');
  const [watched, setWatched] = useState(false);
  const [favourite, setFavourite] = useState(false);

  const handleAddMovie = () => {
    const userId = auth.currentUser.uid;
    addMovie(userId, name, director, genre, watched, favourite);
    setName('');
    setDirector('');
    setGenre('');
    setWatched(false);
    setFavourite(false);
  };

  return (
    <View style={styles.contentContainer}>
      <Text style={styles.title}>Movie Tracker</Text>
      <TextInput
        style={styles.input}
        placeholder="Movie Name"
        onChangeText={setName}
        value={name}
      />
      <TextInput
        style={styles.input}
        placeholder="Director"
        onChangeText={setDirector}
        value={director}
      />
      <TextInput
        style={styles.input}
        placeholder="Genre"
        onChangeText={setGenre}
        value={genre}
      />
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Watched:</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={watched ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={setWatched}
          value={watched}
        />
      </View>
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Favourite:</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={favourite ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={setFavourite}
          value={favourite}
        />
      </View>
      <Button title="Add Movie" onPress={handleAddMovie} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  contentContainer: {
    flex: 1,
    padding: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#33619e',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#33619e',
    marginRight: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  switch: {
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
  },
});

export default HomeComponent;
