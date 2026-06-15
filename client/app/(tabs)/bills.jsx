import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native'
import { useState } from 'react'
import { WebView } from 'react-native-webview'
import colours from '../../constants/colours'
import Card from '../../components/Card'
import AddButton from '../../components/AddButton'
import AddModal from '../../components/AddModal'
import Field from '../../components/Field'

const CHART_URL = 'https://vivid-abaft.metabaseapp.com/public/question/58ad854f-7cd1-4ab6-9c8b-e0a1522e7092'

const SECTIONS = [
  { key: 'recurring', title: 'Recurring Bills' },
  { key: 'subscription', title: 'Subscriptions' },
  { key: 'one-time', title: 'One-Time Bills' },
]

const SEED_BILLS = [
  { bill_id: 1, account: 'Sam', bill_name: 'EE Phone Bill', bill_amount: 16, bill_due_date: '14/06', category_type: 'recurring', paid: false },
  { bill_id: 2, account: 'Shared', bill_name: 'Rent', bill_amount: 1500, bill_due_date: '01/07', category_type: 'recurring', paid: false },
  { bill_id: 3, account: 'Shared', bill_name: 'Electricity & Gas', bill_amount: 120, bill_due_date: '02/07', category_type: 'recurring', paid: false },
  { bill_id: 4, account: 'Alex', bill_name: 'Netflix', bill_amount: 10, bill_due_date: '11/06', category_type: 'subscription', paid: false },
  { bill_id: 5, account: 'Alex', bill_name: 'Spotify', bill_amount: 12, bill_due_date: '03/06', category_type: 'subscription', paid: true },
  { bill_id: 6, account: 'Shared', bill_name: 'Concert Tickets', bill_amount: 120, bill_due_date: '14/07', category_type: 'one-time', paid: false },
  { bill_id: 7, account: 'Alex', bill_name: 'Car Repair', bill_amount: 180, bill_due_date: '20/06', category_type: 'one-time', paid: false },
]

export default function bills() {
  const [bills, setBills] = useState(SEED_BILLS)
  const [modalVisible, setModalVisible] = useState(false)

  const [billName, setBillName] = useState('')
  const [amount, setAmount] = useState('')
  const [account, setAccount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [type, setType] = useState('recurring')

  function resetForm() {
    setBillName('')
    setAmount('')
    setAccount('')
    setDueDate('')
    setType('recurring')
  }

  function handleAddBill() {
    if (!billName || !amount) return
    const newBill = {
      bill_id: Date.now(),
      account: account || 'Shared',
      bill_name: billName,
      bill_amount: Number(amount) || 0,
      bill_due_date: dueDate || '--/--',
      category_type: type,
      paid: false,
    }
    setBills((current) => [...current, newBill])
    resetForm()
    setModalVisible(false)
  }

  function togglePaid(bill_id) {
    setBills((current) =>
      current.map((b) => (b.bill_id === bill_id ? { ...b, paid: !b.paid } : b))
    )
  }

  function removeBill(bill_id) {
    setBills((current) => current.filter((b) => b.bill_id !== bill_id))
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Text style={styles.heading}>Upcoming Bills</Text>
        <Text style={styles.sub}>Stay ahead of upcoming bills and subscriptions</Text>

        <Card title="Bills vs Account Value">
          <View style={styles.chartBox}>
            <WebView source={{ uri: CHART_URL }} style={{ flex: 1 }} />
          </View>
        </Card>

        {SECTIONS.map((section) => {
          const sectionBills = bills.filter((b) => b.category_type === section.key)
          return (
            <Card key={section.key} title={section.title}>
              {sectionBills.length === 0 ? (
                <Text style={styles.empty}>No bills yet</Text>
              ) : (
                sectionBills.map((bill) => (
                  <View key={bill.bill_id} style={styles.bill}>
                    <View style={styles.billLeft}>
                      <Text style={[styles.billName, bill.paid && styles.paidText]}>
                        {bill.bill_name}
                      </Text>
                      <Text style={styles.billMeta}>
                        {bill.account} · due {bill.bill_due_date}
                        {bill.paid ? ' · Paid' : ''}
                      </Text>
                      <View style={styles.actions}>
                        <Pressable onPress={() => togglePaid(bill.bill_id)}>
                          <Text style={styles.actionPaid}>
                            {bill.paid ? 'Mark unpaid' : 'Mark paid'}
                          </Text>
                        </Pressable>
                        <Pressable onPress={() => removeBill(bill.bill_id)}>
                          <Text style={styles.actionDelete}>Delete</Text>
                        </Pressable>
                      </View>
                    </View>
                    <Text style={[styles.amount, bill.paid && styles.paidText]}>
                      £{Number(bill.bill_amount).toLocaleString()}
                    </Text>
                  </View>
                ))
              )}
            </Card>
          )
        })}
      </ScrollView>

      <View style={styles.addBtnWrap}>
        <AddButton onPress={() => setModalVisible(true)} />
      </View>

      <AddModal title="Add A Bill" visible={modalVisible} setVisible={setModalVisible}>
        <View style={styles.form}>
          <Field
            label="Bill Name"
            placeholder="e.g. Netflix"
            value={billName}
            onChangeText={setBillName}
          />
          <Field
            label="Amount"
            placeholder="e.g. 12"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <Field
            label="Account"
            placeholder="e.g. Alex, Sam, Shared"
            value={account}
            onChangeText={setAccount}
          />
          <Field
            label="Due Date"
            placeholder="DD/MM"
            value={dueDate}
            onChangeText={setDueDate}
          />

          <Text style={styles.typeLabel}>Type</Text>
          <View style={styles.typeRow}>
            {SECTIONS.map((s) => (
              <Pressable
                key={s.key}
                onPress={() => setType(s.key)}
                style={[styles.chip, type === s.key && styles.chipActive]}
              >
                <Text style={[styles.chipText, type === s.key && styles.chipTextActive]}>
                  {s.title}
                </Text>
              </Pressable>
            ))}
          </View>

          <Pressable style={styles.submit} onPress={handleAddBill}>
            <Text style={styles.submitText}>Add Bill</Text>
          </Pressable>
        </View>
      </AddModal>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colours.background },
  body: { padding: 16, paddingTop: 30 },
  heading: { fontSize: 24, fontWeight: '800', color: colours.pageHeader },
  sub: { fontSize: 13, color: '#7a8794', marginBottom: 16, marginTop: 4 },
  empty: { fontSize: 13, color: '#9aa3b0', paddingVertical: 6 },

  chartBox: { height: 280, borderRadius: 12, overflow: 'hidden' },

  bill: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eef1f5' },
  billLeft: { flex: 1, paddingRight: 12 },
  billName: { fontSize: 14, fontWeight: '700', color: '#2f3a48' },
  billMeta: { fontSize: 12, color: '#7a8794', marginTop: 2 },
  amount: { fontSize: 14, fontWeight: '700', color: '#2f3a48' },
  paidText: { color: '#9aa3b0', textDecorationLine: 'line-through' },

  actions: { flexDirection: 'row', gap: 16, marginTop: 6 },
  actionPaid: { fontSize: 12, fontWeight: '600', color: colours.cardTitle },
  actionDelete: { fontSize: 12, fontWeight: '600', color: '#d1495b' },

  addBtnWrap: { position: 'absolute', right: 20, bottom: 28 },

  form: { width: 260 },
  typeLabel: { fontSize: 12, color: '#55626d', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  chip: { borderWidth: 1, borderColor: '#d7dee6', borderRadius: 16, paddingVertical: 6, paddingHorizontal: 12 },
  chipActive: { backgroundColor: colours.cardTitle, borderColor: colours.cardTitle },
  chipText: { fontSize: 12, color: '#55626d' },
  chipTextActive: { color: '#fff', fontWeight: '700' },

  submit: { backgroundColor: colours.cardTitle, borderRadius: 10, height: 46, alignItems: 'center', justifyContent: 'center' },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})
