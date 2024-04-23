<template>

  <q-page padding>
    <div>
      <p class="text-h5 q-mt-lg q-mb-lg">llistat d'Empreses</p>
      <q-btn icon="add" label="Empresa" type="submit" color="primary"/>
    </div>

    <q-table
      flat bordered
      title="Empreses"
      :rows="companyData"
      :columns="columns"
      row-key="nom"
      binary-state-sort
      class="q-mb-lg q-mt-lg"
      :pagination="initialPagination"
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
                <router-link :to="{ path: 'fct/empresaForm', params: {id: props.row.idEmpresa}}">
                  <q-btn
                    :color="'primary'"
                    :text-color="'white'"
                    round
                    dense
                    icon="drive_file_rename_outline"
                  />
                </router-link>

              <q-btn
                @click="deleteCompany(props.row.idEmpresa)"
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
            <div class="row flex justify-center">
              <div class="col-5 q-mx-sm" v-for="(value,key, index) in company" :key="index" v-show="key !== 'idEmpresa'">
                <q-input
                  filled
                  type="text"
                  :label="labels[index]"
                  :readonly=" key === 'numeroExpedient'"
                  v-model="company[key]"
                  :model-value="company[key]"
                />
              </div>
              <div class="col-5 q-mx-sm">
              </div>
            </div>
            <div class="flex justify-end q-gutter-sm">
              <q-btn label="Guardar Empresa" type="submit" color="primary" v-close-popup/>
              <q-btn label="Tancar"  color="primary"  v-close-popup/>
            </div>
          </q-form>
        </q-card-section>
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
const company:Ref<Empresa> = ref({} as Empresa);
const companyData:Ref<Empresa[]> = ref([] as Empresa[]);
const columns:Ref<QTableColumn[]> = ref([] as QTableColumn[]);
const labels = ["Id","Número Conveni","Número Annnex","Nom","CIF","Adreça",
  "Codi Postal","Població","Provicia","Telèfon"];
const initialPagination = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 0
};

async function saveCompany(){

    await EmpresaService.saveCompany(company.value);
}

async function deleteCompany(id:number){

    await EmpresaService.deleteCompany(id);
}

onMounted(async () =>{

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

</style>
