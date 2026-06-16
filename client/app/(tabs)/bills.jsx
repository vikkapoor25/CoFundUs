import { ScrollView, View, Text, StyleSheet } from 'react-native'

export default function bills() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.body}>
      <Text style={styles.heading}>Payments</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Upcoming Payments</Text>
        <View style={styles.row}>
          <Text style={[styles.cell, styles.head]}>Days Left</Text>
          <Text style={[styles.cell, styles.head]}>Payment</Text>
          <Text style={[styles.cell, styles.head]}>Account</Text>
          <Text style={[styles.cell, styles.head, styles.rightCell]}>Amount</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>2 days</Text>
          <Text style={styles.cell}>EE Phone Bill</Text>
          <Text style={styles.cell}>Sam</Text>
          <Text style={[styles.cell, styles.rightCell]}>£16</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Subscriptions</Text>
        <View style={styles.row}>
          <Text style={[styles.cell, styles.head]}>Payment</Text>
          <Text style={[styles.cell, styles.head]}>Amount</Text>
          <Text style={[styles.cell, styles.head]}>Account</Text>
          <Text style={[styles.cell, styles.head, styles.rightCell]}>Due</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Rent</Text>
          <Text style={styles.cell}>£1,500</Text>
          <Text style={styles.cell}>Shared</Text>
          <Text style={[styles.cell, styles.rightCell]}>01/07</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Electricity & Gas</Text>
          <Text style={styles.cell}>£120</Text>
          <Text style={styles.cell}>Shared</Text>
          <Text style={[styles.cell, styles.rightCell]}>02/07</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Netflix</Text>
          <Text style={styles.cell}>£10</Text>
          <Text style={styles.cell}>Alex</Text>
          <Text style={[styles.cell, styles.rightCell]}>11/06</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Spotify</Text>
          <Text style={styles.cell}>£12</Text>
          <Text style={styles.cell}>Alex</Text>
          <Text style={[styles.cell, styles.rightCell]}>03/06</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>One-Time Payments</Text>
        <View style={styles.row}>
          <Text style={[styles.cell, styles.head]}>Payment</Text>
          <Text style={[styles.cell, styles.head]}>Amount</Text>
          <Text style={[styles.cell, styles.head]}>Account</Text>
          <Text style={[styles.cell, styles.head, styles.rightCell]}>Date</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Concert Tickets</Text>
          <Text style={styles.cell}>£120</Text>
          <Text style={styles.cell}>Shared</Text>
          <Text style={[styles.cell, styles.rightCell]}>14/07</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cell}>Car Repair</Text>
          <Text style={styles.cell}>£180</Text>
          <Text style={styles.cell}>Alex</Text>
          <Text style={[styles.cell, styles.rightCell]}>20/06</Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#eef2f7' },
  body: { padding: 16, paddingTop: 60 },
  heading: { fontSize: 24, fontWeight: '800', color: '#2f4f7a', marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#4a7ec2', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eef1f5' },
  cell: { flex: 1, fontSize: 12, color: '#3f4856' },
  head: { fontWeight: '700', color: '#7a8794', fontSize: 11 },
  rightCell: { textAlign: 'right' },
})
