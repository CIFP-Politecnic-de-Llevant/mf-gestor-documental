import {axios}  from 'boot/axios'
import {Document} from "../model/Document";
import {Usuari} from "src/model/Usuari";
import {Grup} from "src/model/Grup";
import {UsuariService} from "src/service/UsuariService";
import {CursService} from "src/service/CursService";
import {Curs} from "src/model/Curs";

export class GrupService {

  static async findAllGrups(): Promise<Array<Grup>> {
    const response = await axios.get(process.env.API + '/api/core/grup/llistatprofessorat');
    const grups = await response.data;

    return Promise.all(grups.map((grup:any)=>{
      return this.fromJSONGrup(grup);
    }));
  }

  static async findGrupsAmbDocumentsFct(): Promise<Array<Grup>> {
    const response = await axios.get(process.env.API + '/api/gestordocumental/grups-amb-documentsfct');
    const grups = await response.data;

    return Promise.all(grups.map((grup:any)=>{
      return this.fromJSONGrup(grup);
    }));
  }

  static fromJSONGrup(json:any):Promise<Grup>{
    const usuariPromises:Promise<Usuari>[] = [];

    if(json.gestibTutor1) {
      usuariPromises.push(UsuariService.getByGestibId(json.gestibTutor1));
    }
    if(json.gestibTutor2) {
      usuariPromises.push(UsuariService.getByGestibId(json.gestibTutor2));
    }
    if(json.gestibTutor3) {
      usuariPromises.push(UsuariService.getByGestibId(json.gestibTutor3));
    }

    const cursPromises:Promise<Curs>[] = [];
    cursPromises.push(CursService.getCursByCodiGestib(json.gestibCurs));

    return Promise.all(usuariPromises).then(g=>{
      return Promise.all(cursPromises).then(c=>{
        return {
          id: json.idgrup,
          nom: json.gestibNom,
          gestibCodi: json.gestibIdentificador,
          tutor1: g[0],
          tutor2: g[1],
          tutor3: g[2],
          curs: c[0]
        }
      });
    });
  }
}
