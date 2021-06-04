import { AxiosRequestConfig } from "axios";
import { ConfigQueryParameter, MultiplePossibleValues } from "../models/QueryDirectory";

class QueryDirectoryService {

    private configQueryParameter: ConfigQueryParameter[] = [];

    getConfigQueryParameters(): ConfigQueryParameter[] {
        return this.configQueryParameter;
    }

    getConfigQueryParameter(url: string, method: string, params: MultiplePossibleValues[]): ConfigQueryParameter {
        return this.configQueryParameter.find(config => config.url === url && config.method === method && compareParams(config.params, params));
    }
    
    hasConfigQueryParameter(url: string, method: string, params: MultiplePossibleValues[]): boolean {
        return !this.configQueryParameter.some((config) => config.url === url && config.method === method && compareParams(config.params, params));
    }
    
    addConfigQueryParameter(configTmp: ConfigQueryParameter): void {
        this.configQueryParameter.push(configTmp);
    }

    removeQueryDirectory(axiosRequestConfig: AxiosRequestConfig) {
        this.configQueryParameter = this.configQueryParameter.filter(config =>
            comparatorUrlMethodParams(config, axiosRequestConfig.url, axiosRequestConfig.method, axiosRequestConfig.params));
    }

    // private compareParams(params1: MultiplePossibleValues[], params2: MultiplePossibleValues[]): boolean {
    //     return params1.length === params2.length && params1.every((value, index) => value === params2[index])
    // }

}

const compareParams = (params1: MultiplePossibleValues[], params2: MultiplePossibleValues[]) =>
    params1.length === params2.length && params1.every((value, index) => value === params2[index]);

const comparatorUrlMethodParams = (config, url, method, params) => config.url === url && config.method === method && compareParams(config.params, params);

const queryDirectoryService = new QueryDirectoryService();
export default queryDirectoryService;