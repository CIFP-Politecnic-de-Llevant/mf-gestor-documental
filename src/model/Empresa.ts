import {LlocTreball} from "src/model/LlocTreball";

export interface Empresa {

    idEmpresa:number;
    numeroConveni?:string;
    nom?:string;
    cif?:string;
    adreca?:string;
    emailEmpresa: string;
    codiPostal?:string;
    poblacio?:string;
    provincia?:string;
    telefon?:string;
    llocsTreball?:Array<LlocTreball>;
}
