import api from './api';

export default {
  getMemberPublicKeyList(headers, data) {
    return api({method: 'POST', url: '/key/publickey', headers, data});
  },
  getEncryptedSecretKeyAtSingle(headers, data, roomId) {
    return api({method: 'GET', url: `/single/${roomId}`, headers, data});
  },
  getEncryptedSecretKeyAtGroup(headers, data, roomId) {
    return api({method: 'GET', url: `/group/${roomId}`, headers, data});
  },
};
