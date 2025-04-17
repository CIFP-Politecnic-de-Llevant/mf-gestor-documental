import {Empresa} from "src/model/Empresa";

export interface LlocTreball {

    idLlocTreball:number;
    nom:string;
    adreca:string;
    codiPostal:string;
    telefon:string;
    poblacio:string;
    activitat:string;
    nomCompletRepresentantLegal:string;
    nomRepresentantLegal:string;
    cognomsRepresentantLegal:string;
    dniRepresentantLegal:string;
    nomCompletTutorEmpresa:string;
    nomTutorEmpresa:string;
    cognomsTutorEmpresa:string;
    dniTutorEmpresa:string;
    carrecTutor:string;
    municipi:string;
    emailTutorEmpresa:string;
    empresa:Empresa;
}
