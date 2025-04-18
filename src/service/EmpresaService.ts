import axios from "axios";
import {Empresa} from "src/model/Empresa";
import {LlocTreball} from "src/model/LlocTreball";
import {DadesFormulari} from "src/model/DadesFormulari";

export class EmpresaService {


    static async allCompanies():Promise<Array<Empresa>>{

        const response = await axios.get(process.env.API + `/api/gestordocumental/empresa/all-companies`);
        const data = response.data;
        return data.map((empresa:any):Empresa =>{
            return this.fromJsonEmpresa(empresa)
        }).sort();

    }

    static async getCompanyById(id:number){

        const response = await  axios.post(process.env.API + `/api/gestordocumental/empresa/company/${id}`)
        const empresa = response.data;

        return this.fromJsonEmpresa(empresa);
    }

    static async deleteCompany(id:number){

        await axios.get(process.env.API + `/api/gestordocumental/empresa/delete-company/${id}`)
    }

    static async deleteWorkspace(id:number){

        await axios.get(process.env.API + `/api/gestordocumental/empresa/lloc-treball/delete/${id}`)
    }

    static  async  saveCompany(empresa:Empresa){
        await axios.post(process.env.API + `/api/gestordocumental/empresa/save-company`,empresa)
    }
    static  async  updateCompany(empresa:Empresa){
        await axios.post(process.env.API + `/api/gestordocumental/empresa/update-company`,empresa)
    }

    static async saveWorkspace(llocTreball:LlocTreball){

      await axios.post(process.env.API + `/api/gestordocumental/empresa/lloc-treball/save-workspace`,llocTreball)
    }
    static async updateWorkspace(llocTreball:LlocTreball){

      await axios.post(process.env.API + `/api/gestordocumental/empresa/lloc-treball/update-workspace`,llocTreball)
    }



    static fromJsonEmpresa(json:any):Empresa{

      console.log("jjjjsooonn",json)
        return {
            idEmpresa: json.idEmpresa,
            numeroConveni: json.numeroConveni,
            emailEmpresa: json.emailEmpresa,
            nom: json.nom,
            cif: json.cif,
            adreca: json.adreca,
            codiPostal: json.codiPostal,
            poblacio: json.poblacio,
            provincia: json.provincia,
            telefon: json.telefon,
            llocsTreball: json.llocsTreball
        }
    }

}
