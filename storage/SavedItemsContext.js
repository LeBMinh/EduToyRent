import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the context
export const SavedItemsContext = createContext();

// Provider component to wrap around the app
export const SavedItemsProvider = ({ children }) => {
  const [savedItems, setSavedItems] = useState([]);

  // Load saved items from AsyncStorage when the app initializes
  useEffect(() => {
    const loadSavedItems = async () => {
      try {
        const savedData = await AsyncStorage.getItem('savedItems');
        if (savedData !== null) {
          setSavedItems(JSON.parse(savedData));
        }
      } catch (error) {
        console.log('Error loading saved items:', error);
      }
    };
    loadSavedItems();
  }, []);

  // Save items to AsyncStorage when the savedItems state changes
  useEffect(() => {
    const saveItemsToStorage = async () => {
      try {
        await AsyncStorage.setItem('savedItems', JSON.stringify(savedItems));
      } catch (error) {
        console.error('Error saving items:', error);
      }
    };

    if (savedItems.length > 0) {
      saveItemsToStorage();
    }
  }, [savedItems]);

  // Toggle save/remove items
  const toggleSaveItem = (itemId) => {
    setSavedItems((prevItems) =>
      prevItems.includes(itemId)
        ? prevItems.filter((id) => id !== itemId)   // Remove if exists
        : [...prevItems, itemId]   // Add if not exists
    );
  };

  // Provide the state and setter function to the rest of the app
  return (
    <SavedItemsContext.Provider value={{ savedItems, toggleSaveItem }}>
      {children}
    </SavedItemsContext.Provider>
  );
};
