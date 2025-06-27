<template>

  <q-page padding>
    <div>
      <p class="text-h5 q-mt-lg q-mb-lg">Llistat de llocs de treballs sense validar</p>
    </div>

    <q-table
      flat bordered
      title="Llocs de Treball"
      :rows="workspaces"
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
          <q-td key="adreca" :props="props" class="text-wrap-center">
            {{ props.row.adreca }}
          </q-td>
          <q-td key="activitat" :props="props" class="text-wrap-center">
            {{ props.row.activitat }}
          </q-td>
          <q-td key="emailcreator" :props="props" class="text-wrap-center">
            {{ props.row.emailCreator }}
          </q-td>
          <q-td class="text-wrap-center">
            <div>
              <q-btn
                :to="{ name: 'empresaForm', params: {id: props.row.idEmpresa}}"
                :color="'primary'"
                :text-color="'white'"
                round
                dense
                class="q-ml-lg"
                icon="visibility"
                target="_blank"
              >
                <q-tooltip>
                  Veure lloc de treball a l'empresa
                </q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">

import {onMounted, Ref, ref} from "vue";
import {Empresa} from "src/model/Empresa";
import {QTableColumn} from "quasar";
import {EmpresaService} from "src/service/EmpresaService";
import {LlocTreball} from "src/model/LlocTreball";

const workspaces:Ref<LlocTreball[]> = ref([] as LlocTreball[]);
const columns:Ref<QTableColumn[]> = ref([] as QTableColumn[]);
const initialPagination = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 0
};
const filter = ref('');

onMounted(async () =>{

  workspaces.value = await EmpresaService.allWorkspacesNotValidated();

  console.log("Llocs de treball no validats: ", workspaces.value);

  columns.value.push({
    name:'nom',
    label:'Nom',
    field: row => row.nom,
    sortable: true

  });
  columns.value.push({
    name:'adreca',
    label:'Adreça',
    field: row => row.adreca,
    sortable: true

  });
  columns.value.push({
    name:'activitat',
    label:'Activitat',
    field: row => row.activitat,
    sortable: true
  });
  columns.value.push({
    name:'emailcreator',
    label:'Email Creador',
    field: row => row.emailCreator,
    sortable: true
  });
  columns.value.push({
    name:'accions',
    label:'Accions',
    field: row => row
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
