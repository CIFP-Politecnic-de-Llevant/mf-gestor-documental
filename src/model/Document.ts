import {TipusDocument} from "src/model/TipusDocument";
import {Usuari} from "src/model/Usuari";
import {DocumentSignatura} from "src/model/DocumentSignatura";
import {FitxerBucket} from "src/model/google/FitxerBucket";
import {DocumentEstat} from "src/model/DocumentEstat";

export interface Document {
  id: string;
  nomOriginal: string;
  id_googleDrive:string;
  documentEstat: string;
  tipusDocument?: TipusDocument;
  usuari?: Usuari;
  documentSignatures: Array<DocumentSignatura>;
  file?: File;
  fitxer?: FitxerBucket;
}
