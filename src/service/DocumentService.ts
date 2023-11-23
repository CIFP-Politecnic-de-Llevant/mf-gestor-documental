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

  static async getDocumentsByPath(path:string,email:string):Promise<Array<Document>>{
    const response = await axios.post(process.env.API + '/api/gestordocumental/documents',{
      path: path,
      email: email
    });
    const data = await response.data;
    return data.map((document:any):Document=>{
      return this.fromJSONDocument(document)
    }).sort();
  }

  static async traspassarDocument(pathOrigen:string,email:string){
    const documents:Document[] = await this.getDocumentsByPath(pathOrigen,email);

    for(const document of documents){
      const documentParts:string[] = document.nom.split("_");

      //Compromís seguiment flexibilització
      if(documentParts.length === 2){
          const cicle = documentParts[0];
          const nomDocument = documentParts[1];


      } else if(documentParts.length === 4){
        const cicle = documentParts[0];
        const cognoms = documentParts[1];
        const nom = documentParts[2];
        const nomDocument = documentParts[3];

        //Creem l'estructura de carpetes
        await axios.post(process.env.API + '/api/gestordocumental/crear-carpeta',{
          path: "",
          folderName: "FCT JOAN RESOLT",
          email: email
        });

        await axios.post(process.env.API + '/api/gestordocumental/crear-carpeta',{
          path: "FCT JOAN RESOLT",
          folderName: cicle,
          email: email
        });

        await axios.post(process.env.API + '/api/gestordocumental/crear-carpeta',{
          path: `FCT JOAN RESOLT/${cicle}`,
          folderName: cognoms+" "+nom,
          email: email
        });

        //Permisos
        const usuarisFetch = await axios.get(process.env.API + '/api/core/usuaris/tutorfct-by-codigrup/'+cicle);
        const usuariData = usuarisFetch.data;
        const tutorFCT:Usuari = this.fromJSONUsuari(usuariData);
        console.log("Tutor FCT",tutorFCT);

        //Fer còpia
        await axios.post(process.env.API + '/api/gestordocumental/copy',{
          idFile: document.id_googleDrive,
          email: email,
          filename: nomDocument
        });
      }
    }

  }


  static fromJSONDocument(json:any):Document{
    return {
      id: json.idDocument,
      nom: json.nom,
      id_googleDrive: json.idGoogleDrive
    }
  }

  static fromJSONUsuari(json:any):Usuari{
    return {
      id: json.idusuari,
      email: json.gsuiteEmail,
      nomComplet: json.gsuiteFullName,
      value: json.gsuiteEmail,
      label: json.gsuiteFullName + ' <'+json.gsuiteEmail+'>'

    }
  }

}
