/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState, useCallback } from 'react';
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
import axios from 'axios'; // Import axios
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const FeedScreen = () => {
  const [words, setWords] = useState([]);
  const [backgroundImages, setBackgroundImages] = useState({});
  const [loading, setLoading] = useState(false); // For loading state on API call
  const colorScheme = useColorScheme(); // Detect light/dark mode
  const isDarkMode = colorScheme === 'dark';

  const windowHeight = Dimensions.get('window').height; // Full screen height
  const statusBarHeight = StatusBar.currentHeight || 0; // Get status bar height
  const slideHeight = windowHeight - 65 - statusBarHeight; // Slide height adjustment

  // Fetch words from Firestore on mount
  useEffect(() => {
    const fetchWords = async () => {
      const user = auth().currentUser;
      if (!user) {
        console.error('User not authenticated');
        return;
      }

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

  // Function to fetch background image from Hugging Face API
  const getBackgroundImage = async (word) => {
    const HUGGING_FACE_API_KEY = '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'; // Your Hugging Face API Key
    const apiUrl = 'https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image';

    try {
      const response = await axios.post(
        apiUrl,
        { inputs: word },
        {
          headers: {
            Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
          },
        },
      );

      const imageUrl = response.data[0]?.url; // Assuming the response contains 'url'
      return imageUrl || 'default-image-url'; // Return image or default if none
    } catch (err) {
      console.error('Error fetching background image:', err);
      return 'default-image-url'; // Default image on error
    }
  };

  // Handle when FlatList's active slide changes
  const onViewableItemsChanged = useCallback(
    async ({ viewableItems }) => {
      if (viewableItems.length > 0) {
        const visibleItem = viewableItems[0]; // Get the currently active slide

        // Fetch background image for the active slide if not already fetched
        if (!backgroundImages[visibleItem.item.id]) {
          setLoading(true);
          const imageUrl = await getBackgroundImage(visibleItem.item.word);
          setBackgroundImages((prevState) => ({
            ...prevState,
            [visibleItem.item.id]: imageUrl,
          }));
          setLoading(false);
        }
      }
    },
    [backgroundImages], // Depend on backgroundImages to prevent re-fetching the same images
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50, // Trigger API call when 50% of the item is visible
  };

  const renderItem = ({ item }) => {
    const backgroundImage = backgroundImages[item.id] || null;

    return (
      <View
        style={[
          styles.slide,
          {
            backgroundColor: isDarkMode ? '#1E1E1E' : '#F5F5F5', // Default background color
            height: slideHeight, // Dynamically adjust slide height
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : null, // Apply background image
            backgroundSize: 'cover', // Ensure background image covers the entire slide
            backgroundPosition: 'center', // Center the background image
          },
        ]}>
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.word,
              {color: isDarkMode ? '#FFFFFF' : '#333333'}, // Adjust text color
            ]}
            allowFontScaling>
            {item.word}
          </Text>
          {/* Render Meaning */}
          {item.meaning && (
            <Text
              style={[
                styles.meaning,
                {color: isDarkMode ? '#AAAAAA' : '#666666'},
              ]}
              allowFontScaling>
              Meaning: {item.meaning}
            </Text>
          )}
          <Text
            style={[
              styles.description,
              {color: isDarkMode ? '#AAAAAA' : '#666666'}, // Adjust text color
            ]}
            allowFontScaling>
            {item.description}
          </Text>
          {/* Render Tags */}
          {item.tags && item.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {item.tags.map((name, index) => (
                <Text
                  key={index}
                  style={[
                    styles.tag,
                    {color: isDarkMode ? '#FFFFFF' : '#000000'},
                  ]}
                  allowFontScaling>
                  #{name}
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: isDarkMode ? '#000000' : '#FFFFFF'}}>
      <FlatList
        data={words}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged} // Trigger when active slide changes
        viewabilityConfig={viewabilityConfig} // Config to track visibility of items
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
    justifyContent: 'center',
    alignItems: 'flex-start', // Left align content
    padding: 8,
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
    fontSize: 18,
    textAlign: 'left', // Left align the description
    marginTop: 10,
    textTransform: 'capitalize',
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
    backgroundColor: '#ddd',
    marginTop: 5,
  },
});

export default FeedScreen;
