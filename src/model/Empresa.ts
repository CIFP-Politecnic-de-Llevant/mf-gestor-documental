import {LlocTreball} from "src/model/LlocTreball";

export interface Empresa {

    idEmpresa:number;
    numeroConveni?:string;
    numeroAnnex?:string;
    nom?:string;
    cif?:string;
    adreca?:string;
    codiPostal?:string;
    poblacio?:string;
    provincia?:string;
    telefon?:string;
    llocsTreball?:Array<LlocTreball>;
}
