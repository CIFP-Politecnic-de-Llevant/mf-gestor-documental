import {axios}  from 'boot/axios'
import {Convocatoria} from "src/model/Convocatoria";

export class ConvocatoriaService {

  static async getConvocatories(): Promise<Array<Convocatoria>> {
    try {
      const response = await axios.get(process.env.API + '/api/gestordocumental/convocatories');
      const data = await response.data;
      return data.map((convocatoria:any):Convocatoria=>{
        return this.fromJSON(convocatoria);
      });
    } catch (error) {
      console.error('Error fetching convocatories', error);
      return [];
    }
  }

  static async getAdminConvocatories(): Promise<Array<Convocatoria>> {
    try {
      const response = await axios.get(process.env.API + '/api/gestordocumental/admin/convocatories');
      const data = await response.data;
      return data.map((convocatoria:any):Convocatoria=>{
        return this.fromJSON(convocatoria);
      });
    } catch (error) {
      console.error('Error fetching admin convocatories', error);
      return [];
    }
  }

  static async getQFempoFolders(): Promise<string[]> {
    try {
      const response = await axios.get(process.env.API + '/api/gestordocumental/admin/convocatories/fempo-folders');
      return response.data;
    } catch (error) {
      console.error('Error fetching FEMPO folders', error);
      return [];
    }
  }

  static async testDeleteFempoFolders(folderNames: string[]): Promise<void> {
    await axios.post(process.env.API + '/api/gestordocumental/admin/convocatories/test-delete-fempo-folders', folderNames);
  }

  static async createConvocatoria(payload: {
    convocatoria: {
      nom: string;
      isActual: boolean;
      idCursAcademic: number;
      pathDesti: string;
    };
    previousConvocatoriaId?: number;
    previousPathDesti?: string;
    applyDriveChanges?: boolean;
    deleteOriginDocuments?: boolean;
    selectedQFempoFolders?: string[];
  }): Promise<{
    convocatoria: Convocatoria;
    carpetesEsborrades: string[];
    carpetesNoEsborrades: string[];
    fitxersOrigenNoEsborrats: number;
  }> {
    const response = await axios.post(process.env.API + '/api/gestordocumental/admin/convocatories', payload);
    return {
      convocatoria: this.fromJSON(response.data.convocatoria),
      carpetesEsborrades: response.data.carpetesEsborrades || [],
      carpetesNoEsborrades: response.data.carpetesNoEsborrades || [],
      fitxersOrigenNoEsborrats: response.data.fitxersOrigenNoEsborrats || 0
    };
  }

  static fromJSON(json:any):Convocatoria{
    return {
      id: json.idConvocatoria,
      nom: json.nom,
      actual: json.isActual,
      pathDesti: json.pathDesti,
      idCursAcademic: json.idCursAcademic,
      pathOrigen: json.pathOrigen,
      isUnitatOrganitzativaOrigen: json.isUnitatOrganitzativaOrigen,
      isUnitatOrganitzativaDesti: json.isUnitatOrganitzativaDesti
    }
  }
}
