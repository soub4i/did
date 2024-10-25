import crypto  from "node:crypto"

export default class CryptoUtils {
  static generateKeyPair() {
    return crypto.generateKeyPairSync('ed25519', {
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });
  }

  static deriveServiceSpecificPseudonym(masterSecret, serviceId) {
    const hmac = crypto.createHmac('sha256', masterSecret);
    hmac.update(serviceId);
    return hmac.digest('hex');
  }

  static  createCommitment(value) {
    const salt = crypto.randomBytes(32);
    const commitment = crypto.createHash('sha256')
      .update(Buffer.concat([Buffer.from(value), salt]))
      .digest('hex');
    return { commitment, salt };
  }
}