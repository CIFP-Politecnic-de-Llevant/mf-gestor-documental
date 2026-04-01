
export interface Convocatoria {
  id: number;
  nom: string;
  actual: boolean;
  pathDesti?: string;
  idCursAcademic?: number;
  pathOrigen?: string;
  isUnitatOrganitzativaOrigen?: boolean;
  isUnitatOrganitzativaDesti?: boolean;
}
