import axios from 'axios';
import params from '../config/parametre.json'
import { getStorage } from '../services/StorageService';

export const instance = axios.create({
    baseURL: params.baseUrl
});

instance.interceptors.request.use(
    async (config) => {
      const headerImpl = await header();
  
      if (headerImpl) {
        if (config.method !== 'OPTIONS') {
              config.headers = headerImpl;
        }
      }
      return config;
    },
    error => {
      // Do something with request error 
      return Promise.reject(error);
  });
  
  async function getToken() {
    const token = await getStorage('token');
    
    if (token == null) {
      return null;
    } else {
      return token;
    }
  }
  
  export async function header() {
    const token = await getToken();
    
    let headers = {};
    
    if (token == null) {
      headers = {
        'Content-Type': 'application/json'
      };
    } else {
      headers = {
        'Content-Type': 'application/json',
        'Authorization': token
      };
    }
    return headers;
}
  
export default instance;