import axios from 'axios';
import { getStorage } from '../services/storage-service';
import gestionConfig from '../services/GestionConfigService';

export const instance = axios.create({
  baseURL: gestionConfig.getParameterBaseUrl()
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
   // const token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzZWN1cmUtYXBpIiwiYXVkIjoic2VjdXJlLWFwcCIsInN1YiI6InVzZXJuYW1lMSIsImV4cCI6MTYyMjY1NTA2NSwicm9sIjpbXX0.7yBkKodS0VCSrgUCRkG0Y5cg4kOcV7MSFZpGEt6AuonTrpRYxc8OGPT2lfeLkkwSq6cEoNwTXZEzX2npQc6p0w';
    let token;// = await getToken();

    if (gestionConfig.getParameterUseAsyncStorage()) {
      token = await getToken();
    } else {
      token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzZWN1cmUtYXBpIiwiYXVkIjoic2VjdXJlLWFwcCIsInN1YiI6InVzZXJuYW1lMSIsImV4cCI6MTYyMjY1NTA2NSwicm9sIjpbXX0.7yBkKodS0VCSrgUCRkG0Y5cg4kOcV7MSFZpGEt6AuonTrpRYxc8OGPT2lfeLkkwSq6cEoNwTXZEzX2npQc6p0w';
    }

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