import { View, Text, StyleSheet, Modal, Pressable, Keyboard,TouchableWithoutFeedback, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import colours from '../constants/colours'



export default function AddModal({ title, visible, setVisible, children }) {
  return (
    <Modal
  visible={visible}
  transparent={true}
  animationType="slide"
>
  <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    
    <View style={styles.centeredView}>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ width: "100%" }}
      >

        <TouchableWithoutFeedback>
          <View style={styles.modalView}>

            <Text style={styles.modalText}>{title}</Text>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>

            <Pressable onPress={() => setVisible(false)}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>

          </View>
        </TouchableWithoutFeedback>

      </KeyboardAvoidingView>

    </View>

  </TouchableWithoutFeedback>
</Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    width: '90%',
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});