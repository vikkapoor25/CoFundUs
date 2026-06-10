import { BASE_URL } from '../constants/api'

// Calls the backend /user router.

export async function login(household_name, password) {
  const res = await fetch(`${BASE_URL}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ household_name, password }),
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
