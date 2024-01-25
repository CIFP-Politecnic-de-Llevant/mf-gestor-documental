import {TipusDocument} from "src/model/TipusDocument";
import {Usuari} from "src/model/Usuari";
import {DocumentSignatura} from "src/model/DocumentSignatura";
import {FitxerBucket} from "src/model/google/FitxerBucket";

export interface Document {
  id: string;
  nomOriginal: string;
  id_googleDrive:string;
  tipusDocument?: TipusDocument;
  usuari?: Usuari;
  documentSignatures: Array<DocumentSignatura>;
  file?: File;
  fitxer?: FitxerBucket;
}
