import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {color, height, width} from '../utils';
import {profileState} from '../states/memberState';
import {useRecoilValue} from 'recoil';
import {useNavigation, useRoute} from '@react-navigation/native';

export default function Header({
  goBack,
  title,
  messages,
  profile_pic,
  nickname,
}) {
  const route = useRoute();
  const navigation = useNavigation();
  const profile = useRecoilValue(profileState);

  return (
    <View style={styles.container}>
      {goBack ? (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Chat')}>
          <MaterialIcons name="arrow-back" size={28} color={color.black} />
          <Text style={{...styles.title, marginBottom: 4, marginLeft: 8}}>
            {title}
          </Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.title}>{title}</Text>
      )}

      {route.name !== 'Chatting' && (
        <View style={styles.rightContainer}>
          {messages && (
            <TouchableOpacity style={styles.iconButton} disabled={true}>
              <Entypo name="unread" size={20} color={color.black} />
            </TouchableOpacity>
          )}

          <Text style={styles.nickname}>{profile.nickname}</Text>
          <TouchableOpacity style={styles.profileButton}>
            <Image
              source={{uri: profile.profile_pic}}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.mainLight,
    width: width * 362,
    height: height * 56,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: width * 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: width * 16,
  },
  nickname: {fontSize: 14, color: color.black},
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
    marginRight: width * 16,
  },
  iconButton: {
    marginRight: 16,
    opacity: 0.4,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginLeft: 12,
    overflow: 'hidden',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
});
