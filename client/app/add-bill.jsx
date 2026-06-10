import { StyleSheet, View, Text } from 'react-native'
import React from 'react'

// ADD BILL — Contains: Select Account (dropdown), Payment Frequency (dropdown),
// Amount (input), Category (dropdown, stretch), Date (YYYY/MM/DD), Add Bill button.
// Bills = expenditure. Links to: Bills List (after adding). API: api/bills.js createBill()
export default function addBill() {
  return (
    <View style={styles.container}>
      <Text>Add Bill Screen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})
