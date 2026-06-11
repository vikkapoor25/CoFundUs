import { ScrollView, View, Text, StyleSheet, Modal, Pressable, TextInput} from 'react-native'
import {useState} from 'react';
import colours from '../../constants/colours'
import Card from '../../components/Card'
import AddButton from '../../components/AddButton'
import AddModal from '../../components/AddModal'
import Field from '../../components/Field';
import { createAccount, getAccounts, deleteAccount } from '../../api/bank-accounts';


export default function accounts() {

  const [modalVisible, setModalVisible] = useState(false);
  const [accountName, setAccountName] = useState('')
  const [accountBalance, setAccountBalance] = useState('')
  const [accountType, setAccountType] = useState('')


  async function handleAddAccount() {
    await createAccount({
      household_id: 1,
      account_name: accountName,
      account_balance: accountBalance,
      account_type: accountType,
    });
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.body}>
        <Text style={styles.heading}>Accounts</Text>
        {/* add account button */}
        <View style={styles.container}>
          <AddButton onPress={() => setModalVisible(true)} />
        </View>
          
        
          <Card title="My Account">
            <View style={styles.row}>
              <Text style={styles.label}>Total Balance</Text>
              <Text style={styles.value}>£11,000</Text>
            </View>
          </Card>

          <Card title="Personal Goals">
            <View style={styles.row}>
              <Text style={styles.label}>iPhone 16</Text>
              <Text style={styles.value}>£200 / £1,600</Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: '13%' }]} />
            </View>
          </Card>

          <Card title="Monthly Breakdown">
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

      <AddModal
        title="Add A Bank Account"
        visible={modalVisible}
        setVisible={setModalVisible}
      >
        <Field
          label="Account Name"
          placeholder="Enter your bank account name"
          keyboardType="default"
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
        <Pressable onPress={handleAddAccount}>
          <Text>Add Account</Text>
        </Pressable>
      </AddModal>
    </View>
  )
}

const styles = StyleSheet.create({
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
})
