import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, Dimensions, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {IconOutline} from '@ant-design/icons-react-native';
import firestore from '@react-native-firebase/firestore';

const FeedScreen = () => {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;
  const slideHeight = screenHeight - 75 - insets.top - insets.bottom;
  const [words, setWords] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('words')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        snapshot => {
          if (snapshot) {
            const wordList = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data(),
            }));
            setWords(wordList);
          }
        },
        error => {
          console.error('Firestore snapshot error:', error);
        }
      );
  
    return () => unsubscribe();
  }, []);
  

  const renderItem = ({item}) => (
    <View style={[styles.slide, {height: slideHeight}]}>
      <View style={styles.textContainer}>
        <Text style={styles.word}>{item.word}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
      <View style={styles.iconContainer}>
        <IconOutline name="heart" size={30} color="red" />
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
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 10,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  word: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    textTransform: 'capitalize'
  },
  description: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    textTransform: 'capitalize'
  },
  iconContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 10,
  },
});

export default FeedScreen;
