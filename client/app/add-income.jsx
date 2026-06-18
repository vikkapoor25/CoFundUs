import { StyleSheet, View, Text } from 'react-native'
import React from 'react'

// ADD INCOME — Contains: Select Account (dropdown), Payment Frequency (dropdown),
// Amount (input), Category (dropdown, stretch), Date (YYYY/MM/DD), Add Income button.
// Links to: Accounts List (after adding). API: api/income.js createIncome()
export default function addIncome() {
  return (
    <View style={styles.container}>
      <Text>Add Income Screen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})
