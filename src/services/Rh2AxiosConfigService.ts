import { Rh2AxiosConfig } from "..";

/**
 * Service de configuration des requêtes
 * Permet de centraliser les requêtes à faire, pour en executer une, il suffit de l'appeler par son nom 
 */
class Rh2AxiosConfigService {

    private configsAxios: Rh2AxiosConfig[] = [];

    /**
     * Obtenir tous les éléments stockés
     * @returns Tableau de résultat
     */
    getAllConfigAxios(): Rh2AxiosConfig[] {
        return this.configsAxios;
    }

    /**
     * Obtenir un élément stocké
     * @param id Query name
     * @returns L'élément recherché s'il existe
     */
    getConfigAxios(id: string): Rh2AxiosConfig {
        return this.configsAxios.find(config => config.label === id);
    }

    /**
     * Vérifier l'existance du paramètrage
     * @param id Query name
     * @returns True si présent sinon False
     */
    hasConfigAxios(id: string): boolean {
        return this.configsAxios.some((config) => config.label === id);
    }

    /**
      * Ajouter un nouveau paramètrage
      * Si le nom existe déjà, le paramètrage ne sera pas ajouté
      * @param configAxios nouveau paramètrage
      */
    addConfigAxios(configAxios: Rh2AxiosConfig): void {
        if (!this.hasConfigAxios(configAxios.label)) {
            this.configsAxios.push(configAxios);
        }
    }

    /**
     * Add auth to a axios config
     * @param label Query name
     * @param auth Ident to HTTP Basic auth
     */
    addAuthToConfigAxios(label: string, auth: { username: string, password: string }): void {
        if (this.hasConfigAxios(label)) {
            let config = this.getConfigAxios(label);
            this.removeConfigAxios(label);
            const configAxios = config.axiosRequestConfig;
            config = {
                ...config,
                axiosRequestConfig: { ...configAxios, auth }
            };
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
            const configAxios = config.axiosRequestConfig;
            config = {
                ...config,
                axiosRequestConfig: { ...configAxios, data: body }
            };
            this.addConfigAxios(config);
        }
    }


    /**
     * Replace config
     * @param label Query name
     * @param configAxios Config to replace
     */
    replaceConfig(label: string, configAxios: Rh2AxiosConfig): void {
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
        this.configsAxios = this.configsAxios.filter(config => config.label !== label);
    }

    /**
     * Vide tous les éléments
     */
    removeAllConfigAxios(): void {
        this.configsAxios = []
    }

}

const rh2AxiosConfigService = new Rh2AxiosConfigService();
export default rh2AxiosConfigService;