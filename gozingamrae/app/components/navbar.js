import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {color} from '../utils';
import {Friend, Chat, MyPage} from '../screens';
import {useEffect} from 'react';
import {View} from 'react-native';
import {Header} from '.';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function Navbar() {
  const Tab = createBottomTabNavigator();
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {}, [isFocused]);

  return (
    <Tab.Navigator
      initialRouteName="Friend"
      screenOptions={{
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="Friend"
        component={Friend}
        options={{
          header: () => <Header title={'친구 목록'} />,
          tabBarIcon: () => (
            <Icon name="account-group" size={30} color={color.mainLight} />
          ),
        }}
        listeners={() => ({
          tabPress: e => {
            console.log('클릭');
          },
        })}
      />
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{
          header: () => <Header title={'채팅 목록'} />,
          tabBarIcon: () => (
            <Icon name="message" size={28} color={color.mainLight} />
          ),
        }}
        listeners={() => ({
          tabPress: e => {
            console.log('클릭');
          },
        })}
      />
      <Tab.Screen
        name="MyPage"
        component={MyPage}
        options={{
          header: () => <Header title={'나의 프로필'} />,
          tabBarIcon: () => (
            <Icon name="account-circle" size={30} color={color.mainLight} />
          ),
        }}
        listeners={() => ({
          tabPress: e => {
            console.log('클릭');
          },
        })}
      />
    </Tab.Navigator>
  );
}
