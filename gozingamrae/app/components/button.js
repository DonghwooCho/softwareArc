import {TouchableOpacity} from 'react-native';

function Button(props) {
  return (
    <TouchableOpacity activeOpacity={0.5} {...props}>
      {props.children}
    </TouchableOpacity>
  );
}

export default Button;
