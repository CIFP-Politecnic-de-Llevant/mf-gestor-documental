import {TipusDocument} from "src/model/TipusDocument";
import {Usuari} from "src/model/Usuari";
import {Signatura} from "src/model/Signatura";

export interface Document {
  id: string;
  nomOriginal: string;
  id_googleDrive:string;
  tipusDocument?: TipusDocument;
  usuari?: Usuari;
  signatures?: Array<Signatura>;
}
