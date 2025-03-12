<template>
  <q-page padding>
    <div>
      <p class="text-h5  q-mb-lg">Editar Empresa</p>
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
            label="Població"
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
      </div>
    </q-form>
    <div class="q-mb-lg q-mt-xl">
      <q-btn icon="add"  @click="addWorkplace = true" label="Lloc Treball" type="submit" class="q-mt-sm" color="primary"/>
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
          />
          <q-btn
              @click="deleteConfirmation(workspace.idLlocTreball, workspace.nom)"
              :color="'grey'"
              :text-color="'white'"
              dense
              class="q-my-sm border q-mr-sm"
              icon="delete"
          />
        </div>
      </div>
      <div class="row flex justify-center q-my-sm">
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
            label="Nom Representant Legal"
            v-model="workspace.nomCompletRepresentantLegal"
            class="q-pa-sm "
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="DNI Representant Legal"
            v-model="workspace.dniRepresentantLegal"
            class="q-pa-sm "
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="Nom Tutor/a Empresa"
            v-model="workspace.nomCompletTutorEmpresa"
            class="q-pa-sm "
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="DNI Tutor/a Empresa"
            v-model="workspace.dniTutorEmpresa"
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
            label="Carrec Tutor/a"
            v-model="workspace.carrecTutor"
            class="q-pa-sm "
          />
        </div>
        <div class="col-md-4">
          <q-input
            filled
            type="text"
            label="E-mail tutor empresa"
            v-model="workspace.emailTutorEmpresa"
            class="q-pa-sm "
          />
        </div>
      </div>
    </q-form>
    <q-dialog v-model="addWorkplace" persistent>
      <q-card style="max-width: 1000px;">
        <q-card-section>
          <q-form @submit="saveWorkplace"  class="q-gutter-md ">
            <p class="text-h5 q-mt-lg">Crear Lloc de treball</p>
            <div class="row flex justify-center q-my-sm">
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Nom"
                  v-model="workplace.nom"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Adreça"
                  v-model="workplace.adreca"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Codi Postal"
                  v-model="workplace.codiPostal"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Telèfon"
                  v-model="workplace.telefon"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Població"
                  v-model="workplace.poblacio"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Activitat"
                  v-model="workplace.activitat"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Nom Representant Legal"
                  v-model="workplace.nomCompletRepresentantLegal"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="DNI Representant Legal"
                  v-model="workplace.dniRepresentantLegal"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Nom Tutor/a Empresa"
                  v-model="workplace.nomCompletTutorEmpresa"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="DNI Tutor/a Empresa"
                  v-model="workplace.dniTutorEmpresa"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Municipi"
                  v-model="workplace.municipi"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Carrec Tutor/a"
                  v-model="workplace.carrecTutor"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="E-mail tutor empresa"
                  v-model="workplace.emailTutorEmpresa"
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
          ¿Vols esborrar {{nameWorkspaceSelected}}?
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn color="primary" @click="deleteWorkspace" label="SI" v-close-popup />
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

const addWorkplace = ref(false);
const confirmation = ref(false);
const idCompany = ref<number>(0);
const nameWorkspaceSelected = ref('');
const idWorkspaceSelected = ref(0);
const companyData:Ref<Empresa> = ref({} as Empresa);
const workplace:Ref<LlocTreball> = ref({} as LlocTreball)

async function saveWorkplace(){

  workplace.value.empresa = companyData.value;
  await EmpresaService.saveWorkspace(workplace.value);
  companyData.value = await EmpresaService.getCompanyById(idCompany.value);

}
async function updateCompany(){

  await EmpresaService.updateCompany(companyData.value);

}
async function updateWorkspace(workspace: LlocTreball){

    await EmpresaService.updateWorkspace(workspace);
}

function deleteConfirmation(id:number,nom:string){

  confirmation.value = true;
  nameWorkspaceSelected.value = nom;
  idWorkspaceSelected.value = id;

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
