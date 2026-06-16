import { StyleSheet, View, Text } from 'react-native'
import React from 'react'

// ADD GOAL — Contains: Goal Name (input), Amount (input), Target Date (YYYY/MM/DD),
// Add Goal button. Goals are shared. Links to: Goals AI page. API: api/goals.js createGoal()
export default function addGoal() {
  return (
    <View style={styles.container}>
      <Text>Add Goal Screen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})
