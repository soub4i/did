import express from 'express';
import { issuer, pseudonym, verify } from './controller.js';


const router = express.Router()

router.get("/ack", (req, res) => {
    res.send('syn')
  })

 router.post("/issue", issuer)
 router.post("/verify", verify)
 router.post("/pseudonym", pseudonym)

export default router