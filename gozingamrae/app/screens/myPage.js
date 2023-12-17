import {StyleSheet, Text, View, Image} from 'react-native';
import {color, height, width} from '../utils';
import {useRecoilValue} from 'recoil';
import {profileState} from '../states/memberState';

export default function MyPage() {
  const profile = useRecoilValue(profileState);
  console.log(profile.profile_pic);
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{uri: profile.profile_pic}}
          style={styles.profileImage}
          resizeMode="contain"
        />
        <Text style={styles.nickname}>{profile.nickname}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: -10,
    marginBottom: 20,
  },
  profileImage: {
    width: width * 240,
    height: height * 240,
    borderRadius: 50,
  },
  nickname: {
    marginTop: 20,
    fontSize: 28,
    fontWeight: 'bold',
  },
});
