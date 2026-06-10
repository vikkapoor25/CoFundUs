import { StyleSheet, View, Text, TextInput, Pressable, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'

// REGISTER — Contains: Partner 1 Name, Partner 1 Email, Partner 2 Name,
// Partner 2 Email, Household Username (unique), Household Password.
// Links to: Login (on successful account creation).
export default function register() {
  const router = useRouter()
  const [form, setForm] = useState({
    name_1: '', email_1: '', name_2: '', email_2: '',
    household_name: '', password: '',
  })
  const set = (key) => (value) => setForm({ ...form, [key]: value })

  function handleRegister() {
    // TODO: call api/user.js register(form), then send to login
    router.replace('/login')
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create your shared account</Text>
      <TextInput style={styles.input} placeholder="Partner 1 name" value={form.name_1} onChangeText={set('name_1')} />
      <TextInput style={styles.input} placeholder="Partner 1 email" value={form.email_1} onChangeText={set('email_1')} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Partner 2 name" value={form.name_2} onChangeText={set('name_2')} />
      <TextInput style={styles.input} placeholder="Partner 2 email" value={form.email_2} onChangeText={set('email_2')} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Household username" value={form.household_name} onChangeText={set('household_name')} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Household password" value={form.password} onChangeText={set('password')} secureTextEntry />
      <Pressable style={styles.btn} onPress={handleRegister}>
        <Text style={styles.btnText}>Register</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 24, gap: 12, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, height: 44, paddingHorizontal: 12 },
  btn: { backgroundColor: '#2f6df6', borderRadius: 8, height: 46, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontWeight: '600' },
  link: { textAlign: 'center', color: '#2f6df6', marginTop: 12 },
})
