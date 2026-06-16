import AsyncStorage from '@react-native-async-storage/async-storage'
import { useState } from 'react'
import { View, Text, TextInput, Pressable, Image, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Svg, { Path } from 'react-native-svg'
import colours from '../../constants/colours'
import { login as apiLogin } from '../../api/user'

export default function login() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setError('')
    setLoading(true)
    try {
      const data = await apiLogin(username, password)
      if (data && data.jwt_token) {

        //save data in storage
        await AsyncStorage.setItem("token", data.jwt_token);
        await AsyncStorage.setItem(
          "household",
          JSON.stringify({
            household_id: data.household_id,
            name_1: data.name_1,
            name_2: data.name_2,
          })
        )
      
        router.replace('/')
      } else {
        setError(data?.error || 'Invalid login details')
      }
    } catch (e) {
      setError('Could not reach the server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Image source={require('../../assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.tagline}>Track, Save, Grow Together</Text>
      </View>

      <Svg width="100%" height={70} viewBox="0 0 1440 120" preserveAspectRatio="none" style={styles.wave}>
        <Path d="M0,120 L0,55 C400,120 1040,0 1440,55 L1440,120 Z" fill="#ffffff" />
      </Svg>

      <View style={styles.bottom}>
        <Text style={styles.heading}>Login</Text>

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your household username"
          placeholderTextColor="#9aa3b0"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#9aa3b0"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable style={styles.btn} onPress={handleLogin} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </Pressable>

        <View style={styles.links}>
          <Pressable onPress={() => router.push('/register')}>
            <Text style={styles.link}>Create account?</Text>
          </Pressable>
          <Pressable>
            <Text style={styles.link}>Forgot Password?</Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colours.navBackground },
  top: { height: 250, alignItems: 'center', justifyContent: 'center', gap: 12 },
  logo: { width: 90, height: 90, resizeMode: 'contain' },
  tagline: { color: '#fff', fontSize: 15, fontWeight: '600' },
  wave: { marginBottom: -1 },
  bottom: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 28, paddingTop: 8 },
  heading: { fontSize: 30, fontWeight: '800', color: '#3a4a63', marginBottom: 24 },
  label: { fontSize: 13, color: '#55626d', marginBottom: 6, fontWeight: '600' },
  input: { borderBottomWidth: 1, borderBottomColor: '#d7dee6', height: 44, marginBottom: 18, fontSize: 14 },
  error: { color: '#e5484d', fontSize: 13, marginBottom: 10 },
  btn: { backgroundColor: '#4a7ec2', borderRadius: 10, height: 48, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  links: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
  link: { color: '#4a7ec2', fontWeight: '600', fontSize: 13 },
})
