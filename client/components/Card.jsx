import { ScrollView, View, Text, StyleSheet } from 'react-native'
import colours from '../constants/colours'



export default function Card({ title, children  }) {
  return (
    <View style={styles.card}>
        <Text style={styles.cardTitle}>{title}</Text>
      <View>{children }</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colours.cardBackground, borderRadius: 16, padding: 16, marginBottom: 14 },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colours.cardTitle
  },
  rightIcon: {
    marginLeft: 8
  }
});
