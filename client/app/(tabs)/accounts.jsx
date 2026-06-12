import { ScrollView, View, Text, StyleSheet, Modal, Pressable, Keyboard, TextInput} from 'react-native'
import {useState, useEffect} from 'react'
import colours from '../../constants/colours'
import Card from '../../components/Card'
import AddButton from '../../components/AddButton'
import AddModal from '../../components/AddModal'
import Field from '../../components/Field'
import DateField from '../../components/DateField'
import SelectField from '../../components/SelectField'
import MetabaseScreen from '../../components/Data'
import { createAccount, getAccounts, deleteAccount,addIncome } from '../../api/bank-accounts';


export default function accounts() {

  const [activeModal, setActiveModal] = useState(null)
  const [accounts, setAccounts] = useState([]) //not in use yet
  const [accountName, setAccountName] = useState('')
  const [accountBalance, setAccountBalance] = useState('')
  const [accountType, setAccountType] = useState('')
  const [accountId, setAccountId] = useState('') //not in use yet
  const [incomeFrequency, setIncomeFrequency] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(null)
  const [date, setDate] = useState(new Date())
  const accountOptions = accounts.map(acc => ({
    label: acc.account_name,
    value: acc.account_id,
  }))


  //on page load
  useEffect(() => {
    loadAccounts()
  }, [])


  // function to get accounts for household
  async function loadAccounts() {
    try {
      const data = await getAccounts(1) //update id
      setAccounts(data)
    } catch (error) {
      console.log("Failed to load accounts:", error)
    }
  }

  

  // function to add income to account
  async function handleAddIncome() {
    if (!accountId || !incomeFrequency || !amount || !date) {
      alert("Please fill in all fields");
      return;
    }

    const payload = {
      account_id: 1,
      income_frequency: incomeFrequency,
      income_amount: amount,
      category: category ?? null,
      date: date,
    };

    console.log("PAYLOAD:", payload);
    await addIncome({
      account_id: 1,
      income_frequency: incomeFrequency,
      income_amount: amount,
      category: category ?? null,
      date: date,
    });
    setActiveModal(null);
  }

  // function to add bank account
  async function handleAddAccount() {
    if (!accountName || !accountBalance || !accountType) {
      alert("Please fill in all fields");
      return;
    }
    await createAccount({
      household_id: 1, //need to update id
      account_name: accountName,
      account_balance: accountBalance,
      account_type: accountType,
    });
    setActiveModal(null);
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
            <SelectField
              label="Bank Account"
              value={accountId}
              onChange={setAccountId}
              placeholder="Select Bank Account"
              options={accountOptions}
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
                { label: "None", value: null },
                { label: "Salary", value: "Salary" },
                { label: "Refund", value: "Refund" },
                { label: "Other", value: "Other" }
              ]}
            />
            <SelectField
              label="Income Frequency"
              value={incomeFrequency}
              onChange={setIncomeFrequency}
              placeholder="Select Frequency"
              options={[
                { label: "Annually", value: "annually" },
                { label: "Monthly", value: "monthly" },
                { label: "One-Time", value: "one_time" }
              ]}
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
