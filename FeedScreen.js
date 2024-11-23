/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {IconOutline} from '@ant-design/icons-react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const FeedScreen = () => {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;
  const slideHeight = screenHeight - 75 - insets.top - insets.bottom;
  const [words, setWords] = useState([]);
  const colorScheme = useColorScheme(); // Detect light/dark mode
  const isDarkMode = colorScheme === 'dark';

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

  const renderItem = ({item}) => (
    <View
      style={[
        styles.slide,
        {
          height: slideHeight,
          backgroundColor: isDarkMode ? '#1E1E1E' : '#F5F5F5', // Adjust background for dark/light mode
        },
      ]}>
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.word,
            {color: isDarkMode ? '#FFFFFF' : '#333333'}, // Adjust text color,
          ]} allowFontScaling>
          {item.word}
        </Text>
        <Text
          style={[
            styles.description,
            {color: isDarkMode ? '#AAAAAA' : '#666666'}, // Adjust text color
          ]} allowFontScaling>
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={words}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor: isDarkMode ? '#000000' : '#FFFFFF', // Adjust background for FlatList
      }}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  word: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
    textTransform: 'capitalize',
  },
  iconContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 30,
    padding: 10,
    elevation: 5, // Add shadow for better visibility
  },
});

export default FeedScreen;
