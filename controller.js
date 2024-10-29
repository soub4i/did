
import { CredentialService, DIDCommService, VerificationService } from "./services.js"
import CryptoUtils from "./utils/crypto.js"
import crypto  from "crypto" 
const credentialService = new CredentialService();
const didCommService = new DIDCommService();
export const  issuer = async (req, res) => {
    try {
      const { subject, healthData } = req.body;
  
      if (!subject || !healthData) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const { credential, salt } = await credentialService.issueCredential(
        subject,
        healthData
      );
  
      // Generate service-specific pseudonym
      const serviceId = req.headers['x-service-id'];
      const masterSecret = crypto.randomBytes(32);
      const pseudonym = CryptoUtils.deriveServiceSpecificPseudonym(
        masterSecret,
        serviceId
      );
  
      // Create DIDComm message
      const message = await didCommService.createDIDCommMessage(
        credential,
        subject.id
      );
  
      res.status(201).json({
        credential,
        salt,
        pseudonym,
        message
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };



  export const verify = async (req, res) => {
    try {
      const { proof, publicCommitment } = req.body;
  
      if (!proof || !publicCommitment) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const isValid = await VerificationService.verifyCredential(
        proof,
        publicCommitment
      );
  
      res.json({ isValid });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }


  export const pseudonym =  async (req, res) => {
    try {
      const { masterSecret, serviceId } = req.body;
  
      if (!masterSecret || !serviceId) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const pseudonym = CryptoUtils.deriveServiceSpecificPseudonym(
        masterSecret,
        serviceId
      );
  
      res.json({ pseudonym });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  export const  health = async (req, res) => {
    return res.json({ status: "ok" })
  }