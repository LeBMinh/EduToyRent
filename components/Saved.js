import React, { useContext, useState, useEffect } from 'react';
import { SavedItemsContext } from '../storage/SavedItemsContext';
import { useNavigation } from '@react-navigation/native';
import { getAllToys } from '../storage/ApiToyList';
import { View, Text, StyleSheet, Button, FlatList, Pressable, Image, SafeAreaView, TouchableOpacity, TextInput, Modal } from 'react-native';
import {MaterialCommunityIcons, AntDesign, Entypo} from '@expo/vector-icons';

export default function Saved() {
  const navigate = useNavigation();
  const [toys, setToys] = useState([]);
  const [loading, setLoading] = useState(true);
  const { savedItems, toggleSaveItem } = useContext(SavedItemsContext);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [selectedToys, setSelectedToys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Modify the toys fetching useEffect to filter only saved toys
  useEffect(() => {
    getAllToys()
      .then(toys => {
        setToys(toys);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Filter only saved toys to display and filter them based on search query
  const filteredToys = toys.filter(toy => savedItems.includes(toy.id)  && toy.toyName.toLowerCase().includes(searchQuery.toLowerCase()));

  // Toggle selection mode
  const handleLongPress = (toyId) => {
    setIsMultiSelect(true);
    toggleToySelection(toyId);
  };

  const toggleToySelection = (toyId) => {
    if (selectedToys.includes(toyId)) {
      setSelectedToys(selectedToys.filter(id => id !== toyId));
    } else {
      setSelectedToys([...selectedToys, toyId]);
    }
  };

  const selectAllToys = () => {
    const allToyIds = filteredToys.map(toy => toy.id); // Get all visible toy IDs
    setSelectedToys(allToyIds);
  };
  
  const cancelSelection = () => {
    setIsMultiSelect(false);
    setSelectedToys([]);
  };

  const removeSelectedToys = () => {
    setIsModalVisible(true);
  };

  const confirmRemoveToys = () => {
    selectedToys.forEach(toyId => toggleSaveItem(toyId));
    cancelSelection();
    setIsModalVisible(false);
  };

  // Rendering the toy cards (only saved ones)
  const renderToyItem = ({ item }) => (
    <Pressable
      key={item.id}
      onPress={() => !isMultiSelect && navigate.navigate('Toy Detail', { toyId: item.id })}
      //Passing item.id to the Toy Detail screen instead of the entire item object. 
      //This ensures that the details page fetches the most up-to-date data directly from the API.
      onLongPress={() => handleLongPress(item.id)}
      style={styles.toyCard}
    >
      {item.soldOut && (
        <View style={styles.soldOutTagContainer}>
          <Text style={styles.soldOutTag}>SOLD OUT</Text>
        </View>
      )}
      <View style={styles.row}>
        <Image
          source={{ uri: item.image }}
          style={styles.toyImage}
          resizeMode="contain"
        />
        <View style={styles.textContainer}>
          <Text
            style={styles.toyName}
            numberOfLines={1} // Limit to 1 line
            ellipsizeMode="tail" // Add "..." at the end of long text
          >
            {item.toyName}
          </Text>
          <Text style={styles.toyPrice}>Price: ${item.price}</Text>
        </View>

        {isMultiSelect ? (
          <Pressable onPress={() => toggleToySelection(item.id)} style={styles.minuscircleIcon}>
            <AntDesign
              name={selectedToys.includes(item.id) ? "minuscircle" : "minuscircleo"}
              size={24}
              color="red"
            />
          </Pressable>
        ) : (
          <Pressable onPress={() => toggleSaveItem(item.id)} style={styles.bookmarkIcon}>
            <MaterialCommunityIcons
              name={savedItems.includes(item.id) ? "bookmark" : "bookmark-outline"}
              size={30}
              color="#0FA3B1"
            />
          </Pressable>
        )}
      </View>
    </Pressable>
  );

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {filteredToys.length > 0 && (
        // Show search input if there are saved toys
        <TextInput
          style={styles.searchInput}
          placeholder="Search saved toys..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      )}

      {isMultiSelect && (
        <View style={styles.multiSelectBar}>
          <TouchableOpacity onPress={cancelSelection} style={styles.topButtonsContainer}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <View style={styles.rowAR}>
            <TouchableOpacity onPress={removeSelectedToys} >
              <Text style={styles.removeText}>Remove ({selectedToys.length})</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={selectAllToys} style={styles.topButtonsContainer}>
              <Text style={styles.allText}>All</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* <SafeAreaView> */}
      {filteredToys.length > 0 ? (        
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filteredToys}
          renderItem={renderToyItem}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>There's nothing here to display </Text>
          <Entypo name="emoji-sad" size={40} color="#999" style={{marginTop: 10}}/>
        </View>
      )}
      {/* </SafeAreaView> */}

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modelText}>
              Are you sure you want to remove selected items?
            </Text>
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setIsModalVisible(false)}/>
              <Button title="Remove" onPress={confirmRemoveToys} color="#e23636" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchInput: {
    height: 50,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingLeft: 10,
    marginVertical: 10,
    marginHorizontal: 4,
  },
  noDataContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    color: '#999',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toyCard: {
    margin: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    position: 'relative',
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  soldOutTagContainer: {
    position: 'absolute',
    top: 4,
    left: 4,
    zIndex: 1,  // Ensure the tag appears on top
  },
  soldOutTag: {
    backgroundColor: 'red',
    color: 'white',
    paddingHorizontal: 4,
    fontWeight: 'bold',
  },
  toyImage: {
    width: 50,
    height: 50,
  },
  toyName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  toyPrice: {
    fontSize: 14,
  },
  bookmarkIcon: {
    position: 'absolute',
    top: 5,
    right: 1,
    zIndex: 2, // Ensure the bookmark icon is on top
  },
  minuscircleIcon: {
    marginLeft: 'auto',
  },
  multiSelectBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  topButtonsContainer:{
    backgroundColor: '#d9d9d9',
    padding: 10,
    borderRadius: 40,
  },
  rowAR: {
    flexDirection: 'row',
    // marginBottom: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: 'black',
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  allText: {
    color: 'black',
    paddingHorizontal: 10,
  },
  removeText: {
    color: 'red',
    fontWeight: 'bold',
    marginHorizontal: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: 280,
  },
  modelText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
})
