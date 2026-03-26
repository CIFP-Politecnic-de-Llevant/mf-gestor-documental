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

  static async createConvocatoria(payload: {
    convocatoria: {
      nom: string;
      isActual: boolean;
      idCursAcademic: number;
      pathDesti: string;
    };
    previousConvocatoriaId?: number;
    previousPathDesti?: string;
  }): Promise<Convocatoria> {
    const response = await axios.post(process.env.API + '/api/gestordocumental/admin/convocatories', payload);
    return this.fromJSON(response.data);
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
