// api/external/omnigateway/index.ts
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_OMNI_GATEWAY_URL;
const API_KEY = process.env.NEXT_PUBLIC_OMNI_GATEWAY_API_KEY;

// Function to create omniGateway instance with client API key
export const createOmniGateway = (clientApiKey?: string) => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      'x-api-key': API_KEY,
      'client-x-api-key': clientApiKey || ''
    }
  });
};