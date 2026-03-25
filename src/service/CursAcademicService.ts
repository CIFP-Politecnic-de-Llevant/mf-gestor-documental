import {axios} from 'boot/axios'

export class CursAcademicService {

  static async getCursAcademicActualNom(): Promise<string> {
    const response = await axios.get(process.env.API + '/api/core/cursAcademic/actual');
    return response.data.nom;
  }

  static async getAllCursAcademicNoms(): Promise<string[]> {
    const response = await axios.get(process.env.API + '/api/core/cursAcademic/findAll');
    return response.data
      .map((cursAcademic: { nom: string }) => cursAcademic.nom)
      .sort((a: string, b: string) => b.localeCompare(a));
  }

}
