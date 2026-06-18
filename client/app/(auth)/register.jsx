import { useState } from 'react'
import { View, Text, TextInput, Pressable, Image, ScrollView, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Svg, { Path } from 'react-native-svg'
import colours from '../../constants/colours'
import { register as apiRegister } from '../../api/user'

export default function register() {
  const router = useRouter()
  const [form, setForm] = useState({
    name_1: '',
    email_1: '',
    name_2: '',
    email_2: '',
    household_username: '',
    household_password: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key) => (value) => setForm({ ...form, [key]: value })

  async function handleRegister() {
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const data = await apiRegister(form)
      if (data && data.error) {
        setError('Could not create account')
      } else {
        setSuccess('Registered successfully! Taking you to login...')
        setTimeout(() => router.replace('/login'), 1300)
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
        <Text style={styles.brand}>CoFund<Text style={styles.brandAccent}>Us</Text></Text>
        <Text style={styles.tagline}>Track. Save. Grow Together.</Text>
      </View>

      <Svg width="100%" height={60} viewBox="0 0 1440 120" preserveAspectRatio="none" style={styles.wave}>
        <Path d="M0,120 L0,55 C400,120 1040,0 1440,55 L1440,120 Z" fill="#ffffff" />
      </Svg>

      <ScrollView style={styles.bottom} contentContainerStyle={styles.bottomContent} showsVerticalScrollIndicator={false} bounces={false}>
        <Text style={styles.heading}>Register</Text>

        <Text style={styles.label}>Partner 1 Name</Text>
        <TextInput style={styles.input} placeholder="e.g. Alex" placeholderTextColor="#9aa3b0"
          value={form.name_1} onChangeText={set('name_1')} />

        <Text style={styles.label}>Partner 1 Email</Text>
        <TextInput style={styles.input} placeholder="alex@email.com" placeholderTextColor="#9aa3b0"
          value={form.email_1} onChangeText={set('email_1')} autoCapitalize="none" keyboardType="email-address" />

        <Text style={styles.label}>Partner 2 Name</Text>
        <TextInput style={styles.input} placeholder="e.g. Sam" placeholderTextColor="#9aa3b0"
          value={form.name_2} onChangeText={set('name_2')} />

        <Text style={styles.label}>Partner 2 Email</Text>
        <TextInput style={styles.input} placeholder="sam@email.com" placeholderTextColor="#9aa3b0"
          value={form.email_2} onChangeText={set('email_2')} autoCapitalize="none" keyboardType="email-address" />

        <Text style={styles.label}>Household Username</Text>
        <TextInput style={styles.input} placeholder="choose a unique username" placeholderTextColor="#9aa3b0"
          value={form.household_username} onChangeText={set('household_username')} autoCapitalize="none" />

        <Text style={styles.label}>Household Password</Text>
        <TextInput style={styles.input} placeholder="choose a password" placeholderTextColor="#9aa3b0"
          value={form.household_password} onChangeText={set('household_password')} secureTextEntry />

        {success ? <Text style={styles.success}>{success}</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable style={styles.btn} onPress={handleRegister} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Creating account...' : 'Register'}</Text>
        </Pressable>

        <Pressable style={styles.linkWrap} onPress={() => router.push('/login')}>
          <Text style={styles.link}>Already have an account?</Text>
        </Pressable>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#4a7ec2' },
  top: { height: 190, alignItems: 'center', justifyContent: 'center', gap: 10 },
  logo: { width: 80, height: 80, resizeMode: 'contain' },
  brand: { color: '#fff', fontSize: 26, fontWeight: '800', letterSpacing: 0.5 },
  brandAccent: { color: '#bcd3f0' },
  tagline: { color: '#fff', fontSize: 14, fontWeight: '600' },
  wave: { marginBottom: -1 },
  bottom: { flex: 1, backgroundColor: '#fff' },
  bottomContent: { paddingHorizontal: 28, paddingTop: 16, paddingBottom: 40 },
  heading: { fontSize: 26, fontWeight: '800', color: '#3a4a63', marginBottom: 18 },
  label: { fontSize: 13, color: '#55626d', marginBottom: 6, fontWeight: '600' },
  input: { borderBottomWidth: 1, borderBottomColor: '#d7dee6', height: 42, marginBottom: 14, fontSize: 14 },
  error: { color: '#e5484d', fontSize: 13, marginBottom: 10 },
  success: { color: '#16a34a', fontSize: 13, marginBottom: 10, fontWeight: '600' },
  btn: { backgroundColor: '#4a7ec2', borderRadius: 10, height: 48, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  linkWrap: { marginTop: 16, alignItems: 'center' },
  link: { color: '#4a7ec2', fontWeight: '600', fontSize: 13 },
})
