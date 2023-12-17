import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Navbar} from '../components';
import Login from '../screens/login';
import Join from '../screens/join';
import {useRecoilValue} from 'recoil';
import {isLoginState, isProfileState} from '../states/memberState';
import InitialProfile from '../screens/initialProfile';
import {Chatting} from '../screens';

const Stack = createStackNavigator();

export default function AppScreens() {
  const isLogin = useRecoilValue(isLoginState);
  const isProfile = useRecoilValue(isProfileState);

  // 로그인 여부, 초기 프로필 설정 여부에 따라 화면 분기
  return (
    <NavigationContainer>
      {!isLogin ? (
        <LoginScreens />
      ) : !isProfile ? (
        <ProfileScreens />
      ) : (
        <MainScreens />
      )}
    </NavigationContainer>
  );
}

function MainScreens() {
  return (
    <Stack.Navigator
      initialRouteName={'Navbar'}
      screenOptions={{animationEnabled: false}}>
      <Stack.Screen
        name="Navbar"
        component={Navbar}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Chatting"
        component={Chatting}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

function LoginScreens() {
  return (
    <Stack.Navigator
      initialRouteName={'Login'}
      screenOptions={{animationEnabled: false}}>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Join"
        component={Join}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

function ProfileScreens() {
  return (
    <Stack.Navigator
      initialRouteName={'Profile'}
      screenOptions={{animationEnabled: false}}>
      <Stack.Screen
        name="initialProfile"
        component={InitialProfile}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
