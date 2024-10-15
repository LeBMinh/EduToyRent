import React from 'react'
import { View, Text, StyleSheet } from 'react-native';


export default function HSHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        EduToyRent
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: '#F4B400',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 35,
    fontSize: 30,
    fontWeight: '500',
    color: 'white'
  }
})