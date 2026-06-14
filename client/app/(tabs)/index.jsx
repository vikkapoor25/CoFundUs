import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import {useState, useEffect} from 'react'
import colours from '../../constants/colours'
import Card from '../../components/Card'
import MetabaseScreen from '../../components/Data'
import { getHome, mockGetHome } from '../../api/home';



export default function home() {

  const [householdId, setHouseholdId] = useState(null)
  const [nameOne, setNameOne] = useState(null)
  const [nameTwo, setNameTwo] = useState(null)
  const [balance, setBalance] = useState()
  const [net, setNet] = useState()


  //load in id first
  useEffect(() => {
    loadStorage();
  }, []);

  useEffect(() => {
    if (householdId === null) return;
    loadData()
  }, [householdId]);

  //get names from asyncstorage
  async function loadStorage() {
    const stored = await AsyncStorage.getItem("household")
    if (!stored) {
      setNameOne("User1")
      setNameTwo("User2")
      setHouseholdId(1)
      return
    }
    const { name_1, name_2 } = JSON.parse(stored)
    const { household_id } = JSON.parse(stored)
    setNameOne(name_1 ?? "")
    setNameTwo(name_2 ?? "")
    setHouseholdId(Number(household_id));
  }

  async function loadData() {
    try {
      const data = await mockGetHome(householdId) 
      setNet(data.netGainLoss)
      setBalance(data.totalBalance)
      console.log(data)
    } catch (error) {
      console.log("Failed to get data:", error)
    }
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

      <Card title="Account Balance Overview">
        <View style={styles.row}>
          <Text style={styles.label}>Total Balance</Text>
          <Text style={styles.value}>£{balance}</Text>
        </View>
        <View style={styles.metabaseBox}>
          <MetabaseScreen 
            url ="https://vivid-abaft.metabaseapp.com/public/dashboard/c32c2fba-aeb7-4f1d-bccd-2b403319ca79"
          />
        </View>
      </Card>

      <Card title="Monthly Income and Spending">
        <Text>Add bar charts</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Net Gain/Loss (£):</Text>
          <Text
            style={[
              styles.value,
              { color: net >= 0 ? colours.green : colours.red }
            ]}
          >
            {net}
          </Text>
        </View>
      </Card>

      <Card title="Upcoming Bills" rightIcon={<Text style={{ color: colours.red, fontWeight: '800' }}>!</Text>}>
        <Text style={styles.label}>Bills due within the week</Text>
      </Card>

      <Card title="Next Goal">
        <Text style={styles.label}>data visual of progress bar and figures </Text>
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  metabaseBox: {
    height: 400,  
    marginVertical: 16,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom:60
  },
  screen: { flex: 1, backgroundColor: colours.background },
  body: { padding: 16, paddingTop: 30 },
  heading: { fontSize: 24, fontWeight: '800', color: colours.pageHeader },
  sub: { fontSize: 13, color: '#7a8794', marginBottom: 16, marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  label: { color: '#55626d' },
  value: { fontWeight: '700' },
})
