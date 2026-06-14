import { ScrollView, View, Text, StyleSheet } from 'react-native'
import colours from '../constants/colours'



export default function Card({ title, children, rightIcon  }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.cardTitle}>{title}</Text>
        {rightIcon && (
          <View style={styles.rightIcon}>
            {rightIcon}
          </View>
        )}
      </View>
      <View>{children }</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colours.cardBackground, borderRadius: 16, padding: 16, marginBottom: 14 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colours.cardTitle
  },
  rightIcon: {
    marginLeft: 8
  }
});