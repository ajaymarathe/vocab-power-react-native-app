/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {IconOutline} from '@ant-design/icons-react-native';
import {useColorScheme} from 'react-native';
import FeedScreen from './src/FeedScreen';
import AddWordScreen from './src/AddScreen';
import TagWordsScreen from './src/TagWordsScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  useEffect(() => {
    const authenticate = async () => {
      try {
        const userCredential = await auth().signInAnonymously();
        console.log('User ID:', userCredential.user.uid);
      } catch (error) {
        console.error('Failed to sign in:', error);
      }
    };

    authenticate();
  }, []);

  const colorScheme = useColorScheme(); // Detect system theme (light/dark)
  const isDarkMode = colorScheme === 'dark';

  // Custom light and dark themes
  const MyLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      backgroundColor: '#FFFFFF',
      card: '#F8F8F8',
      text: '#000000',
      border: '#CCCCCC',
    },
  };

  const MyDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      backgroundColor: '#000000',
      card: '#1E1E1E',
      text: '#FFFFFF',
      border: '#333333',
    },
  };

  return (
    <NavigationContainer theme={isDarkMode ? MyDarkTheme : MyLightTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: isDarkMode ? '#1E1E1E' : '#FFFFFF',
            borderTopColor: isDarkMode ? '#333333' : '#CCCCCC',
            paddingBottom: 7,
            height: 65,
          },
          tabBarActiveTintColor: isDarkMode ? '#FF5555' : '#FF0000',
          tabBarInactiveTintColor: isDarkMode ? '#AAAAAA' : '#888888',
        }}>
        <Tab.Screen
          name="Home"
          component={FeedScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <IconOutline name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Add"
          component={AddWordScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <IconOutline name="plus-circle" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="TagWordsScreen"
          component={TagWordsScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
