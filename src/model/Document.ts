import {TipusDocument} from "src/model/TipusDocument";
import {Usuari} from "src/model/Usuari";
import {Signatura} from "src/model/Signatura";
import {DocumentSignatura} from "src/model/DocumentSignatura";

export interface Document {
  id: string;
  nomOriginal: string;
  id_googleDrive:string;
  tipusDocument?: TipusDocument;
  usuari?: Usuari;
  documentSignatures: Array<DocumentSignatura>;
}
