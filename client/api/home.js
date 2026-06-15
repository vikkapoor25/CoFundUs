const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

// Calls the backend /home router (dashboard summary).
export async function getHome(householdId) {
  const res = await fetch(`${BASE_URL}/home/${householdId}`)
  return res.json() // { totalBalance, income, bills, netGainLoss, upcomingBills, goals }
}

//fetch households bills
export async function getBills(householdId) {
  const res = await fetch(`${BASE_URL}/home/bills/${householdId}`)
  return res.json() 
}

//fetch households netgain/loss
export async function getNet(householdId){
  const res = await fetch(`${BASE_URL}/home/net/${householdId}`)
  return res.json()
}

//mock functions until backed in ready
export async function mockGetHome(householdId) {
  return {
    totalBalance: 28500,
    netGainLoss: 1150,
  };
}

export async function mockGetGoal(householdId){
  return {
    goal_name: "iPhone",
    goal_amount: 1000,
    current_amount: 800,
    target_date: "28-08-2026"
  }
}

