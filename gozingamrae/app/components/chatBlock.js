import {View, Text, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {color} from '../utils';

export default function ChatBlock({me, message}) {
  return (
    <View
      style={[
        styles.container,
        me ? styles.reverseRow : styles.row,
        styles.marginBottom,
      ]}>
      {me && (
        <View style={styles.checkmarkContainer}>
          <Ionicons name="checkmark-done" size={16} />
        </View>
      )}

      <View
        style={[
          styles.messageContainer,
          me ? styles.mainBackground : styles.lightBackground,
        ]}>
        <Text
          style={[
            styles.messageText,
            me ? styles.whiteText : styles.blackText,
          ]}>
          {message}
        </Text>
      </View>

      <Text
        style={[styles.timestamp, me ? styles.marginRight : styles.marginLeft]}>
        21:22
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  reverseRow: {
    flexDirection: 'row-reverse',
  },
  row: {
    flexDirection: 'row',
  },
  marginBottom: {
    marginBottom: 6,
  },
  checkmarkContainer: {
    width: 8,
    alignItems: 'center',
  },
  messageContainer: {
    padding: 4,
    borderRadius: 20,
    maxWidth: '60%',
  },
  mainBackground: {
    backgroundColor: color.mainLight,
    alignItems: 'flex-end',
  },
  lightBackground: {
    backgroundColor: '#ccc',
  },
  messageText: {
    fontFamily: 'rubik',
    fontSize: 14,
    margin: 4,
    marginLeft: 10,
    marginRight: 10,
  },
  whiteText: {
    color: 'white',
  },
  blackText: {
    color: 'black',
  },
  timestamp: {
    fontSize: 10,
    alignSelf: 'flex-end',
    color: color.blackLight,
    marginBottom: 6,
  },
  marginRight: {
    marginRight: 3,
  },
  marginLeft: {
    marginLeft: 3,
  },
});
