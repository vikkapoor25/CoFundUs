import { BASE_URL } from '../constants/api'

// Calls the backend /home router (dashboard summary).
export async function getHome(householdId) {
  const res = await fetch(`${BASE_URL}/home/${householdId}`)
  return res.json() // { totalBalance, income, bills, netGainLoss, upcomingBills, goals }
}

export async function mockGetHome(householdId) {
  return {
    totalBalance: 49605,
    netGainLoss: -850,
  };
}

export async function mockGetBills(householdId) {
  return {
    totalBalance: 49605,
    netGainLoss: -850,
  };
}

