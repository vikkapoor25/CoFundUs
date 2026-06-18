import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect } from "react"
import { useRouter } from "expo-router"

export default function Logout() {
  const router = useRouter()

  useEffect(() => {
    async function logout() {
      await AsyncStorage.removeItem("token")

      const after = await AsyncStorage.getItem("token")
      router.replace("/(auth)/login")
    }

    logout()
  }, [])

  return null;
}