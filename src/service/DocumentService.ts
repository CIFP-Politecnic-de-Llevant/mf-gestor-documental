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
      const documentParts:string[] = document.nomOriginal.split("_");

      //Compromís seguiment flexibilització
      if(documentParts.length === 2){
          const cicle = documentParts[0];
          const nomDocument = documentParts[1];

        //Permisos
        const usuarisFetch = await axios.get(process.env.API + '/api/core/usuaris/tutorfct-by-codigrup/'+cicle);
        const usuarisData = usuarisFetch.data;

        const tutorsFCT:Usuari[] = usuarisData.map((usuari:any):Usuari=>{
          return UsuariService.fromJSONUsuari(usuari)
        }).sort();
        console.log("Tutor FCT",tutorsFCT);

        //Creem l'estructura de carpetes
        const carpetaRootFetch = await axios.post(process.env.API + '/api/gestordocumental/crear-carpeta',{
          folderName: FOLDER_BASE,
          email: email,
          parentFolderId: process.env.APP_SHAREDDRIVE_GESTORDOCUMENTAL
        });
        const carpetaRoot = carpetaRootFetch.data;

        const carpetaCicleFetch = await axios.post(process.env.API + '/api/gestordocumental/crear-carpeta',{
          path: FOLDER_BASE,
          folderName: cicle,
          email: email,
          editors:tutorsFCT.map(t=>t.email),
          parentFolderId: carpetaRoot.id
        });
        const carpetaCicle = carpetaCicleFetch.data;

        //Fer còpia
        const fitxerFetch = await axios.post(process.env.API + '/api/gestordocumental/copy',{
          idFile: document.id_googleDrive,
          email: email,
          filename: nomDocument,
          parentFolderId: carpetaCicle.id,
          originalName: document.nomOriginal
        });
        const fitxer = fitxerFetch.data;

        //Desem el fitxer
        await axios.post(process.env.API + '/api/gestordocumental/documents/crear-document',{
          idFile: document.id_googleDrive,
          path: `${FOLDER_BASE}/${cicle}/${nomDocument}`,
          email: email,
          tipus: nomDocument,
          originalName: document.nomOriginal
        });

      } else if(documentParts.length === 4){ //Altres documents associats a un alumne
        const cicle = documentParts[0];
        const cognoms = documentParts[1];
        const nom = documentParts[2];
        const nomDocument = documentParts[3];


        //Permisos
        const usuarisFetch = await axios.get(process.env.API + '/api/core/usuaris/tutorfct-by-codigrup/'+cicle);
        const usuarisData = usuarisFetch.data;

        const tutorsFCT:Usuari[] = usuarisData.map((usuari:any):Usuari=>{
          return UsuariService.fromJSONUsuari(usuari)
        }).sort();
        console.log("Tutor FCT",tutorsFCT);

        //Creem l'estructura de carpetes
        const carpetaRootFetch = await axios.post(process.env.API + '/api/gestordocumental/crear-carpeta',{
          folderName: FOLDER_BASE,
          email: email,
          parentFolderId: process.env.APP_SHAREDDRIVE_GESTORDOCUMENTAL
        });
        const carpetaRoot = carpetaRootFetch.data;

        const carpetaCicleFetch = await axios.post(process.env.API + '/api/gestordocumental/crear-carpeta',{
          folderName: cicle,
          email: email,
          parentFolderId: carpetaRoot.id
        });
        const carpetaCicle = carpetaCicleFetch.data;

        const carpetaAlumneFetch = await axios.post(process.env.API + '/api/gestordocumental/crear-carpeta',{
          folderName: cognoms+" "+nom,
          email: email,
          parentFolderId: carpetaCicle.id
        });
        const carpetaAlumne = carpetaAlumneFetch.data

        //Fer còpia
        const fitxerFetch = await axios.post(process.env.API + '/api/gestordocumental/copy',{
          idFile: document.id_googleDrive,
          email: email,
          filename: cognoms+" "+nom+"_" + nomDocument,
          parentFolderId: carpetaAlumne.id,
          originalName: document.nomOriginal
        });
        const fitxer = fitxerFetch.data;

        //Desem el fitxer
        await axios.post(process.env.API + '/api/gestordocumental/documents/crear-document',{
          idFile: document.id_googleDrive,
          path: `${FOLDER_BASE}/${cicle}/${cognoms} ${nom}/${cognoms} ${nom}_${nomDocument}`,
          email: email,
          tipus: nomDocument,
          originalName: document.nomOriginal
        });
      }
    }
  }

  static fromJSONDocument(json:any):Document{
    return {
      id: json.idDocument,
      nomOriginal: json.nomOriginal,
      id_googleDrive: json.idGoogleDrive
    }
  }

}
