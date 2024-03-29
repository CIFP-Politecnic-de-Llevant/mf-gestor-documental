import {axios}  from 'boot/axios'
import {Document} from "../model/Document";
import {Usuari} from "src/model/Usuari";
import {UsuariService} from "./UsuariService";
import {TipusDocumentService} from "src/service/TipusDocumentService";
import {SignaturaService} from "src/service/SignaturaService";
import {Signatura} from "src/model/Signatura";
import {FitxerBucket} from "src/model/google/FitxerBucket";
import {DocumentEstat} from "src/model/DocumentEstat";

export class DocumentService {

  static async getDocumentsByPath(path:string,email:string):Promise<Array<Document>>{
    const response = await axios.post(process.env.API + '/api/gestordocumental/documents',{
      path: path,
      email: email
    });
    const data = await response.data;
    return Promise.all(data.map((document:any):Promise<Document>=>{
      return this.fromJSONDocument(document)
    }).sort());
  }

  static async getDocumentsNoTraspassatsByPath(path:string,email:string):Promise<Array<Document>>{
    const response = await axios.post(process.env.API + '/api/gestordocumental/documents-no-traspassats',{
      path: path,
      email: email
    });
    const data = await response.data;
    return Promise.all(data.map((document:any):Promise<Document>=>{
      return this.fromJSONDocument(document)
    }).sort());
  }

  static async getDocumentsByGrupCodi(grupCodi:string):Promise<Array<Document>>{
    const response = await axios.get(process.env.API + '/api/gestordocumental/documents-grup/'+grupCodi);
    const data = await response.data;
    return Promise.all(data.map((document:any):Promise<Document>=>{
      return this.fromJSONDocument(document)
    }).sort());
  }

  static async getDocumentById(id:string):Promise<Document>{
    const response = await axios.get(process.env.API + '/api/gestordocumental/documents/'+id);
    const data = await response.data;
    return this.fromJSONDocument(data);
  }

  static async traspassarDocument(documents:Document[],email:string){
    const FOLDER_BASE:string = process.env.APP_DESTFOLDER_GESTORDOCUMENTAL!;

    //const documents:Document[] = await this.getDocumentsByPath(pathOrigen,email);

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
        //console.log("Tutor FCT",tutorsFCT);

        //Creem l'estructura de carpetes
        const carpetaRootFetch = await axios.post(process.env.API + '/api/gestordocumental/crear-carpeta',{
          folderName: FOLDER_BASE,
          email: email,
          parentFolderId: process.env.APP_SHAREDDRIVE_GESTORDOCUMENTAL
        });
        const carpetaRoot = carpetaRootFetch.data;

        const carpetaCicleFetch = await axios.post(process.env.API + '/api/gestordocumental/crear-carpeta',{
          //path: FOLDER_BASE,
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
          originalName: document.nomOriginal,
          tipusDocument: document.tipusDocument,
          codiGrup: cicle
        });

      } else if(documentParts.length === 5){ //Altres documents associats a un alumne
        const cicle = documentParts[0];
        const cognoms = documentParts[1];
        const nom = documentParts[2];
        const numExpedient = documentParts[3];
        const nomDocument = documentParts[4];


        //Permisos
        const usuarisFetch = await axios.get(process.env.API + '/api/core/usuaris/tutorfct-by-codigrup/'+cicle);
        const usuarisData = usuarisFetch.data;

        const tutorsFCT:Usuari[] = usuarisData.map((usuari:any):Usuari=>{
          return UsuariService.fromJSONUsuari(usuari)
        }).sort();
        //console.log("Tutor FCT",tutorsFCT);

        //Creem l'estructura de carpetes
        const carpetaRootFetch = await axios.post(process.env.API + '/api/gestordocumental/crear-carpeta',{
          folderName: FOLDER_BASE,
          email: email,
          parentFolderId: process.env.APP_SHAREDDRIVE_GESTORDOCUMENTAL
        });
        const carpetaRoot = carpetaRootFetch.data;

        const carpetaCicleFetch = await axios.post(process.env.API + '/api/gestordocumental/crear-carpeta',{
          //path: FOLDER_BASE,
          folderName: cicle,
          email: email,
          editors:tutorsFCT.map(t=>t.email),
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
          originalName: document.nomOriginal,
          tipusDocument: document.tipusDocument,
          usuari: document.usuari,
          codiGrup: cicle
        });
      }
    }
  }


  static async changeEstatDocument(document:Document,estat:string){
    const response = await axios.post(process.env.API + '/api/gestordocumental/document/canviarEstatDocument',{
      idDocument: document.id,
      estat: estat
    });
  }

  static async signarDocument(document:Document,signatura: Signatura, signat:boolean){
    const response = await axios.post(process.env.API + '/api/gestordocumental/document/signar',{
      idDocument: document.id,
      idSignatura: signatura.id,
      signat: signat
    });
  }

  static async saveDocumentExtra(document:Document, curs:string, tipusDocument:string, idusuari?:number):Promise<Document>{
    const response = await axios.post(process.env.API + '/api/gestordocumental/documents/saveDocumentExtra',{
      document: document,
      curs: curs,
      idusuari: idusuari,
      tipusDocument: tipusDocument
    });
    return this.fromJSONDocument(response.data);
  }

  static async uploadDocument(document:Document){
    console.log("Upload document",document)
    if(document.file) {
      const formData = new FormData();
      formData.append("arxiu", document.file);
      formData.append("id", document.id);

      const response = await axios.post(
        process.env.API + "/api/gestordocumental/document/uploadFile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          withCredentials: true,
        }
      );
    }
  }

  static async getURLFitxerDocument(document:Document):Promise<null | FitxerBucket>{
    let fitxerResolucio:FitxerBucket|null = null;
    if(document.fitxer){
      const f: any = await axios.get(process.env.API + '/api/core/fitxerbucket/' + document.fitxer.id);
      const fitxerBucket: FitxerBucket = f.data;
      if (fitxerBucket){
        const url: any = await axios.post(process.env.API + '/api/core/googlestorage/generate-signed-url', fitxerBucket);
        fitxerBucket.url = url.data;

        fitxerResolucio = fitxerBucket;
      }
    }
    return fitxerResolucio;
  }

  static fromJSONDocument(json:any):Promise<Document>{
    console.log(json)
    return new Promise((resolve,reject)=>{
      const document: Document = {
        id: json.idDocument,
        nomOriginal: json.nomOriginal,
        id_googleDrive: json.idGoogleDrive,
        documentEstat: json.estat,
        tipusDocument: (json.tipusDocument)?TipusDocumentService.fromJSON(json.tipusDocument):undefined,
        documentSignatures: (json.documentSignatures)?json.documentSignatures.map((documentSignatura:any):any=>{
          console.log(documentSignatura)
          return {
            document: documentSignatura.document,
            signatura: SignaturaService.fromJSON(documentSignatura.signatura),
            signat: documentSignatura.signat
          }
        }):undefined
      }

      if(json.idFitxer){
        console.log(json.idFitxer);
        const fitxerBucket:FitxerBucket = {
          id: json.idFitxer,
          nom: "",
          path: "",
          bucket: ""
        }
        document.fitxer = fitxerBucket;
      }

      if(json.idUsuari) {
        const usuari: Promise<Usuari> = UsuariService.getById(json.idUsuari);
        usuari.then((usuari: Usuari) => {
          document.usuari = usuari;
          resolve(document);
        });
      } else {
        resolve(document);
      }

    });
  }

}
