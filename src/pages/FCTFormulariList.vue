<script setup lang="ts">
import {onMounted, Ref, ref} from "vue";
import {FormulariService} from "src/service/FormulariService";
import {Formulari} from "src/model/Formulari";
import {QTableColumn} from "quasar";

const formularis:Ref<Formulari[]> = ref([] as Formulari[]);

/*
  id:string;
  anyCurs:string;
  nomAlumne:string;
  llinatgesAlumne:string;
  poblacio:string;
  dni:string;
  menorEdat:string;
  edat:string;
  estudis:string;
  cicleFormatiu:string;
  grup:string;
  duradaCicle:string;
  totalHoresProposadesFct:string;
  horesDiaries:string;
  km:string;
  periode:string;
  dataInici:string;
  dataFi:string;
  dataAcabament:string;
  tipusJornada:string;
  horari:string;
  nomTutor:string;
  llinatgesTutor:string;
  telefonTutor:string;
  empresaNova:string;
  empresaAdministracioPublica:string;
  numeroConveni:string;
  numeroAnnex:string;
  nomEmpresa:string;
  cif:string;
  adrecaEmpresa:string;
  cpempresa:string;
  poblacioEmpresa:string;
  telefonEmpresa:string;
  nomLlocTreball:string;
  adrecaLlocTreball:string;
  cpLlocTreball:string;
  poblacioLlocTreball:string;
  telefonLlocTreball:string;
  activitatLlocTreball:string;
  nomCompletRepresentantLegal:string;
  nifRepresentantLegal:string;
  nomCompletTutorEmpresa:string;
  nifTutorEmpresa:string;
  nacionalitatTutorEmpresa:string;
  municipiTutorEmpresa:string;
  carrecTutorEmpresa:string;
  emailEmpresa:string;
  diaSeguimentCentreEducatiu:string;
  horaSeguimentCentreEducatiu:string;
  diaSeguimentResponsableFct:string;
  horaSeguimentResponsableFct:string;
  flexibilitzacioModulFct:string;
  nExpedient:string;
 */
const columns:QTableColumn[] = [] as QTableColumn[];
columns.push({
  name:'nomAlumne',
  label:'Nom Alumne',
  field: row => row.nomAlumne,
  sortable: true
});

columns.push({
  name:'llinatgesAlumne',
  label:'Llinatges Alumne',
  field: row => row.llinatgesAlumne,
  sortable: true

});

columns.push({
  name:'dni',
  label:'DNI',
  field: row => row.dni,
  sortable: true

});

columns.push({
  name:'menorEdat',
  label:'Menor Edat',
  field: row => row.menorEdat,
  sortable: true
});

columns.push({
  name:'edat',
  label:'Edat',
  field: row => row.edat,
  sortable: true
});

columns.push({
  name:'estudis',
  label:'Estudis',
  field: row => row.estudis,
  sortable: true
});

columns.push({
  name:'cicleFormatiu',
  label:'Cicle Formatiu',
  field: row => row.cicleFormatiu,
  sortable: true
});

columns.push({
  name:'grup',
  label:'Grup',
  field: row => row.grup,
  sortable: true
});

columns.push({
  name:'duradaCicle',
  label:'Durada Cicle',
  field: row => row.duradaCicle,
  sortable: true
});

columns.push({
  name:'totalHoresProposadesFct',
  label:'Total Hores Proposades FCT',
  field: row => row.totalHoresProposadesFct,
  sortable: true

});

onMounted(async ()=>{
  formularis.value = await FormulariService.getFormularis();
})
</script>

<template>
  <q-page padding>
    <q-btn class="q-mb-lg" icon="add" to="/fct/formulari/form" label="Nou formulari" color="primary"/>
    <q-table
      flat bordered
      title="Documents del grup"
      :rows="formularis"
      :columns="columns"
      row-key="name"
      binary-state-sort
      class="q-mb-lg"
    />
  </q-page>
</template>

<style scoped>

</style>
