import { View, Text, StyleSheet, Pressable, Modal, FlatList } from 'react-native'
import { useState } from 'react'

export default function SelectField({
  label,
  value,
  onChange,
  placeholder = "Select an option",
  options = [],
}) {
  const [open, setOpen] = useState(false)

  const selected = options.find(opt => opt.value === value)

  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      {/* display */}
      <Pressable style={styles.input} onPress={() => setOpen(true)}>
        <Text style={{ color: selected ? '#000' : '#999' }}>
          {selected ? selected.label : placeholder}
        </Text>
      </Pressable>

      {/* dropdown */}
      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.dropdown}>
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.option}
                  onPress={() => {
                    onChange(item.value)
                    setOpen(false)
                  }}
                >
                  <Text>{item.label}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
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
    letterSpacing: 0.5
  },

  input: {
    borderWidth: 1,
    borderColor: '#d7dee6',
    borderRadius: 10,
    backgroundColor: '#fff',
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    padding: 20,
  },

  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 10,
    maxHeight: 250,
  },

  option: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
})