import { StyleSheet, View, Text } from 'react-native'
import React from 'react'

export default function bills() {
  return (
    <View style={styles.container} >
      <Text>Bills Screen</Text>
    </View>
  )
}

const styles =  StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center'
  }
})