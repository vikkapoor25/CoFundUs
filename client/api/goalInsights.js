const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

// Calls the backend /goal-insights router (AI-generated text insights).

export async function getFeasibility(householdId) {
  const res = await fetch(`${BASE_URL}/goal-insights/feasibility/household/${householdId}`)
  return res.json()
}

export async function getPriority(householdId) {
  const res = await fetch(`${BASE_URL}/goal-insights/priority/household/${householdId}`)
  return res.json()
}

export async function getOptimisation(householdId) {
  const res = await fetch(`${BASE_URL}/goal-insights/optimisation/household/${householdId}`)
  return res.json()
}
