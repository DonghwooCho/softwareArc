import api from './api';

export default {
  initProfile(headers, data) {
    return api({
      method: 'POST',
      url: '/user/profile',
      headers,
      data,
    });
  },
  getMyProfile(headers) {
    return api({
      method: 'GET',
      url: '/user/profile',
      headers,
    });
  },
  addFriend(headers, data) {
    return api({
      method: 'POST',
      url: '/friend/add',
      headers,
      data,
    });
  },
  getFriendList(headers) {
    return api({
      method: 'GET',
      url: '/friend/list',
      headers,
    });
  },
};
