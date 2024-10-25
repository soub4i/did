export const CREDENTIAL_SCHEMA = {
    id: "did:phc:soubai/credential-schema/phc",
    type: "PersonalHealthCredential",
    properties: {
      bloodType: "string",
      weight: "number",
      vaccinations: ["string"],
    }
  };