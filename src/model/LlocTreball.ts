import {Empresa} from "src/model/Empresa";

export interface LlocTreball {

    idLlocTreball:number;
    nom:string;
    adreca:string;
    codiPostal:string;
    telefon:string;
    poblacio:string;
    activitat:string;
    nomRepresentantLegal:string;
    dniRepresentantLegal:string;
    nomTutorEmpresa:string;
    dniTutorEmpresa:string;
    municipi:string;
    carrecTutor:string;
    email:string;
    empresa:Empresa;
}
