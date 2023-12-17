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
  TouchableWithoutFeedback,
} from 'react-native';
import {color, height, width} from '../utils';
import {useRecoilState, useRecoilValue} from 'recoil';
import {Input} from '../components';
import {
  groupChattingRoomListState,
  singleChattingRoomListState,
} from '../states/chatState';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {memberState} from '../states/memberState';
import chatAPI from '../apis/chatAPI';
import {friendListState} from '../states/friendState';
import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {encryptRSA2048, generateSecretKey} from '../utils/crypto';
import keyAPI from '../apis/keyAPI';

// TODO: 화살표 대신 마지막 메세지, 시간 추가
export default function Chat() {
  const isFocused = useIsFocused();
  const member = useRecoilValue(memberState);
  const friendList = useRecoilValue(friendListState);
  const navigation = useNavigation();
  const [checkedItems, setCheckedItems] = useState({});
  const [isDetail, setIsDetail] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [groupTitle, setGroupTitle] = useState('');
  const [publickeyList, setPublickeyList] = useState([]);
  const [singleChattingRoomList, setSingleChattingRoomList] = useRecoilState(
    singleChattingRoomListState,
  );
  const [groupChattingRoomList, setGroupChattingRoomList] = useRecoilState(
    groupChattingRoomListState,
  );

  const toggleCheckbox = target_id => {
    setCheckedItems(prevState => ({
      ...prevState,
      [target_id]: !prevState[target_id],
    }));
  };

  useEffect(() => {
    if (isFocused) {
      const headers = {user_id: member.userId};
      chatAPI
        .getChatRoomList(headers)
        .then(res => {
          if (res.data.data !== false) {
            setSingleChattingRoomList(res.data.data);
          }
          if (res.data.data2 !== false) {
            // setGroupChattingRoomList(res.data.data2);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [isFocused]);

  useEffect(() => {
    if (publickeyList.length) {
      const secretKey = generateSecretKey(member.email);

      const encryptedSecretKeyList = publickeyList.map(publickey => {
        return [
          publickey.user_id,
          encryptRSA2048(secretKey, publickey.public_key),
        ];
      });

      const headers = {user_id: member.userId};
      const data = {
        room_name: groupTitle,
        enter_data: encryptedSecretKeyList,
      };

      console.log(data);

      chatAPI
        .generateGroupChatRoom(headers, data)
        .then(res => {
          console.log('방 결과:', res.data);
          AsyncStorage.setItem(`secretKey/${res.data.data}`, secretKey);
          // TODO: 단체방 만들어지면 바로 들어가지도록
          Alert.alert('단체 채팅방이 생성되었습니다.');
          setIsDetail(false);
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [publickeyList]);

  const generateGroupChattingRoomHandler = () => {
    setIsDetail(true);
    setIsVisible(false);
  };

  const generateGRoupChattingRoom = async () => {
    const headers = {user_id: member.userId};

    const invitedFriends = friendList.filter(
      friend => checkedItems[friend.user_id],
    );

    // TODO: 나중에 2으로 바꾸기
    if (invitedFriends.length >= 1) {
      await keyAPI
        .getMemberPublicKeyList(headers, {
          friend_id: [
            ...invitedFriends.map(friend => friend.user_id),
            member.userId,
          ],
        })
        .then(res => {
          console.log('key', res.data);
          setPublickeyList(res.data.data);
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      Alert.alert('단체 채팅방은 2명 이상의 친구를 초대해야 합니다.');
    }
  };

  const renderChattingRoom = ({item}) => {
    const target_id =
      item.user_id1 === member.userId ? item.user_id2 : item.user_id1;
    const target = friendList.find(friend => friend.user_id === target_id);
    console.log(target);
    return (
      <TouchableOpacity
        style={styles.friendContainer}
        onPress={() =>
          navigation.navigate('Chatting', {
            data: {...target, room_id: item.room_id},
          })
        }>
        <Image source={{uri: target.profile_pic}} style={styles.friendImage} />
        <View style={styles.friendInfo}>
          <Text style={styles.friendName}>{target.nickname}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={color.black} />
      </TouchableOpacity>
    );
  };

  const renderFriendItem = ({item}) => (
    <TouchableWithoutFeedback onPress={() => toggleCheckbox(item.user_id)}>
      <View
        style={{
          ...styles.friendContainer,
          width: width * 280,
          borderRadius: 10,
        }}>
        <Image source={{uri: item.profile_pic}} style={styles.friendImage} />
        <View style={styles.friendInfo}>
          <Text style={styles.friendName}>{item.nickname}</Text>
        </View>
        {checkedItems[item.user_id] ? (
          <MaterialIcons name="check-box" size={20} color={color.black} />
        ) : (
          <MaterialIcons
            name="check-box-outline-blank"
            size={20}
            color={color.black}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );

  const selectGroupChattingMember = () => {
    return (
      <Modal isVisible={isDetail} onBackdropPress={() => setIsDetail(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>채팅방 상대 초대</Text>
          <FlatList
            data={friendList}
            keyExtractor={item => item.user_id}
            renderItem={renderFriendItem}
          />
          <Input
            style={styles.input}
            placeholder="단체 채팅방 이름을 입력하세요."
            onChangeText={text => setGroupTitle(text)}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => generateGRoupChattingRoom()}>
            <Text style={styles.buttonText}>선택 완료</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsDetail(false)}>
            <Text style={styles.buttonText}>취소</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  const chattingTitle = title => (
    <TouchableOpacity style={styles.friendContainer}>
      <View style={styles.friendInfo}>
        <Text style={{...styles.friendName, fontWeight: 'bold'}}>{title}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView>
      {isDetail && selectGroupChattingMember()}
      <Modal isVisible={isVisible} onBackdropPress={() => setIsVisible(false)}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>채팅방 유형 선택</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              Alert.alert(
                "1:1 채팅방은 '친구' 탭에서 친구 프로필을 눌러서 개설할 수 있습니다.",
                '',
                [{text: 'OK', onPress: () => setIsVisible(false)}],
              );
            }}>
            <Text style={styles.buttonText}>1:1 채팅방</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => generateGroupChattingRoomHandler()}>
            <Text style={styles.buttonText}>단체 채팅방</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsVisible(false)}>
            <Text style={styles.buttonText}>취소</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {chattingTitle('1:1 채팅방')}
      <FlatList
        data={singleChattingRoomList}
        keyExtractor={item => item.room_id}
        renderItem={renderChattingRoom}
      />
      {chattingTitle('단체 채팅방')}
      <FlatList
        data={groupChattingRoomList}
        keyExtractor={item => item.room_id}
        renderItem={renderChattingRoom}
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
            채팅방 추가
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
