/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const TagWordsScreen = ({ route, navigation }) => {
  const tag = route?.params?.tag || null; // Get the selected tag
  const [words, setWords] = useState([]);

  const windowHeight = Dimensions.get('window').height; // Full screen height
  const statusBarHeight = StatusBar.currentHeight || 0;
  const slideHeight = windowHeight - 65 - statusBarHeight; // Remove status bar space

  useEffect(() => {
    const fetchWordsByTag = async () => {
      if (!tag) return;

      const querySnapshot = await firestore()
        .collection('words')
        .where('tags', 'array-contains', tag)
        .get();

      const wordList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setWords(wordList);
    };

    fetchWordsByTag();
  }, [tag]);

  if (!tag) {
    return null;
  }

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.slide,
        {
          height: slideHeight, // Dynamically adjust slide height
        },
      ]}
    >
      <View style={styles.textContainer}>
        <Text style={styles.word}>{item.word}</Text>
        {item.meaning && (
          <Text style={styles.meaning}>
            Meaning: {item.meaning}
          </Text>
        )}
        <Text style={styles.description}>
          Example: {item.description}
        </Text>

        {/* Render Tags */}
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.map((name, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {}}
              >
                <Text style={styles.tag}>#{name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={words}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
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

export default TagWordsScreen;
