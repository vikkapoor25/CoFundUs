import AsyncStorage from '@react-native-async-storage/async-storage'
import { ScrollView, View, Text, StyleSheet } from 'react-native'
import {useState, useEffect} from 'react'
import colours from '../../constants/colours'
import Card from '../../components/Card'
import TableCard from '../../components/Table'
import MetabaseScreen from '../../components/Data'
import { getHome, getNet, getBills, getGoal } from '../../api/home'
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry'



export default function home() {

  const [householdId, setHouseholdId] = useState(null)
  const [nameOne, setNameOne] = useState(null)
  const [nameTwo, setNameTwo] = useState(null)
  const [net, setNet] = useState()
  const [bills, setBills] = useState([])
  const [goal, setGoal] = useState(null)


  //load in id first
  useEffect(() => {
    loadStorage()
  }, [])

  useEffect(() => {
    if (householdId === null) return
    loadData()
  }, [householdId])

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
    setHouseholdId(Number(household_id))
  }

  async function loadData() {
    try {
      const netData = await getNet(householdId)
      const billData = await getBills(householdId)
      const goalData = await getGoal(householdId)
      setNet(Number(netData.net_gain_loss))
      setBills(billsData)
      setGoal(goalData)
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

      {/* display all account in pie chart */}
      <Card title="Account Balance Overview">
        <View style={styles.metabaseBox}>
          <MetabaseScreen url="https://vivid-abaft.metabaseapp.com/public/question/42e0e5ac-8274-4c8c-9e66-c816874c51ae#titled=false"/>
        </View>
      </Card>

      {/* display income and spending for month with net gain or loss */}
      <Card title="Monthly Income and Spending">
        {/* add bar chart visual */}

        <View style={styles.row}>
          <Text style={styles.label}>Net Gain/Loss:</Text>

          <Text
            style={[
              styles.value,
              { color: net >= 0 ? colours.green : colours.red },
            ]}
          >
            {net >= 0 ? "+" : ""}£{Number(net)}
          </Text>
        </View>
      </Card>

      {/* display bills due within 7 days */}
      <TableCard
        title="Upcoming Bills"
        headers={['Bill', 'Amount', 'Account', 'Due']}
        data={bills}
        emptyText="No bills due within the next 7 days!"
         renderRow={(bill) => (
          <View key={bill.bill_name} style={styles.tableRow}>
            <Text style={styles.col}>{bill.bill_name}</Text>
            <Text style={styles.col}>£{bill.bill_amount}</Text>
            <Text style={styles.col}>{bill.account_name}</Text>
            <Text style={styles.col}>{bill.bill_due_date}</Text>
          </View>
        )}
      />

      {/* display goal and progress bar */}
      <Card title="Next Goal">
        {!goal?.goal_name ? (
          <Text style={styles.emptyText}>
            You haven’t set a savings goal yet
          </Text>
        ) : (
          <>
            <View style={styles.row}>
              <Text style={styles.label}>{goal.goal_name}</Text>
              <Text style={styles.label}>
                £{goal.current_value}/£{goal.goal_amount}
              </Text>
            </View>

            {/* add progress bar data */}

            <Text style={styles.label}>
              Target date: {goal.target_date}
            </Text>
          </>
        )}
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  metabaseBox: {
    height: 300,  
    marginVertical: 16,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom:0
  },
  screen: { flex: 1, backgroundColor: colours.background },
  body: { padding: 16, paddingTop: 30 },
  heading: { fontSize: 24, fontWeight: '800', color: colours.pageHeader },
  sub: { fontSize: 13, color: '#7a8794', marginBottom: 16, marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  label: { color: '#55626d' },
  value: { fontWeight: '700' },
  tableHeader: {
  flexDirection: 'row',
  paddingVertical: 6,
  borderBottomWidth: 1,
  borderBottomColor: '#e5e7eb',
  },
  tableRow: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', },
  col: { flex: 1, fontSize: 12, color: '#111827', },
  emptyText:{
    paddingVertical: 12,
    color: '#7a8794',
    fontSize: 13,
    fontStyle: 'italic',
  }
})
