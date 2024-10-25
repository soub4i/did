import CryptoUtils from "./utils/crypto.js"
import Credential from "./credential.js"

import crypto  from "node:crypto"

export class CredentialService {
    constructor() {
      this.issuedCredentials = new Map();
      this.subjectRegistry = new Set(); // Store hashed biometric identifiers
    }
  
    async issueCredential(subject, data) {
      // Check for duplicate credentials using biometric hash
 
      const biometricHash = crypto.createHash('sha256')
        .update(subject.biometricData)
        .digest('hex');
      
      if (this.subjectRegistry.has(biometricHash)) {
        throw new Error('Credential already issued for this subject');
      }
  
      const issuer = {
        id: 'did:hackathon:issuer',
        publicKey: CryptoUtils.generateKeyPair().publicKey
      };
  
      const credential = new Credential(subject, issuer, data);
      const salt = await credential.createCommitments();
  
      this.issuedCredentials.set(credential.id, credential);
      this.subjectRegistry.add(biometricHash);
  
      return {
        credential,
        salt, // Securely transmit to holder
      };
    }
  }

  export class DIDCommService {
    constructor() {
      this.keyPair = CryptoUtils.generateKeyPair();
    }
  
    async createDIDCommMessage(credential, recipientDID) {
      return {
        id: crypto.randomUUID(),
        type: 'https://didcomm.org/issue-credential/2.0/issue',
        from: credential.issuer.id,
        to: [recipientDID],
        body: {
          credential_preview: {
            type: credential.type,
            commitments: credential.commitments
          }
        },
        attachments: [
          {
            id: '1',
            mime_type: 'application/json',
            data: {
              json: credential
            }
          }
        ]
      };
    }
  }

  export class VerificationService {
    static async verifyCredential(proof, publicCommitment) {
      const { value, salt } = proof;
      
      // Recreate commitment
      const verificationCommitment = crypto.createHash('sha256')
        .update(Buffer.concat([Buffer.from(value), salt]))
        .digest('hex');
      
      return verificationCommitment === publicCommitment;
    }
  }
