import io from 'socket.io-client';
import {REACT_APP_GOZINGAMRAE_SERVER_URL} from '@env';
import {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {color, height, width} from '../utils';
import {Button, Header, Input} from '../components';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {memberState} from '../states/memberState';
import {useRecoilValue} from 'recoil';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ChatBlock from '../components/chatBlock';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  decryptAES256,
  defaultSecretKey,
  encryptAES256,
  iv256,
} from '../utils/crypto';
import chatAPI from '../apis/chatAPI';

export default function ChattingRoom() {
  const route = useRoute();
  const isFocused = useIsFocused();
  const target = route.params?.data;
  const member = useRecoilValue(memberState);
  const socket = io(REACT_APP_GOZINGAMRAE_SERVER_URL);

  const [tempMessage, setTempMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [secretKey, setSecretKey] = useState('');

  useEffect(() => {
    if (isFocused) {
      const getSecretkey = async () => {
        await AsyncStorage.getItem(`secretKey/${target.room_id}`);
        setSecretKey(secretKey);
      };
      console.log('target: ', target);
      chatAPI.getChattingList(target.room_id).then(res => {
        console.log('chatting list: ', res.data.data);
        const prevMessages = res.data.data
          ?.filter(chat => chat.message)
          .map(chat => {
            if (chat.sender === member.userId) {
              return {...chat, me: false};
            } else {
              return {...chat, me: true};
            }
          });
        setMessages(prevMessages);
      });

      socket.on('connect', () => {
        console.log('서버에 연결되었습니다.');
        getSecretkey();

        socket.emit('join', {
          room: target.room_id,
          sender: member.userId,
        });
      });

      socket.on('chat', message => {
        console.log('message: ', message);

        setMessages(prevMessages => {
          if (message.sender === member.userId) {
            return [...prevMessages, {...message, me: true}];
          } else {
            return [...prevMessages, {...message, me: false}];
          }
        });
      });

      socket.on('disconnect', () => {
        console.log('서버 연결이 끊어졌습니다.');
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [isFocused]);

  const onSend = message => {
    setTempMessage('');
    const encryptedMessage = encryptAES256(message, defaultSecretKey, iv256);
    console.log('서버에 보낸 평문 메세지:', message);
    console.log('서버에 보낸 암호문 메세지:', encryptedMessage);
    socket.emit('chat', {
      room: target.room_id,
      sender: member.userId,
      message: encryptedMessage,
    });
  };

  return (
    <View style={styles.container}>
      <Header goBack={true} title={target.nickname} />
      <FlatList
        style={{margin: 10}}
        data={messages}
        keyExtractor={(item, index) => index}
        renderItem={({item}) => (
          <ChatBlock
            me={item.me}
            message={decryptAES256(item.message, defaultSecretKey, iv256)}
          />
        )}
      />
      <View
        style={{
          flexDirection: 'row',
          borderTopWidth: 1,
          borderTopColor: '#aaaaaa',
        }}>
        <Input
          onChangeText={text => setTempMessage(text)}
          value={tempMessage}
          style={{
            backgroundColor: color.white,
            width: width * 312,
            height: height * 40,
            paddingLeft: width * 12,
          }}
          placeholder="메세지를 입력하세요"
        />
        <Button
          onPress={() => onSend(tempMessage)}
          style={{
            backgroundColor: color.mainLight,
            width: width * 50,
            height: height * 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Icon name="send" size={30} color="white" />
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.lightGray,
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
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
