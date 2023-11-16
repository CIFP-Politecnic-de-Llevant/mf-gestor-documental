import {axios}  from 'boot/axios'
import {Reserva} from "../model/Reserva";
import {Ref} from "vue";
import {Calendari} from "src/model/Calendari";

export class ReservatService {

  static async findAllCalendaris(): Promise<Array<Calendari>> {
    const response = await axios.get(process.env.API + '/api/reserves/calendaris');
    const data = await response.data;
    return Promise.all(data.map(async (calendari:any):Promise<Calendari>=>{
      return await this.fromJSONCalendar(calendari)
    }).sort());
  }

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

  static async fromJSON(json:any):Promise<Reserva>{
    return {
      id: json.idReserva,
      descripcio: json.descripcio,
      dataInici: json.dataInici,
      dataFi: json.dataFi,
      idCalendar: json.idCalendar,
      idCalendarEvent: json.idCalendarEvent,
      usuariEmail: json.usuariEmail,
      usuariNom: json.usuariNom
    }
  }
  static async fromJSONCalendar(json:any):Promise<Calendari>{
    return {
      id: json.idCalendari,
      nom: json.descripcio

    }
  }

}
