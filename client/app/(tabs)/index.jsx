import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import {useState, useEffect} from 'react'
import colours from '../../constants/colours'
import Card from '../../components/Card'


export default function home() {

  const [nameOne, setNameOne] = useState(null)
  const [nameTwo, setNameTwo] = useState(null)

  useEffect(() => {
    loadNames()
  }, [])  

  //get names from asyncstorage
  async function loadNames() {
    const stored = await AsyncStorage.getItem("household")
    if (!stored) {
      setNameOne("A")
      setNameTwo("B")
      return
    }
    const { name_1, name_2 } = JSON.parse(stored)
    setNameOne(name_1 ?? "")
    setNameTwo(name_2 ?? "")
  }


  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.body}
      showsVerticalScrollIndicator={false}
      bounces={false}  
    >
      <Text style={styles.heading}>Hi {nameOne} and {nameTwo}!</Text>
      <Text style={styles.sub}>Your complete household financial overview</Text>

      <Card title="My Account">
        <View style={styles.row}>
          <Text style={styles.label}>Income</Text>
          <Text style={styles.value}>£2,500</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Spending</Text>
          <Text style={styles.value}>£500</Text>
        </View>
        <Text style={styles.net}>Net Gain   +£2,000</Text>
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colours.background },
  body: { padding: 16, paddingTop: 30 },
  heading: { fontSize: 24, fontWeight: '800', color: colours.pageHeader },
  sub: { fontSize: 13, color: '#7a8794', marginBottom: 16, marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  label: { color: '#55626d' },
  value: { fontWeight: '700' },
  net: { color: '#16a34a', fontWeight: '700', marginTop: 8 },
})
