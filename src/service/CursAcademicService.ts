import {axios} from 'boot/axios'
import {CursAcademic} from "src/model/CursAcademic";

export class CursAcademicService {

  static async getCursAcademicActual(): Promise<CursAcademic | null> {
    const response = await axios.get(process.env.API + '/api/core/cursAcademic/actual');
    const cursAcademic = response.data;

    if (!cursAcademic) {
      return null;
    }

    return this.fromJson(cursAcademic);
  }

  static async getCursAcademicActualNom(): Promise<string> {
    const cursAcademic = await this.getCursAcademicActual();
    return cursAcademic?.nom || '';
  }

  static async getAllCursosAcademics(): Promise<CursAcademic[]> {
    const response = await axios.get(process.env.API + '/api/core/cursAcademic/findAll');
    return response.data
      .map((cursAcademic: CursAcademic) => this.fromJson(cursAcademic))
      .sort((a: CursAcademic, b: CursAcademic) => b.nom.localeCompare(a.nom));
  }

  static async getAllCursAcademicNoms(): Promise<string[]> {
    const cursosAcademics = await this.getAllCursosAcademics();
    return cursosAcademics.map((cursAcademic: CursAcademic) => cursAcademic.nom);
  }

  static async save(cursAcademic: CursAcademic): Promise<CursAcademic> {
    const response = await axios.post(process.env.API + '/api/core/cursAcademic/desa', cursAcademic);
    return this.fromJson(response.data);
  }

  static fromJson(json: CursAcademic): CursAcademic {
    return {
      idcursAcademic: json.idcursAcademic,
      nom: json.nom,
      actual: json.actual
    };
  }

}
