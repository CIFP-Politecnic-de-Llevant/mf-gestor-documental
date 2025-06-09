import {Empresa} from "src/model/Empresa";

export interface LlocTreball {
  idLlocTreball:number;
  nom:string;
  adreca:string;
  codiPostal:string;
  telefon:string;
  poblacio:string;
  activitat:string;
  municipi:string;
  validat:boolean;
  emailCreator:string;
  empresa:Empresa;
}
