import { ScrollView, View, Text, StyleSheet } from 'react-native'
import colours from '../../constants/colours'

export default function home() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.body}>
      <Text style={styles.heading}>Hi Sam and Alex!</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Monthly Breakdown</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Income</Text>
          <Text style={styles.value}>£2,500</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Spending</Text>
          <Text style={styles.value}>£500</Text>
        </View>
        <Text style={styles.net}>Net Gain   +£2,000</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colours.background },
  body: { padding: 16, paddingTop: 60 },
  heading: { fontSize: 24, fontWeight: '800', color: colours.pageHeader, marginBottom: 16 },
  card: { backgroundColor: colours.cardBackground, borderRadius: 16, padding: 16, marginBottom: 14 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: colours.cardTitle, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  label: { color: '#55626d' },
  value: { fontWeight: '700' },
  net: { color: '#16a34a', fontWeight: '700', marginTop: 8 },
})
