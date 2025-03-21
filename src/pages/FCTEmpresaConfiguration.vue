<template>

  <q-page padding>
    <div>
      <p class="text-h5 q-mt-lg q-mb-lg">Llistat d'Empreses</p>
      <q-btn icon="add" @click="addCompany = true" label="Empresa" type="submit" color="primary"/>
    </div>

    <q-table
      flat bordered
      title="Empreses"
      :rows="companiesData"
      :columns="columns"
      row-key="nom"
      binary-state-sort
      class="q-mb-lg q-mt-lg"
      :pagination="initialPagination"
      :filter="filter"
    >
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="text-wrap-center"
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="nom" :props="props" class="text-wrap-center">
            {{ props.row.nom }}
          </q-td>
          <q-td key="cif" :props="props" class="text-wrap-center">
            {{ props.row.cif }}
          </q-td>
          <q-td class="text-wrap-center">
            <div>
                <router-link :to="{ name: 'empresaForm', params: {id: props.row.idEmpresa}}">
                  <q-btn
                    :color="'primary'"
                    :text-color="'white'"
                    round
                    dense
                    icon="drive_file_rename_outline"
                  />
                </router-link>

              <q-btn
                @click="deleteConfirmation(props.row.idEmpresa, props.row.nom)"
                :color="'primary'"
                :text-color="'white'"
                round
                dense
                class="q-ml-lg"
                icon="delete"
              />
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog v-model="addCompany" persistent>
      <q-card style="max-width: 1000px;">
        <q-card-section>
          <q-form @submit="saveCompany"  class="q-gutter-md ">
            <p class="text-h5 q-mt-lg">Crear Empresa</p>
            <div class="row flex justify-center q-my-sm">
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Número Conveni"
                  v-model="company.numeroConveni"
                  class="q-pa-sm"
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="E-mail empresa"
                  v-model="company.emailEmpresa"
                  class="q-pa-sm"
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Nom"
                  v-model="company.nom"
                  class="q-pa-sm"
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="CIF"
                  v-model="company.cif"
                  class="q-pa-sm"
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Adreça"
                  v-model="company.adreca"
                  class="q-pa-sm"
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Codi Postal"
                  v-model="company.codiPostal"
                  class="q-pa-sm"
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Població"
                  v-model="company.poblacio"
                  class="q-pa-sm"
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Província"
                  v-model="company.provincia"
                  class="q-pa-sm"
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Telèfon"
                  v-model="company.telefon"
                  class="q-pa-sm"
                />
              </div>
            </div>
            <div class="flex justify-end q-gutter-sm">
              <q-btn label="Guardar Empresa" type="submit" color="primary" v-close-popup/>
              <q-btn label="Tancar" color="primary"  v-close-popup/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirmation" persistent>
      <q-card style="width: 300px">
        <q-card-section class="bg-primary">
          <div class="text-h6">Esborrar Empresa</div>
        </q-card-section>
        <q-card-section class="q-pt-md">
          ¿Vols esborrar l'empresa {{nameCompanySelected}}?
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn color="primary" @click="deleteCompany" label="SI" v-close-popup />
          <q-btn color="primary"  label="NO" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">

import {onMounted, Ref, ref} from "vue";
import {Empresa} from "src/model/Empresa";
import {QTableColumn} from "quasar";
import {EmpresaService} from "src/service/EmpresaService";

const addCompany = ref(false);
const confirmation = ref(false);
const idCompanySelected = ref<number>(0)
const nameCompanySelected = ref('');
const company:Ref<Empresa> = ref({} as Empresa);
const companiesData:Ref<Empresa[]> = ref([] as Empresa[]);
const columns:Ref<QTableColumn[]> = ref([] as QTableColumn[]);
const initialPagination = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 0
};
const filter = ref('');

async function saveCompany(){

    await EmpresaService.saveCompany(company.value);
    companiesData.value = await EmpresaService.allCompanies();
    company.value.numeroConveni = "";
    company.value.emailEmpresa = "";
    company.value.nom = "";
    company.value.cif = "";
    company.value.adreca = "";
    company.value.codiPostal = "";
    company.value.poblacio = "";
    company.value.provincia = "";
    company.value.telefon = "";

}

function deleteConfirmation(id:number,nom:string){

  confirmation.value = true;
  nameCompanySelected.value = nom;
  idCompanySelected.value = id;

}

async function deleteCompany(){

  const index = companiesData.value.findIndex(c=> c.idEmpresa == idCompanySelected.value);

  if(index !== -1){

    companiesData.value.splice(index,1);
    await EmpresaService.deleteCompany(idCompanySelected.value);
  }
}

onMounted(async () =>{

  companiesData.value = await EmpresaService.allCompanies();

  company.value;

  columns.value.push({
    name:'nom',
    label:'Nom',
    field: row => row.nom,
    sortable: true

  });
  columns.value.push({
    name:'cif',
    label:'CIF',
    field: row => row.cif,
    sortable: true

  });
  columns.value.push({
    name:'accions',
    label:'Accions',
    field: 'accions',
  });

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
</style>
