import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';

const RSA_DEFAULT_KEY_SIZE = 2048;
export const defaultSecretKey = '12345678901234567890123456789012';
export const iv256 = '1234567890123456';

const encryptSHA256 = data => {
  return CryptoJS.SHA256(data).toString();
};

export const encryptAES256 = (data, secretKey, iv) => {
  return CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(secretKey), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CTR,
  }).toString();
};

export const decryptAES256 = (data, secretKey, iv) => {
  return CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(secretKey), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CTR,
  }).toString(CryptoJS.enc.Utf8);
};

export const encryptRSA2048 = (data, publicKey) => {
  const crypto = new JSEncrypt({default_key_size: RSA_DEFAULT_KEY_SIZE});

  crypto.setPublicKey(publicKey);

  return crypto.encrypt(data);
};

export const decryptRSA2048 = (data, privateKey) => {
  const crypto = new JSEncrypt({default_key_size: RSA_DEFAULT_KEY_SIZE});

  crypto.setPrivateKey(privateKey);

  return crypto.decrypt(data);
};

export const generateKeyRSA2048 = () => {
  const crypto = new JSEncrypt({default_key_size: RSA_DEFAULT_KEY_SIZE});

  // RSA 키 쌍 생성
  crypto.getKey();

  const publicKey = crypto.getPublicKey();
  const privateKey = crypto.getPrivateKey();

  return {publicKey, privateKey};
};

export const generateSecretKey = data => {
  const secretKey = encryptSHA256(data);

  console.log(secretKey);

  return secretKey;
};
