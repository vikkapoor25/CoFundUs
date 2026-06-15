import { BASE_URL } from '../constants/api'

// Calls the backend /bank-accounts router.

export async function getAccounts(householdId) {
  const res = await fetch(`${BASE_URL}/bank-accounts/${householdId}`)
  return res.json()
}

export async function createAccount(body) {
  // body: { household_id, account_name, account_balance, account_type }
  const res = await fetch(`${BASE_URL}/bank-accounts/new`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

export async function deleteAccount(bank_account_id) {
  const res = await fetch(`${BASE_URL}/bank-accounts/delete`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bank_account_id }),
  })
  return res.json()
}
