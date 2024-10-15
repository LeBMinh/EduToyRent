import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

const Feedback = ({ comments }) => {
  const [selectedRating, setSelectedRating] = useState(null); // null means no filter

  // Filter feedback based on the selected rating
  const filteredComments = selectedRating
    ? comments.filter((comment) => comment.rating === selectedRating)
    : comments;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <AntDesign
          key={i}
          name={i <= rating ? "star" : "staro"}
          size={16}
          color="gold"
        />
      );
    }
    return stars;
  };

  const renderFeedbackItem = ({ item }) => (
    <View style={styles.feedbackItem}>
      {/* Rating shown as stars */}
      <View style={styles.ratingContainer}>
        {renderStars(item.rating)}
      </View>
      {/* Comment text */}
      <Text style={styles.commentText}>{item.comment}</Text>

      {/* Author and date */}
      <Text style={styles.authorText}>- {item.author}, {new Date(item.date).toLocaleDateString()}</Text>
    </View>
  );

  return (
    <View style={styles.feedbackContainer}>
      {/* Star Filter */}
      <View style={styles.starFilterContainer}>
        {Array.from({ length: 5 }, (_, index) => {
          const starRating = index + 1;
          return (
            <TouchableOpacity
              key={index}
              onPress={() =>
                setSelectedRating(selectedRating === starRating ? null : starRating)
              } // Deselect if already selected
            >
              <AntDesign
                name={selectedRating === starRating ? 'star' : 'staro'}
                size={24}
                color={selectedRating === starRating ? 'gold' : 'gray'}
              />
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.feedbackTitle}>Customer Feedback</Text>
      <FlatList
        data={filteredComments}  // Use filtered comments here
        renderItem={renderFeedbackItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  feedbackContainer: {
    marginVertical: 10,
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  feedbackItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#6d4cb8',
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    marginHorizontal: 5,
  },
  authorText: {
    fontSize: 12,
    color: '#888',
    marginHorizontal: 5,
  },
  starFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 20, // Add space between stars and feedback
  },
});

export default Feedback;
