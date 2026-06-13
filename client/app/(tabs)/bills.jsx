import { ScrollView, View, Text, StyleSheet, Modal} from 'react-native'
import {useState} from 'react';
import colours from '../../constants/colours'
import Card from '../../components/Card'
import AddButton from '../../components/AddButton'
import AddModal from '../../components/AddModal'



export default function bills() {

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.body}>
        <View style={styles.container}>
          <AddButton title="+"onPress={() => setModalVisible(true)} />
        </View>

        <Card title="Upcoming Bills">
          <View style={styles.row}>
            <Text style={[styles.cell, styles.head]}>Days Left</Text>
            <Text style={[styles.cell, styles.head]}>Payment</Text>
            <Text style={[styles.cell, styles.head]}>Account</Text>
            <Text style={[styles.cell, styles.head, styles.rightCell]}>Amount</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>2 days</Text>
            <Text style={styles.cell}>EE Phone Bill</Text>
            <Text style={styles.cell}>Sam</Text>
            <Text style={[styles.cell, styles.rightCell]}>£16</Text>
          </View>
        </Card>

        <Card title="Subscriptions">
          <View style={styles.row}>
            <Text style={[styles.cell, styles.head]}>Payment</Text>
            <Text style={[styles.cell, styles.head]}>Amount</Text>
            <Text style={[styles.cell, styles.head]}>Account</Text>
            <Text style={[styles.cell, styles.head, styles.rightCell]}>Due</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>Rent</Text>
            <Text style={styles.cell}>£1,500</Text>
            <Text style={styles.cell}>Shared</Text>
            <Text style={[styles.cell, styles.rightCell]}>01/07</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>Electricity & Gas</Text>
            <Text style={styles.cell}>£120</Text>
            <Text style={styles.cell}>Shared</Text>
            <Text style={[styles.cell, styles.rightCell]}>02/07</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>Netflix</Text>
            <Text style={styles.cell}>£10</Text>
            <Text style={styles.cell}>Alex</Text>
            <Text style={[styles.cell, styles.rightCell]}>11/06</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>Spotify</Text>
            <Text style={styles.cell}>£12</Text>
            <Text style={styles.cell}>Alex</Text>
            <Text style={[styles.cell, styles.rightCell]}>03/06</Text>
          </View>
        </Card>

        <Card title="One-Time Bills">
          <View style={styles.row}>
            <Text style={[styles.cell, styles.head]}>Payment</Text>
            <Text style={[styles.cell, styles.head]}>Amount</Text>
            <Text style={[styles.cell, styles.head]}>Account</Text>
            <Text style={[styles.cell, styles.head, styles.rightCell]}>Date</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>Concert Tickets</Text>
            <Text style={styles.cell}>£120</Text>
            <Text style={styles.cell}>Shared</Text>
            <Text style={[styles.cell, styles.rightCell]}>14/07</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.cell}>Car Repair</Text>
            <Text style={styles.cell}>£180</Text>
            <Text style={styles.cell}>Alex</Text>
            <Text style={[styles.cell, styles.rightCell]}>20/06</Text>
          </View>
        </Card>
      </ScrollView>

      <AddModal
        title="Add A Bill"
        visible={modalVisible}
        setVisible={setModalVisible}
      />

    </View>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colours.background },
  container: {left: 305,bottom: 30},
  body: { padding: 16, paddingTop: 60 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eef1f5' },
  cell: { flex: 1, fontSize: 12, color: '#3f4856' },
  head: { fontWeight: '700', color: '#7a8794', fontSize: 11 },
  rightCell: { textAlign: 'right' },
})
