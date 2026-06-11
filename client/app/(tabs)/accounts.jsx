import { ScrollView, View, Text, StyleSheet } from 'react-native'
import colours from '../../constants/colours'


export default function accounts() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.body}>
      <Text style={styles.heading}>Accounts</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>My Account</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Total Balance</Text>
          <Text style={styles.value}>£11,000</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Personal Goals</Text>
        <View style={styles.row}>
          <Text style={styles.label}>iPhone 16</Text>
          <Text style={styles.value}>£200 / £1,600</Text>
        </View>
        <View style={styles.track}>
          <View style={[styles.fill, { width: '13%' }]} />
        </View>
      </View>

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
  track: { height: 12, borderRadius: 8, backgroundColor: '#e3e9f0', overflow: 'hidden', marginTop: 8 },
  fill: { height: '100%', backgroundColor: '#4a7ec2', borderRadius: 8 },
})
