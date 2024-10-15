import React, { useState, useEffect, useContext } from 'react';
import { getToyById } from '../storage/ApiToyList';
import { SavedItemsContext } from '../storage/SavedItemsContext';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, Modal, TouchableOpacity, TouchableHighlight, Pressable, TextInput } from 'react-native';
import Feedback from './Feedback';
import { AntDesign, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons, Fontisto } from '@expo/vector-icons';

export default function Detail({ route, navigation }) {
  const { toyId } = route.params;  // Get the toy ID from the route parameters
  const [toy, setToy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const { savedItems, toggleSaveItem } = useContext(SavedItemsContext);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    // Fetch toy details by ID when the component mounts
    const fetchToyDetails = async () => {
      try {
        const toyData = await getToyById(toyId);
        setToy(toyData);  // Store the toy details in state
      } catch (error) {
        console.error('Error loading toy details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchToyDetails();
  }, [toyId]);

  useEffect(() => {
    // Set the screen title dynamically based on the toy name
    if (toy) {
      navigation.setOptions({ title: toy.toyName });
    }
  }, [navigation, toy]);

  if (loading) {
    // Show loading spinner while fetching data
    return <ActivityIndicator size="large" color="#F4B400" />;
  }

  if (!toy) {
    // Handle case where toy data is not available
    return <Text>No toy details available</Text>;
  }

  // Render the toy details once the data is loaded
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Pressable onPress={() => setImageModalVisible(true)}
            style={styles.imageContainer}
          >
            <Image source={{ uri: toy.image }}
              style={styles.toyImage}
              resizeMode="contain"
            />
          </Pressable>
          <Text style={styles.toyName}>{toy.toyName}</Text>
          <Text style={styles.toyBrand}>{toy.company}</Text>
          <View style={styles.toyPriceContainer}>
            {toy.limitedTimeDeal > 0 ? (
              <View style={styles.priceWrapper}>
                <Text style={styles.discountedPrice}>
                  ${(toy.price * (1 - toy.limitedTimeDeal)).toFixed(2)}
                </Text>
                <Text style={styles.originalPrice}>
                  ${toy.price}
                </Text>
              </View>
            ) : (
              // If no discount, just show the regular price
              <Text style={styles.regularPrice}>${toy.price}</Text>
            )}
          </View>
          <Text style={{ fontSize: 17, fontWeight: 'bold', }}>Model Details:</Text>
          <Text style={styles.toyDescription}>{toy.toyDescription}</Text>
          {toy.soldOut && (
            <View style={styles.soldOutTagContainer}>
              <Text style={styles.soldOutTag}>NOT AVAILABLE</Text>
            </View>
          )}
        </View>

        {/* Feedback Section and More */}
        <View style={styles.feedbackContainer}>
          {/* Input Feedback */}
          <TouchableOpacity onPress={() => setFeedbackVisible(!feedbackVisible)} style={styles.feedbackIcon}>
            <MaterialIcons name="chat-bubble" size={24} color="#F4B400" />
          </TouchableOpacity>

          {/* View Feedback Button */}
          <TouchableHighlight
            activeOpacity={0.4}
            underlayColor="#6d4cb8"
            onPress={() => setModalVisible(true)}
            style={styles.feedbackButton}
          >
            <Text style={styles.feedbackButtonText}>View Feedback</Text>
          </TouchableHighlight>

          {/* Save Button */}
          <Pressable onPress={() => toggleSaveItem(toy.id)} style={styles.bookmarkIcon}>
            <MaterialCommunityIcons
              name={savedItems.includes(toy.id) ? "bookmark" : "bookmark-outline"}
              size={30}
              color="#0FA3B1"
            />
          </Pressable>

          {/* Share Button */}
          <TouchableOpacity onPress={() => setShareModalVisible(true)}>
            <Fontisto name="share-a" size={24} color="#0FA3B1" />
          </TouchableOpacity>

        </View>

        {/* Feedback Input and Star Rating (Visible when chat bubble is pressed) */}
        {feedbackVisible && (
          <View style={styles.feedbackInputContainer}>
            <TextInput
              style={styles.feedbackInput}
              placeholder="Leave your feedback"
              value={feedback}
              onChangeText={setFeedback}
            />
            {/* Add a star rating component here */}
          </View>
        )}

      </ScrollView>



      {/* Feedback Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Close button */}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>

            {/* Render Feedback */}
            <Feedback comments={toy.comments} />
          </View>
        </View>
      </Modal>

      {/* Image Modal */}
      <Modal
        visible={imageModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setImageModalVisible(false)} // Android back button closes the modal
      >
        <View style={styles.imageModalContainer}>
          <TouchableHighlight style={styles.closeImgButton} onPress={() => setImageModalVisible(false)}>
            <AntDesign name="close" size={30} color="white" />
          </TouchableHighlight>

          {/* Fullscreen Image */}
          <Image
            source={{ uri: toy.image }}
            style={styles.fullscreenImage}
            resizeMode="contain"
          />
        </View>
      </Modal>

      {/* Share Modal */}
      <Modal visible={shareModalVisible} animationType="slide" transparent={true} onRequestClose={() => setShareModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalShareContent}>
            {/* Close button */}
            <TouchableOpacity onPress={() => setShareModalVisible(false)} style={styles.closeButton}>
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 20 }}>Share Toy on:</Text>
            <View style={styles.socialIcons}>
              <TouchableHighlight onPress={() => console.log('Facebook pressed')} style={styles.modalIcon_Fb}>
                <SimpleLineIcons name="social-facebook" size={24} color="white" />
              </TouchableHighlight>
              <TouchableHighlight onPress={() => console.log('Instagram pressed')} style={styles.modalIcon_Ig}>
                <SimpleLineIcons name="social-instagram" size={24} color="white" />
              </TouchableHighlight>
              <TouchableHighlight onPress={() => console.log('Reddit pressed')} style={styles.modalIcon_Rd}>
                <SimpleLineIcons name="social-reddit" size={24} color="white" />
              </TouchableHighlight>
              <TouchableHighlight onPress={() => console.log('Twitter pressed')} style={styles.modalIcon_Tw}>
                <SimpleLineIcons name="social-twitter" size={24} color="white" />
              </TouchableHighlight>
              <TouchableHighlight onPress={() => console.log('Tumblr pressed')} style={styles.modalIcon_Tb}>
                <SimpleLineIcons name="social-tumblr" size={24} color="white" />
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toyImage: {
    width: 270,
    height: 270,
    marginBottom: 40,
  },
  imageModalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  closeImgButton: {
    alignSelf: 'flex-end',
    paddingTop: 40,
  },
  toyName: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  toyBrand: {
    color: '#0FA3B1',
  },
  toyPriceContainer: {
    marginVertical: 10,
  },
  priceWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountedPrice: {
    fontWeight: 'bold',
    color: 'green',
    fontSize: 16,
    marginRight: 20, // Space between the two prices
  },
  originalPrice: {
    textDecorationLine: 'line-through', // Strikethrough for original price
    color: 'gray',
    fontSize: 14,
  },
  regularPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
  toyDescription: {
    color: 'gray',
  },
  soldOutTag: {
    backgroundColor: 'red',
    borderColor: 'yellow',
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 12,
    textAlign: 'center',
    color: 'yellow',
    paddingHorizontal: 4,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  feedbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  feedbackIcon: {
    backgroundColor: '#6d4cb8',
    borderRadius: 15,
    padding: 8,
  },
  feedbackButton: {
    backgroundColor: '#0FA3B1',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 20,
    // marginVertical: 25,
    alignSelf: 'center',
  },
  feedbackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  feedbackInputContainer: {
    marginVertical: 15,
  },
  feedbackInput: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark background
  },
  modalContent: {
    backgroundColor: '#fff',
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    marginTop: 60, // Leaving space at the top
  },
  modalShareContent: {
    backgroundColor: '#fff',
    height: '25%', // Set the modal height to 1/3 of the screen
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
    paddingVertical: 20,
  },
  modalIcon_Fb: {
    width: 36,
    height: 36,
    borderRadius: 5,
    backgroundColor: '#3b5998',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalIcon_Ig: {
    width: 36,
    height: 36,
    borderRadius: 5,
    backgroundColor: '#8A3AB9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalIcon_Rd: {
    width: 36,
    height: 36,
    borderRadius: 5,
    backgroundColor: '#FF4500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalIcon_Tw: {
    width: 36,
    height: 36,
    borderRadius: 5,
    backgroundColor: '#1DA1F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalIcon_Tb: {
    width: 36,
    height: 36,
    borderRadius: 5,
    backgroundColor: '#36465D',
    justifyContent: 'center',
    alignItems: 'center',
  },
})