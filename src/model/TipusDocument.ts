import {Signatura} from "src/model/Signatura";

export interface TipusDocument {
  id: string;
  nom: string;
  signatures: Array<Signatura>;
}
