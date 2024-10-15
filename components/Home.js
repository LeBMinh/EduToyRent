import React, { useContext, useState, useEffect } from 'react';
import { SavedItemsContext } from '../storage/SavedItemsContext';
import { useNavigation } from '@react-navigation/native';
import { getAllToys } from '../storage/ApiToyList';
import { View, Text, StyleSheet, Button, FlatList, Pressable, Image, SafeAreaView, ScrollView, TextInput } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Home() {
  const navigate = useNavigation();
  const [toys, setToys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [filteredToys, setFilteredToys] = useState([]);
  const { savedItems, toggleSaveItem } = useContext(SavedItemsContext);

  // Fetch toy data from API on component mount
  const fetchToys = async () => {
    try {
      const toys = await getAllToys();
      setToys(toys);
      setFilteredToys(toys);
      setLoading(false);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load data');
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchToys();
  }, []);

  // Function to handle company filtering
  const filterToysByCompany = (company) => {
    setSelectedCompany(company);
    if (company === 'All') {
      setFilteredToys(toys.filter(toy => toy.toyName.toLowerCase().includes(searchQuery.toLowerCase())));
    } else {
      const filtered = toys.filter(toy => toy.company === company && toy.toyName.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredToys(filtered);
    }
  };

  // Function to count toys by company
  const getCompanyCount = (company) => {
    if (company === 'All') {
      return toys.length;
    }
    return toys.filter(toy => toy.company === company).length;
  };

  // Filter toys by search query and selected company
  useEffect(() => {
    filterToysByCompany(selectedCompany);
  }, [searchQuery]);

  // Rendering the toy cards
  const renderToyItem = ({ item }) => (
    <Pressable
      key={item.id}
      onPress={() => navigate.navigate('Toy Detail', { toyId: item.id })}
      //Passing item.id to the Toy Detail screen instead of the entire item object. This ensures that the details page fetches the most up-to-date data directly from the API.
      style={styles.toyCard}
    >
      {item.soldOut && (
        <View style={styles.soldOutTagContainer}>
          <Text style={styles.soldOutTag}>NOT AVAILABLE</Text>
        </View>
      )}
      <Image
        source={{ uri: item.image }}
        style={styles.toyImage}
        resizeMode="contain"
      />
      <Text
        style={styles.toyName}
        numberOfLines={1} // Limit to 1 line
        ellipsizeMode="tail" // Add "..." at the end of long text
      >
        {item.toyName}
      </Text>
      <Text style={styles.toyPrice}>Price: ${item.price}</Text>
      {item.limitedTimeDeal > 0 && (
        <Text style={styles.limitedDeal}>
          Limited Time Deal: {Math.floor(item.limitedTimeDeal * 100)}% Off!
        </Text>
      )}
      <Pressable onPress={() => toggleSaveItem(item.id)} style={styles.bookmarkIcon}>
        <MaterialCommunityIcons
          name={savedItems.includes(item.id) ? "bookmark" : "bookmark-outline"}
          size={30}
          color="#0FA3B1"
        />
      </Pressable>
    </Pressable>
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }


  return (
    <View style={styles.container}>
      <SafeAreaView >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          <View style={styles.buttonContainer}>
            {['All', 'Bandai', 'Banpresto', 'Good Smile Company', 'Hot Toys', 'Dark Horse', 'McFarlane Toys'].map((company) => (
              <Pressable
                key={company}
                style={[
                  styles.filterButton,
                  selectedCompany === company && styles.selectedButton,
                ]}
                onPress={() => filterToysByCompany(company)}
              >
                <Text style={[
                  styles.buttonText,
                  selectedCompany === company && styles.selectedButtonText,
                ]}>
                  {company} ({getCompanyCount(company)})
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>

       {/* Search bar only if toys exist */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search toys..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

      <FlatList
        data={filteredToys}
        renderItem={renderToyItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2} // Show 2 items side by side
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  filterContainer: {
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: '#ddd',
    marginHorizontal: 5, // Gap between buttons
  },
  selectedButton: {
    backgroundColor: '#F4B400', // BG color for selected button
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  selectedButtonText: {
    color: '#fff', // White text color for selected button
  },
  toyCard: {
    margin: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',  // To enable absolute positioning within the card
    // Ensures cards are even
    flexBasis: '45%', // Take up about half of the available width
    maxWidth: '45%',  // Set a max width for consistent sizing
    aspectRatio: 0.75, // Maintain a consistent aspect ratio
    justifyContent: 'space-between', // Distribute space evenly inside the card
  },
  soldOutTagContainer: {
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 1,  // Ensure the tag appears on top
  },
  soldOutTag: {
    backgroundColor: 'red',
    color: 'white',
    paddingHorizontal: 5,
    fontWeight: 'bold',
  },
  toyImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  toyName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  toyPrice: {
    fontSize: 14,
    marginBottom: 5,
  },
  limitedDeal: {
    fontSize: 11,
    color: 'green',
    fontWeight: 'bold',
  },
  bookmarkIcon: {
    position: 'absolute',
    top: 5,
    right: 8,
    zIndex: 2, // Ensure the bookmark icon is on top
  },
  searchInput: {
    height: 45,
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginVertical: 5,
  },
})
