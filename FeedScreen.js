/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  useColorScheme,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const FeedScreen = () => {
  const [words, setWords] = useState([]);
  const colorScheme = useColorScheme(); // Detect light/dark mode
  const isDarkMode = colorScheme === 'dark';

  const windowHeight = Dimensions.get('window').height; // Full screen height

  // For Android, use StatusBar.currentHeight to get the status bar height
  const statusBarHeight = StatusBar.currentHeight || 0;

  // Calculate the usable height for each slide (subtract status bar height)
  const slideHeight = (windowHeight - 65 ) - statusBarHeight; // Remove status bar space

  useEffect(() => {
    const fetchWords = async () => {
      // Ensure the user is authenticated
      const user = auth().currentUser;
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      // Fetch data
      const unsubscribe = firestore()
        .collection('words')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
          const wordList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setWords(wordList);
        });

      return () => unsubscribe();
    };

    fetchWords();
  }, []);

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.slide,
        {
          backgroundColor: isDarkMode ? '#1E1E1E' : '#F5F5F5', // Adjust background for dark/light mode
          height: slideHeight, // Dynamically adjust slide height
        },
      ]}
    >
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.word,
            { color: isDarkMode ? '#FFFFFF' : '#333333' }, // Adjust text color
          ]}
          allowFontScaling
        >
          {item.word}
        </Text>
        {/* Render Meaning */}
        {item.meaning && (
          <Text
            style={[
              styles.meaning,
              { color: isDarkMode ? '#AAAAAA' : '#666666' },
            ]}
            allowFontScaling
          >
            Meaning: {item.meaning}
          </Text>
        )}
        <Text
          style={[
            styles.description,
            { color: isDarkMode ? '#AAAAAA' : '#666666' }, // Adjust text color
          ]}
          allowFontScaling
        >
          Example: {item.description}
        </Text>
        {/* Render Tags */}
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.map((name, index) => (
              <Text
                key={index}
                style={[
                  styles.tag,
                  { color: isDarkMode ? '#FFFFFF' : '#000000' },
                ]}
                allowFontScaling
              >
                #{name}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: isDarkMode ? '#000000' : '#FFFFFF' }}
    >
      <FlatList
        data={words}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: isDarkMode ? '#000000' : '#FFFFFF', // Adjust background for FlatList
          flex: 1, // Let FlatList take the full available space
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  slide: {
    width: '100%', // Full width of the screen
    justifyContent: 'center', // Align to the left
    alignItems: 'flex-start', // Align to the left
    padding: 15,
    // borderColor: 'white',
    // borderWidth: 1,
  },
  textContainer: {
    alignItems: 'flex-start', // Left align text container
    marginBottom: 20,
    width: '100%', // Make sure the text container uses the full width
  },
  word: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'left', // Left align the word
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 16,
    textAlign: 'left', // Left align the description
    marginTop: 10,
    textTransform: 'capitalize',
    fontStyle: 'italic',
  },
  meaning: {
    fontSize: 16,
    textAlign: 'left', // Left align the meaning
    marginTop: 10,
    fontStyle: 'italic',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    fontSize: 14,
    marginRight: 5,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: 'gray',
    marginTop: 5,
  },
});

export default FeedScreen;
