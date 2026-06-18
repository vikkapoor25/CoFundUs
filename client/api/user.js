const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;


// Calls the backend /user router.

export async function login(household_username, household_password) {
  const res = await fetch(`${BASE_URL}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ household_username, household_password }),
  })
  return res.json() // { household_id, name_1, name_2, jwt_token }
}

export async function register(details) {
  const res = await fetch(`${BASE_URL}/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details),
  })
  return res.json()
}

export async function verify(household_id, code) {
  const res = await fetch(`${BASE_URL}/user/verify-2fa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ household_id, code }),
  })
  return res.json()
}
