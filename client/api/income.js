import { BASE_URL } from '../constants/api'

// Calls the backend /income router.

export async function getIncome(householdId) {
  const res = await fetch(`${BASE_URL}/income/${householdId}`)
  return res.json()
}

export async function createIncome(body) {
  // body: { income_amount, account_id, date, category, repeat, payment_frequency, income_repeat_date }
  const res = await fetch(`${BASE_URL}/income/new`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

export async function deleteIncome(income_id) {
  const res = await fetch(`${BASE_URL}/income/delete`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ income_id }),
  })
  return res.json()
}
