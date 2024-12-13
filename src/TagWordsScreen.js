import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const TagWordsScreen = ({ route }) => {
  const tag = route?.params?.tag || null; // Get the selected tag
  const [words, setWords] = useState([]);

  useEffect(() => {
    const fetchWordsByTag = async () => {
      if(!tag) {
        return null;
      }
      
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

  if(!tag) {
    return null;
  }

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.word}>{item.word}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={words}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  word: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
  },
});

export default TagWordsScreen;
