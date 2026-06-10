import { View, Text, StyleSheet } from 'react-native'

export default function Row({ left, middle, right, bold }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.left, bold && styles.bold]} numberOfLines={1}>{left}</Text>
      {middle != null ? <Text style={[styles.cell, styles.middle]} numberOfLines={1}>{middle}</Text> : null}
      <Text style={[styles.cell, styles.right, bold && styles.bold]} numberOfLines={1}>{right}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#eef1f5',
  },
  cell: { fontSize: 13, color: '#3f4856' },
  left: { flex: 1 },
  middle: { flex: 1, textAlign: 'center', color: '#7a8794' },
  right: { flex: 1, textAlign: 'right', fontWeight: '600' },
  bold: { fontWeight: '700' },
})
