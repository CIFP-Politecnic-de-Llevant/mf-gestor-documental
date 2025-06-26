<template>
  <q-page padding>
    <div>
      <p class="text-h4  q-mb-lg">Editar Empresa</p>
    </div>
    <q-form class="border">
      <div class="bg-primary q-ma-none border-bottom flex justify-between">
        <p class="text-h6 fw-normal q-py-sm q-pl-lg q-mb-none">{{companyData.nom}}</p>
        <q-btn
            @click="updateCompany"
            :color="'grey'"
            :text-color="'white'"
            dense
            class="q-my-sm border q-mr-sm"
            icon="save"
            label="Desar Empresa"
        />
      </div>
      <div class="row flex justify-start q-my-sm">
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="Número Conveni"
            v-model="companyData.numeroConveni"
            class="q-pa-sm"
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="E-mail empresa"
            v-model="companyData.emailEmpresa"
            class="q-pa-sm"
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="Nom"
            v-model="companyData.nom"
            class="q-pa-sm"
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="CIF"
            v-model="companyData.cif"
            class="q-pa-sm"
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="Adreça"
            v-model="companyData.adreca"
            class="q-pa-sm"
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="Codi Postal"
            v-model="companyData.codiPostal"
            class="q-pa-sm"
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="Població"
            v-model="companyData.poblacio"
            class="q-pa-sm"
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="Província"
            v-model="companyData.provincia"
            class="q-pa-sm"
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="Telèfon"
            v-model="companyData.telefon"
            class="q-pa-sm"
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="Nom Representant Legal"
            v-model="companyData.nomRepresentantLegal"
            class="q-pa-sm"
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="Cognom 1 Representant Legal"
            v-model="companyData.cognom1RepresentantLegal"
            class="q-pa-sm"
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="Cognom 2 Representant Legal"
            v-model="companyData.cognom2RepresentantLegal"
            class="q-pa-sm"
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="DNI Representant Legal"
            v-model="companyData.dniRepresentantLegal"
            class="q-pa-sm"
          />
        </div>
      </div>
    </q-form>

    <div>
      <p class="text-h5  q-my-lg">Llocs de Treball</p>
    </div>
    <div class="q-mb-lg q-mt-xl">
      <q-btn icon="add" @click="addWorkspace = true" label="Lloc Treball" type="submit" class="q-mt-sm" color="primary"/>
    </div>
    <q-form v-for="workspace in companyData.llocsTreball" class="border q-mb-lg">
      <div class="bg-primary q-ma-none border-bottom flex justify-between">
        <p class="text-h6 fw-normal q-py-sm q-pl-lg q-mb-none">{{workspace.nom}}</p>
        <div>
          <q-btn
              @click="updateWorkspace(workspace)"
              :color="'grey'"
              :text-color="'white'"
              dense
              class="q-my-sm border q-mr-sm"
              icon="save"
              label="Desar Lloc Treball"
          />
          <q-btn
              @click="deleteConfirmation(workspace.idLlocTreball, workspace.nom)"
              :color="'grey'"
              :text-color="'white'"
              dense
              class="q-my-sm border q-mr-sm"
              icon="delete"
              label="Esborrar Lloc Treball"
          />
        </div>
      </div>
      <div class="row flex justify-start items-start q-my-sm">
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="Nom"
            v-model="workspace.nom"
            class="q-pa-sm "
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="Adreça"
            v-model="workspace.adreca"
            class="q-pa-sm "
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="Codi Postal"
            v-model="workspace.codiPostal"
            class="q-pa-sm "
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="Telèfon"
            v-model="workspace.telefon"
            class="q-pa-sm "
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="Població"
            v-model="workspace.poblacio"
            class="q-pa-sm "
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="Activitat"
            v-model="workspace.activitat"
            class="q-pa-sm "
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="Municipi"
            v-model="workspace.municipi"
            class="q-pa-sm "
          />
        </div>
        <div class="col-md-4">
          <q-toggle
            v-model="workspace.validat"
            label="Validat"
            color="primary"
            class="q-pa-sm"
            @update:model-value="updateWorkspace(workspace)"
          />
        </div>
      </div>
    </q-form>

    <div>
      <p class="text-h5  q-mb-lg">Tutors Empresa</p>
    </div>
    <div class="q-mb-lg q-mt-xl">
      <q-btn icon="add"  @click="addTutorEmpresa = true" label="Tutor Empresa" type="submit" class="q-mt-sm" color="primary"/>
    </div>
    <q-form v-for="tutorEmpresa in companyData.tutorsEmpresa" class="border q-mb-lg">
      <div class="bg-primary q-ma-none border-bottom flex justify-between">
        <p class="text-h6 fw-normal q-py-sm q-pl-lg q-mb-none">{{tutorEmpresa.nom}} {{tutorEmpresa.cognom1}} {{tutorEmpresa.cognom2}} ({{tutorEmpresa.carrec}})</p>
        <div>
          <q-btn
            @click="updateTutorEmpresa(tutorEmpresa)"
            :color="'grey'"
            :text-color="'white'"
            dense
            class="q-my-sm border q-mr-sm"
            icon="save"
            label="Desar Tutor Empresa"
          />
          <q-btn
            @click="deleteConfirmationTutorEmpresa(tutorEmpresa.idTutorEmpresa, `${tutorEmpresa.nom} ${tutorEmpresa.cognom1} ${tutorEmpresa.cognom2}`)"
            :color="'grey'"
            :text-color="'white'"
            dense
            class="q-my-sm border q-mr-sm"
            icon="delete"
            label="Esborrar Tutor Empresa"
          />
        </div>
      </div>
      <div class="row flex justify-start items-start q-my-sm">
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="Nom"
            v-model="tutorEmpresa.nom"
            class="q-pa-sm "
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="Cognom 1"
            v-model="tutorEmpresa.cognom1"
            class="q-pa-sm "
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="Cognom 2"
            v-model="tutorEmpresa.cognom2"
            class="q-pa-sm "
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="DNI/NIE"
            v-model="tutorEmpresa.dni"
            class="q-pa-sm "
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="Nacionalitat"
            v-model="tutorEmpresa.nacionalitat"
            class="q-pa-sm "
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="Càrrec"
            v-model="tutorEmpresa.carrec"
            class="q-pa-sm "
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="Telèfon"
            v-model="tutorEmpresa.telefon"
            class="q-pa-sm "
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="Correu electrònic"
            v-model="tutorEmpresa.email"
            class="q-pa-sm "
          />
        </div>
        <div class="col-md-4">
          <q-toggle
            v-model="tutorEmpresa.validat"
            label="Validat"
            color="primary"
            class="q-pa-sm"
            @update:model-value="updateTutorEmpresa(tutorEmpresa)"
          />
        </div>
      </div>
    </q-form>



    <!-- LLOC DE TREBALL -->
    <q-dialog v-model="addWorkspace" persistent>
      <q-card style="max-width: 1000px;">
        <q-card-section>
          <q-form @submit="saveWorkspace" class="q-gutter-md ">
            <p class="text-h5 q-mt-lg">Crear Lloc de treball</p>
            <div class="row flex justify-start items-start q-my-sm">
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Nom"
                  v-model="workspace.nom"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Adreça"
                  v-model="workspace.adreca"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Codi Postal"
                  v-model="workspace.codiPostal"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Telèfon"
                  v-model="workspace.telefon"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Població"
                  v-model="workspace.poblacio"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Municipi"
                  v-model="workspace.municipi"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Activitat"
                  v-model="workspace.activitat"
                  class="q-pa-sm "
                />
              </div>
            </div>
            <div class="flex justify-end q-gutter-sm">
              <q-btn label="Guardar" type="submit" color="primary" v-close-popup/>
              <q-btn label="Tancar" color="primary"  v-close-popup/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirmation" persistent>
      <q-card style="width: 300px">
        <q-card-section class="bg-primary">
          <div class="text-h6">Esborrar Lloc de treball</div>
        </q-card-section>
        <q-card-section class="q-pt-md">
          ¿Està segur que vol esborrar {{nameWorkspaceSelected}}?
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn color="primary" @click="deleteWorkspace" label="SI" v-close-popup />
          <q-btn color="primary"  label="NO" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>


    <!-- TUTORS EMPRESA -->
    <q-dialog v-model="addTutorEmpresa" persistent>
      <q-card style="max-width: 1000px;">
        <q-card-section>
          <q-form @submit="saveTutorEmpresa"  class="q-gutter-md ">
            <p class="text-h5 q-mt-lg">Crear Tutor d'Empresa</p>
            <div class="row flex justify-start items-start q-my-sm">
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Nom"
                  v-model="tutorEmpresa.nom"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Cognom 1"
                  v-model="tutorEmpresa.cognom1"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Cognom 2"
                  v-model="tutorEmpresa.cognom2"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="DNI/NIE"
                  v-model="tutorEmpresa.dni"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Nacionalitat"
                  v-model="tutorEmpresa.nacionalitat"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Càrrec"
                  v-model="tutorEmpresa.carrec"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Telèfon"
                  v-model="tutorEmpresa.telefon"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Correu electrònic"
                  v-model="tutorEmpresa.email"
                  class="q-pa-sm "
                />
              </div>
            </div>
            <div class="flex justify-end q-gutter-sm">
              <q-btn label="Guardar" type="submit" color="primary" v-close-popup/>
              <q-btn label="Tancar" color="primary"  v-close-popup/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirmationTutorEmpresa" persistent>
      <q-card style="width: 300px">
        <q-card-section class="bg-primary">
          <div class="text-h6">Esborrar Tutor d'Empresa</div>
        </q-card-section>
        <q-card-section class="q-pt-md">
          ¿Vols esborrar {{nameTutorEmpresaSelected}}?
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn color="primary" @click="deleteTutorEmpresa" label="SI" v-close-popup />
          <q-btn color="primary"  label="NO" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">

import {computed, onMounted, ref, Ref} from "vue";
import {Empresa} from "src/model/Empresa";
import {useRoute} from "vue-router";
import {EmpresaService} from "src/service/EmpresaService";
import {LlocTreball} from "src/model/LlocTreball";
import {TutorEmpresa} from "src/model/TutorEmpresa";

const addWorkspace = ref(false);
const confirmation = ref(false);
const addTutorEmpresa = ref(false);
const confirmationTutorEmpresa = ref(false);
const idCompany = ref<number>(0);
const nameWorkspaceSelected = ref('');
const idWorkspaceSelected = ref(0);
const nameTutorEmpresaSelected = ref('');
const idTutorEmpresaSelected = ref(0);
const companyData:Ref<Empresa> = ref({} as Empresa);
const workspace:Ref<LlocTreball> = ref({} as LlocTreball)
const tutorEmpresa:Ref<TutorEmpresa> = ref({} as TutorEmpresa);

async function saveWorkspace(){
  workspace.value.empresa = companyData.value;
  await EmpresaService.saveWorkspace(workspace.value);
  companyData.value = await EmpresaService.getCompanyById(idCompany.value);
}

async function saveTutorEmpresa(){
  tutorEmpresa.value.empresa = companyData.value;
  await EmpresaService.saveTutorEmpresa(tutorEmpresa.value);
  companyData.value = await EmpresaService.getCompanyById(idCompany.value);
}

async function updateCompany(){
  await EmpresaService.updateCompany(companyData.value);
}

async function updateWorkspace(workspace: LlocTreball) {
  const workspaceToSend:LlocTreball = { ...workspace, empresa: companyData.value };
  await EmpresaService.updateWorkspace(workspaceToSend);
}

async function updateTutorEmpresa(tutorEmpresa: TutorEmpresa){
    const tutorToSend:TutorEmpresa = { ...tutorEmpresa, empresa: companyData.value };
    await EmpresaService.updateTutorEmpresa(tutorToSend);
}

function deleteConfirmation(id:number,nom:string){
  confirmation.value = true;
  nameWorkspaceSelected.value = nom;
  idWorkspaceSelected.value = id;
}

function deleteConfirmationTutorEmpresa(id:number, nom:string){
  confirmationTutorEmpresa.value = true;
  nameTutorEmpresaSelected.value = nom;
  idTutorEmpresaSelected.value = id;
}

async function deleteWorkspace(){
  if ( companyData.value.llocsTreball !== undefined){
    const index = companyData.value.llocsTreball.findIndex(ll=> ll.idLlocTreball == idWorkspaceSelected.value);
    if(index !== -1){
      companyData.value.llocsTreball.splice(index,1);
      await EmpresaService.deleteWorkspace(idWorkspaceSelected.value);
    }
  }
}

async function deleteTutorEmpresa(){
  if ( companyData.value.tutorsEmpresa !== undefined){
    const index = companyData.value.tutorsEmpresa.findIndex(te => te.idTutorEmpresa == idTutorEmpresaSelected.value);
    if(index !== -1){
      companyData.value.tutorsEmpresa.splice(index,1);
      await EmpresaService.deleteTutorEmpresa(idTutorEmpresaSelected.value);
    }
  }
}


onMounted(async () =>{

  const route = useRoute();
  idCompany.value= Number(route.params.id);

  companyData.value = await EmpresaService.getCompanyById(idCompany.value);

})
</script>

<style scoped>
.text-wrap-center{
    text-wrap: wrap;
    text-align: center;
}
.text-wrap{
    text-wrap: wrap;
    text-align: left;
}
.border{
    border: 1px solid black;
}
.border-bottom{
    border-bottom: 1px solid black;
}
.fw-normal{
  font-weight: normal;
}
</style>
