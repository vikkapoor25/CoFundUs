import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, View, Text, StyleSheet, Modal, Pressable, Keyboard, TextInput} from 'react-native'
import {useState, useEffect} from 'react'
import colours from '../../constants/colours'
import Card from '../../components/Card'
import AccountCards from '../../components/AccountCards';
import AddButton from '../../components/AddButton'
import AddModal from '../../components/AddModal'
import Field from '../../components/Field'
import DateField from '../../components/DateField'
import SelectField from '../../components/SelectField'
import { createAccount, getAccounts, deleteAccount,addIncome, getBalance } from '../../api/bank-accounts';


export default function accounts() {


  const [householdId, setHouseholdId] = useState(null)
  const [activeModal, setActiveModal] = useState(null)
  const [accounts, setAccounts] = useState([]) //not in use yet
  const [balance, setBalance] = useState() //not in use yet
  const [accountAmount, setAccountAmount] = useState()
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


  //load in id first
  useEffect(() => {
    loadHouseholdId();
  }, []);
  //run once householdid is stored
  useEffect(() => {
    if (householdId === null) return;
    loadAccounts();
    loadBalance();
  }, [householdId]);

  

  //get household id for asyncstorage
  async function loadHouseholdId() {
    const stored = await AsyncStorage.getItem('household');
    if (!stored) {
      setHouseholdId(1)
      return
    }
    const { household_id } = JSON.parse(stored)
    setHouseholdId(Number(household_id));
  }

  // function to get accounts for household
  async function loadAccounts() {
    try {
      const data = await getAccounts(householdId) 
      setAccounts(data)
      setAccountAmount(data.length)
      console.log(data)
    } catch (error) {
      console.log("Failed to load accounts:", error)
    }
  }

  // function to retrieve overall balance for all accounts
  async function loadBalance() {
    try {
      const data = await getBalance(householdId) 
      setBalance(data.balance)
    } catch (error) {
      console.log("Failed to get Balance:", error)
    }
  }

  // function to add income to account
  async function handleAddIncome() {
    if (!accountId || !incomeFrequency || !amount || !date) {
      alert("Please fill in all fields");
      return;
    }

    const payload = {
      account_id: accountId,
      income_frequency: incomeFrequency,
      income_amount: amount,
      category: category ?? null,
      date: date,
    };

    await addIncome({
      account_id: accountId,
      income_frequency: incomeFrequency,
      income_amount: amount,
      category: category ?? null,
      date: date,
    });
    resetIncomeForm()
    setActiveModal(null);
  }

  // function to add bank account
  async function handleAddAccount() {
    if (!accountName || !accountBalance || !accountType) {
      alert("Please fill in all fields");
      return;
    }
    await createAccount({
      household_id: householdId, 
      account_name: accountName,
      account_balance: accountBalance,
      account_type: accountType,
    });
    //reload accounts for updated list
    await loadAccounts();
    resetAccountForm()
    setActiveModal(null);
  }

  //delet account by id
  async function handleDeleteAccount() {
    if (!accountId) {
      alert("Please select an account");
      return;
    }
    await deleteAccount(accountId);
    //reload accounts for updated list
    await loadAccounts();
    setActiveModal(null);
  }
  //reset form
  function resetAccountForm() {
    setAccountName('')
    setAccountBalance('')
    setAccountType('')
  }
  function resetIncomeForm() {
    setAccountId('')
    setAmount('')
    setCategory(null)
    setIncomeFrequency('')
    setDate(new Date())
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        bounces={false}  
      >
        <Text style={styles.heading}>Household Banks</Text>
        <Text style={styles.sub}>All your household finances in one place</Text>
        {/* show balance */}
        
        <View style={styles.list}>
          <Card title="All Accounts">
            <View style={styles.row}>
              <Text style={styles.label}>Total Balance</Text>
              <Text style={styles.value}>£{balance}</Text>
            </View>
              <View style={styles.row}>
                <Text style={styles.label}>Total Accounts</Text>
                <Text style={styles.value}>{accountAmount}</Text>
              </View>
          </Card>

          {/* view account information */}
          <AccountCards accounts={accounts} />

          {/* add income and delete button */}
          <View style={styles.bottomBar}>
            <Pressable
              onPress={() => setActiveModal("income")}
              style={styles.bottomButton}
            >
              <Text style={styles.textStyle}>Add Income</Text>
              </Pressable>

              <Pressable
                onPress={() => setActiveModal("delete")}
                style={styles.bottomButton}
              >
              <Text style={styles.textStyle}>Delete Account</Text>
            </Pressable>
          </View>

        </View>
      </ScrollView>

      {/* add account button */}
      <AddButton onPress={() => setActiveModal("account")} />

      <AddModal
        title={
          activeModal === "account"
            ? "Add A Bank Account"
            : activeModal === "income"
            ? "Add Income"
            : "Delete A Bank Account"
        }
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
        {activeModal === "delete" && (
          <>
            <SelectField
              label="Bank Account"
              value={accountId}
              onChange={setAccountId}
              placeholder="Select Bank Account"
              options={accountOptions}
            />

            <Pressable
              style={styles.button}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.textStyle}>Delete Account</Text>
            </Pressable>
          </>
        )}
      </AddModal>
    </View>

    
  )
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colours.background,
  },
  body: {
    padding: 16,
    paddingTop: 30,
    paddingBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    color: colours.pageHeader,
  },
  sub: {
    fontSize: 13,
    color: "#7a8794",
    marginTop: 4,
    marginBottom: 16,
  },
  list: {
    marginTop: 10,
    gap: 16, 
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  label: {
    color: "#55626d",
  },
  value: {
    fontWeight: "700",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 4,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 20,
    backgroundColor: colours.buttonBackground,
    alignSelf: 'center'
  },
  bottomButton: {
    flex: 1,
    backgroundColor: colours.buttonBackground,
    padding: 12,
    borderRadius: 16,
    alignItems: "center",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});