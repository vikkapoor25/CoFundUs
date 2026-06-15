const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL

// Calls the backend /home router (dashboard summary).
export async function getHome(householdId) {
  const res = await fetch(`${BASE_URL}/home/${householdId}`)
  return res.json() // { totalBalance, income, bills, netGainLoss, upcomingBills, goals }
}

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
export async function mockGetBills(householdId) {
  return [
      {
        bill_name: "EE Phone Bill",
        account_name: "tooba",
        bill_amount: 20,
        bill_due_date: "2026-06-16"
      },
      {
        bill_name: "Gym",
        account_name: "tooba",
        bill_amount: 30,
        bill_due_date: "2026-06-17"
      }
  ]
}

export async function mockGetGoal(householdId){
  return {
    goal_name: "iPhone",
    goal_amount: 1000,
    current_amount: 800,
    target_date: "28-08-2026"
  }
}

