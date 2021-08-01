import axios, { AxiosInstance } from 'axios';
import { KeyValue } from '../models/Rh2Config';
import rh2ConfigService from './Rh2ConfigService';

type Rh2AxiosInstance = { [key: string]: AxiosInstance };

export const axiosInstances: Rh2AxiosInstance = getInstances();

function getInstances() {
    let listAxiosInstance: Rh2AxiosInstance;

    if (rh2ConfigService.getParametersAxiosConfigs() != null &&
    rh2ConfigService.getParametersAxiosConfigs().length > 0) {

        rh2ConfigService.getParametersAxiosConfigs().forEach(config => {
            if (config.key != null && config.axiosConfig != null) {
                const anInstance: AxiosInstance = axios.create(config.axiosConfig);
                listAxiosInstance = { ...listAxiosInstance, [config.key]: anInstance };
                if (config.defaultInterceptor == null || config.defaultInterceptor === true) {
                    generateInterceptors(anInstance, config.headerUrl)
                }
            }
        })
    } else {
        listAxiosInstance = { ...listAxiosInstance, ['default']: axios.create() };
    }
    return listAxiosInstance;
}

function generateInterceptors(axiosInstance: AxiosInstance, headersToAdd: KeyValue[]) {
    axiosInstance.interceptors.request.use(
        async (config) => {
            const headers = await addHeaderToUrl(headersToAdd);

            if (headers) {
                if (config.method !== 'OPTIONS') {
                    config = { ...config, headers };
                }
            }
            return config;
        },
        error => {
            return Promise.reject(error);
        });
}

async function addHeaderToUrl(headersToAdd: KeyValue[]): Promise<{[k: string]: string}> {
    const headersDefault: KeyValue[] = rh2ConfigService.HEADER_URL;

    if (headersToAdd == null || headersToAdd.length === 0) {
        return mapAllHeaders(headersDefault);
    } else {
        return mapAllHeaders(headersToAdd);
    }

}

function mapAllHeaders(headers: KeyValue[]): {[k: string]: string} {
    const headerAfterBuilding = {};
    headers.forEach((kv: KeyValue) => headerAfterBuilding[kv.key] = kv.value);
    return headerAfterBuilding;
}

/**
 * If the user has initialized library with SettingsInitializerRnhrh and provided data for the param axiosConfig
 * All instances requested will be accessible. You can use them to make interceptors
 * If nothing provided, default instance has been created
 * @returns All Axios instances generate 
 */
export function getAxiosInstances(): Rh2AxiosInstance {
    return axiosInstances;
}




// instances[0].interceptors.request.use(
//   async (config) => {
//     const headerImpl = await header();
//     if (headerImpl) {
//       if (config.method !== 'OPTIONS') {
//         config = { ...config, headers: headerImpl };
//       }
//     }
//     return config;
//   },
//   error => {
//     // Do something with request error 
//     return Promise.reject(error);
//   });



// async function getToken() {
//   const token = await getStorage('token');

//   if (token == null) {
//     return null;
//   } else {
//     return token;
//   }
// }


// export async function header() {
//   let token = null;

//   //token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJzZWN1cmUtYXBpIiwiYXVkIjoic2VjdXJlLWFwcCIsInN1YiI6InVzZXJuYW1lMSIsImV4cCI6MTYyMjY1NTA2NSwicm9sIjpbXX0.7yBkKodS0VCSrgUCRkG0Y5cg4kOcV7MSFZpGEt6AuonTrpRYxc8OGPT2lfeLkkwSq6cEoNwTXZEzX2npQc6p0w';

//   if (rh2ConfigService.isUseAsyncStorage()) {
//     token = await getToken();
//   }

//   let headers = await addHeaderToUrl();

//   if (token != null) {
//     headers = { ...headers, 'Authorization': token };
//   }
//   return headers;
// }

// async function addHeaderToUrl() {
//   const headers: KeyValue[] = rh2ConfigService.HEADER_URL;

//   let headerAfterBuilding = {};
//   headers.forEach((kv: KeyValue) => headerAfterBuilding[kv.key] = kv.value);
//   return headerAfterBuilding;

// }

export default axiosInstances;