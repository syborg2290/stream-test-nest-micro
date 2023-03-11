const crypto = require('crypto');

export const generateKeyPair = () => {
  try {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('ec', {
      namedCurve: 'sect233k1',
      publicKeyEncoding: {
        type: 'spki',
        format: 'der',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'der',
      },
    });
    return { privateKey, publicKey };
  } catch (error) {
    console.log(error);
  }
};

export const sign = (data, privateKey) => {
  try {
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    sign.end();
    const signature = sign.sign(Buffer.from(privateKey, 'base64'));
    return signature;
  } catch (error) {
    console.log(error);
  }
};

export const verify = (data, publicKey, signature) => {
  try {
    const verify = crypto.createVerify('SHA256');
    verify.update(data);
    verify.end();
    return verify.verify(publicKey, signature);
  } catch (error) {
    console.log(error);
  }
};
