import { View, Text, TextInput, StyleSheet } from 'react-native'

export default function Field({ label, value, onChangeText, placeholder, keyboardType }) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9aa3b0"
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { fontSize: 12, color: '#55626d', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    borderWidth: 1,
    borderColor: '#d7dee6',
    borderRadius: 10,
    height: 46,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontSize: 14,
  },
})
