import api from './api';

export default {
  login(data) {
    return api({method: 'POST', url: '/auth/local/login', data});
  },
  join(data) {
    return api({method: 'POST', url: '/auth/local/join', data});
  },
  emailCheck(data) {
    return api({method: 'POST', url: '/user/email', data});
  },
};
