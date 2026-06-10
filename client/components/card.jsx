import { View, StyleSheet } from 'react-native'
import React from 'react'

// A SHARED, reusable card container (used across multiple screens).
// Component name is Capitalised because it's used as <Card> in JSX.
export default function Card({ children }) {
  return <View style={styles.card}>{children}</View>
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#eee' },
})
