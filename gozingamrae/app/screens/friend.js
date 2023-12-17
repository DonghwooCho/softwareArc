import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Keyboard,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {color} from '../utils';
import {useRecoilState, useRecoilValue} from 'recoil';
import {friendListState} from '../states/friendState';
import {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import profileAPI from '../apis/profileAPI';
import {memberState} from '../states/memberState';
import Modal from 'react-native-modal';
import {Input} from '../components';
import {encryptRSA2048, generateSecretKey} from '../utils/crypto';
import keyAPI from '../apis/keyAPI';
import chatAPI from '../apis/chatAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Friend() {
  const isFocused = useIsFocused();
  const member = useRecoilValue(memberState);
  const [isDetail, setIsDetail] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [friendEmail, setFriendEmail] = useState('');
  const [publickeyList, setPublickeyList] = useState([]);
  const [friendList, setFriendList] = useRecoilState(friendListState);

  useEffect(() => {
    if (isFocused) {
      const headers = {user_id: member.userId};
      profileAPI
        .getFriendList(headers)
        .then(res => {
          console.log(res.data);
          setFriendList(res.data.data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [isFocused, friendList.length]);

  const addFriendHandler = () => {
    const headers = {user_id: member.userId};
    const data = {friend_email: friendEmail};
    profileAPI
      .addFriend(headers, data)
      .then(res => {
        console.log(res.data);
        setFriendList(res.data);
        setIsVisible(false);
        setFriendEmail('');
        Alert.alert('친구 추가되었습니다.');
      })
      .catch(err => {
        console.log(err);
        setIsVisible(false);
        Alert.alert('친구 추가에 실패했습니다. 다시 시도해주세요.');
      });
  };

  const generateChatRoomHandler = item => {
    const headers = {user_id: member.userId};
    const secretKey = generateSecretKey();

    keyAPI
      .getMemberPublicKeyList(headers, {
        friend_id: [item.user_id, member.userId],
      })
      .then(res => {
        console.log('key', res.data);
        setPublickeyList(res.data.data);
        const data = {
          friend_id: item.user_id,
          owner_secret_key: encryptRSA2048(
            secretKey,
            res.data.data[0].user_id == member.userId
              ? res.data.data[0].public_key
              : res.data.data[1].public_key,
          ),
          attender_secret_key: encryptRSA2048(
            secretKey,
            res.data.data[0].user_id == member.userId
              ? res.data.data[1].public_key
              : res.data.data[0].public_ke,
          ),
        };
        chatAPI
          .generateSingleChatRoom(headers, data)
          .then(res => {
            console.log(res.data);
            setIsDetail(false);
            setFriendEmail('');
            AsyncStorage.setItem(`secretKey/${res.data.data}`, secretKey);
            Alert.alert('채팅방 생성되었습니다.');
          })
          .catch(err => {
            console.log(err);
            setIsDetail(false);
            Alert.alert('채팅방 생성에 실패했습니다. 다시 시도해주세요.');
          });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const renderFriendItem = ({item}) => (
    <TouchableOpacity
      onPress={() => setIsDetail(true)}
      style={styles.friendContainer}>
      <Modal
        isVisible={isDetail}
        onBackdropPress={() => {
          Keyboard.dismiss();
          setIsDetail(false);
        }}>
        <View style={styles.modalContainer}>
          <Image
            source={{uri: item.profile_pic}}
            style={styles.friendDetailImage}
          />
          <Text style={styles.modalTitle}>{item.nickname}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => generateChatRoomHandler(item)}>
            <Text style={styles.buttonText}>1:1 채팅하기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setIsDetail(false);
            }}>
            <Text style={styles.buttonText}>취소</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Image source={{uri: item.profile_pic}} style={styles.friendImage} />
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{item.nickname}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={color.black} />
    </TouchableOpacity>
  );

  return (
    <ScrollView>
      <Modal
        isVisible={isVisible}
        onBackdropPress={() => {
          Keyboard.dismiss();
          setIsVisible(false);
          setFriendEmail('');
        }}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>친구 아이디(이메일)</Text>
          <Input
            style={styles.input}
            placeholder="이메일을 입력하세요"
            onChangeText={text => setFriendEmail(text)}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => addFriendHandler()}>
            <Text style={styles.buttonText}>확인</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setIsVisible(false);
              setFriendEmail('');
            }}>
            <Text style={styles.buttonText}>취소</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <FlatList
        data={friendList}
        keyExtractor={item => item.user_id}
        renderItem={renderFriendItem}
      />
      <TouchableOpacity
        onPress={() => setIsVisible(true)}
        style={styles.friendContainer}>
        <View style={styles.friendInfo}>
          <Text
            style={{
              ...styles.friendName,
              color: color.blackLight,
              fontSize: 15,
            }}>
            {'친구 추가'}
          </Text>
        </View>
        <Icon name="plus-circle" size={24} color={color.blackLight} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  friendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    backgroundColor: color.lightGray,
  },
  friendImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  friendDetailImage: {
    width: 200,
    height: 200,
    borderRadius: 20,
    marginBottom: 14,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    color: 'black',
  },
  friendStatus: {
    fontSize: 12,
    color: 'gray',
  },
  modalContainer: {
    backgroundColor: color.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    width: '100%',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  button: {
    backgroundColor: color.mainLight,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});
