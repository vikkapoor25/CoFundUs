import { BASE_URL } from '../constants/api'

// Calls the backend /home router (dashboard summary).
export async function getHome(householdId) {
  const res = await fetch(`${BASE_URL}/home/${householdId}`)
  return res.json() // { totalBalance, income, bills, netGainLoss, upcomingBills, goals }
}
