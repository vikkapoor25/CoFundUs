import { Tabs } from 'expo-router';


// Specifies each tab in nav bar with custom name and order
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen
        name="accounts"
        options={{ title: "Accounts" }}
      />
        <Tabs.Screen
        name="index"
        options={{ title: "Home" }}
      />
      <Tabs.Screen
        name="bills"
        options={{ title: "Bills" }}
      />
      <Tabs.Screen
        name="goals"
        options={{ title: "Goals" }}
      />
      
    </Tabs>
    
  )
}