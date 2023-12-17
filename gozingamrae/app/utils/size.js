import {Dimensions} from 'react-native';

export const defalutSize = {
  width: 360,
  height: 740,
};

export const width = (
  Dimensions.get('screen').width *
  (1 / defalutSize.width)
).toFixed(2);

export const height = (
  Dimensions.get('screen').height *
  (1 / defalutSize.height)
).toFixed(2);
