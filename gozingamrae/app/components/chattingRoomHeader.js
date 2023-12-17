import {StyleSheet, SectionList, Image, Text, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {color} from '../utils';
import {Button} from '../components';

export default function Chat() {
  return (
    <View style={styles.header}>
      <Button onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back-ios" size={20} color="white" />
      </Button>

      <View style={styles.userInfo}>
        <View style={styles.avatarContainer}>
          <Image
            // source={require('@/assets/images/person-1.webp')}
            style={styles.avatar}
          />
          <View style={styles.statusDot} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.userName}>Martijn Dragonj</Text>
          <Text style={styles.status}>Online</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button>
          <Octicons name="search" size={16} color="white" />
        </Button>

        <Button style={styles.actionButton}>
          <Feather name="phone-call" size={16} color="white" />
        </Button>

        <Button>
          <Fontisto name="more-v-a" size={16} color="white" />
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#4a90e2', // 사용자의 배경색에 맞게 변경
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    position: 'relative',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  textContainer: {
    marginLeft: 10,
  },
  userName: {
    fontSize: 14,
    color: 'white',
  },
  status: {
    marginTop: 1,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  actionButton: {
    marginHorizontal: 5,
  },
});
