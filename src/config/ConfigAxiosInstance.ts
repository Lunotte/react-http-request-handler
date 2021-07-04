import axios from 'axios';
import { getStorage } from '../services/storage-service';
import rh2ConfigService from '../services/Rh2ConfigService';
import { KeyValue } from '../models/Rh2Config';

export const instance = axios.create({
  baseURL: rh2ConfigService.getParameterBaseUrl()
});

instance.interceptors.request.use(
  async (config) => {
   const headerImpl = await header();
    if (headerImpl) {
      if (config.method !== 'OPTIONS') {
        config = { ...config, headers: headerImpl };
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
  let token = null;

  //token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzZWN1cmUtYXBpIiwiYXVkIjoic2VjdXJlLWFwcCIsInN1YiI6InVzZXJuYW1lMSIsImV4cCI6MTYyMjY1NTA2NSwicm9sIjpbXX0.7yBkKodS0VCSrgUCRkG0Y5cg4kOcV7MSFZpGEt6AuonTrpRYxc8OGPT2lfeLkkwSq6cEoNwTXZEzX2npQc6p0w';

  if (rh2ConfigService.isUseAsyncStorage()) {
    token = await getToken();
  }

  let headers = await addHeaderToUrl();

  if (token != null) {
    headers = {...headers, 'Authorization': token};
  }
  return headers;
}

async function addHeaderToUrl() {
  const headers: KeyValue[] = rh2ConfigService.getParameterHeaderUrl();

  let headerAfterBuilding = {};
  headers.forEach((kv: KeyValue) => headerAfterBuilding[kv.key] = kv.value);
  return headerAfterBuilding;
  
}

export default instance;