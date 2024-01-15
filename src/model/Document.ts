import {TipusDocument} from "src/model/TipusDocument";
import {Usuari} from "src/model/Usuari";

export interface Document {
  id: string;
  nomOriginal: string;
  id_googleDrive:string;
  tipusDocument: TipusDocument;
  usuari: Usuari;
}
