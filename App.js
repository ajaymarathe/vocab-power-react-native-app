/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {IconOutline} from '@ant-design/icons-react-native';
import FeedScreen from './FeedScreen'; // Update with correct path
import AddScreen from './AddScreen'; // Update with correct path

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
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
          component={AddScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <IconOutline name="plus-circle" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
