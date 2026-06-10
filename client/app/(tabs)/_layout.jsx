import { Tabs, useRouter } from 'expo-router'
import { Image } from 'react-native'

export default function TabsLayout() {
  const router = useRouter()

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="accounts" options={{ title: "Accounts" }} />
      <Tabs.Screen name="bills" options={{ title: "Bills" }} />
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: () => (
            <Image
              source={require('../../assets/images/logo.png')}
              style={{ width: 40, height: 40, resizeMode: 'contain' }}
            />
          ),
        }}
      />
      <Tabs.Screen name="goals" options={{ title: "Goals" }} />
      <Tabs.Screen
        name="logout"
        options={{ title: "Logout" }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault()
            router.replace('/login')
          },
        }}
      />
    </Tabs>
  )
}
