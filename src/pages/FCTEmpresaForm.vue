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
      <div class="row flex justify-center q-my-sm">
        <div class="col-md-4" v-for="(value,key,index) in companyData" :key="key" v-show="key !== 'idEmpresa' && key !== 'llocsTreball'">
          <q-input
              filled
              type="text"
              :label="labelsCompany[index]"
              :readonly="readOnlyConditionCompany(key)"
              :bg-color="readOnlyConditionCompany(key) ? 'primary' : ''"
              v-model="companyData[key]"
              :model-value="companyData[key]"
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
        <div class="col-md-4" v-for="(value,key,index) in workspace" :key="key" v-show="key !== 'idLlocTreball' && key !== 'empresa'">
          <q-input
              filled
              type="text"
              :label="labelsWorkspace[index]"
              :readonly="readOnlyConditionWorkspace(key)"
              :bg-color="readOnlyConditionWorkspace(key) ? 'primary' : ''"
              v-model="workspace[key]"
              :model-value="workspace[key]"
              class="q-pa-sm "
          />
        </div>
        <div class="col-md-4">
        </div>
        <div class="col-md-4">
        </div>
      </div>
    </q-form>
    <q-dialog v-model="addWorkplace" persistent>
      <q-card style="max-width: 1000px;">
        <q-card-section>
          <q-form @submit="saveWorkplace"  class="q-gutter-md ">
            <p class="text-h5 q-mt-lg">Crear Lloc de treball</p>
            <div class="row flex justify-center">
              <div class="col-5 q-mx-sm q-my-sm" v-for="(value,key, index) in workplace" :key="index">
                <q-input
                  filled
                  type="text"
                  :label="labelsWorkspace[index+1]"
                  v-model="workplace[key]"
                />
              </div>
              <div class="col-5 q-mx-sm">
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
const readOnlyConditionCompany = computed(() => {
  return (key:string) => key === 'cif' || key === 'adreca' || key === 'nom'
})
const readOnlyConditionWorkspace = computed(() => {
  return (key:string) => key === 'nomRepresentantLegal'
})
const workplace:Ref<LlocTreball> = ref({nom:'', adreca:'', codiPostal: '', telefon: '',
  poblacio: '', activitat: '', nomRepresentantLegal: '', dniRepresentantLegal: '',
  nomTutorEmpresa: '', dniTutorEmpresa: '', municipi: '', carrecTutor: '', email: ''} as LlocTreball)
const labelsCompany = ["Id","Número Conveni","Número Annnex","Nom","CIF","Adreça",
    "Codi Postal","Població","Provicia","Telèfon"];

const labelsWorkspace = ["Id","Nom","Adreça", "Codi Postal","Telèfon","Població","Activitat","Nom Representant Legal",
    "DNI Representant Legal","Nom Tutor/a Empresa","DNI Tutor/a Empresa","Carrec Tutor/a","Municipi","E-mail","Empresa"];


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
