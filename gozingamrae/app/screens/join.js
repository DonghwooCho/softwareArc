import {
  View,
  Text,
  Platform,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  StyleSheet,
  Alert,
} from 'react-native';
import {color, height, width} from '../utils';
import {Button, Input} from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {joinState} from '../states/memberState';
import {useRecoilState, useResetRecoilState} from 'recoil';
import authAPI from '../apis/authAPI';
import {useEffect, useState} from 'react';
import {generateKeyRSA2048} from '../utils/crypto';
import FastImage from 'react-native-fast-image';

export default function Join() {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const resetJoin = useResetRecoilState(joinState);
  const [join, setJoin] = useRecoilState(joinState);
  const [isSpinner, setIsSpinner] = useState(false);
  const [privateKey, setPrivateKey] = useState('');

  useEffect(() => {
    if (isFocused) {
      resetJoin();
    }
  }, [isFocused]);

  useEffect(() => {
    if (privateKey) {
      AsyncStorage.setItem('privateKey', privateKey);
    }
  }, [privateKey]);

  useEffect(() => {
    if (join.publicKey) {
      authAPI
        .join(join)
        .then(res => {
          if (res.data.message === '회원가입 성공') {
            Alert.alert('회원가입에 성공 했습니다.');
            navigation.navigate('Login');
          }
        })
        .catch(err => {
          if (err.response.status === 409) {
            Alert.alert('이미 가입한 이메일입니다. 다시 시도해주세요.');
          } else {
            Alert.alert('회원가입 실패. 다시 시도해주세요.');
          }
          AsyncStorage.removeItem('privateKey');
          console.log(err);
        })
        .finally(() => {
          setIsSpinner(false);
        });
    }
  }, [join]);

  useEffect(() => {
    if (isSpinner) {
      const {publicKey, privateKey} = generateKeyRSA2048();
      setPrivateKey(privateKey);
      setJoin({...join, publicKey});
    }
  }, [isSpinner]);

  const joinHandler = () => {
    if (!join.email || !join.password || !join.passwordConfirm) {
      Alert.alert('모든 항목을 입력해주세요.');
    } else if (join.password !== join.passwordConfirm) {
      Alert.alert('비밀번호가 일치하지 않습니다. 다시 입력해주세요.');
    } else {
      Keyboard.dismiss();
      authAPI
        .emailCheck({email: join.email})
        .then(res => {
          setIsSpinner(true);
        })
        .catch(err => {
          if (err.response.status === 400) {
            Alert.alert('이미 가입한 이메일입니다. 다시 시도해주세요.');
          }
          console.log(err);
        });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          {isSpinner ? (
            <View style={styles.spinnerContainer}>
              <View style={styles.spinnerBox}>
                <FastImage
                  source={require('../assets/images/spinner.gif')}
                  style={styles.spinner}
                />
              </View>
              <Text style={styles.spinnerText}>
                안전한 채팅 서비스를 위한 암호키 생성 중입니다.
              </Text>
              <Text style={styles.spinnerText}>
                회원가입 시 최초 1회 진행됩니다. 잠시만 기다려주세요.
              </Text>
              <Text style={{...styles.spinnerText, color: color.main}}>
                {'\n'}[약 30초 ~ 1분 소요]
              </Text>
            </View>
          ) : null}
          <Text style={styles.title}>회원가입</Text>

          <View style={styles.formContainer}>
            <View>
              <View style={styles.inputContainer}>
                <Input
                  placeholder="사용할 아이디(이메일)를 입력하세요."
                  style={styles.input}
                  onChangeText={text => setJoin({...join, email: text})}
                />
              </View>

              <View style={styles.inputContainer}>
                <Input
                  placeholder="사용할 비밀번호를 입력하세요."
                  secureTextEntry={true}
                  style={styles.input}
                  onChangeText={text => setJoin({...join, password: text})}
                />
              </View>

              <View style={styles.inputContainer}>
                <Input
                  placeholder="사용할 비밀번호를 다시 한 번 입력하세요."
                  secureTextEntry={true}
                  style={styles.input}
                  onChangeText={text =>
                    setJoin({...join, passwordConfirm: text})
                  }
                />
              </View>
            </View>
            <View>
              <Button style={styles.signUpButton} onPress={() => joinHandler()}>
                <Text style={styles.signUpButtonText}>Sign up</Text>
              </Button>

              <Button
                style={styles.signInButton}
                onPress={() => navigation.navigate('Login')}>
                <Text style={styles.signInButtonText}>
                  기존에 사용하신 아이디가 있으신가요?{'  '}
                  <Text style={styles.textMain}>로그인</Text>
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: color.white,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 28,
    color: color.main,
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 10,
  },
  formContainer: {
    backgroundColor: color.main,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,

    justifyContent: 'space-between',

    paddingVertical: 18,
    paddingHorizontal: 12,
    height: height * 360,
    width: width * 360,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.lightGray,
    borderRadius: 20,
    padding: 4,
    marginBottom: 12,
  },
  input: {
    fontWeight: '500',
    fontSize: 14,
    color: color.black,
    marginLeft: 2,
    borderRadius: 30,
    flex: 1,
  },
  signUpButton: {
    backgroundColor: color.lightGray,
    borderRadius: 20,
    paddingVertical: 4,
    marginTop: 14,
    alignItems: 'center',
  },
  signUpButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: color.main,
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  signInButtonText: {
    fontSize: 14,
    color: color.white,
  },
  textMain: {
    color: color.lightGray,
  },
  spinnerContainer: {
    width: width * 360,
    height: height * 720,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.sub,
    zIndex: 2,
  },
  spinnerBox: {
    backgroundColor: color.lightGray,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    width: 150,
    height: 150,
    marginTop: -100,
    marginBottom: 30,
  },
  spinner: {
    zIndex: 3,
    width: 150,
    height: 150,
  },
  spinnerText: {
    zIndex: 3,
    fontSize: 16,
    fontWeight: 'bold',
    color: color.white,
  },
});
