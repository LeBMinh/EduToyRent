import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import HSHeader from './components/HSHeader';
import { SavedItemsProvider } from './storage/SavedItemsContext';
import Home from './components/Home';
import Saved from './components/Saved';
import Detail from './components/Detail';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Stack Navigator for Home with Detail page included
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home}
        options={{ headerShown: false }} />
      <Stack.Screen name="Toy Detail" component={Detail}
        options={{ headerShown: true }} />
    </Stack.Navigator>
  );
}

function SaveStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Saved" component={Saved}
        options={{ headerShown: false }} />
      <Stack.Screen name="Toy Detail" component={Detail}
        options={{ headerShown: true }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SavedItemsProvider>
      <NavigationContainer >
        <HSHeader />
        <Tab.Navigator
          initialRouteName='Home Page'
          screenOptions={{
            tabBarActiveTintColor: '#F4B400',  // Custom active color
            tabBarInactiveTintColor: 'gray', // Custom inactive color
          }}
        >
          <Tab.Screen
            name="Home Page"
            component={HomeStack}
            options={{
              headerShown: false,
              tabBarIcon: ({ color }) => (
                <Entypo name="home" size={24} color={color} />
              ),
            }}
          />
          <Tab.Screen
            name="Saved Toys"
            component={SaveStack}
            options={{
              headerShown: false,
              tabBarIcon: ({ color }) => (
                <FontAwesome name="bookmark" size={24} color={color} />
              ),
            }} />
        </Tab.Navigator>
      </NavigationContainer>
    </SavedItemsProvider>
  );
}

