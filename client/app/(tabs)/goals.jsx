import { StyleSheet, View, Text } from 'react-native'
import React from 'react'

export default function goals() {
  return (
    <View style={styles.container} >
      <Text>Goals Screen</Text>
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