import { ScrollView, View, Text, StyleSheet } from 'react-native'
import colours from '../../constants/colours'
import Card from '../../components/card'



export default function goals() {


  return (
    <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        bounces={false}  
      >
      <Text style={styles.heading}>AI Insights</Text>
      <Text style={styles.sub}>Your AI Financial Coach</Text>

      <Card title="AI Financial Summary">
        <Text style={styles.line}>This month you both saved £120 and spent £80 less than last month.</Text>
        <Text style={styles.line}>Your biggest spending category was eating out.</Text>
        <Text style={styles.line}>You are on track to reach your holiday savings goal.</Text>
      </Card>

      <Card title="What You Did Well">
        <Text style={styles.line}>Shared savings increased this month.</Text>
        <Text style={styles.line}>All upcoming bills are covered.</Text>
        <Text style={styles.line}>You contributed consistently towards your holiday fund.</Text>
      </Card>

      <Card title="Improvements">
        <Text style={styles.line}>An annual payment is due next month, so consider setting money aside.</Text>
        <Text style={styles.line}>You are slightly behind your house deposit savings target.</Text>
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colours.background },
  body: { padding: 16, paddingTop: 30 },
  heading: { fontSize: 24, fontWeight: '800', color: colours.pageHeader },
  sub: { fontSize: 13, color: '#7a8794', marginBottom: 16, marginTop: 4 },
  line: { fontSize: 13, color: '#3f4856', paddingVertical: 6, lineHeight: 18 },
})
