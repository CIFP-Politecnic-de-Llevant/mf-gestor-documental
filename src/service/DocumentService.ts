import {axios}  from 'boot/axios'
import {Document} from "../model/Document";
import {Usuari} from "src/model/Usuari";
import {UsuariService} from "./UsuariService";

export class DocumentService {

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
    const FOLDER_BASE:string = "FCT JOAN RESOLT";

    const documents:Document[] = await this.getDocumentsByPath(pathOrigen,email);

    for(const document of documents){
      const documentParts:string[] = document.nom.split("_");

      //Compromís seguiment flexibilització
      if(documentParts.length === 2){
          const cicle = documentParts[0];
          const nomDocument = documentParts[1];

        //Creem l'estructura de carpetes
        await axios.post(process.env.API + '/api/gestordocumental/crear-carpeta',{
          path: "",
          folderName: FOLDER_BASE,
          email: email
        });

        const carpetaCicleFetch = await axios.post(process.env.API + '/api/gestordocumental/crear-carpeta',{
          path: FOLDER_BASE,
          folderName: cicle,
          email: email
        });
        const carpetaCicle = carpetaCicleFetch.data;

        //Permisos
        const usuarisFetch = await axios.get(process.env.API + '/api/core/usuaris/tutorfct-by-codigrup/'+cicle);
        const usuarisData = usuarisFetch.data;

        const tutorsFCT:Usuari[] = usuarisData.map((usuari:any):Usuari=>{
          return UsuariService.fromJSONUsuari(usuari)
        }).sort();
        console.log("Tutor FCT",tutorsFCT);

        //Fer còpia
        await axios.post(process.env.API + '/api/gestordocumental/copy',{
          idFile: document.id_googleDrive,
          email: email,
          filename: nomDocument,
          parentFolderId: carpetaCicle.id
        });

      } else if(documentParts.length === 4){ //Altres documents associats a un alumne
        const cicle = documentParts[0];
        const cognoms = documentParts[1];
        const nom = documentParts[2];
        const nomDocument = documentParts[3];

        //Creem l'estructura de carpetes
        await axios.post(process.env.API + '/api/gestordocumental/crear-carpeta',{
          path: "",
          folderName: FOLDER_BASE,
          email: email
        });

        await axios.post(process.env.API + '/api/gestordocumental/crear-carpeta',{
          path: FOLDER_BASE,
          folderName: cicle,
          email: email
        });

        const carpetaAlumneFetch = await axios.post(process.env.API + '/api/gestordocumental/crear-carpeta',{
          path: `${FOLDER_BASE}/${cicle}`,
          folderName: cognoms+" "+nom,
          email: email
        });
        const carpetaAlumne = carpetaAlumneFetch.data
        console.log("Carpeta alumne",carpetaAlumne)


        //Permisos
        const usuarisFetch = await axios.get(process.env.API + '/api/core/usuaris/tutorfct-by-codigrup/'+cicle);
        const usuarisData = usuarisFetch.data;

        const tutorsFCT:Usuari[] = usuarisData.map((usuari:any):Usuari=>{
          return UsuariService.fromJSONUsuari(usuari)
        }).sort();
        console.log("Tutor FCT",tutorsFCT);

        //Fer còpia
        await axios.post(process.env.API + '/api/gestordocumental/copy',{
          idFile: document.id_googleDrive,
          email: email,
          filename: cognoms+" "+nom+"_" + nomDocument,
          parentFolderId: carpetaAlumne.id
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

}
