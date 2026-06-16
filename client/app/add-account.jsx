import { StyleSheet, View, Text } from 'react-native'
import React from 'react'

// ADD BANK ACCOUNT — Contains: Account Name (input), Account Type (dropdown:
// personal / shared), Starting Balance (input), Add Account button.
// Links to: Accounts List (after adding). API: api/bank-accounts.js createAccount()
export default function addAccount() {
  return (
    <View style={styles.container}>
      <Text>Add Bank Account Screen</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})
