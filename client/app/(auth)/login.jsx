import { useState } from 'react'
import { View, Text, TextInput, Pressable, Image, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import Svg, { Path } from 'react-native-svg'

export default function login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#9aa3b0"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
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

        <Pressable style={styles.btn} onPress={() => router.replace('/')}>
          <Text style={styles.btnText}>Login</Text>
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
  container: { flex: 1, backgroundColor: '#7e9fd6' },
  top: { height: 250, alignItems: 'center', justifyContent: 'center', gap: 12 },
  logo: { width: 90, height: 90, resizeMode: 'contain' },
  tagline: { color: '#fff', fontSize: 15, fontWeight: '600' },
  wave: { marginBottom: -1 },
  bottom: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 28, paddingTop: 8 },
  heading: { fontSize: 30, fontWeight: '800', color: '#3a4a63', marginBottom: 24 },
  label: { fontSize: 13, color: '#55626d', marginBottom: 6, fontWeight: '600' },
  input: { borderBottomWidth: 1, borderBottomColor: '#d7dee6', height: 44, marginBottom: 18, fontSize: 14 },
  btn: { backgroundColor: '#7e9fd6', borderRadius: 10, height: 48, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  links: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
  link: { color: '#4a7ec2', fontWeight: '600', fontSize: 13 },
})
