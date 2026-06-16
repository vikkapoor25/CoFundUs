import { ScrollView, View, Text, StyleSheet, Pressable, Dimensions, Modal } from 'react-native'
import { useState } from 'react'
import { WebView } from 'react-native-webview'
import colours from '../../constants/colours'
import Card from '../../components/card'
import AddButton from '../../components/AddButton'
import AddModal from '../../components/AddModal'
import Field from '../../components/field'

const CHARTS = [
  'https://vivid-abaft.metabaseapp.com/public/question/d73c0b97-8c7c-4883-b571-c2a286e8fb76',
  'https://vivid-abaft.metabaseapp.com/public/question/044c35dc-1275-421e-98f0-98b4cf1528b5',
  'https://vivid-abaft.metabaseapp.com/public/question/a66e81c3-fe91-4fae-bf40-381eaf2328a1',
]

const SLIDE_W = Dimensions.get('window').width - 32

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
  const [activeChart, setActiveChart] = useState(0)
  const [fullChart, setFullChart] = useState(null)

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
      <ScrollView style={styles.screen} contentContainerStyle={styles.body}>
        <View style={styles.header}>
          <Text style={styles.heading}>Bills</Text>
          <AddButton onPress={() => setModalVisible(true)} />
        </View>

        <Text style={styles.sectionTitle}>Insights</Text>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => setActiveChart(Math.round(e.nativeEvent.contentOffset.x / SLIDE_W))}
          style={styles.carousel}
        >
          {CHARTS.map((url) => (
            <View key={url} style={{ width: SLIDE_W }}>
              <Pressable style={styles.slideChart} onPress={() => setFullChart(url)}>
                <View style={StyleSheet.absoluteFill} pointerEvents="none">
                  <WebView source={{ uri: url }} style={{ flex: 1 }} />
                </View>
                <View style={styles.expandHint}>
                  <Text style={styles.expandHintText}>Tap to expand</Text>
                </View>
              </Pressable>
            </View>
          ))}
        </ScrollView>
        <View style={styles.dots}>
          {CHARTS.map((url, i) => (
            <View key={url} style={[styles.dot, activeChart === i && styles.dotActive]} />
          ))}
        </View>

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

      <Modal visible={fullChart !== null} animationType="slide" onRequestClose={() => setFullChart(null)}>
        <View style={styles.fullWrap}>
          <View style={styles.fullHeader}>
            <Text style={styles.fullTitle}>Insight</Text>
            <Pressable onPress={() => setFullChart(null)}>
              <Text style={styles.fullClose}>Close</Text>
            </Pressable>
          </View>
          {fullChart && <WebView source={{ uri: fullChart }} style={{ flex: 1 }} />}
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colours.background },
  body: { padding: 16, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  heading: { fontSize: 24, fontWeight: '800', color: colours.pageHeader },
  empty: { fontSize: 13, color: '#9aa3b0', paddingVertical: 6 },

  sectionTitle: { fontSize: 15, fontWeight: '700', color: colours.cardTitle, marginBottom: 10 },
  carousel: { marginBottom: 10 },
  slideChart: { height: 280, borderRadius: 16, overflow: 'hidden', backgroundColor: '#fff' },
  expandHint: { position: 'absolute', right: 8, bottom: 8, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  expandHintText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  fullWrap: { flex: 1, backgroundColor: '#fff' },
  fullHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#eef1f5' },
  fullTitle: { fontSize: 16, fontWeight: '800', color: colours.pageHeader },
  fullClose: { fontSize: 15, fontWeight: '700', color: colours.cardTitle },
  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginBottom: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#cdd5df' },
  dotActive: { backgroundColor: colours.cardTitle, width: 18 },

  bill: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eef1f5' },
  billLeft: { flex: 1, paddingRight: 12 },
  billName: { fontSize: 14, fontWeight: '700', color: '#2f3a48' },
  billMeta: { fontSize: 12, color: '#7a8794', marginTop: 2 },
  amount: { fontSize: 14, fontWeight: '700', color: '#2f3a48' },
  paidText: { color: '#9aa3b0', textDecorationLine: 'line-through' },

  actions: { flexDirection: 'row', gap: 16, marginTop: 6 },
  actionPaid: { fontSize: 12, fontWeight: '600', color: colours.cardTitle },
  actionDelete: { fontSize: 12, fontWeight: '600', color: '#d1495b' },

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
