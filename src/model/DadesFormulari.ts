export enum Ensenyament {
    FPGB = "FPGB",
    GM = "GM",
    GS = "GS"
}

export interface DadesFormulari {

    anyCurs?:string;
    nomAlumne?:string;
    llinatgesAlumne?:string;
    poblacioAlumne?:string;
    dniAlumne?:string;
    telefonAlumne?:string;
    emailAlumne?:string;
    numeroExpedient?:string;
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
    emailTutor?:string;
    empresaNova?:boolean;
    empresaAdministracioPublica?:boolean;
    numeroConveni?:string;
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
    nomRepresentantLegal?:string;
    cognomsRepresentantLegal?:string;
    nifRepresentantLegal?:string;
    nomCompletTutorEmpresa?:string;
    nomTutorEmpresa?:string;
    cognomsTutorEmpresa?:string;
    nifTutorEmpresa?:string;
    nacionalitatTutorEmpresa?:string;
    municipiTutorEmpresa?:string;
    carrecTutorEmpresa?:string;
    emailEmpresa?:string;
    telefonTutorEmpresa?:string;
    emailTutorEmpresa?:string;
    diaSeguimentCentreEducatiu?:string;
    horaSeguimentCentreEducatiu?:string;
    diaSeguimentResponsableFct?:string;
    horaSeguimentResponsableFct?:string;
    flexibilitzacioModulFct?:boolean;
    isMesuresEducatives?:boolean;
    mesuresEducativesDescripcio?:string;
    isAutoritzacioExtraordinaria?:boolean;
    motiu?:string;

}
