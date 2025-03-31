
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
    <q-form @submit="confirmSave" @validationError="errorForm" ref="formulariAlumnes">
      <div class="bg-primary border-bottom">
          <p class="text-apartat text-center col-md-12 q-pt-md text-wrap-center">Dades de l'alumne</p>
      </div>

      <div class="q-pa-md">
        <div class="q-gutter-md row">
          <q-select
            standout
            v-model="selectedStudent"
            emit-value
            map-options
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            :options="filteredStudentOptions"
            @filter="filterStudentsFn"
            style="width: 250px; padding-bottom: 32px"
            label="Alumne"
            color="white"
            bg-color="primary"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sense resultats
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
      </div>


      <div class="row flex justify-center q-mt-sm q-gutter-y-md">
        <div class="col-md-2">
          <q-input
            class="q-pa-sm"
            outlined
            type="text"
            label="Número expedient"
            v-model="formData.numeroExpedient"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>
        <div class="col-md-3">
          <q-input
            class="q-pa-sm"
            outlined
            type="text"
            label="Nom alumne"
            v-model="formData.nomAlumne"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>
        <div class="col-md-4">
          <q-input
            class="q-pa-sm"
            outlined
            type="text"
            label="Llinatges alumne"
            v-model="formData.llinatgesAlumne"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>
        <div class="col-md-3">
          <q-input
            class="q-pa-sm"
            outlined
            type="text"
            label="DNI/NIE"
            v-model="formData.dni"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>
      </div>

      <div class="row flex justify-start q-mt-sm q-gutter-y-md">
        <div class=" q-pl-sm">
          <p class="q-pt-sm q-pr-sm q-pl-sm q-mb-none ">Estudis</p>
          <div class="q-gutter-sm">
            <q-radio size="sm" v-model="formData.estudis" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="FP Bàsica" label="FP Bàsica" />
            <q-radio size="sm" v-model="formData.estudis" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="CF Grau Mitjà" label="CF Grau Mitjà" />
            <q-radio size="sm" v-model="formData.estudis" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="CF Grau Superior" label="CF Grau Superior" />
          </div>
        </div>

        <div class="col-md-3">
          <q-select
            outlined
            class="q-pa-sm"
            v-model="formData.cicleFormatiu"
            :options= "ciclesFormatius"
            label="Cicle Formatiu"
          />
        </div>

        <div class="col-md-2">
          <q-select
            outlined
            class="q-pa-sm"
            v-model="formData.grup"
            :options= "allNomGrups"
            label="Grup"
            :clearable="false"
          />
        </div>

        <div class=" q-pl-sm">
          <p class="q-pt-sm q-pr-sm q-pl-sm q-mb-none ">Durada del cicle</p>
          <div class="q-gutter-sm">
            <q-radio size="sm" v-model="formData.duradaCicle" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="1 any" label="1 any" />
            <q-radio size="sm" v-model="formData.duradaCicle" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="2 anys" label="2 anys" />
          </div>
        </div>
      </div>

      <div class="row flex justify-center q-mt-sm q-gutter-y-md">
        <div class="col-md-4 q-pa-md">
          <p class="text-h6">Data inici pràctiques</p>
          <q-date
            v-model="formData.dataInici"
            minimal
            mask="YYYY-MM-DD"
            @update:model-value="ageCalculate(formData.dataInici)"
          />
        </div>
        <div class="col-md-4 q-pa-md">
          <p class="text-h6">Data final pràctiques</p>
          <q-date
            v-model="formData.dataFi"
            minimal
            mask="YYYY-MM-DD"
          />
        </div>
        <div class="col-md-4 q-pa-md">
          <p class="text-h6">Data màxima acabament</p>
          <q-date
            v-model="formData.dataAcabament"
            minimal
            mask="YYYY-MM-DD"
          />
        </div>
      </div>

      <div class="row flex justify-start q-mt-sm q-gutter-y-md">
        <div class=" q-pl-sm">
          <p class="q-pt-sm q-pr-sm q-pl-sm q-mb-none ">Període</p>
          <div class="q-gutter-sm ">
            <q-radio size="sm" v-model="formData.periode" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="Ordinari" label="Ordinari" />
            <q-radio size="sm" v-model="formData.periode" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="No ordinari" label="No ordinari" />
          </div>
        </div>

        <div class=" q-pl-sm">
          <p class="q-pt-sm q-pr-sm q-pl-sm q-mb-none ">Es menor d'edat en el moment de començar la FCT?</p>
          <div class="q-gutter-sm ">
            <q-radio size="sm" v-model="formData.menorEdat" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="true" label="Si" />
            <q-radio size="sm" v-model="formData.menorEdat" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="false" label="No" />
          </div>
          <small>Si s'emplena la data d'inici de la FCT aquest camps s'emplena automàticament</small>
        </div>

        <div class="col-md-4">
          <q-input
            class="q-pa-sm"
            outlined
            type="number"
            label="Edat de l'alumne (només número)"
            v-model="formData.edat"
            hint="Si s'emplena la data d'inici de la FCT aquest camps s'emplena automàticament"
          />
        </div>
      </div>


      <div class="row flex justify-start q-mt-sm q-gutter-y-md">

        <div class="col-md-2">
          <q-input
            class="q-pa-sm"
            outlined
            type="number"
            label="Número hores proposades"
            v-model="formData.totalHoresProposadesFct"
            hint="Només número"
          />
        </div>

        <div class="col-md-2">
          <q-input
            class="q-pa-sm"
            outlined
            type="number"
            label="Número hores diàries"
            v-model="formData.horesDiaries"
            hint="Només número"
          />
        </div>

        <div class="col-md-2">
          <q-input
            class="q-pa-sm"
            outlined
            type="number"
            label="Km centre treball-població alumne"
            v-model="formData.km"
            hint="Només número"
          />
        </div>

        <div class="col-md-3">
          <q-select
            class="q-pa-sm"
            v-model="formData.tipusJornada"
            outlined
            label="Tipus jornada"
            :options="['Continuada', 'Partida', 'Continuada i Partida']" />
        </div>

        <div class="col-md-3">
          <q-input
            class="q-pa-sm"
            outlined
            type="text"
            label="Horari"
            v-model="formData.horari"
            hint="Exemple: jornada partida: 8.00-12:00 15:00-18:00"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>
      </div>


      <div class="bg-primary border-bot-top q-mt-lg">
          <p class="text-apartat text-center col-md-12 q-pt-md text-wrap-center">Dades del professor-tutor</p>
      </div>
      <div class="row flex justify-center q-mt-sm q-gutter-y-md">
        <div class="col-md-4">
          <q-input
            class="q-pa-sm"
            outlined
            type="text"
            label="Nom tutor"
            v-model="formData.nomTutor"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>
        <div class="col-md-4">
          <q-input
            class="q-pa-sm"
            outlined
            type="text"
            label="Llinatges tutor"
            v-model="formData.llinatgesTutor"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>
        <div class="col-md-4">
          <q-input
            class="q-pa-sm"
            outlined
            type="text"
            label="Telèfon mòbil tutor"
            v-model="formData.telefonTutor"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>
      </div>



      <div class="bg-primary border-bot-top q-mt-lg">
          <p class="text-apartat text-center col-md-12 q-pt-md text-wrap-center">Dades empresa</p>
      </div>

      <div class="q-pa-md">
        <div class="q-gutter-md row">
          <q-select
            standout
            v-model="selectedCompany"
            emit-value
            map-options
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            :options="filteredCompanyOptions"
            @filter="filterCompaniesFn"
            label="Empresa"
            color="white"
            bg-color="primary"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Sense resultats
                </q-item-section>
              </q-item>
            </template>
          </q-select>

          <q-btn-dropdown class="q-mt-md q-mr-md q-ml-sm" color="primary" label="Lloc de treball" v-if="companySelected">
            <q-list>
              <q-item v-for="workspace in allCompanyWorkspace" clickable v-close-popup @click="selectWorkspace(workspace)">
                <q-item-section>
                  <q-item-label>{{workspace.nom}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </div>


<!--      <q-btn-dropdown class="q-mt-md q-mr-md q-ml-sm" color="primary" label="Empresa">-->
<!--        <q-list>-->
<!--          <q-item v-for="company in allCompanies" clickable v-close-popup @click="selectCompany(company)">-->
<!--            <q-item-section>-->
<!--              <q-item-label>{{company.nom}}</q-item-label>-->
<!--            </q-item-section>-->
<!--          </q-item>-->
<!--        </q-list>-->
<!--      </q-btn-dropdown>-->


      <div class="row flex justify-start q-mt-sm q-gutter-y-md">
        <div class=" q-pl-sm">
          <p class="q-pt-sm q-pr-sm q-pl-sm q-mb-none ">És una empresa nova?</p>
          <div class="q-gutter-sm ">
            <q-radio size="sm" v-model="formData.empresaNova" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="true" label="Si" />
            <q-radio size="sm" v-model="formData.empresaNova" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="false" label="No" />
          </div>
        </div>

        <div class=" q-pl-sm">
          <p class="q-pt-sm q-pr-sm q-pl-sm q-mb-none ">És una empresa de l'Administració Pública?</p>
          <div class="q-gutter-sm ">
            <q-radio size="sm" v-model="formData.empresaAdministracioPublica" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="true" label="Si" />
            <q-radio size="sm" v-model="formData.empresaAdministracioPublica" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="false" label="No" />
          </div>
        </div>

        <div class="col-md-4">
          <q-input
            class="q-pa-sm"
            outlined
            type="text"
            label="Número de conveni"
            v-model="formData.numeroConveni"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>

        <div class="col-md-4">
          <q-input
            class="q-pa-sm"
            outlined
            type="text"
            label="Correu electrònic empresa"
            v-model="formData.emailEmpresa"
          />
        </div>
      </div>

      <div class="row flex justify-start q-mt-sm q-gutter-y-md">
        <div class="col-md-4">
          <q-input
            class="q-pa-sm"
            outlined
            bg-color="primary"
            type="text"
            label="Nom de l'empresa"
            v-model="formData.nomEmpresa"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>

        <div class="col-md-4">
          <q-input
            class="q-pa-sm"
            outlined
            bg-color="primary"
            type="text"
            label="CIF de l'empresa"
            v-model="formData.cif"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>

        <div class="col-md-4">
          <q-input
            class="q-pa-sm"
            outlined
            bg-color="primary"
            type="text"
            label="Adreça de l'empresa"
            v-model="formData.adrecaEmpresa"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>
      </div>
      <div class="row flex justify-start q-mt-sm q-gutter-y-md">
        <div class="col-md-4">
          <q-input
            class="q-pa-sm"
            outlined
            type="text"
            label="Població empresa"
            v-model="formData.poblacioEmpresa"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>

        <div class="col-md-4">
          <q-input
            class="q-pa-sm"
            outlined
            type="text"
            label="Codi postal empresa"
            v-model="formData.cpempresa"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>

        <div class="col-md-4">
          <q-input
            class="q-pa-sm"
            outlined
            type="text"
            label="Telèfon"
            v-model="formData.telefonEmpresa"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>
      </div>


      <p class="text-apartat text-center col-md-12 q-pt-md text-wrap-center">Lloc de treball</p>

      <div class="row flex justify-start q-mt-sm q-gutter-y-md">
        <div class="col-md-4">
          <q-input
            class="q-pa-sm"
            outlined
            type="text"
            label="Nom centre de treball"
            v-model="formData.nomLlocTreball"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>
        <div class="col-md-4">
          <q-input
            class="q-pa-sm"
            outlined
            bg-color="primary"
            type="text"
            label="Nom representant legal"
            v-model="formData.nomCompletRepresentantLegal"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>
        <div class="col-md-4">
          <q-input
            class="q-pa-sm"
            outlined
            bg-color="primary"
            type="text"
            label="NIF representant legal"
            v-model="formData.nifRepresentantLegal"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>

        <div class="col-md-4">
          <q-input
            class="q-pa-sm"
            outlined
            type="text"
            label="Telèfon lloc de treball"
            v-model="formData.telefonLlocTreball"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>

        <div class="col-md-4">
          <q-input
            class="q-pa-sm"
            outlined
            type="text"
            label="Correu electrònic tutor empresa"
            v-model="formData.emailTutorEmpresa"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>

        <div class="col-md-4">
          <q-input
            class="q-pa-sm"
            outlined
            type="text"
            label="Activitat centre de treball"
            v-model="formData.activitatLlocTreball"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>
      </div>

      <div class="row flex justify-center q-mt-sm q-gutter-y-md">
        <div class="col-md-4">
          <q-input
            class="q-pa-sm"
            outlined
            type="text"
            label="Adreça centre de treball"
            v-model="formData.adrecaLlocTreball"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>

        <div class="col-md-4">
          <q-input
            class="q-pa-sm"
            outlined
            type="text"
            label="Població centre de treball"
            v-model="formData.poblacioLlocTreball"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>

        <div class="col-md-4">
          <q-input
            class="q-pa-sm"
            outlined
            type="text"
            label="CP centre de treball"
            v-model="formData.cpLlocTreball"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>
      </div>

      <div class="row flex justify-start q-mt-sm q-gutter-y-md">
        <div class="col-md-4">
          <q-input
            class="q-pa-sm"
            outlined
            type="text"
            label="Nom tutor empresa"
            v-model="formData.nomCompletTutorEmpresa"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>

        <div class="col-md-4">
          <q-input
            class="q-pa-sm"
            outlined
            type="text"
            label="NIF/NIE tutor empresa"
            v-model="formData.nifTutorEmpresa"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>

        <div class="col-md-4">
          <q-input
            class="q-pa-sm"
            outlined
            type="text"
            label="Nacionalitat tutor empresa"
            v-model="formData.nacionalitatTutorEmpresa"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>

        <div class="col-md-4">
          <q-input
            class="q-pa-sm"
            outlined
            type="text"
            label="Municipi tutor empresa"
            v-model="formData.municipiTutorEmpresa"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>

        <div class="col-md-4">
          <q-input
            class="q-pa-sm"
            outlined
            type="text"
            label="Càrrec empresa"
            v-model="formData.carrecTutorEmpresa"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>
      </div>


      <div class="bg-primary border-bot-top q-mt-lg">
          <p class="text-apartat text-center col-md-12 q-pt-md text-wrap-center">Altres informacions</p>
      </div>

      <div class="row flex justify-center q-mt-sm q-gutter-y-md">
        <div class="col-md-3">
          <q-select
            outlined
            class="q-pa-sm"
            v-model="formData.diaSeguimentCentreEducatiu"
            :options= "['Dilluns','Dimarts','Dimecres','Dijous','Divendres']"
            label="Dia seguiment centre educatiu"
          />
        </div>
        <div class="col-md-3">
          <q-input
            class="q-pa-sm"
            outlined
            type="text"
            label="Hora seguiment centre educatiu"
            v-model="formData.horaSeguimentCentreEducatiu"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>
        <div class="col-md-3">
          <q-select
            outlined
            class="q-pa-sm"
            v-model="formData.diaSeguimentResponsableFct"
            :options= "['Dilluns','Dimarts','Dimecres','Dijous','Divendres']"
            label="Dia seguiment amb responsable FCT"
          />
        </div>
        <div class="col-md-3">
          <q-input
            class="q-pa-sm"
            outlined
            type="text"
            label="Hora seguiment amb responsable FCT"
            v-model="formData.horaSeguimentResponsableFct"
            :rules="[(val:any) => !!val || 'El camp és obligatori']"
          />
        </div>
      </div>


      <div class="bg-primary border-bot-top q-mt-md">
          <p class="text-apartat text-center col-md-12 q-pt-md text-wrap-center">Flexibilització en el mòdul FCT</p>
      </div>
      <div class="row flex justify-center q-my-sm q-gutter-y-md">
          <div class="col-md-4  q-pl-sm">
              <p class="q-pt-sm q-pr-sm q-pl-sm q-mb-none ">Hi ha algun tipus de flexibilització en el mòdul de FCT?</p>
              <div class="q-gutter-sm ">
                  <q-radio v-model="formData.flexibilitzacioModulFct" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="true" label="Si" />
                  <q-radio v-model="formData.flexibilitzacioModulFct" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="false" label="No" />
              </div>
          </div>
        <div class="col-md-4"></div>
        <div class="col-md-4"></div>
      </div>

      <div class="bg-primary border-bot-top q-mt-md">
        <p class="text-apartat text-center col-md-12 q-pt-md text-wrap-center"></p>
      </div>
      <div class="flex justify-center q-gutter-sm q-ma-lg">
        <q-btn label="Desar Formulari" type="submit" color="primary" size="lg"/>
        <!--q-btn label="Desar" type="submit" @click="confirmSave" color="primary"/-->
      </div>
    </q-form>
   </div>

  </q-page>
</template>
<script setup lang="ts">

import {useQuasar} from "quasar";
import {computed, onMounted, ref, Ref, watch} from "vue";
import {Alumne} from "src/model/Alumne";
import {Empresa} from "src/model/Empresa";
import {UsuariService} from "src/service/UsuariService";
import {EmpresaService} from "src/service/EmpresaService";
import {DadesFormulari} from "src/model/DadesFormulari";
import {Grup} from "src/model/Grup";
import {LlocTreball} from "src/model/LlocTreball";
import {Usuari} from "src/model/Usuari";
import {DocumentService} from "src/service/DocumentService";
import IStudentListItem from "src/Interfaces/IStudentListItem";
import ICompanyListItem from "src/Interfaces/ICompanyListItem";
import {GrupService} from "src/service/GrupService";

const $q = useQuasar();

const allStudents:Ref<Alumne[]> = ref([] as Alumne[]);        // Tots els alumnes
let studentSelectList:IStudentListItem[] = [];                // Llista d'opcions pel select amb filtre
const selectedStudent:Ref<Alumne> = ref<Alumne>(null);  // Alumne seleccionat pel select amb filtre
const studentSelect:Ref<Alumne> = ref({} as Alumne);          // Antic alumne seleccionat en el formulari
const filteredStudentOptions:IStudentListItem[] = ref(studentSelectList)

const allCompanies:Ref<Empresa[]> = ref([] as Empresa[]);
let companySelectList:ICompanyListItem[] = []
const selectedCompany:Ref<Empresa> = ref<Empresa>(null)
const filteredCompanyOptions:ICompanyListItem[] = ref(companySelectList)

const companySelected:Ref<boolean> = ref(false);


const allCompanyWorkspace:Ref<LlocTreball[]> = ref([] as LlocTreball[]);
const tutorFCT:Ref<Usuari> = ref({} as Usuari);

const formulariAlumnes = ref(null)

const allNomGrups = ref([] as string[]);

const ciclesFormatius = [
  'FP Bàsica Manteniment de vehicles',
  'FP Bàsica Serveis Comercials',
  'CFGM Activitats comercials',
  'CFGM Carroseria',
  'CFGM Electromecànica de vehicles',
  'CFGM Gestió Administrativa',
  'CFGM Instal·lacions elèctriques i automàtiques',
  'CFGM Sistemes microinformàtics i xarxes',
  'CFGS Administració i finances',
  'CFGS Administració de sistemes informàtics',
  'CFGS Assistència a la Direcció',
  'CFGS Automoció',
  "CFGS Desenvolupament d'aplicacions web",
  'CFGS Gestió de Vendes i Espais Comercials',
  'CFGS Màrketing i publicitat'
];

const formData: Ref<DadesFormulari> = ref({
  anyCurs: '2024/25',
  nomAlumne: '',
  llinatgesAlumne: '',
  poblacioAlumne: '',
  dniAlumne: '',
  numeroExpedient: '',
  menorEdat: false,
  edat: '',
  estudis: localStorage.getItem('estudis') || 'FP Bàsica',
  cicleFormatiu: localStorage.getItem('cicleformatiu') || ciclesFormatius[0],
  grup: '',
  duradaCicle: localStorage.getItem('duradacicle') || '2 anys',
  totalHoresProposadesFct: '',
  horesDiaries: '',
  km: '',
  periode: localStorage.getItem('periode') || 'Ordinari',
  dataInici: '', dataFi: '', dataAcabament: '',
  tipusJornada: 'Continuada', horari: '', nomTutor: '', llinatgesTutor: '', telefonTutor: '', empresaNova: false,
  empresaAdministracioPublica: false, numeroConveni: '', nomEmpresa: '', cif: '', adrecaEmpresa: '',
  cpempresa: '', poblacioEmpresa: '', telefonEmpresa: '', nomLlocTreball: '', adrecaLlocTreball: '', cpLlocTreball: '',
  poblacioLlocTreball: '', telefonLlocTreball: '', activitatLlocTreball: '', nomCompletRepresentantLegal: '',
  nifRepresentantLegal: '', nomCompletTutorEmpresa: '', nifTutorEmpresa: '', nacionalitatTutorEmpresa: '',
  municipiTutorEmpresa: '', carrecTutorEmpresa: '', emailEmpresa: '', emailTutorEmpresa:'', diaSeguimentCentreEducatiu: '', horaSeguimentCentreEducatiu: '',
  diaSeguimentResponsableFct: '', horaSeguimentResponsableFct: '', flexibilitzacioModulFct: false,
});




function selectStudent(student:Alumne){
    studentSelect.value = student;
    formData.value.nomAlumne = student.nom;
    formData.value.llinatgesAlumne = student.cognom1 + " " + student.cognom2;
    formData.value.poblacioAlumne = student.municipi;
    formData.value.dniAlumne = student.dni;

    if (student && typeof student.numeroExpedient !== 'undefined') {
        formData.value.numeroExpedient = student.numeroExpedient.toString();
      console.log(formData.value.numeroExpedient)
    }
    formData.value.grup = allNomGrups.value.find(g=>g===( (student.estudis||'') + (student.grup || '') )) || allNomGrups.value[0];

  formData.value.cicleFormatiu = ciclesFormatius[0];
  //Fem el mapeig de les dades de l'usuari
  /*
  0- 'FP Bàsica Manteniment de vehicles', - TMV11
  1- 'FP Bàsica Serveis Comercials', - COM11
  2- 'CFGM Activitats comercials', - COM21
  3- 'CFGM Carroseria', - TMV21
  4- 'CFGM Electromecànica de vehicles', - TMV22
  5- 'CFGM Gestió Administrativa', - ADG21
  6- 'CFGM Instal·lacions elèctriques i automàtiques', - ELE21
  7- 'CFGM Sistemes microinformàtics i xarxes', - IFC21
  8- 'CFGS Administració i finances', - ADG32
  9- 'CFGS Administració de sistemes informàtics', - IFC31
  10- 'CFGS Assistència a la Direcció', - ADG31
  11- 'CFGS Automoció', - TMV31
  12- "CFGS Desenvolupament d'aplicacions web", - IFC33
  13- 'CFGS Gestió de Vendes i Espais Comercials', - COM33
  14- 'CFGS Màrketing i publicitat' - COM31
   */
  /*
    Mapeig de Cicles Formatius
    "FP Bàsica", "CF Grau Mitjà", "CF Grau Superior"
   */
  if(student.estudis === 'TMV11'){
    formData.value.cicleFormatiu = ciclesFormatius[0];
    formData.value.estudis = 'FP Bàsica';
  } else if(student.estudis === 'COM11'){
    formData.value.cicleFormatiu = ciclesFormatius[1];
    formData.value.estudis = 'FP Bàsica';
  } else if(student.estudis === 'COM21'){
    formData.value.cicleFormatiu = ciclesFormatius[2];
    formData.value.estudis = 'CF Grau Mitjà';
  } else if(student.estudis === 'TMV21'){
    formData.value.cicleFormatiu = ciclesFormatius[3];
    formData.value.estudis = 'CF Grau Mitjà';
  } else if(student.estudis === 'TMV22'){
    formData.value.cicleFormatiu = ciclesFormatius[4];
    formData.value.estudis = 'CF Grau Mitjà';
  } else if(student.estudis === 'ADG21'){
    formData.value.cicleFormatiu = ciclesFormatius[5];
    formData.value.estudis = 'CF Grau Mitjà';
  } else if(student.estudis === 'ELE21'){
    formData.value.cicleFormatiu = ciclesFormatius[6];
    formData.value.estudis = 'CF Grau Mitjà';
  } else if(student.estudis === 'IFC21'){
    formData.value.cicleFormatiu = ciclesFormatius[7];
    formData.value.estudis = 'CF Grau Mitjà';
  } else if(student.estudis === 'ADG32'){
    formData.value.cicleFormatiu = ciclesFormatius[8];
    formData.value.estudis = 'CF Grau Superior';
  } else if(student.estudis === 'IFC31'){
    formData.value.cicleFormatiu = ciclesFormatius[9];
    formData.value.estudis = 'CF Grau Superior';
  } else if(student.estudis === 'ADG31'){
    formData.value.cicleFormatiu = ciclesFormatius[10];
    formData.value.estudis = 'CF Grau Superior';
  } else if(student.estudis === 'TMV31'){
    formData.value.cicleFormatiu = ciclesFormatius[11];
    formData.value.estudis = 'CF Grau Superior';
  } else if(student.estudis === 'IFC33'){
    formData.value.cicleFormatiu = ciclesFormatius[12];
    formData.value.estudis = 'CF Grau Superior';
  } else if(student.estudis === 'COM33'){
    formData.value.cicleFormatiu = ciclesFormatius[13];
    formData.value.estudis = 'CF Grau Superior';
  } else if(student.estudis === 'COM31') {
    formData.value.cicleFormatiu = ciclesFormatius[14];
    formData.value.estudis = 'CF Grau Superior';
  }
}

const filterStudentsFn = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase()
    filteredStudentOptions.value = studentSelectList.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
}

const filterCompaniesFn = (val, update, abort) => {
  update(() => {
    const needle = val.toLowerCase()
    filteredCompanyOptions.value = companySelectList.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
}

watch(selectedStudent, (newValue, oldValue) => {
  if(selectedStudent.value !== null){
    selectStudent(selectedStudent.value);
  }
});

watch(selectedCompany, (newValue, oldValue) => {
  if(selectedCompany.value !== null) {
    selectCompany(selectedCompany.value);
  }
});

function selectCompany(company:Empresa){

  formData.value.empresaNova = false;
  formData.value.numeroConveni = company.numeroConveni;
  formData.value.nomEmpresa = company.nom;
  formData.value.emailEmpresa = company.emailEmpresa;
  formData.value.cif = company.cif;
  formData.value.adrecaEmpresa = company.adreca;
  formData.value.cpempresa = company.codiPostal;
  formData.value.telefonEmpresa = company.telefon;
  formData.value.poblacioEmpresa = company.poblacio;

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
    formData.value.nomCompletRepresentantLegal = workspace.nomCompletRepresentantLegal;
    formData.value.nifRepresentantLegal = workspace.dniRepresentantLegal;
    formData.value.nomCompletTutorEmpresa = workspace.nomCompletTutorEmpresa;
    formData.value.nifTutorEmpresa = workspace.dniTutorEmpresa;
    formData.value.municipiTutorEmpresa = workspace.municipi;
    formData.value.carrecTutorEmpresa = workspace.carrecTutor;
    formData.value.emailTutorEmpresa = workspace.emailTutorEmpresa;
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

function errorForm(){
  $q.notify({
    color: 'negative',
    message: 'Hi ha camps incorrectes',
    icon: 'report_problem'
  });
}

function confirmSave(){
  console.log('confirm save form');
  formulariAlumnes.value.validate().then(success => {
    if (success) {
      // yay, models are correct
      $q.dialog({
        title: 'Alerta',
        message: 'Està segur que vol desar el formulari? No es podrà modificar després',
        cancel: true,
        persistent: true
      }).onOk(() => {
        saveForm();
      });
    } else {
      console.log('error')
      $q.notify({
        color: 'negative',
        message: 'Hi ha camps incorrectes',
        icon: 'report_problem'
      });
    }
  }).catch(() => {
    // error
    console.log('error')
    $q.notify({
      color: 'negative',
      message: 'Hi ha camps incorrectes',
      icon: 'report_problem'
    })
  })



}

async function saveForm(){

  if(formData.value.cicleFormatiu) {
    localStorage.setItem('cicleformatiu', formData.value.cicleFormatiu);
  }
  if(formData.value.estudis){
    localStorage.setItem('estudis', formData.value.estudis);
  }
  if(formData.value.duradaCicle){
    localStorage.setItem('duradacicle', formData.value.duradaCicle);
  }
  if(formData.value.periode){
    localStorage.setItem('periode', formData.value.periode);
  }
  await DocumentService.saveForm(formData.value,tutorFCT.value.email);
  window.location.reload();
}

onMounted(async () =>{

  allStudents.value = await UsuariService.allStudents();
  allCompanies.value = await EmpresaService.allCompanies();
  tutorFCT.value = await UsuariService.getProfile();

  formData.value.nomTutor = tutorFCT.value.nom;
  formData.value.llinatgesTutor = tutorFCT.value.cognom1 + " " + tutorFCT.value.cognom2;


  studentSelectList = allStudents.value.map(student => ({
    label: student.cognom1 + " " + student.cognom2 + ", " + student.nom,
    value: student
  }));

 companySelectList = allCompanies.value
    .map(company => ({
      label: company.nom,
      value: company
    }))
    .sort((a, b) => a.label.localeCompare(b.label));


  const allGrups = await GrupService.findAllGrups();
  for (const grup of allGrups) {
    const nomGrup = grup.curs.nom + grup.nom;
    allNomGrups.value.push(nomGrup);
  }
  allNomGrups.value.sort((a, b) => a.localeCompare(b));

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
