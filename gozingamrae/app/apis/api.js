import axios from 'axios';
import {REACT_APP_GOZINGAMRAE_SERVER_URL} from '@env';

export default axios.create({
  baseURL: REACT_APP_GOZINGAMRAE_SERVER_URL,
});
