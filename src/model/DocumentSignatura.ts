import {TipusDocument} from "src/model/TipusDocument";
import {Usuari} from "src/model/Usuari";
import {Signatura} from "src/model/Signatura";

export interface DocumentSignatura {
  document: Document;
  signatura: Signatura;
  signat:boolean;
}
