### DID + PHC

- nodejs: +v20

---

```bash
node main.js
```

### test API

- Issue the credentials

```bash 

curl -X POST http://localhost:3000/v1/issue \
 -H "Content-Type: application/json" \
  -H "X-Service-ID: hospital-A" \
  -d '{
    "subject": {
      "id": "did:phc:soubai",
      "biometricData": "some-secure-biometric-data"
    },
    "healthData": {
      "bloodType": "A+",
      "vaccinations": ["COVID-19", "Flu"],
      "weight" : 77
    }
  }'
```

- verify 

```bash 

curl -X POST http://localhost:3000/v1/verify \
  -H "Content-Type: application/json" \
  -d '{
    "proof": {
      "value": "A+",
      "salt": "SALT_VALUE_FROM_ISSUANCE"
    },
    "publicCommitment": "PUBLIC_COMMITMENT_HASH"
  }'

```

- generate a service specific pseudonym (hospital-A)

```bash 

curl -X POST http://localhost:3000/v1/pseudonym \
  -H "Content-Type: application/json" \
 -d '{
    "masterSecret": "YOUR_MASTER_SECRET",
    "serviceId": "hospital-A"
  }'

