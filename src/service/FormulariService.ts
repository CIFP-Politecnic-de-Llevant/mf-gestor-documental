import {axios}  from 'boot/axios'
import {Formulari} from "src/model/Formulari";

export class FormulariService {

  static async getFormularis(): Promise<Array<Formulari>> {
    const response = await axios.get(process.env.API + '/api/gestordocumental/formulari/llistat');
    const data = await response.data;
    return data.map((formulari:any):Formulari=>{
        return this.fromJSON(formulari);
    });
  }

  static fromJSON(json:any):Formulari{
    return {
      id: json.id,
      activitatLlocTreball: json.activitatLlocTreball,
      adrecaEmpresa: json.adrecaEmpresa,
      adrecaLlocTreball: json.adrecaLlocTreball,
      anyCurs: json.anyCurs,
      carrecTutorEmpresa: json.carrecTutorEmpresa,
      cicleFormatiu: json.cicleFormatiu,
      cif: json.cif,
      cpLlocTreball: json.cpLlocTreball,
      cpempresa: json.cpempresa,
      dataAcabament: json.dataAcabament,
      dataFi: json.dataFi,
      dataInici: json.dataInici,
      diaSeguimentCentreEducatiu: json.diaSeguimentCentreEducatiu,
      diaSeguimentResponsableFct: json.diaSeguimentResponsableFct,
      dni: json.dni,
      duradaCicle: json.duradaCicle,
      edat: json.edat,
      emailEmpresa: json.emailEmpresa,
      empresaAdministracioPublica: json.empresaAdministracioPublica,
      empresaNova: json.empresaNova,
      estudis: json.estudis,
      flexibilitzacioModulFct: json.flexibilitzacioModulFct,
      grup: json.grup,
      horaSeguimentCentreEducatiu: json.horaSeguimentCentreEducatiu,
      horaSeguimentResponsableFct: json.horaSeguimentResponsableFct,
      horari: json.horari,
      horesDiaries: json.horesDiaries,
      km: json.km,
      llinatgesAlumne: json.llinatgesAlumne,
      llinatgesTutor: json.llinatgesTutor,
      menorEdat: json.menorEdat,
      municipiTutorEmpresa: json.municipiTutorEmpresa,
      numeroExpedient: json.numeroExpedient,
      nacionalitatTutorEmpresa: json.nacionalitatTutorEmpresa,
      nifRepresentantLegal: json.nifRepresentantLegal,
      nifTutorEmpresa: json.nifTutorEmpresa,
      nomAlumne: json.nomAlumne,
      nomCompletRepresentantLegal: json.nomCompletRepresentantLegal,
      nomCompletTutorEmpresa: json.nomCompletTutorEmpresa,
      nomEmpresa: json.nomEmpresa,
      nomLlocTreball: json.nomLlocTreball,
      nomTutor: json.nomTutor,
      numeroAnnex: json.numeroAnnex,
      numeroConveni: json.numeroConveni,
      periode: json.periode,
      poblacio: json.poblacio,
      poblacioEmpresa: json.poblacioEmpresa,
      poblacioLlocTreball: json.poblacioLlocTreball,
      telefonEmpresa: json.telefonEmpresa,
      telefonLlocTreball: json.telefonLlocTreball,
      telefonTutor: json.telefonTutor,
      tipusJornada: json.tipusJornada,
      totalHoresProposadesFct: json.totalHoresProposadesFct
    }
  }
}
