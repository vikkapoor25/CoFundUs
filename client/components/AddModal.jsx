import { View, Text, StyleSheet, Modal, Pressable } from 'react-native'
import colours from '../constants/colours'



export default function AddModal({ title, visible, setVisible, children }) {
  return (
    <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
    >
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>{title}</Text>
              <View>{children}</View>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setVisible(!visible)}>
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>
          </View>
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
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});