import axios from 'axios';
import { getStorage } from '../services/storage-service';
import gestionConfig from '../services/GestionConfigService';
import { KeyValue } from '../models/GestionConfig';

export const instance = axios.create({
  baseURL: gestionConfig.getParameterBaseUrl()
});

instance.interceptors.request.use(
  async (config) => {
   const headerImpl = await header();
    console.log(headerImpl, config);
    
    if (headerImpl) {
      if (config.method !== 'OPTIONS') {
        config = { ...config, headers: headerImpl };
      }
    }
    console.log(config);
    
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
  let token = null;// = await getToken();

  //token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzZWN1cmUtYXBpIiwiYXVkIjoic2VjdXJlLWFwcCIsInN1YiI6InVzZXJuYW1lMSIsImV4cCI6MTYyMjY1NTA2NSwicm9sIjpbXX0.7yBkKodS0VCSrgUCRkG0Y5cg4kOcV7MSFZpGEt6AuonTrpRYxc8OGPT2lfeLkkwSq6cEoNwTXZEzX2npQc6p0w';

  if (gestionConfig.isUseAsyncStorage()) {
    token = await getToken();
  } /*else {
      token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzZWN1cmUtYXBpIiwiYXVkIjoic2VjdXJlLWFwcCIsInN1YiI6InVzZXJuYW1lMSIsImV4cCI6MTYyMjY1NTA2NSwicm9sIjpbXX0.7yBkKodS0VCSrgUCRkG0Y5cg4kOcV7MSFZpGEt6AuonTrpRYxc8OGPT2lfeLkkwSq6cEoNwTXZEzX2npQc6p0w';
    }*/

  let headers = await extractHeaderUrl();

  if (token != null) {
    headers = {...headers, 'Authorization': token};
  }

  return headers;
}

async function extractHeaderUrl() {
  const headers: KeyValue[] = gestionConfig.getParameterHeaderUrl();

  let headerAfterBuilding = {};
  headers.forEach((kv: KeyValue) => headerAfterBuilding[kv.key] = kv.value);
  return headerAfterBuilding;
  
}

export default instance;