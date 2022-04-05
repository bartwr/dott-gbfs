// import the required package dependecies
import jsonWebToken from 'jsonwebtoken';
import fetch from 'node-fetch';

// import the credentials
import { serviceAccountKey } from './credentials.js';

// Utility function used to generate a JWT token with the required claims
// and sign it using the provided credentials private key
const generateSignedToken = (credentials) => jsonWebToken.sign(
  {
    email: credentials.client_email
  },
  credentials.private_key,
  {
    algorithm: 'RS256',
    audience: 'https://gbfs.api.ridedott.com',
    expiresIn: 3600*365,
    keyid: credentials.private_key_id,
    issuer: `${credentials.client_email}`,
    subject: credentials.client_email,
  }
);

const run = async () => {
  // generate a signed JWT token
  const token = generateSignedToken(serviceAccountKey);
  // console.log('token', token);
  // perform a request to the API attaching the token to the request header
  const response = await fetch(
    `https://gbfs.api.ridedott.com/v2/gbfs.json`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.json();
};
run()
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.error(error);
  });
