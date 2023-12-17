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
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  isLoginState,
  isProfileState,
  loginState,
  memberState,
  profileState,
} from '../states/memberState';
import {useRecoilState} from 'recoil';
import {useEffect} from 'react';
import authAPI from '../apis/authAPI';
import profileAPI from '../apis/profileAPI';

export default function Login() {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [, setMember] = useRecoilState(memberState);
  const [, setIsProfile] = useRecoilState(isProfileState);
  const [, setIsLogin] = useRecoilState(isLoginState);
  const [, setProfile] = useRecoilState(profileState);
  const [login, setLogin] = useRecoilState(loginState);

  useEffect(() => {
    if (isFocused) {
      setIsLogin(false);
      setLogin({memberId: '', password: ''});
    }
  }, [isFocused]);

  const loginHandler = () => {
    authAPI
      .login(login)
      .then(res => {
        console.log(res.data.data);
        setMember({userId: res.data.data, email: login.email});
        profileAPI
          .getMyProfile({user_id: res.data.data})
          .then(res => {
            if (res.data.data[0].user_id) {
              setIsProfile(true);
              setProfile(res.data.data[0]);
            } else {
              console.log('프로필 설정 안 된 사용자');
            }
          })
          .catch(err => {
            console.log(err);
          })
          .finally(() => {
            setIsLogin(true);
          });
      })
      .catch(err => {
        Alert.alert('로그인 실패했습니다. 다시 시도해주세요.');
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>
          <Text style={styles.title}>로그인</Text>
          <View style={styles.formContainer}>
            <View>
              <View style={styles.inputContainer}>
                <Input
                  placeholder="아이디(이메일)를 입력하세요."
                  style={styles.input}
                  onChangeText={text => setLogin({...login, email: text})}
                />
              </View>

              <View style={styles.inputContainer}>
                <Input
                  placeholder="비밀번호를 입력하세요."
                  secureTextEntry={true}
                  style={styles.input}
                  onChangeText={text => setLogin({...login, password: text})}
                />
              </View>
            </View>
            <View>
              <Button style={styles.loginButton} onPress={() => loginHandler()}>
                <Text style={styles.loginButtonText}>Login</Text>
              </Button>

              <Button
                style={styles.signupButton}
                onPress={() => navigation.navigate('Join')}>
                <Text style={styles.signupButtonText}>
                  아이디가 없으신가요?{'  '}
                  <Text style={styles.signupButtonHighlight}>회원가입</Text>
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
  loginButton: {
    backgroundColor: color.lightGray,
    borderRadius: 20,
    paddingVertical: 4,
    marginTop: 14,
    alignItems: 'center',
  },
  loginButtonText: {
    fontWeight: 'bold',
    color: color.main,
  },
  signupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  signupButtonText: {
    fontSize: 14,
    color: color.white,
  },
  signupButtonHighlight: {
    color: color.lightGray,
  },
});
