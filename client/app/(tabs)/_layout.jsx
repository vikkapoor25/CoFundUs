import { Tabs, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { Image } from "react-native"
import colours from "../../constants/colours"

export default function TabsLayout() {
  const router = useRouter()

  return (
    <Tabs
      screenOptions={{
        headerShown: true,

        //header styling
        headerStyle: {
          backgroundColor: "white",
          height: 110,
        },
        headerTitleStyle: {
          color: colours.pageHeader,
          fontWeight: "700",
          fontSize: 25,
        },
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerTitleContainerStyle: {
          paddingTop: 8,
        },

        // tabbar styling
        tabBarStyle: {
          backgroundColor: "white",
          height: 85,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 10,
          elevation: 10,
          paddingBottom: 12,
          paddingTop: 10,
        },
        tabBarActiveTintColor: colours.activeTab,
        tabBarInactiveTintColor: colours.inactiveTab,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginBottom: 2,
        },
        tabBarItemStyle: {
          justifyContent: "center",
        },
      }}
    >
      <Tabs.Screen
        name="accounts"
        options={{
          title: "Accounts",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="wallet-outline"
              size={size}
              color={color}
              style={{
                transform: [{ translateY: focused ? -1 : 0 }],
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="bills"
        options={{
          title: "Bills",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="receipt-outline"
              size={size}
              color={color}
              style={{
                transform: [{ translateY: focused ? -1 : 0 }],
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarLabel: () => null,
          tabBarIcon: () => (
            <Image
              source={require("../../assets/images/logo.png")}
              style={{
                width: 46,
                height: 46,
                resizeMode: "contain",
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="goals"
        options={{
          title: "Goals",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="flag-outline"
              size={size}
              color={color}
              style={{
                transform: [{ translateY: focused ? -1 : 0 }],
              }}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="logout"
        options={{
          title: "Logout",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault()
            router.replace("/login")
          },
        }}
      />
    </Tabs>
  )
}