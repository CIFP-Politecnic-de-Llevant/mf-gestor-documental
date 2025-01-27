import {axios}  from 'boot/axios'
import {Curs} from "src/model/Curs";
import {Signatura} from "src/model/Signatura";
import {AbortControllerService} from "src/service/AbortControllerService";

export class SignaturaService {

  static async findAll(): Promise<Array<Signatura>> {
    AbortControllerService.addAbortController('SignaturaService-findAll', new AbortController());
    const response = await axios.get(process.env.API + '/api/gestordocumental/signatura/list', {signal: AbortControllerService.getAbortController('signatura')?.signal});
    const data = await response.data;
    return data.map((signatura:any):Signatura=>{
        return this.fromJSON(signatura);
    });
  }

  static fromJSON(json:any):Signatura{
    return {
      id: json.idSignatura,
      nom: json.nom,
      signat: false
    }
  }
}
