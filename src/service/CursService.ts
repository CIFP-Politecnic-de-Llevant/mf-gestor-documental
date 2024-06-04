import {axios}  from 'boot/axios'
import {Curs} from "src/model/Curs";
import {Grup} from "src/model/Grup";
import {ref, Ref} from "vue";

export class CursService {

  static async getCursById(id:string): Promise<Curs> {
    const response = await axios.get(process.env.API + '/api/core/curs/getById/' + id);
    const data:any = await response.data;
    return this.fromJSON(data);
  }

  static async getCursByCodiGestib(id:string): Promise<Curs> {
    const response = await axios.get(process.env.API + '/api/core/curs/getByCodiGestib/' + id);
    const data = await response.data;
    return this.fromJSON(data);
  }
static async getCursByCodi(id:string): Promise<Grup> {
    const response = await axios.get(process.env.API + `/api/core/grup/getByCodigrup/${id}`);
    const data = await response.data;
    return this.fromJsonGrup(data);
  }

  static async getCursos(): Promise<Array<Curs>> {
    const response = await axios.get(process.env.API + '/api/core/curs/llistat');
    const data = await response.data;
    return data.map((curs:any):Curs=>{
        return this.fromJSON(curs);
    });
  }

  static fromJsonGrup(json:any):Grup{
    const cursAux:Ref<Curs> = ref({id:json.idgrup,nom:json.gestibNom});
    return {
      id: json.idgrup,
      nom: json.gestibNom,
      gestibCodi: json.gestibIdentificador,
      tutor1: json.gestibTutor1,
      tutor2: json.gestibTutor2,
      tutor3: json.gestibTutor3,
      curs: cursAux.value
    }
  }
  static fromJSON(json:any):Curs{
    return {
      id: json.idcurs,
      nom: json.gestibNom
    }
  }
}
