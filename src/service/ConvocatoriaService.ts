import {axios}  from 'boot/axios'
import {Curs} from "src/model/Curs";
import {Convocatoria} from "src/model/Convocatoria";

export class ConvocatoriaService {

  static async getConvocatories(): Promise<Array<Convocatoria>> {
    try {
      const response = await axios.get(process.env.API + '/api/gestordocumental/convocatories');
      const data = response.data || [];
      return data.map((convocatoria:any):Convocatoria=>{
        return this.fromJSON(convocatoria);
      });
    } catch (error) {
      console.error('Error fetching convocatories', error);
      return [];
    }
  }

  static fromJSON(json:any):Convocatoria{
    return {
      id: json.idConvocatoria,
      nom: json.nom,
      actual: json.isActual
    }
  }
}
