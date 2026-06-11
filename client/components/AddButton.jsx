import { ScrollView, View, Text, StyleSheet, Pressable } from 'react-native'
import colours from '../constants/colours'



export default function AddButton({onPress} ) {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Text style={styles.add}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { backgroundColor: colours.buttonBackground, borderRadius: 50, width:50, height: 50, justifyContent: 'center', alignItems: 'center'},
  add: { fontSize: 30, fontWeight: '700', color: colours.buttonText}
});