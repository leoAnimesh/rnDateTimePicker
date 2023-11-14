import { View, Text, StyleSheet, Button } from 'react-native'
import React from 'react'
import DatePicker from './components/DatePicker'

const App = () => {
  const [date, setDate] = React.useState('8/6/2001');
  const [show, setShow] = React.useState(false);
  const togglePicker = () => {
    setShow(!show);
  }

  return (
    <View style={styles.container} >
      <Button title='Show Date Picker' onPress={() => setShow(!show)} />
      {show &&
        <DatePicker
          show={show}
          setShow={setShow}
          value={date}
          setValue={setDate}
        />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default App