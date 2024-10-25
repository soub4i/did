import {CREDENTIAL_SCHEMA}  from "./config.js"
import CryptoUtils  from "./utils/crypto.js"

export default class Credential {
    constructor(subject, issuer, data) {
      this.id = crypto.randomUUID();
      this.type = CREDENTIAL_SCHEMA.type;
      this.issuer = issuer;
      this.subject = subject;
      this.issuanceDate = new Date().toISOString();
      this.data = data;
      this.commitments = {};
    }
  
    async createCommitments() {
      for (const [key, value] of Object.entries(this.data)) {
        const { commitment, salt } = CryptoUtils.createCommitment(value);
        this.commitments[key] = commitment;
        // Store salt securely with the holder
        return salt;
      }
    }
  }