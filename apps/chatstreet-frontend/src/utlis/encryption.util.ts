const NodeRSA = require('node-rsa');

const encryptText = (text: string, public_key: string): string => {
  const key_public = new NodeRSA(public_key);
  key_public.setOptions({ encryptionScheme: 'pkcs1' });
  return key_public.encrypt(text, 'base64');
};

const decryptText = (text: string, private_key: string): string => {
  const key_private = new NodeRSA(private_key);
  key_private.setOptions({ encryptionScheme: 'pkcs1' });
  console.log(text);
  return key_private.decrypt(text);
};

export { encryptText, decryptText };
