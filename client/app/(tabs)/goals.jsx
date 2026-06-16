import { ScrollView, View, Text, StyleSheet } from 'react-native'

export default function goals() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.body}>
      <Text style={styles.heading}>AI Insights</Text>
      <Text style={styles.sub}>Your AI Financial Coach</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>AI Financial Summary</Text>
        <Text style={styles.line}>This month you both saved £120 and spent £80 less than last month.</Text>
        <Text style={styles.line}>Your biggest spending category was eating out.</Text>
        <Text style={styles.line}>You are on track to reach your holiday savings goal.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>What You Did Well</Text>
        <Text style={styles.line}>Shared savings increased this month.</Text>
        <Text style={styles.line}>All upcoming bills are covered.</Text>
        <Text style={styles.line}>You contributed consistently towards your holiday fund.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Improvements</Text>
        <Text style={styles.line}>An annual payment is due next month, so consider setting money aside.</Text>
        <Text style={styles.line}>You are slightly behind your house deposit savings target.</Text>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#eef2f7' },
  body: { padding: 16, paddingTop: 60 },
  heading: { fontSize: 24, fontWeight: '800', color: '#2f4f7a' },
  sub: { fontSize: 13, color: '#7a8794', marginBottom: 16, marginTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#4a7ec2', marginBottom: 12 },
  line: { fontSize: 13, color: '#3f4856', paddingVertical: 6, lineHeight: 18 },
})
