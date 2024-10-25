    
    import { CredentialService, DIDCommService, VerificationService } from "./services.js"
    import CryptoUtils from "./utils/crypto.js"
    import crypto  from "crypto" 
    const credentialService = new CredentialService();
    const didCommService = new DIDCommService();
  
    // Issue a credential
    const subject = {
      id: 'did:hackathon:soubai',
      biometricData: 'my-fingerprint-biometrics-info'
    };
  
    const healthData = {
      bloodType: 'A+',
      vaccinations: ['COVID-19', 'Flu'],
      weight: 76
    };
  
    try {
      // Issue credential
      const { credential, salt } = await credentialService.issueCredential(
        subject,
        healthData
      );
  
      // Create service-specific pseudonym
      const serviceId = 'hospital-A';
      const masterSecret = crypto.randomBytes(32);
      const pseudonym = CryptoUtils.deriveServiceSpecificPseudonym(
        masterSecret,
        serviceId
      );
  
      // Create DIDComm message
      const message = await didCommService.createDIDCommMessage(
        credential,
        'did:hackathon:recipient456'
      );
  
      // Verify a specific claim (e.g., blood type)
      const proof = {
        value: healthData.bloodType,
        salt
      };
  
      const isValid = await VerificationService.verifyCredential(
        proof,
        credential.commitments.bloodType
      );
  
      console.log('Credential issued:', credential.id);
      console.log('Service-specific pseudonym:', pseudonym);
      console.log('Proof verification result:', isValid);
      
    } catch (error) {
      console.error('Error:', error.message);
    }