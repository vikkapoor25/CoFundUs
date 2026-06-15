import { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'

export default function DateField({
  label,
  value,
  onChange,
}) {
  const [showPicker, setShowPicker] = useState(false)

  function handleChange(event, selectedDate) {
    setShowPicker(false)

    if (selectedDate) {
      onChange(selectedDate)
    }
  }

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <Pressable
        style={styles.input}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.text}>
          {value ? value.toLocaleDateString() : "Select a date"}
        </Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 14,
  },

  label: {
    fontSize: 12,
    color: '#55626d',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  input: {
    borderWidth: 1,
    borderColor: '#d7dee6',
    borderRadius: 10,
    height: 46,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },

  text: {
    fontSize: 14,
    color: '#000',
  },
})