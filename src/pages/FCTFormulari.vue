
<template>
  <q-page padding>
    <div class="row flex">
      <div class="col-md-3">
        <p class="text-h5 q-mt-lg">Formulari - Dades FCT</p>
      </div>
      <div class="row col-md-8 q-mt-xs">
        <p class="q-pt-lg q-mr-sm text-apartat">Curs Escolar: </p>
        <q-input placeholder="23/24" dense class="q-pt-sm q-mt-xs" color="primary" v-model="formData.anyCurs" label="      " />
      </div>
    </div>
   <div class="border">
    <q-form>
      <div class="bg-primary border-bottom">
          <p class="text-apartat text-center col-md-12 q-pt-md text-wrap-center">Dades de l'alumne</p>
      </div>

        <q-btn-dropdown class="q-mt-md q-mr-md q-ml-sm" color="primary" label="Alumne" menu-self="top middle">
            <q-list>
                <q-item v-for="student in allStudents" clickable v-close-popup @click="selectStudent(student)">
                    <q-item-section>
                        <q-item-label>{{student.nom}} {{student.cognom1}} {{student.cognom2}}</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-btn-dropdown>
      <div class="row flex justify-center q-mt-sm q-gutter-y-md">
        <div class="col-md-4" v-for="(value,key,index) in formData" :key="key" v-show="dadesAlumne.includes(labels[index])">
          <q-input
              v-if="key !== 'menorEdat' && key !== 'estudis' && key !== 'cicleFormatiu'
              && key !== 'grup' && key !== 'duradaCicle' && key !== 'periode' && key !== 'tipusJornada'"
              class="q-pa-sm"
              outlined
              :type="key === 'dataInici'? 'date':'text' && key === 'dataFi'? 'date':'text' && key === 'dataAcabament'? 'date':'text'"
              :label="labels[index]"
              v-model="formData[key]"
              :model-value="formData[key]"
              @change="key === 'dataInici'? ageCalculate(formData[key]) : ''"
          />
          <q-select
              v-if="key === 'cicleFormatiu' || key === 'grup'"
              outlined
              class="q-pa-sm"
              v-model="formData[key]"
              :options= "key === 'cicleFormatiu'? ciclesFormatius : allNomGrups"
              :label="labels[index]"
          />
          <div
              class=" q-pl-sm"
              v-if="key === 'menorEdat' || key === 'estudis'
               || key === 'duradaCicle' || key === 'periode'
               || key === 'estudis'">
              <p class="q-pt-sm q-pr-sm q-pl-sm q-mb-none ">{{labels[index]}}</p>
              <div class="q-gutter-sm " v-if="key === 'menorEdat'">
                  <q-radio size="sm" v-model="formData[key]" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="true" label="Si" />
                  <q-radio size="sm" v-model="formData[key]" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="false" label="No" />
              </div>
              <div class="q-gutter-sm" v-else-if="key === 'estudis'">
                <q-radio size="sm" v-model="formData[key]" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="FP Bàsica" label="FP Bàsica" />
                <q-radio size="sm" v-model="formData[key]" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="CF Grau Mitjà" label="CF Grau Mitjà" />
                <q-radio size="sm" v-model="formData[key]" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="CF Grau Superior" label="CF Grau Superior" />
              </div>
              <div class="q-gutter-sm" v-else-if="key === 'duradaCicle'">
                <q-radio size="sm" v-model="formData[key]" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="1 any" label="1 any" />
                <q-radio size="sm" v-model="formData[key]" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="2 anys" label="2 anys" />
              </div>
              <div class="q-gutter-sm" v-else-if="key === 'periode'">
                <q-radio size="sm" v-model="formData[key]" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="Ordinari" label="Ordinari" />
                <q-radio size="sm" v-model="formData[key]" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="No ordinari" label="No ordinari" />
              </div>
              <div class="q-gutter-sm" v-else-if="key === 'periode'">
                <q-radio size="sm" v-model="formData[key]" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="Continuada" label="Continuada" />
                <q-radio size="sm" v-model="formData[key]" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="Partida" label="Partida" />
                <q-radio size="sm" v-model="formData[key]" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="Continuada i Partida" label="Continuada i Partida" />
              </div>
          </div>
        </div>
        <div class="col-md-4"></div>
        <div class="col-md-4"></div>
      </div>
      <div class="bg-primary border-bot-top q-mt-md">
          <p class="text-apartat text-center col-md-12 q-pt-md text-wrap-center">Dades del professor-tutor</p>
      </div>
      <div class="row flex justify-center q-mt-sm q-gutter-y-md">
        <div class="col-md-4" v-for="(value,key,index) in formData" :key="key" v-show="dadesTutor.includes(labels[index])">
          <q-input
              class="q-pa-sm"
              outlined
              type="text"
              :label="labels[index]"
              v-model="formData[key]"
              :model-value="formData[key]"
          />
        </div>
        <div class="col-md-4"></div>
      </div>
      <div class="bg-primary border-bot-top q-mt-md">
          <p class="text-apartat text-center col-md-12 q-pt-md text-wrap-center">Dades empresa</p>
      </div>
      <q-btn-dropdown class="q-mt-md q-mr-md q-ml-sm" color="primary" label="Empresa">
        <q-list>
          <q-item v-for="company in allCompanies" clickable v-close-popup @click="selectCompany(company)">
            <q-item-section>
              <q-item-label>{{company.nom}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
        <q-btn-dropdown class="q-mt-md q-mr-md q-ml-sm" color="primary" label="Lloc de treball" v-if="companySelected">
        <q-list>
          <q-item v-for="workspace in allCompanyWorkspace" clickable v-close-popup @click="selectWorkspace(workspace)">
            <q-item-section>
              <q-item-label>{{workspace.nom}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <div class="row flex justify-center q-mt-sm q-gutter-y-md">
        <div class="col-md-4" v-for="(value,key,index) in formData" :key="key" v-show=" dadesEmpresa.includes(labels[index])">
          <q-input
              v-if="key !== 'empresaNova' && key !== 'empresaAdministracioPublica'"
              class="q-pa-sm"
              outlined
              :readonly="readOnlyConditionCompany(key)"
              :bg-color="readOnlyConditionCompany(key) ? 'primary' : ''"
              type="text"
              :label="labels[index]"
              v-model="formData[key]"
              :model-value="formData[key]"
          />
          <div class="col-md-4 q-pl-sm" v-if="key === 'empresaNova' || key === 'empresaAdministracioPublica'">
              <p class="q-pt-sm q-pr-sm q-pl-sm q-mb-none ">{{labels[index]}}</p>
              <div class="q-gutter-sm ">
                  <q-radio size="sm" v-model="formData[key]" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="true" label="Si" />
                  <q-radio size="sm" v-model="formData[key]" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="false" label="No" />
              </div>
          </div>
        </div>
        <p class="text-apartat text-center col-md-12 q-pt-md text-wrap-center">Lloc de treball</p>
        <div class="col-md-4" v-for="(value,key,index) in formData" :key="key" v-show=" dadesLlocTreball.includes(labels[index])">
        <q-input
            class="q-pa-sm"
            outlined
            :readonly="readOnlyConditionCompany(key)"
            :bg-color="readOnlyConditionCompany(key) ? 'primary' : ''"
            type="text"
            :label="labels[index]"
            v-model="formData[key]"
            :model-value="formData[key]"
        />
      </div>
        <div class="col-md-4"></div>
        <div class="col-md-4"></div>
      </div>
      <div class="bg-primary border-bot-top q-mt-md">
          <p class="text-apartat text-center col-md-12 q-pt-md text-wrap-center">Altres informacions</p>
      </div>
      <div class="row flex justify-center q-mt-sm q-gutter-y-md">
        <div class="col-md-4" v-for="(value,key,index) in formData" :key="key" v-show="dadesAltresInformacions.includes(labels[index])">
          <q-input
              v-if="key !== 'diaSeguimentCentreEducatiu' && key !== 'diaSeguimentResponsableFct'"
              class="q-pa-sm"
              outlined
              type="text"
              :label="labels[index]"
              v-model="formData[key]"
              :model-value="formData[key]"
          />
          <q-select
              v-if="key === 'diaSeguimentCentreEducatiu' || key === 'diaSeguimentResponsableFct'"
              outlined
              class="q-pa-sm"
              v-model="formData[key]"
              :options= "['Dilluns','Dimarts','Dimecres','Dijous','Divendres']"
              :label="labels[index]"
          />
        </div>
        <div class="col-md-4"></div>
        <div class="col-md-4"></div>
      </div>
      <div class="bg-primary border-bot-top q-mt-md">
          <p class="text-apartat text-center col-md-12 q-pt-md text-wrap-center">Flexibilització en el mòdul FCT</p>
      </div>
      <div class="row flex justify-center q-my-sm q-gutter-y-md">
          <div class="col-md-4  q-pl-sm">
              <p class="q-pt-sm q-pr-sm q-pl-sm q-mb-none ">Hi ha algun tipus de flexibilització en el mòdul de FCT?</p>
              <div class="q-gutter-sm ">
                  <q-radio v-model="formData.flexibilitzacioModulFct" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="true" label="Si" />
                  <q-radio v-model="formData.flexibilitzacioModulFct" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="false" label="No" />
              </div>
          </div>
        <div class="col-md-4"></div>
        <div class="col-md-4"></div>
      </div>
    </q-form>
   </div>
      <div class="flex justify-end q-gutter-sm q-mt-md">
          <q-btn label="Guardar" type="submit" @click="saveForm" color="primary"/>
      </div>
  </q-page>
</template>
<script setup lang="ts">


import {computed, onMounted, ref, Ref} from "vue";
import {Alumne} from "src/model/Alumne";
import {Empresa} from "src/model/Empresa";
import {UsuariService} from "src/service/UsuariService";
import {EmpresaService} from "src/service/EmpresaService";
import {DadesFormulari} from "src/model/DadesFormulari";
import {Grup} from "src/model/Grup";
import {GrupService} from "src/service/GrupService";
import {date} from "quasar";
import formatDate = date.formatDate;
import {LlocTreball} from "src/model/LlocTreball";
import {Usuari} from "src/model/Usuari";
import {DocumentService} from "src/service/DocumentService";

const companySelected:Ref<boolean> = ref(false);
const studentSelect:Ref<Alumne> = ref({} as Alumne);
const companySelect:Ref<Empresa> = ref({} as Empresa);
const allStudents:Ref<Alumne[]> = ref([] as Alumne[]);
const allCompanies:Ref<Empresa[]> = ref([] as Empresa[]);
const allCompanyWorkspace:Ref<LlocTreball[]> = ref([] as LlocTreball[]);
const allGrups:Ref<Grup[]> = ref([] as Grup[]);
const tutorFCT:Ref<Usuari> = ref({} as Usuari);
const unselectStudent:Ref<Alumne[]> = ref(allStudents);
const readOnlyConditionCompany = computed(() => {

  return (key:string) => key === 'cif' || key === 'adrecaEmpresa' || key === 'nomEmpresa' || key === 'nomRepresentantLegal'

})
const allNomGrups = ['TMV11B', 'COM11B', 'COM21B', 'TMV21B', 'TMV22B', 'TMV22D', 'ADG21B', 'ELE21B', 'IFC21B',
  'IFC21D', 'ADG32B', 'IFC31B', 'ADG31B', 'TMV31B', 'IFC33B', 'COM33B', 'COM31B'];

const formData: Ref<DadesFormulari> = ref({ anyCurs: '', nomAlumne: '', llinatgesAlumne: '', poblacio: '',
  dni: '', nExpedient: '', menorEdat: undefined, edat: '', estudis: '', cicleFormatiu: '', grup: '', duradaCicle: '',
  totalHoresProposadesFct: '', horesDiaries: '', km: '', periode: '', dataInici: '', dataFi: '', dataAcabament: '',
  tipusJornada: '', horari: '', nomTutor: '', llinatgesTutor: '', telefonTutor: '', empresaNova: undefined,
  empresaAdministracioPublica: undefined, numeroConveni: '', numeroAnnex: '', nomEmpresa: '', cif: '', adrecaEmpresa: '',
  cpempresa: '', poblacioEmpresa: '', telefonEmpresa: '', nomLlocTreball: '', adrecaLlocTreball: '', cpLlocTreball: '',
  poblacioLlocTreball: '', telefonLlocTreball: '', activitatLlocTreball: '', nomRepresentantLegal: '',
  nifRepresentantLegal: '', nomTutorEmpresa: '', nifTutorEmpresa: '', nacionalitatTutorEmpresa: '',
  municipiTutorEmpresa: '', carrecTutorEmpresa: '', emailEmrpesa: '', diaSeguimentCentreEducatiu: '', horaSeguimentCentreEducatiu: '',
  diaSeguimentResponsableFct: '', horaSeguimentResponsableFct: '', flexibilitzacioModulFct: undefined,
});

const ciclesFormatius = ['FP Bàsica Manteniment de vehicles', 'FP Bàsica Serveis Comercials', 'CFGM Activitats comercials',
  'CFGM Carroseria', 'CFGM Electromecànica de vehicles', 'CFGM Gestió Administrativa', 'CFGM Instal·lacions elèctriques i automàtiques',
  'CFGM Sistemes microinformàtics i xarxes', 'CFGS Administració i finances', 'CFGS Administració de sistemes informàtics',
  'CFGS Assistència a la Direcció', 'CFGS Automoció', 'CFGS Desenvolupament d\'aplicacions web', 'CFGS Gestió de Vendes i Espais Comercials',
  'CFGS Màrketing i publicitat'
];
const labels = ["Curs Escolar","Nom alumne","Llinatges alumne","Població","DNI","Nombre expedient",
  "Es menor d'edat en el moment de començar la FCT? ","Edat de l'alumne (només número)","Estudis",
  "Cicle Formatiu","Grup","Durada del cicle", "Número d'hores totals proposades per FCT (només número)",
  "Número d'hores diàries (només número)","Km centre treball-població alumne (només número)","Període",
  "Data inicial","Data final","Data màxima acabament","Tipus de jornada","Horari(Exemple jornada partida: 8.00-12:00 15:00-18:00)","Nom tutor","Llinatges tutor",
  "Telèfon mòbil","És una empresa nova?","És una empresa de l'Administració Pública?","Número de conveni",
  "Número d'annex","Nom de l'empresa","CIF","Adreça","Còdig postal","Població","Telèfon","Nom Centre de treball",
  "Adreça Centre de treball","Còdig postal Centre de treball","Població Centre de treball","Telèfon Centre de treball",
  "Activitat Centre de treball","Nom representant legal","NIF representant legal", "Nom tutor empresa",
  "NIF tutor empresa","Nacionalitat tutor empresa", "Municipi tutor empresa", "Càrrec del tutor dins l'empresa","Correu electrònic de l'empresa",
  "Dia seguiment centre educatiu","Hora seguiment centre educatiu", "Dia seguiment amb responsable FCT","Hora seguiment amb responsable FCT"];

const dadesAlumne = ["Nom alumne","Llinatges alumne","Població alumne","DNI","Nombre expedient",
  "Es menor d'edat en el moment de començar la FCT? ","Edat de l'alumne (només número)","Estudis",
  "Cicle Formatiu","Grup","Durada del cicle", "Número d'hores totals proposades per FCT (només número)",
  "Número d'hores diàries (només número)","Km centre treball-població alumne (només número)","Període",
  "Data inicial","Data final","Data màxima acabament","Tipus de jornada","Horari(Exemple jornada partida: 8.00-12:00 15:00-18:00)"];

const dadesTutor = ["Nom tutor","Llinatges tutor","Telèfon mòbil"];

const dadesEmpresa = ["És una empresa nova?","És una empresa de l'Administració Pública?","Número de conveni",
  "Número d'annex","Nom de l'empresa","CIF","Adreça","Còdig postal","Població tutor","Telèfon"];

const dadesLlocTreball = ["Nom Centre de treball", "Adreça Centre de treball","Còdig postal Centre de treball",
    "Població Centre de treball","Telèfon Centre de treball", "Activitat Centre de treball","Nom representant legal",
    "NIF representant legal", "Nom tutor empresa", "NIF tutor empresa","Nacionalitat tutor empresa","Municipi tutor empresa",
    "Càrrec del tutor dins l'empresa", "Correu electrònic de l'empresa"];

const dadesAltresInformacions = ["Dia seguiment centre educatiu","Hora seguiment centre educatiu",
  "Dia seguiment amb responsable FCT","Hora seguiment amb responsable FCT"];


function selectStudent(student:Alumne){

    studentSelect.value = student;
    formData.value.nomAlumne = student.nom;
    formData.value.llinatgesAlumne = student.cognom1 + " " + student.cognom2;
    formData.value.poblacio = student.municipi;
    formData.value.dni = student.dni;

    if (student && typeof student.numeroExpedient !== 'undefined') {
        formData.value.nExpedient = student.numeroExpedient.toString();
      console.log(formData.value.nExpedient)
    }
    formData.value.grup = student.estudis;
}
function filterstudent(val:string) {
  if (val === '') {
    unselectStudent.value = allStudents.value;
  }else {
    unselectStudent.value = unselectStudent.value.filter(student => student.nom?.toLowerCase().includes(val.toLowerCase()) ||
      student.cognom1?.toLowerCase().includes(val.toLowerCase()) || student.cognom2?.toLowerCase().includes(val.toLowerCase()))
  }
}
function selectCompany(company:Empresa){


  formData.value.empresaNova = false;
  formData.value.numeroConveni = company.numeroConveni;
  formData.value.numeroAnnex = company.numeroAnnex;
  formData.value.nomEmpresa = company.nom;
  formData.value.cif = company.cif;
  formData.value.adrecaEmpresa = company.adreca;
  formData.value.cpempresa = company.codiPostal;
  formData.value.telefonEmpresa = company.telefon;

    console.log(company.llocsTreball);
  if(company.llocsTreball !== undefined){
      companySelected.value = true;
      allCompanyWorkspace.value = company.llocsTreball;
  }
}

function selectWorkspace(workspace:LlocTreball){

    formData.value.nomLlocTreball = workspace.nom;
    formData.value.adrecaLlocTreball = workspace.adreca;
    formData.value.cpLlocTreball = workspace.codiPostal;
    formData.value.poblacioLlocTreball = workspace.poblacio;
    formData.value.telefonLlocTreball = workspace.telefon;
    formData.value.activitatLlocTreball = workspace.activitat;
    formData.value.nomRepresentantLegal = workspace.nomRepresentantLegal;
    formData.value.nifRepresentantLegal = workspace.dniRepresentantLegal;
    formData.value.nomTutorEmpresa = workspace.nomTutorEmpresa;
    formData.value.nifTutorEmpresa = workspace.dniTutorEmpresa;
    formData.value.municipiTutorEmpresa = workspace.municipi;
    formData.value.carrecTutorEmpresa = workspace.carrecTutor;
    formData.value.emailEmpresa = workspace.email;
}
function ageCalculate(date:Date){

    if(studentSelect.value.dataNaixement !== undefined){
       const fechaNaixement = studentSelect.value.dataNaixement.toString().split("-");
       const fechaInici = date.toString().split("-");
       let age = parseInt(fechaInici[0]) - parseInt(fechaNaixement[0]);

       if(parseInt(fechaNaixement[1]) > parseInt(fechaInici[1])){
           age = age - 1;
       }else if(parseInt(fechaNaixement[1]) === parseInt(fechaInici[1])){

           if (parseInt(fechaNaixement[2]) > parseInt(fechaInici[2])){
               age = age - 1;
           }
       }
        formData.value.edat = age.toString();
        age >= 18 ? formData.value.menorEdat = false : formData.value.menorEdat = true;
    }
}

async function saveForm(){

    await DocumentService.saveForm(formData.value,tutorFCT.value.email);
    companySelected.value = false;

    formData.value.anyCurs = '';
    formData.value.nomAlumne = '';
    formData.value.llinatgesAlumne = '';
    formData.value.poblacio = '';
    formData.value.dni = '';
    formData.value.nExpedient = '';
    formData.value.menorEdat = undefined;
    formData.value.edat = '';
    formData.value.estudis = '';
    formData.value.cicleFormatiu = '';
    formData.value.grup = '';
    formData.value.duradaCicle = '';
    formData.value.totalHoresProposadesFct = '';
    formData.value.horesDiaries = '';
    formData.value.km = '';
    formData.value.periode = '';
    formData.value.dataInici = '';
    formData.value.dataFi = '';
    formData.value.dataAcabament = '';
    formData.value.tipusJornada = '';
    formData.value.horari = '';
    formData.value.telefonTutor = '';
    formData.value.empresaNova = undefined;
    formData.value.empresaAdministracioPublica = undefined;
    formData.value.numeroConveni = '';
    formData.value.numeroAnnex = '';
    formData.value.nomEmpresa = '';
    formData.value.cif = '';
    formData.value.adrecaEmpresa = '';
    formData.value.cpempresa = '';
    formData.value.poblacioEmpresa = '';
    formData.value.telefonEmpresa = '';
    formData.value.nomLlocTreball = '';
    formData.value.adrecaLlocTreball = '';
    formData.value.cpLlocTreball = '';
    formData.value.poblacioLlocTreball = '';
    formData.value.telefonLlocTreball = '';
    formData.value.activitatLlocTreball = '';
    formData.value.nomRepresentantLegal = '';
    formData.value.nifRepresentantLegal = '';
    formData.value.nomTutorEmpresa = '';
    formData.value.nifTutorEmpresa = '';
    formData.value.nacionalitatTutorEmpresa = '';
    formData.value.municipiTutorEmpresa = '';
    formData.value.carrecTutorEmpresa = '';
    formData.value.emailEmpresa = '';
    formData.value.diaSeguimentCentreEducatiu = '';
    formData.value.horaSeguimentCentreEducatiu = '';
    formData.value.diaSeguimentResponsableFct = '';
    formData.value.horaSeguimentResponsableFct = '';
    formData.value.flexibilitzacioModulFct = undefined;
}

onMounted(async () =>{

  allStudents.value = await UsuariService.allStudents();
  allCompanies.value = await EmpresaService.allCompanies();
  tutorFCT.value = await UsuariService.getProfile();

  formData.value.nomTutor = tutorFCT.value.nom;
  formData.value.llinatgesTutor = tutorFCT.value.cognom1 + " " + tutorFCT.value.cognom2;



  /*
  allGrups.value = await GrupService.findAllGrups();
  for (const grup of allGrups.value) {
    const nomGrup = grup.curs.nom + grup.nom;
    allNomGrups.push(nomGrup);
    console.log(nomGrup)
  }

   */

})
</script>
<style scoped>

.text-apartat{
  font-size: 18px;
}
.border{
    border: 1px solid black;
}
.border-bottom{
    border-bottom: 1px solid black;
}
.border-bot-top{
    border-bottom: 1px solid black;
    border-top: 1px solid black;
}


</style>
