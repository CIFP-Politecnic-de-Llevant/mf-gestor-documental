import {Usuari} from "src/model/Usuari";
import {Curs} from "src/model/Curs";

export interface Grup {
  id: number;
  coreId?: number;
  nom: string;
  tutor1?: Usuari;
  tutor2?: Usuari;
  tutor3?: Usuari;
  curs?: Curs;
  gestibCodi: string;
  pathGoogleDrive?: string;
  idGoogleSpreadSheet?: string;
}
