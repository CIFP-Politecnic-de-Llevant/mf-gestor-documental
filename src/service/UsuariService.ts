import {axios}  from 'boot/axios'
import {Document} from "../model/Document";
import {Usuari} from "src/model/Usuari";

export class UsuariService {

  static async getAutoritzats(): Promise<Array<Usuari>> {
    const response = await axios.get(process.env.API + '/api/gestordocumental/autoritzats');
    const data = await response.data;
    return data.map((usuari:any):Usuari=>{
      return  this.fromJSONUsuari(usuari)
    }).sort();
  }

  static async getTutorsFCT(): Promise<Array<Usuari>> {
    const response = await axios.get(process.env.API + '/api/core/usuaris/tutorfct');
    const data = await response.data;
    return data.map((usuari:any):Usuari=>{
      return  this.fromJSONUsuari(usuari)
    }).sort();
  }

  static fromJSONUsuari(json:any):Usuari{
    return {
      id: json.idusuari,
      email: json.gsuiteEmail,
      nomComplet: json.gsuiteFullName,
      value: json.gsuiteEmail,
      label: json.gsuiteFullName + ' <'+json.gsuiteEmail+'>'

    }
  }

}
