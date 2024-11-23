import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const AddWordScreen = () => {
  const [word, setWord] = useState('');
  const [description, setDescription] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const colorScheme = useColorScheme(); // Detect system theme (light or dark)
  const isDarkMode = colorScheme === 'dark';

  const checkAndAddWord = async () => {
    if (!word || !description) {
      setFeedback('Please fill out both fields');
      return;
    }

    setLoading(true);
    setFeedback('');

    try {
      const wordDoc = await firestore()
        .collection('words')
        .doc(word.toLowerCase())
        .get();

      if (wordDoc.exists) {
        setFeedback('Word already exists');
      } else {
        await firestore().collection('words').doc(word.toLowerCase()).set({
          word: word,
          description: description,
          createdAt: firestore.FieldValue.serverTimestamp(), // Add timestamp
        });
        setFeedback('Word added successfully');
        setWord('');
        setDescription('');
      }
    } catch (error) {
      setFeedback('An error occurred. Please try again.');
      console.error('Firestore Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: isDarkMode ? '#000000' : '#FFFFFF'},
      ]}>
      <Text style={[styles.label, {color: isDarkMode ? '#FFFFFF' : '#000000'}]} allowFontScaling>
        Add a New Word
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            color: isDarkMode ? '#FFFFFF' : '#000000',
            borderColor: isDarkMode ? '#555555' : '#CCCCCC',
          },
        ]}
        placeholder="Enter word"
        placeholderTextColor={isDarkMode ? '#888888' : '#AAAAAA'}
        value={word}
        onChangeText={setWord}
        allowFontScaling={true}
      />
      <TextInput
        style={[
          styles.input,
          {
            color: isDarkMode ? '#FFFFFF' : '#000000',
            borderColor: isDarkMode ? '#555555' : '#CCCCCC',
          },
        ]}
        placeholder="Enter description"
        placeholderTextColor={isDarkMode ? '#888888' : '#AAAAAA'}
        value={description}
        onChangeText={setDescription}
        multiline
        allowFontScaling={true}
      />
      <Button title="Add Word" onPress={checkAndAddWord} />
      {loading && (
        <ActivityIndicator
          size="large"
          color={isDarkMode ? '#FFFFFF' : '#0000FF'}
          style={styles.loader}
        />
      )}
      {feedback ? (
        <Text
          style={[
            styles.feedback,
            {color: feedback === 'Word added successfully' ? 'green' : 'red'},
          ]}>
          {feedback}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  feedback: {
    marginTop: 10,
    fontSize: 16,
  },
  loader: {
    marginTop: 20,
  },
});

export default AddWordScreen;
