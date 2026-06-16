import { BASE_URL } from '../constants/api'

// Calls the backend /goals router.

export async function getGoals(householdId) {
  const res = await fetch(`${BASE_URL}/goals/household/${householdId}`)
  return res.json() // goals (+ AI insights if the backend includes them)
}

export async function createGoal(body) {
  // body: { household_id, goal_name, goal_amount, current_value, target_date }
  const res = await fetch(`${BASE_URL}/goals/new`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

export async function updateGoal(body) {
  // body: { goal_id, goal_name, goal_amount, current_value, target_date }
  const res = await fetch(`${BASE_URL}/goals/update`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res.json()
}

export async function deleteGoal(goal_id) {
  const res = await fetch(`${BASE_URL}/goals/delete`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ goal_id }),
  })
  return res.json()
}
