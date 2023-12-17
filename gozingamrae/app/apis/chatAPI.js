import api from './api';

export default {
  generateSingleChatRoom(headers, data) {
    return api({method: 'POST', url: '/chatroom/singleroom', headers, data});
  },
  generateGroupChatRoom(headers, data) {
    return api({method: 'POST', url: '/chatroom/group', headers, data});
  },
  getChatRoomList(headers) {
    return api({method: 'GET', url: '/chatroom', headers});
  },
  getChattingList(roomId) {
    return api({method: 'GET', url: `/chatroom/${roomId}`});
  },
};
