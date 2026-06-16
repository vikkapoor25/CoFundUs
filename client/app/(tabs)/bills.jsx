import { ScrollView, View, Text, StyleSheet, Pressable, Dimensions, Modal } from 'react-native'
import { useState, useEffect } from 'react'
import { WebView } from 'react-native-webview'
import colours from '../../constants/colours'
import Card from '../../components/Card'
import AddButton from '../../components/AddButton'
import AddModal from '../../components/AddModal'
import Field from '../../components/Field'
import { getBills, createBill, deleteBill, markBillPaid } from '../../api/bills'
import { getAccounts } from '../../api/bank-accounts'
import AsyncStorage from '@react-native-async-storage/async-storage'

const CHARTS = [
  'https://vivid-abaft.metabaseapp.com/public/question/d73c0b97-8c7c-4883-b571-c2a286e8fb76#titled=false',
  'https://vivid-abaft.metabaseapp.com/public/question/044c35dc-1275-421e-98f0-98b4cf1528b5#titled=false',
  'https://vivid-abaft.metabaseapp.com/public/question/a66e81c3-fe91-4fae-bf40-381eaf2328a1#titled=false',
]

const SLIDE_W = Dimensions.get('window').width - 32

const SECTIONS = [
  { key: true, title: 'Recurring Bills' },
  { key: false, title: 'One-Time Bills' },
]

const CATEGORIES = ['Subscription', 'Entertainment', 'Beauty', 'Consumable', 'Negative', 'Leisure', 'Home Utility']

export default function bills() {
  const [householdId, setHouseholdId] = useState(null)
  const [bills, setBills] = useState([])
  const [accounts, setAccounts] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [activeChart, setActiveChart] = useState(0)
  const [fullChart, setFullChart] = useState(null)

  const accountOptions = accounts.map((a) => ({ label: a.account_name, value: a.account_id }))

  const [billName, setBillName] = useState('')
  const [amount, setAmount] = useState('')
  const [accountId, setAccountId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')
  const [categoryType, setCategoryType] = useState('')
  const [paymentFrequency, setPaymentFrequency] = useState('')
  const [billRepeatDate, setBillRepeatDate] = useState('')
  const [recurring, setRecurring] = useState(true)

  useEffect(() => {
    loadHouseholdId()
  }, [])

  useEffect(() => {
    if (householdId === null) return
    loadBills()
    loadAccounts()
  }, [householdId])

  async function loadAccounts() {
    try {
      const data = await getAccounts(householdId)
      setAccounts(Array.isArray(data) ? data : [])
    } catch (error) {
      setAccounts([])
    }
  }

  async function loadHouseholdId() {
    const stored = await AsyncStorage.getItem('household')
    if (!stored) {
      setHouseholdId(1)
      return
    }
    const { household_id } = JSON.parse(stored)
    setHouseholdId(Number(household_id) || 1)
  }

  async function loadBills() {
    try {
      const data = await getBills(householdId)
      setBills(Array.isArray(data) ? data : [])
    } catch (error) {
      setBills([])
    }
  }

  function resetForm() {
    setBillName('')
    setAmount('')
    setAccountId('')
    setDueDate('')
    setCategory('')
    setCategoryType('')
    setPaymentFrequency('')
    setBillRepeatDate('')
    setRecurring(true)
  }

  async function handleAddBill() {
    if (!billName || !amount) return
    await createBill({
      account_id: Number(accountId) || householdId,
      bill_name: billName,
      bill_amount: Number(amount) || 0,
      bill_due_date: dueDate,
      category: category,
      category_type: categoryType,
      repeat_bill: recurring,
      payment_frequency: recurring ? paymentFrequency : null,
      bill_repeat_date: recurring ? billRepeatDate : null,
    })
    resetForm()
    setModalVisible(false)
    loadBills()
  }

  async function handleMarkPaid(bill_id) {
    await markBillPaid(bill_id)
    loadBills()
  }

  async function handleDelete(bill_id) {
    await deleteBill(bill_id)
    loadBills()
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.heading}>Upcoming Bills</Text>
            <Text style={styles.sub}>Stay ahead of upcoming bills and subscriptions</Text>
          </View>
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
          const sectionBills = bills.filter((b) => b.repeat_bill === section.key)
          return (
            <Card key={section.title} title={section.title}>
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
                        {bill.category} · due {bill.bill_due_date}
                        {bill.paid ? ' · Paid' : ''}
                      </Text>
                      <View style={styles.actions}>
                        {!bill.paid && (
                          <Pressable onPress={() => handleMarkPaid(bill.bill_id)}>
                            <Text style={styles.actionPaid}>Mark paid</Text>
                          </Pressable>
                        )}
                        <Pressable onPress={() => handleDelete(bill.bill_id)}>
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

      <AddButton onPress={() => setModalVisible(true)} />

      <AddModal title="Add A Bill" visible={modalVisible} setVisible={setModalVisible}>
        <ScrollView style={styles.formScroll} contentContainerStyle={styles.form}>
          <Field label="Bill Name" placeholder="e.g. Netflix" value={billName} onChangeText={setBillName} />
          <Field label="Amount" placeholder="e.g. 15" keyboardType="numeric" value={amount} onChangeText={setAmount} />
          <Text style={styles.typeLabel}>Account</Text>
          {accountOptions.length === 0 ? (
            <Text style={styles.hint}>No accounts found. Add one on the Accounts page first.</Text>
          ) : (
            <View style={styles.typeRow}>
              {accountOptions.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => setAccountId(opt.value)}
                  style={[styles.chip, accountId === opt.value && styles.chipActive]}
                >
                  <Text style={[styles.chipText, accountId === opt.value && styles.chipTextActive]}>
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
          <Text style={styles.typeLabel}>Category</Text>
          <View style={styles.typeRow}>
            {CATEGORIES.map((c) => (
              <Pressable
                key={c}
                onPress={() => setCategory(c)}
                style={[styles.chip, category === c && styles.chipActive]}
              >
                <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
              </Pressable>
            ))}
          </View>
          <Field label="Category Type" placeholder="e.g. Subscription" value={categoryType} onChangeText={setCategoryType} />
          <Field label="Due Date" placeholder="YYYY-MM-DD" value={dueDate} onChangeText={setDueDate} />

          <Text style={styles.typeLabel}>Repeat</Text>
          <View style={styles.typeRow}>
            <Pressable onPress={() => setRecurring(true)} style={[styles.chip, recurring && styles.chipActive]}>
              <Text style={[styles.chipText, recurring && styles.chipTextActive]}>Recurring</Text>
            </Pressable>
            <Pressable onPress={() => setRecurring(false)} style={[styles.chip, !recurring && styles.chipActive]}>
              <Text style={[styles.chipText, !recurring && styles.chipTextActive]}>One-Time</Text>
            </Pressable>
          </View>

          {recurring && (
            <>
              <Field label="Payment Frequency" placeholder="e.g. Monthly" value={paymentFrequency} onChangeText={setPaymentFrequency} />
              <Field label="Bill Repeat Date" placeholder="YYYY-MM-DD" value={billRepeatDate} onChangeText={setBillRepeatDate} />
            </>
          )}

          <Pressable style={styles.submit} onPress={handleAddBill}>
            <Text style={styles.submitText}>Add Bill</Text>
          </Pressable>
        </ScrollView>
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
  body: { padding: 16, paddingTop: 30 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerText: { flex: 1, paddingRight: 12 },
  heading: { fontSize: 24, fontWeight: '800', color: colours.pageHeader },
  sub: { fontSize: 13, color: '#7a8794', marginBottom: 16, marginTop: 4 },
  empty: { fontSize: 13, color: '#9aa3b0', paddingVertical: 6 },
  hint: { fontSize: 12, color: '#9aa3b0', marginBottom: 14 },

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

  formScroll: { maxHeight: 420 },
  form: { width: 270, paddingBottom: 4 },
  typeLabel: { fontSize: 12, color: '#55626d', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  chip: { borderWidth: 1, borderColor: '#d7dee6', borderRadius: 16, paddingVertical: 6, paddingHorizontal: 12 },
  chipActive: { backgroundColor: colours.cardTitle, borderColor: colours.cardTitle },
  chipText: { fontSize: 12, color: '#55626d' },
  chipTextActive: { color: '#fff', fontWeight: '700' },

  submit: { backgroundColor: colours.cardTitle, borderRadius: 10, height: 46, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  submitText: { color: '#fff', fontWeight: '700', fontSize: 15 },
})
