import { AxiosRequestConfig } from "axios";
import { ConfigQueryParameter, MethodRnhrh, MultiplePossibleValues, ParamRnhnh } from "../models/QueryDirectory";
import _ from "lodash";


/**
 * Service de stockage des requetes exécutées
 */
class QueryDirectoryService {

    private configQueryParameter: ConfigQueryParameter[] = [];

    /**
     * Obtenir tous les éléments stockés
     * @returns Tableau de résultat
     */
    getConfigQueryParameters(): ConfigQueryParameter[] {
        return this.configQueryParameter;
    }

    /**
     * Obtenir un élément stocké
     * @param url Url recherchée
     * @param method Méthode recherchée
     * @param params Paramètres recherchés
     * @returns L'élément recherché s'il existe
     */
    getConfigQueryParameter(url: string, method: MethodRnhrh, params?: ParamRnhnh): ConfigQueryParameter {
      //  console.log(url, method);
        
        return this.configQueryParameter.find(config => comparatorUrlMethodParams(config, url, method, params));
    }
    
    /**
     * Vérifier l'existance du paramètrage
     * @param url Url recherchée
     * @param method Méthode recherchée
     * @param params Paramètres recherchés
     * @returns True si présent sinon False
     */
    hasConfigQueryParameter(url: string, method: MethodRnhrh, params?: ParamRnhnh): boolean {
        return this.configQueryParameter.some((config) => comparatorUrlMethodParams(config, url, method, params));
    }

    /**
     * Vérifier l'existance du paramètrage
     * @param parameter Url recherchée
     * @returns True si présent sinon False
     */
    hasConfigQueryParameterByConfigQueryParameter(parameter: ConfigQueryParameter): boolean {
        return this.hasConfigQueryParameter(parameter.url, parameter.method, parameter.params);
    }
    
    /**
     * Ajouter un nouveau paramètrage
     * @param configTmp nouveau paramètrage
     */
    addConfigQueryParameter(configTmp: ConfigQueryParameter): void {
        this.configQueryParameter.push(configTmp);
    }

    /**
     * Supprime l’élément envoyer en paranètre
     * @param axiosRequestConfig Élément à supprimer
     */
    removeQueryDirectory(axiosRequestConfig: AxiosRequestConfig): void {
        this.configQueryParameter = this.configQueryParameter.filter(config =>
            !comparatorUrlMethodParams(config, axiosRequestConfig.url, axiosRequestConfig.method, axiosRequestConfig.params));
       // console.log(this.configQueryParameter);
        
    }

    /**
     * Vide tous les éléments
     */
    removeAllQueryDirectory(): void {
        this.configQueryParameter = []
    }

}

/**
 * Comparer les paramètres de deux sources d'approvisionnement
 * @param params1 
 * @param params2 
 * @returns True si Les paramètres sont identiques, null ou vide sinon False
 */
const compareParams = (params1: ParamRnhnh, params2: ParamRnhnh): boolean =>
{
    if (params1 == null && params2 == null) {
        return true;
    } else if ((params1 == null && params2 != null && Object.keys(params2).length === 0) ||
                params2 == null && params1 != null && Object.keys(params1).length === 0) {
        return true;
    } else if (params1 != null && params2 != null) {
        return _.isEqual(params1, params2);
    } else {
        return false;
    }
}

/**
 * Comparer l'url, le type de méthode et les paramètres
 * @param config Configuration en mémoire
 * @param url Url reçue
 * @param method Method reçue
 * @param params Params reçu
 * @returns True si la comparaison est strictement identique
 */
const comparatorUrlMethodParams = (config, url, method, params): boolean =>   
    config.url === url && config.method === method && compareParams(config.params, params);

const queryDirectoryService = new QueryDirectoryService();
export default queryDirectoryService;