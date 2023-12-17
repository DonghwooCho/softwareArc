import {atom} from 'recoil';

export const isProfileState = atom({
  key: 'isProfileState',
  default: false,
});

export const isLoginState = atom({
  key: 'isLoginState',
  default: false,
});

export const loginState = atom({
  key: 'loginState',
  default: {email: '', password: ''},
});

export const joinState = atom({
  key: 'joinState',
  default: {
    email: '',
    password: '',
    passwordConfirm: '',
    publicKey: '',
  },
});

export const memberState = atom({
  key: 'memberState',
  default: {userId: '', email: ''},
});

export const profileState = atom({
  key: 'profileState',
  default: {userId: '', nickname: '', profile_pic: ''},
});
