import { ScrollView, View, Text, StyleSheet, Modal, Pressable, TextInput} from 'react-native'
import {useState, useEffect} from 'react'
import colours from '../../constants/colours'
import Card from '../../components/Card'
import AddButton from '../../components/AddButton'
import AddModal from '../../components/AddModal'
import Field from '../../components/Field'
import DateField from '../../components/DateField'
import SelectField from '../../components/SelectField'
import MetabaseScreen from '../../components/Data'
import { createAccount, getAccounts, deleteAccount } from '../../api/bank-accounts';


export default function accounts() {

  const [activeModal, setActiveModal] = useState(null)
  const [accounts, setAccounts] = useState([]) //not in use yet
  const [accountName, setAccountName] = useState('')
  const [accountBalance, setAccountBalance] = useState('')
  const [accountType, setAccountType] = useState('')
  const [accountId, setAccountId] = useState('') //not in use yet
  const [paymentFrequency, setPaymentFrequency] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(null)
  const [date, setDate] = useState(new Date())


  async function handleAddIncome() {
    if (!accountName || !paymentFrequency || !amount || !category || !date) {
      alert("Please fill in all fields");
      return;
    }

    await addIncome({
      account_id: 1,
      payment_frequency: paymentFrequency,
      income_amount: amount,
      category: category,
      income_repeat_date: date,
    });
    setModalVisible(false);
  }

  async function handleAddAccount() {
    if (!accountName || !accountBalance || !accountType) {
      alert("Please fill in all fields");
      return;
    }
    await createAccount({
      household_id: 1,
      account_name: accountName,
      account_balance: accountBalance,
      account_type: accountType,
    });
    setModalVisible(false);
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.body}>
        <Text style={styles.heading}>Accounts</Text>
        {/* add account button */}
        <View style={styles.container}>
          <AddButton title="+" onPress={() => setActiveModal("account")} />
        </View>
          
        
          {/* show balance */}
          <Card title="My Account">
            <View style={styles.row}>
              <Text style={styles.label}>Total Balance</Text>
              <Text style={styles.value}>£11,000</Text>
            </View>
          </Card>

          {/* all accounts */}
          <View style={styles.metabaseBox}>
            <MetabaseScreen />
          </View>

          {/* add income button */}
          <Pressable onPress={() => setActiveModal("income")} style={styles.button}>
            <Text style={styles.add}>Add Income</Text>
          </Pressable>

          {/* delete an account button */}
          <Pressable onPress={() => setActiveModal("delete")} style={styles.button}>
            <Text style={styles.add}>Delete An Account</Text>
          </Pressable>
      </ScrollView>

      <AddModal
        title={activeModal === "account" ? "Add A Bank Account" : "Add Income"}
        visible={activeModal !== null}
        setVisible={() => setActiveModal(null)}
      >
       {activeModal === "account" && (
          <>
            <Field
              label="Account Name" 
              placeholder="Enter your bank account name" keyboardType="default" 
              value={accountName} 
              onChangeText={setAccountName}
            />
            <Field
              label="Account Balance" 
              placeholder="Enter your balance" 
              keyboardType="numeric" 
              value={accountBalance} 
              onChangeText={setAccountBalance}
            />
            <Field
              label="Account Type" 
              placeholder="Enter your bank type" 
              keyboardType="default" 
              value={accountType} 
              onChangeText={setAccountType}
            />

            <Pressable style={styles.button} onPress={handleAddAccount}>
              <Text style={styles.textStyle}>Add Account</Text>
            </Pressable>
          </>
        )}

        {activeModal === "income" && (
          <>
            <Field
              label="Account Name"
              placeholder="Select Bank Account" 
              value={accountName}
              onChangeText={setAccountName}
            />
            <Field
              label="Amount"
              placeholder="Enter Amount" 
              keyboardType="numeric" 
              value={amount}
              onChangeText={setAmount}
            />
            <SelectField
              label="Category"
              value={category}
              onChange={setCategory}
              placeholder="Select Category"
              options={[
                "Salary",
                "Refund",
                "Other"
              ]}
            />
            <Field
              label="Payment Frequency"
              placeholder="Payment Frequency" 
              value={paymentFrequency}
              onChangeText={setPaymentFrequency}
            />
            <DateField
              label="Income Date"
              value={date}
              onChange={setDate}
            />
            

            <Pressable style={styles.button} onPress={handleAddIncome}>
              <Text style={styles.textStyle}>Add Income</Text>
            </Pressable>
          </>
        )}
      </AddModal>
    </View>
  )
}

const styles = StyleSheet.create({
  metabaseBox: {
    height: 400,  
    marginVertical: 16,
    borderRadius: 12,
    overflow: "hidden"
  },
  screen: { flex: 1, backgroundColor: colours.background },
  container: {left: 305,bottom: 30},
  body: { padding: 16, paddingTop: 60 },
  heading: { fontSize: 24, fontWeight: '800', color: colours.pageHeader, marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  label: { color: '#55626d' },
  value: { fontWeight: '700' },
  net: { color: '#16a34a', fontWeight: '700', marginTop: 8 },
  track: { height: 12, borderRadius: 8, backgroundColor: '#e3e9f0', overflow: 'hidden', marginTop: 8 },
  fill: { height: '100%', backgroundColor: '#4a7ec2', borderRadius: 8 },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 20,
    backgroundColor: '#4a7ec2',
    alignSelf: 'center'
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  }
})
