import { StyleSheet, View, Text, TextInput, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'

// LOGIN — Contains: Shared Username, Shared Password, Login button.
// Links to: Register, Home/Dashboard (on successful login).
export default function login() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function handleLogin() {
    // TODO: call api/user.js login(), store the jwt_token, then go home
    router.replace('/')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CoFundUs</Text>
      <TextInput style={styles.input} placeholder="Shared username"
        value={username} onChangeText={setUsername} autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Shared password"
        value={password} onChangeText={setPassword} secureTextEntry />
      <Pressable style={styles.btn} onPress={handleLogin}>
        <Text style={styles.btnText}>Login</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/register')}>
        <Text style={styles.link}>No account? Register</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, height: 44, paddingHorizontal: 12 },
  btn: { backgroundColor: '#2f6df6', borderRadius: 8, height: 46, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontWeight: '600' },
  link: { textAlign: 'center', color: '#2f6df6', marginTop: 12 },
})
