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

    // setConfigAxiosToActif(id: string): void {
    //     this.switchActifState(id, true);
    // }

    // setConfigAxiosToInactif(id): void {
    //     this.switchActifState(id, false);
    // }

    // switchActifState(id: string, actif: boolean): void {
    //     let configAxios = this.configsAxios.find(config => config.configAxiosEtat.label === id);
        
    //     if (configAxios != null) {
    //         this.removeConfigAxios(configAxios);
    //         configAxios = { ...configAxios, configAxiosEtat: { ...configAxios.configAxiosEtat, actif } }
    //         this.addConfigAxios(configAxios);
    //     }
    // }
    
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
     * Supprime l’élément envoyer en paramètre
     * @param configAxios Élément à supprimer
     */
    removeConfigAxios(configAxios: ConfigAxios): void {
        this.configsAxios = this.configsAxios.filter(config => config.configAxiosEtat.label !== configAxios.configAxiosEtat.label);
        
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