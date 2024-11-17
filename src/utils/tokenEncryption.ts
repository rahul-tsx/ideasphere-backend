import CryptoTs from 'crypto-ts';

const encryptToken = (token: string, secretKey: string) => {
	return CryptoTs.AES.encrypt(token, secretKey).toString();
};

const decryptToken = (encryptedToken: string, secretKey: string) => {
	const bytes = CryptoTs.AES.decrypt(encryptedToken, secretKey);
	return bytes.toString(CryptoTs.enc.Utf8);
};

export { encryptToken, decryptToken };
