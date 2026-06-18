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

export async function getGoal(householdId){
  const res= await fetch(`${BASE_URL}/home/goal/${householdId}`)
  return res.json()
}

