import {Empresa} from "src/model/Empresa";

export interface LlocTreball {
  idLlocTreball:number;
  nom:string;
  adreca:string;
  codiPostal:string;
  telefon:string;
  poblacio:string;
  municipi:string;
  activitat:string;
  validat:boolean;
  emailCreator:string;
  empresa:Empresa;

  // Dades Contacte Lloc de Treball
  nomContacte?:string;
  cognom1Contacte?:string;
  cognom2Contacte?:string;
  telefonContacte?:string;
  emailContacte?:string;
  ////////
}
