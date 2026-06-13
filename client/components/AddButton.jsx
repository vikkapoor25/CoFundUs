import { Pressable, Text, StyleSheet } from "react-native"
import colours from "../constants/colours"

export default function AddButton({ onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.add}>
      <Text style={styles.addText}>+</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  add: {
    position: "absolute",
    top: 20,
    right: 16,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colours.buttonBackground,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    zIndex:1
  },
  addText: {
    color: "white",
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 28,
  },
})