import { View, StyleSheet } from 'react-native'

export default function ProgressBar({ value = 0, max = 100 }) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${pct}%` }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  track: { height: 12, borderRadius: 8, backgroundColor: '#e3e9f0', overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: '#4a7ec2', borderRadius: 8 },
})
