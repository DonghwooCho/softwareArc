import {atom} from 'recoil';

export const singleChattingRoomListState = atom({
  key: 'singleChattingRoomListState',
  default: [],
});

export const groupChattingRoomListState = atom({
  key: 'groupChattingRoomListState',
  default: [],
});
