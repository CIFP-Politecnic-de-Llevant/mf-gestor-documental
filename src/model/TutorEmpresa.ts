import {Empresa} from "src/model/Empresa";

export interface TutorEmpresa {
    idTutorEmpresa: number;
    nom?: string;
    cognom1?: string;
    cognom2?: string;
    nacionalitat?: string;
    dni?: string;
    telefon?: string;
    email?: string;
    carrec?: string;
    empresa?: Empresa;
}
