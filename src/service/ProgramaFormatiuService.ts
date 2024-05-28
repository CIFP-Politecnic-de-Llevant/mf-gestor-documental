import {ProgramaFormatiu} from "src/model/ProgramaFormatiu";
import axios from "axios";

export class ProgramaFormatiuService {

    static async saveTask(task:ProgramaFormatiu){

        await axios.post(process.env.API + `/api/gestordocumental/programa-formacio/save-task`,task)
    }

    static async deleteTask(id:number){

        await axios.get(process.env.API + `/api/gestordocumental/programa-formacio/delete-task/${id}`)
    }

    static async findAllPFormatiu():Promise<Array<ProgramaFormatiu>>{

        const response = await axios.get(process.env.API + '/api/gestordocumental/programa-formacio/all-PFormatius')
        const data = await response.data;

        return data.map((pFormatiu:any):ProgramaFormatiu=>{
            return this.fromJSONPFormatiu(pFormatiu)
        }).sort();
    }

    static  fromJSONPFormatiu(json:any):ProgramaFormatiu{

        return {
            idPFormatiu: json.idPFormatiu,
            descripcio: json.descripcio,
            idGrup: json.idGrup
        }
    }
}
