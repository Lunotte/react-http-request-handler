import { ConfigAxios } from "../models/AxiosConfig";


/**
 * Service de configuration des requêtes
 * Permet de centraliser les requêtes à faire, pour en executer une, il suffit de l'appeler par son nom 
 */
class QueryStorageService {

    private configsAxios: ConfigAxios[] = [];

    /**
     * Obtenir tous les éléments stockés
     * @returns Tableau de résultat
     */
    getAllConfigAxios(): ConfigAxios[] {
        return this.configsAxios;
    }

    /**
     * Obtenir un élément stocké
     * @param id Query name
     * @returns L'élément recherché s'il existe
     */
    getConfigAxios(id: string): ConfigAxios {
        return this.configsAxios.find(config => config.configAxiosEtat.label === id);
    }

    /**
     * Vérifier l'existance du paramètrage
     * @param id Query name
     * @returns True si présent sinon False
     */
    hasConfigAxios(id: string): boolean {
        return this.configsAxios.some((config) => config.configAxiosEtat.label === id);
    }

   /**
     * Ajouter un nouveau paramètrage
     * Si le nom existe déjà, le paramètrage ne sera pas ajouté
     * @param configAxios nouveau paramètrage
     */
    addConfigAxios(configAxios: ConfigAxios): void {
        if (!this.hasConfigAxios(configAxios.configAxiosEtat.label)) {
            this.configsAxios.push(configAxios);
        }
    }

    /**
     * Add auth to a axios config
     * @param label Query name
     * @param auth Ident to HTTP Basic auth
     */
    addAuthToConfigAxios(label: string, auth: {username: string, password: string}): void {
        if (this.hasConfigAxios(label)) {
            let config = this.getConfigAxios(label);
            this.removeConfigAxios(label);
            const configAxios = config.configAxiosEtat.axiosRequestConfig;
            config = { ...config, configAxiosEtat: { ...config.configAxiosEtat, axiosRequestConfig: {...configAxios, auth} } }
            this.addConfigAxios(config);
        }
    }

    /**
     * Add body to a axios config
     * @param id Query name
     * @param body Body to the http request
     */
    addBodyToConfigAxios<T>(label: string, body: T): void {
        if (this.hasConfigAxios(label)) {
            let config = this.getConfigAxios(label);
            this.removeConfigAxios(label);
            const configAxios = config.configAxiosEtat.axiosRequestConfig;
            config = { ...config, configAxiosEtat: { ...config.configAxiosEtat, axiosRequestConfig: {...configAxios, data: body} } }
            this.addConfigAxios(config);
        }
    }


    /**
     * Replace config
     * @param label Query name
     * @param configAxios Config to replace
     */
    replaceConfig(label: string, configAxios: ConfigAxios): void {
        if (this.hasConfigAxios(label)) {
            this.removeConfigAxios(label);
            this.addConfigAxios(configAxios);
        }
    }


    /**
     * Supprime l’élément envoyer en paramètre
     * @param label Label
     */
    removeConfigAxios(label: string): void {
        this.configsAxios = this.configsAxios.filter(config => config.configAxiosEtat.label !== label);
    }

    /**
     * Vide tous les éléments
     */
    removeAllConfigAxios(): void {
        this.configsAxios = []
    }

}

const queryStorageService = new QueryStorageService();
export default queryStorageService;