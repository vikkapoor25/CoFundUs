import { BASE_URL } from '../constants/api'

// Calls the backend /bills router. (Bills = expenditure / money out.)

export async function getBills(householdId) {
  const res = await fetch(`${BASE_URL}/bills/${householdId}`)
  return res.json()
}

export async function createBill(body) {
  // body: { account_id, bill_name, bill_amount, bill_due_date, category, category_type, repeat_bill, payment_frequency, bill_repeat_date, paid }
  const res = await fetch(`${BASE_URL}/bills/new`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

export async function deleteBill(bill_id) {
  const res = await fetch(`${BASE_URL}/bills/delete`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bill_id }),
  })
  return res.json()
}

export async function markBillPaid(bill_id) {
  const res = await fetch(`${BASE_URL}/bills/paid/${bill_id}`)
  return res.json()
}
