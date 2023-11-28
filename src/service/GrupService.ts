import {axios}  from 'boot/axios'
import {Document} from "../model/Document";
import {Usuari} from "src/model/Usuari";
import {Grup} from "src/model/Grup";

export class GrupService {


  static fromJSONGrup(json:any):Grup{
    return {
      id: 0,
      nom: "fef",
      tutor1: undefined,
      tutor2: undefined,
      tutor3: undefined
    }
  }

}
