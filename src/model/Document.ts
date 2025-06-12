import {TipusDocument} from "src/model/TipusDocument";
import {Usuari} from "src/model/Usuari";
import {FitxerBucket} from "src/model/google/FitxerBucket";

export interface Document {
  id: string;
  nomOriginal: string;
  id_googleDrive:string;
  documentEstat: string;
  observacions: string;
  tipusDocument?: TipusDocument;
  visibilitat: boolean;
  usuari?: Usuari;
  file?: File;
  fitxer?: FitxerBucket;
}
