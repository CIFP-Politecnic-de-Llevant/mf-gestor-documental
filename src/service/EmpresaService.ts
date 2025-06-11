import axios from "axios";
import {Empresa} from "src/model/Empresa";
import {LlocTreball} from "src/model/LlocTreball";
import {DadesFormulari} from "src/model/DadesFormulari";
import {TutorEmpresa} from "src/model/TutorEmpresa";

export class EmpresaService {

  /* EMPRESA */
  static async allCompanies(): Promise<Array<Empresa>> {

    const response = await axios.get(process.env.API + `/api/gestordocumental/empresa/all-companies`);
    const data = response.data;
    return data.map((empresa: any): Empresa => {
      return this.fromJsonEmpresa(empresa)
    }).sort();

  }

  static async getCompanyById(id: number) {

    const response = await axios.post(process.env.API + `/api/gestordocumental/empresa/company/${id}`)
    const empresa = response.data;

    return this.fromJsonEmpresa(empresa);
  }

  static async deleteCompany(id: number) {

    await axios.get(process.env.API + `/api/gestordocumental/empresa/delete-company/${id}`)
  }

  static async saveCompany(empresa: Empresa) {
    await axios.post(process.env.API + `/api/gestordocumental/empresa/save-company`, empresa)
  }

  static async updateCompany(empresa: Empresa) {
    await axios.post(process.env.API + `/api/gestordocumental/empresa/update-company`, empresa)
  }


  // LLOCS DE TREBALL
  static async deleteWorkspace(id: number) {

    await axios.get(process.env.API + `/api/gestordocumental/empresa/lloc-treball/delete/${id}`)
  }

  static async saveWorkspace(llocTreball: LlocTreball) {

    await axios.post(process.env.API + `/api/gestordocumental/empresa/lloc-treball/save-workspace`, llocTreball)
  }

  static async updateWorkspace(llocTreball: LlocTreball) {

    await axios.post(process.env.API + `/api/gestordocumental/empresa/lloc-treball/update-workspace`, llocTreball)
  }

  // TUTORS D'EMPRESA
  static async deleteTutorEmpresa(id: number) {

    await axios.get(process.env.API + `/api/gestordocumental/empresa/tutor-empresa/delete/${id}`)
  }
  static async saveTutorEmpresa(tutorEmpresa: TutorEmpresa) {

    await axios.post(process.env.API + `/api/gestordocumental/empresa/tutor-empresa/save-tutor`, tutorEmpresa)
  }
  static async updateTutorEmpresa(tutorEmpresa: TutorEmpresa) {

    await axios.post(process.env.API + `/api/gestordocumental/empresa/tutor-empresa/update-tutor`, tutorEmpresa)
  }


  static fromJsonEmpresa(json: any): Empresa {
    /*
      idEmpresa:number;
      numeroConveni?:string;
      nomRepresentantLegal?:string;
      cognomsRepresentantLegal?:string;
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
     */
    return {
      idEmpresa: json.idEmpresa,
      numeroConveni: json.numeroConveni,
      nomRepresentantLegal: json.nomRepresentantLegal,
      cognom1RepresentantLegal: json.cognom1RepresentantLegal,
      cognom2RepresentantLegal: json.cognom2RepresentantLegal,
      dniRepresentantLegal: json.dniRepresentantLegal,
      emailEmpresa: json.emailEmpresa,
      nom: json.nom,
      cif: json.cif,
      adreca: json.adreca,
      codiPostal: json.codiPostal,
      poblacio: json.poblacio,
      provincia: json.provincia,
      telefon: json.telefon,
      llocsTreball: json.llocsTreball.map((lloc: any) => this.fromJsonLlocTreball(lloc)),
      tutorsEmpresa: json.tutorsEmpresa.map((tutor: any) => this.fromJsonTutorEmpresa(tutor)),
    }
  }

  static fromJsonLlocTreball(json: any): LlocTreball {
    /*
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
     */
    return {
      idLlocTreball: json.idLlocTreball,
      nom: json.nom,
      adreca: json.adreca,
      codiPostal: json.codiPostal,
      telefon: json.telefon,
      poblacio: json.poblacio,
      activitat: json.activitat,
      municipi: json.municipi,
      validat: json.validat,
      emailCreator: json.emailCreator,
      empresa: this.fromJsonEmpresa(json.empresa)
    }
  }

  static fromJsonTutorEmpresa(json: any): TutorEmpresa {
    /*
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
     */
    return {
      idTutorEmpresa: json.idTutorEmpresa,
      nom: json.nom,
      cognom1: json.cognom1,
      cognom2: json.cognom2,
      nacionalitat: json.nacionalitat,
      dni: json.dni,
      telefon: json.telefon,
      email: json.email,
      carrec: json.carrec,
      empresa: this.fromJsonEmpresa(json.empresa)
    }
  }

}
