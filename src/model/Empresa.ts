import {LlocTreball} from "src/model/LlocTreball";
import {TutorEmpresa} from "src/model/TutorEmpresa";

export interface Empresa {
    idEmpresa:number;
    numeroConveni?:string;
    nomRepresentantLegal?:string;
    cognom1RepresentantLegal?:string;
    cognom2RepresentantLegal?:string;
    dniRepresentantLegal?:string;
    nom?:string;
    cif?:string;
    adreca?:string;
    emailEmpresa: string;
    codiPostal?:string;
    poblacio?:string;
    provincia?:string;
    telefon?:string;
    llocsTreball?:Array<LlocTreball>;
    tutorsEmpresa?:Array<TutorEmpresa>;
}
