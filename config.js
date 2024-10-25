export const CREDENTIAL_SCHEMA = {
    id: "did:example:123/credential-schema/phc",
    type: "PersonalHealthCredential",
    properties: {
      bloodType: "string",
      allergies: ["string"],
      vaccinations: ["string"],
      conditions: ["string"]
    }
  };