import {axios} from 'boot/axios'
import {Usuari} from "src/model/Usuari";
import {Alumne} from "src/model/Alumne";

export class UsuariService {

  static async getAutoritzats(): Promise<Array<Usuari>> {
    const response = await axios.get(process.env.API + '/api/gestordocumental/autoritzats');
    const data = await response.data;
    return data.map((usuari:any):Usuari=>{
      return  this.fromJSONUsuari(usuari)
    }).sort();
  }

  static async getAlumnes(): Promise<Array<Usuari>> {
    const response = await axios.get(process.env.API + '/api/core/usuaris/llistat/actius');
    const data = await response.data;
    return data.map((usuari:any):Usuari=>{
      return  this.fromJSONUsuari(usuari)
    }).filter((u:Usuari)=>u.esAlumne).sort();
  }

  static async getTutorsFCT(): Promise<Array<Usuari>> {
    const response = await axios.get(process.env.API + '/api/core/usuaris/tutorfct');
    const data = await response.data;
    return data.map((usuari:any):Usuari=>{
      return  this.fromJSONUsuari(usuari)
    }).sort();
  }

  static async getTutorsFCTByCodiGrup(codiGrup:string): Promise<Array<Usuari>> {
    const response = await axios.get(process.env.API + '/api/core/usuaris/tutorfct-by-codigrup/'+codiGrup);
    const data = await response.data;
    return data.map((usuari:any):Usuari=>{
      return  this.fromJSONUsuari(usuari)
    }).sort();
  }

  static async getByGestibId(id:string): Promise<Usuari> {
    const responseUser = await axios.get(process.env.API + '/api/core/usuaris/profile-by-gestib-codi/'+id);
    const usuari:any = await responseUser.data;
    return this.fromJSONUsuari(usuari);
  }

  static async getById(id:string): Promise<Usuari> {
    const responseUser = await axios.get(process.env.API + '/api/core/usuaris/profile/'+id);
    const usuari:any = await responseUser.data;
    return this.fromJSONUsuari(usuari);
  }

  static async getProfile(): Promise<Usuari> {
    const responseUser = await axios.get(process.env.API + '/api/core/usuaris/profile');
    const usuari:any = await responseUser.data;
    return this.fromJSONUsuari(usuari);
  }

  static fromJSONUsuari(json:any):Usuari{
    return {
      id: json.idusuari,
      email: json.gsuiteEmail,
      nom: json.gestibNom,
      cognom1: json.gestibCognom1,
      cognom2: json.gestibCognom2,
      nomComplet: json.gsuiteFullName,
      nomComplet2: json.gestibCognom1 + " " + json.gestibCognom2 + ", " + json.gestibNom,
      esAlumne: json.gestibAlumne,
      numExpedient: json.gestibExpedient,
      grup: json.gestibGrup,
      grup2: json.gestibGrup2,
      grup3: json.gestibGrup3,
      value: json.gsuiteEmail,
      label: json.gsuiteFullName + ' <'+json.gsuiteEmail+'>'

    }
  }

  //ALUMNES
   static async getStudentFromFile(file:File):Promise<Array<Alumne>>{

    const formData = new FormData();
    formData.append('file',file);

    const response= await axios.post(process.env.API + '/api/gestordocumental/alumnes/get-students-from-file',formData);
     const data = await response.data;
     const alumnesbd = await this.allStudents()
     const alumnes:Alumne[] = data.map((alumne:any):Alumne=>{

       return this.fromJSONAlumne(alumne)
     }).sort();

     alumnes.forEach(a => {

         a.noExisteix = !alumnesbd.some(abd => abd.numeroExpedient === a.numeroExpedient);
     });

     for (const alumne of alumnes) {
       console.log("Per verificar")

       console.log(alumne)
     }
     return alumnes;

   }

  static async allStudents():Promise<Array<Alumne>>{

    const response = await axios.get(process.env.API + '/api/gestordocumental/alumnes/all-students');
    const data = await response.data;
    return data.map((alumne:any):Alumne=>{

      return this.fromJSONAlumne(alumne)
    }).sort();
  }

  static async updateStudent(alumne:Object){

    await axios.post(process.env.API + `/api/gestordocumental/alumnes/update-student`,alumne)

  }

  static async deleteStudent(nExp:number){

    await axios.get(process.env.API + `/api/gestordocumental/alumnes/delete-student/${nExp}`)
  }

  static async saveStudents(alumnes:Alumne[]){

    for (const alumne of alumnes) {
      console.log("Aquest es per guardarels alumnes")
      console.log(alumne)
    }
      await axios.post(process.env.API + `/api/gestordocumental/alumnes/save-student`,alumnes)
  }

  static fromJSONAlumne(json:any):Alumne{

    return {
      idAlumne: json.idAlumne,
      nom: json.nom,
      cognom1: json.cognom1,
      cognom2: json.cognom2,
      ensenyament: json.ensenyament,
      estudis: json.estudis,
      grup: json.grup,
      numeroExpedient: json.numeroExpedient,
      sexe: json.sexe,
      dataNaixement: json.dataNaixement,
      nacionalitat: json.nacionalitat,
      paisNaixement: json.paisNaixement,
      provinciaNaixement: json.provinciaNaixement,
      localitatNaixement: json.localitatNaixement,
      dni: json.dni,
      targetaSanitaria: json.targetaSanitaria,
      cip: json.cip,
      adrecaCompleta: json.adrecaCompleta,
      municipi: json.municipi,
      localitat: json.localitat,
      cp: json.cp,
      telefon: json.telefon,
      telefonFix: json.telefonFix,
      email: json.email,
      tutor: json.tutor,
      telefonTutor: json.telefonTutor,
      emailTutor: json.emailTutor,
      dniTutor: json.dniTutor,
      adrecaTutor: json.adrecaTutor,
      nacionalitatTutor: json.nacionalitatTutor

    }
  }
}
