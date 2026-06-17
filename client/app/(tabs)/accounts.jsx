import AsyncStorage from '@react-native-async-storage/async-storage'
import { ScrollView, View, Text, StyleSheet, Modal, Pressable, Keyboard, TextInput} from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import {useState, useEffect, useCallback } from 'react'
import colours from '../../constants/colours'
import Card from '../../components/Card'
import AddButton from '../../components/AddButton'
import AddModal from '../../components/AddModal'
import Field from '../../components/Field'
import DateField from '../../components/DateField'
import SelectField from '../../components/SelectField'
import AccountCards from '../../components/AccountCards'
import { createAccount, getAccounts, deleteAccount, getBalance } from '../../api/bank-accounts'
import { createIncome } from '../../api/income'


export default function accounts() {


  const [householdId, setHouseholdId] = useState(null)
  const [activeModal, setActiveModal] = useState(null)
  const [accounts, setAccounts] = useState([]) 
  const [balance, setBalance] = useState()
  const [accountAmount, setAccountAmount] = useState()
  const [accountName, setAccountName] = useState('')
  const [accountBalance, setAccountBalance] = useState('')
  const [accountType, setAccountType] = useState('')
  const [accountId, setAccountId] = useState('')
  const [incomeFrequency, setIncomeFrequency] = useState('')
  const[incomeName, setIncomeName] = useState(null)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(null)
  const [date, setDate] = useState(new Date())
  const [deleteTarget, setDeleteTarget] = useState(null)

  //load in id first
  useEffect(() => {
    loadHouseholdId()
  }, [])
  //run once householdid is stored
  useEffect(() => {
    if (householdId === null) return
    loadAccounts()
    loadBalance()
  }, [householdId])

  useFocusEffect(
    useCallback(() => {
      if (householdId === null) return

      loadAccounts()
      loadBalance()
    }, [householdId])
  )

  //get household id for asyncstorage
  async function loadHouseholdId() {
    const stored = await AsyncStorage.getItem('household')
    if (!stored) {
      setHouseholdId(1)
      return
    }
    const storage = JSON.parse(stored)
    if (!storage?.household_id) {
      setHouseholdId(null)
      return
    }
    setHouseholdId(Number(storage.household_id))
  }

  // function to get accounts for household
  async function loadAccounts() {
    try {
      const data = await getAccounts(householdId)
      setAccounts(data)
      setAccountAmount(data.length)
    } catch (error) {
      console.log("Failed:", error)
      setAccounts([])
    }
  }

  // function to retrieve overall balance for all accounts
  async function loadBalance() {
    try {
      const data = await getBalance(householdId) 
      setBalance(data.total_balance)
    } catch (error) {
      console.log("Failed to get Balance:", error)
    }
  }

  // function to add income to account
  async function handleAddIncome() {
    if (!accountId || !incomeFrequency || !amount || !date) {
      alert("Please fill in all fields")
      return
    }
    await createIncome({
      account_id: accountId,
      income_name: incomeName,
      income_amount: amount,
      payment_date: date.toISOString().split("T")[0],
      category: category,
      payment_frequency: incomeFrequency,
    })
    resetIncomeForm()
    await loadAccounts()
    setActiveModal(null)
  }

  // function to add bank account
  async function handleAddAccount() {
    if (!accountName || !accountBalance || !accountType) {
      alert("Please fill in all fields")
      return
    }
    await createAccount({
      household_id: householdId, 
      account_name: accountName,
      account_balance: accountBalance,
      account_type: accountType,
    })
    //reload information
    await loadAccounts()
    await loadBalance()
    resetAccountForm()
    setActiveModal(null)
  }

  //delet account by id
  async function handleDeleteAccount() {
    console.log("hit del")
    try {
      await deleteAccount(deleteTarget)
      await loadAccounts()
      await loadBalance()
    } catch (error) {
      console.log(error)
    } finally {
      setActiveModal(null)
      setDeleteTarget(null)
    }
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

  function openIncomeModal(accountId) {
    setAccountId(accountId)
    setActiveModal("income")
  }

  function openDeleteModal(accountId) {
    setDeleteTarget(accountId)
    setActiveModal("delete-confirm")
  }

  const selectedAccount = accounts.find(
    acc => acc.account_id === accountId
  )


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
          <AccountCards accounts={accounts} addIncome={openIncomeModal} deleteAccount={openDeleteModal}/>

        </View>
      </ScrollView>

      {/* add account button */}
      <AddButton onPress={() => setActiveModal("account")} />

      <AddModal
        title={
          activeModal === "account"
            ? "Add A Bank Account"
            : ""
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
            <Text style={styles.modalTitle}>
              Adding income to {selectedAccount?.account_name}
            </Text>
            <Field
              label="Name"
              placeholder="Enter Income Name" 
              value={incomeName}
              onChangeText={setIncomeName}
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
                { label: "Salary", value: "Salary" },
                { label: "Refund", value: "Refund" },
                { label: "Payment", value: "Payment" },
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
        {activeModal === "delete-confirm" && (
          <View style={styles.confirmContainer}>
            
            <Text style={styles.confirmTitle}>
              Delete account?
            </Text>

            <Text style={styles.confirmText}>
              Are you sure you want to delete{" "}
              <Text style={styles.confirmBold}>
                {accounts.find(a => a.account_id === deleteTarget)?.account_name}
              </Text>
              ? This action cannot be undone.
            </Text>

            <View style={styles.confirmActions}>
              
              <Pressable
                style={[styles.confirmButton, styles.cancelButton]}
                onPress={() => {
                  setActiveModal(null)
                  setDeleteTarget(null)
                }}
              >
                <Text style={styles.confirmCancelText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[styles.confirmButton, styles.deleteButton]}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.confirmDeleteText}>Delete</Text>
              </Pressable>
            </View>
          </View>
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
    gap: 10, 
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
    color: "#111",
    textAlign: "center",
  },
  modalTitleBold: {
    color: colours.label,
    fontWeight: "800",
  },
  confirmContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
    color: "#111",
  },
  confirmText: {
    fontSize: 13,
    color: "#55626d",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 18,
  },
  confirmBold: {
    fontWeight: "700",
    color: "#111",
  },
  confirmActions: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#e5e7eb",
  },
  deleteButton: {
    backgroundColor: "#c0392b",
  },
  confirmCancelText: {
    fontWeight: "700",
    color: "#111",
  },
  confirmDeleteText: {
    fontWeight: "700",
    color: "white",
  },
})