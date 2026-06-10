import { Text } from 'react-native'

export default function NetText({ amount = 0, style }) {
  const positive = amount >= 0
  const color = positive ? '#16a34a' : '#e5484d'
  const sign = positive ? '+' : '-'
  return <Text style={[{ color, fontWeight: '700' }, style]}>{sign}£{Math.abs(amount)}</Text>
}
