import {axios}  from 'boot/axios'
import {Document} from "../model/Document";
import {Usuari} from "src/model/Usuari";

export class DocumentService {

  static async getAutoritzats(): Promise<Array<Usuari>> {
    const response = await axios.get(process.env.API + '/api/gestordocumental/autoritzats');
    const data = await response.data;
    return data.map((usuari:any):Usuari=>{
      return  this.fromJSONUsuari(usuari)
    }).sort();
  }
/*
  static async getCalendariById(idCalendari:string): Promise<Calendari> {
    const response = await axios.get(process.env.API + '/api/reserves/calendari/'+idCalendari);
    const data:any = await response.data;
    return this.fromJSONCalendar(data)
  }

  static async getReservaById(id:string,idCalendari:string): Promise<Reserva> {
    const response = await axios.get(process.env.API + '/api/reserves/'+idCalendari+'/reserva/' + id);
    const data:any = await response.data;
    return this.fromJSON(data)
  }

  static async findAllMyReserves(idCalendari:string): Promise<Array<Reserva>> {
    const response = await axios.get(process.env.API + '/api/reserves/'+idCalendari+'/myreserves');
    const data = await response.data;
    return Promise.all(data.map(async (reserva:any):Promise<Reserva>=>{
        return await this.fromJSON(reserva)
    }));
  }

  static async findAllReserves(idCalendari:string): Promise<Array<Reserva>> {
    const response = await axios.get(process.env.API + '/api/reserves/'+idCalendari+'/reserves');
    const data = await response.data;
    return Promise.all(data.map(async (reserva:any):Promise<Reserva>=>{
      return await this.fromJSON(reserva)
    }));
  }

  static async save(reserva:Reserva,idCalendari:string){
    await axios.post(process.env.API + '/api/reserves/'+idCalendari+'/reserva/desar',reserva);
  }

  static async esborrar(idReserva:number,idCalendari:string){
    await axios.delete(process.env.API + '/api/reserves/'+idCalendari+'/reserva/eliminar/'+idReserva);
  }
*/
  static async fromJSONCalendar(json:any):Promise<Document>{
    return {
      id: json.idCalendari,
      nom: json.descripcio

    }
  }

  static fromJSONUsuari(json:any):Usuari{
    return {
      cognom1: "",
      cognom2: "",
      email: "",
      esAlumne: false,
      esProfessor: false,
      expedient: "",
      id: 0,
      label: "",
      nom: "",
      nomComplet: "",
      value: ""

    }
  }

}
