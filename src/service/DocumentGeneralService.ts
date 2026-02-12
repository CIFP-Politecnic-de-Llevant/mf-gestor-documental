import axios from "axios";
import { DocumentGeneral } from "src/model/DocumentGeneral";

export class DocumentGeneralService {
  static async findAll(): Promise<Array<DocumentGeneral>> {
    const response = await axios.get(process.env.API + `/api/gestordocumental/document-general`);
    return response.data;
  }

  static async create(documentGeneral: DocumentGeneral): Promise<void> {
    await axios.post(process.env.API + `/api/gestordocumental/document-general`, documentGeneral);
  }

  static async update(oldIdGoogleDrive: string, documentGeneral: DocumentGeneral): Promise<void> {
    await axios.put(
      process.env.API + `/api/gestordocumental/document-general/${encodeURIComponent(oldIdGoogleDrive)}`,
      documentGeneral
    );
  }

  static async delete(idGoogleDrive: string): Promise<void> {
    await axios.delete(process.env.API + `/api/gestordocumental/document-general/${encodeURIComponent(idGoogleDrive)}`);
  }
}
