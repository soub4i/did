export const CREDENTIAL_SCHEMA = {
    id: "did:hackathon:soubai/credential-schema/phc",
    type: "PersonalHealthCredential",
    properties: {
      bloodType: "string",
      weight: "number",
      vaccinations: ["string"],
    }
  };