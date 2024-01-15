import {axios}  from 'boot/axios'
import {Curs} from "src/model/Curs";
import {TipusDocument} from "src/model/TipusDocument";
import {SignaturaService} from "src/service/SignaturaService";

export class TipusDocumentService {

  static async findAllTipusDocument(): Promise<Array<TipusDocument>> {
    const response = await axios.get(process.env.API + '/api/gestordocumental/tipusdocument/list');
    const data = await response.data;
    return data.map((tipusDocument: any): TipusDocument => {
      return this.fromJSON(tipusDocument);
    }).sort((a: TipusDocument, b: TipusDocument) => a.nom.localeCompare(b.nom));
  }

  static fromJSON(json: any): TipusDocument {
    return {
      id: json.idTipusDocument,
      nom: json.nom,
      signatures: json.signatures.map((signatura: any): any => {
        return SignaturaService.fromJSON(signatura)
      }).sort((a: any, b: any) => a.nom.localeCompare(b.nom))
    }
  }
}
