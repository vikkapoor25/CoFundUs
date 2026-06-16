import { Stack, useRouter, useSegments } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"

export default function RootLayout() {
  const [loading, setLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)

  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    const token = await AsyncStorage.getItem("token")
    setLoggedIn(!!token)
    setLoading(false)
  }

  useEffect(() => {
    if (loading) return

    const inAuthGroup = segments[0] === "(auth)"

    if (!loggedIn && !inAuthGroup) {
      router.replace("/(auth)/login")
    }

    if (loggedIn && inAuthGroup) {
      router.replace("/(tabs)/index")
    }
  }, [loggedIn, loading, segments])

  if (loading) {
    return null
  }

  return <Stack screenOptions={{ headerShown: false }} />
}