import {Signatura} from "src/model/Signatura";
import {TipusDocumentPropietari} from "src/model/TipusDocumentPropietari";

export interface TipusDocument {
  id: string;
  nom: string;
  signatures: Array<Signatura>;
  propietari: string;
}
