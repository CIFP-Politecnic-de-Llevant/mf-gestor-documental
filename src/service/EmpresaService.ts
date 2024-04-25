import axios from "axios";
import {Empresa} from "src/model/Empresa";

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

    static  async  saveCompany(empresa:Object){
        await axios.post(process.env.API + `/api/gestordocumental/empresa/save-company`,empresa)
    }

    static fromJsonEmpresa(json:any):Empresa{

        return {
            idEmpresa: json.idEmpresa,
            numeroConveni: json.numeroConveni,
            numeroAnnex: json.numeroAnnex,
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
