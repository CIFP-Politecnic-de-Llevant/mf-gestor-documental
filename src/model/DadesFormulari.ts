export enum Ensenyament {
    FPGB = "FPGB",
    GM = "GM",
    GS = "GS"
}

export interface DadesFormulari {

    anyCurs?:string;
    nomAlumne?:string;
    llinatgesAlumne?:string;
    poblacio?:string;
    dni?:string;
    nExpedient?:string;
    menorEdat?:boolean;
    edat?:string;
    estudis?:string;
    cicleFormatiu?:string;
    grup?:string;
    duradaCicle?:string;
    totalHoresProposadesFct?:string;
    horesDiaries?:string;
    km?:string;
    periode?:string;
    dataInici?:string;
    dataFi?:string;
    dataAcabament?:string;
    tipusJornada?:string;
    horari?:string;
    nomTutor?:string;
    llinatgesTutor?:string;
    telefonTutor?:string;
    empresaNova?:boolean;
    empresaAdministracioPublica?:boolean;
    numeroConveni?:string;
    numeroAnnex?:string;
    nomEmpresa?:string;
    cif?:string;
    adrecaEmpresa?:string;
    cpempresa?:string;
    poblacioEmpresa?:string;
    telefonEmpresa?:string;
    nomLlocTreball?:string;
    adrecaLlocTreball?:string;
    cpLlocTreball?:string;
    poblacioLlocTreball?:string;
    telefonLlocTreball?:string;
    activitatLlocTreball?:string;
    nomCompletRepresentantLegal?:string;
    nifRepresentantLegal?:string;
    nomCompletTutorEmpresa?:string;
    nifTutorEmpresa?:string;
    nacionalitatTutorEmpresa?:string;
    municipiTutorEmpresa?:string;
    carrecTutorEmpresa?:string;
    emailEmpresa?:string;
    diaSeguimentCentreEducatiu?:string;
    horaSeguimentCentreEducatiu?:string;
    diaSeguimentResponsableFct?:string;
    horaSeguimentResponsableFct?:string;
    flexibilitzacioModulFct?:boolean;

}
