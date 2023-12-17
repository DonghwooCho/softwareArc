import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {color, height, width} from '../utils';
import {isProfileState, memberState, profileState} from '../states/memberState';
import {useRecoilState, useRecoilValue} from 'recoil';
import {Input} from '../components';
import profileAPI from '../apis/profileAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import {err} from 'react-native-svg';

export default function InitialProfile() {
  const isFoucused = useIsFocused();
  const [nickname, setNickname] = useState('');
  const [image, setImage] = useState({uri: ''});
  const [, setIsProfile] = useRecoilState(isProfileState);
  const [, setProfile] = useRecoilState(profileState);
  const member = useRecoilValue(memberState);

  const pickImage = () => {
    const options = {
      mediaType: 'photo', // 사진 파일만 가능하도록 설정
    };

    launchImageLibrary(options, response => {
      console.log(response);
      if (response.didCancel) {
        return;
      } else if (response.errorCode) {
        console.log('Image Error : ' + response.errorCode);
      }

      console.log(response);
      setImage(response.assets[0]);
    });
  };

  const uploadProfile = () => {
    const formData = new FormData();
    const headers = {
      'Content-Type': 'multipart/form-data',
      user_id: member.userId,
    };
    formData.append('nickname', nickname);

    if (image.uri) {
      formData.append('image', {
        name: image.fileName,
        type: image.type,
        uri: image.uri,
      });
    } else {
      formData.append('image', {
        name: 'default.png',
        type: 'image/png',
        uri: process.env.REACT_APP_GOZINGAMRAE_DEFAULT_PROFILE_URL,
      });
    }

    console.log(formData['_parts'][1]);

    profileAPI
      .initProfile(headers, formData)
      .then(res => {
        console.log(res.data);
        setIsProfile(true);
        setProfile(res.data.data[0]);
        Alert.alert('프로필 설정이 완료되었습니다.');
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <Text style={styles.title}>프로필 설정</Text>
          <Text style={styles.subTitle}>
            서비스 이용을 위해 초기 프로필 설정이 필요합니다.
          </Text>
        </View>
        <View style={styles.subContainer}>
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            {image.uri ? (
              <Image source={{uri: image.uri}} style={styles.image} />
            ) : (
              <View>
                <Text style={styles.imageText}>프로필 이미지 선택</Text>
                <Text style={{...styles.imageText, color: color.main}}>
                  [Click]
                </Text>
                <Text style={styles.imageSubText}>
                  * 설정하지 않을 시 기본 이미지로 설정됩니다.
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <Input
            style={styles.input}
            placeholder="닉네임을 입력하세요"
            value={nickname}
            onChangeText={text => setNickname(text)}
          />
        </View>
        <View style={styles.subContainer}>
          <TouchableOpacity style={styles.button} onPress={uploadProfile}>
            <Text style={styles.buttonText}>설정 완료</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.sub,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subContainer: {
    width: width * 300,
    height: height * 100,
    marginTop: 20,

    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: color.main,
  },
  subTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 20,
    color: color.white,
  },
  imageContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 20,
    width: width * 240,
    height: height * 200,
    backgroundColor: color.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  imageText: {
    padding: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: color.black,
  },
  imageSubText: {
    padding: 10,
    textAlign: 'center',
    fontSize: 12,
    color: color.sub,
  },
  input: {
    height: 40,
    width: '80%',

    marginBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: color.white,
  },
  button: {
    backgroundColor: color.main,
    padding: 10,
    borderRadius: 120,
    width: width * 240,
  },
  buttonText: {
    color: color.white,
    textAlign: 'center',
  },
});
