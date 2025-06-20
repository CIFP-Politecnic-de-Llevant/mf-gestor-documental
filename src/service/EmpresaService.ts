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
    const companies = await data.map(async (empresa: any):Promise<Empresa> => {
      const e = this.fromJsonEmpresa(empresa)
      this.allWorkspacesByIdEmpresa(e.idEmpresa).then((llocsTreball: Array<LlocTreball>) => {
        e.llocsTreball = llocsTreball;
      });
      this.allTutorsByIdEmpresa(e.idEmpresa).then((tutorsEmpresa: Array<TutorEmpresa>) => {
        e.tutorsEmpresa = tutorsEmpresa;
      });
      return e;
    }).sort();
    return await Promise.all(companies);
  }

  static async getCompanyById(id: number) {
    const response = await axios.post(process.env.API + `/api/gestordocumental/empresa/company/${id}`)
    const empresa = response.data;
    empresa.llocsTreball = await this.allWorkspacesByIdEmpresa(empresa.idEmpresa);
    empresa.tutorsEmpresa = await this.allTutorsByIdEmpresa(empresa.idEmpresa);

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
  static async allWorkspacesByIdEmpresa(idEmpresa: number): Promise<Array<LlocTreball>> {
    const response = await axios.get(process.env.API + `/api/gestordocumental/empresa/lloc-treball/all-workspaces/${idEmpresa}`);
    const data = response.data;

    if(!data) {
      return [];
    }

    return data.map((llocTreball: any): LlocTreball | undefined=> {
      if (llocTreball) {
        return this.fromJsonLlocTreball(llocTreball)
      }
    }).sort();
  }

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
  static async allTutorsByIdEmpresa(idEmpresa: number): Promise<Array<TutorEmpresa>> {
    const response = await axios.get(process.env.API + `/api/gestordocumental/empresa/tutor-empresa/all-tutors/${idEmpresa}`);
    const data = response.data;

    if(!data) {
      return [];
    }

    return data.map((tutorEmpresa: any): TutorEmpresa|undefined => {
      if(tutorEmpresa) {
        return this.fromJsonTutorEmpresa(tutorEmpresa);
      }
    }).sort();
  }

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
    const empresa:Empresa = {
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
    }
    if (json.llocsTreball) {
      empresa.llocsTreball = json.llocsTreball.map((lloc: any) => this.fromJsonLlocTreball(lloc));
    } else {
      empresa.llocsTreball = [];
    }
    if (json.tutorsEmpresa) {
      empresa.tutorsEmpresa = json.tutorsEmpresa.map((tutor: any) => this.fromJsonTutorEmpresa(tutor));
    } else {
      empresa.tutorsEmpresa = [];
    }
    return empresa;
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
