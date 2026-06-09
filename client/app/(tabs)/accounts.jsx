import { StyleSheet, View, Text } from 'react-native'
import React from 'react'

export default function accounts() {
  return (
    <View style={styles.container} >
      <Text>Accounts Screen</Text>
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