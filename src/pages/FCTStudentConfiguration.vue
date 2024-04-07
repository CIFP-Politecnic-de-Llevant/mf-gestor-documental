<template>
  <q-page padding>
    <div>
      <p class="text-h5 q-mt-lg">Alumnes</p>
    </div>
    <q-form @submit="saveFile" class="q-gutter-md" style="display: flex">
      <q-file
        v-model="file"
        accept=".xls"
        label="Fitxer"
        hint=".xls"
        clearable
        dense
        style="max-width: 300px;  margin-right: 10px;"
      ></q-file>
      <div>
        <q-btn label="Guardar" type="submit" color="primary"/>
      </div>
    </q-form>

    <q-table
        flat bordered
        title="Alumnes"
        :rows="studentData"
        :columns="studentData"
        row-key="name"
        binary-state-sort
        class="q-mb-lg"
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
          <q-td key="tipusDocument" :props="props" class="text-wrap">
            {{ props.row}}
          </q-td>
          <q-td :props="props">
            {{ props.row}}
          </q-td>
          <q-td>
            <div class="flex flex-center" style="width: 200px;">

              <q-btn
                  @click="updateStudent()"
                  :color="props.row.documentSignatures && props.row.documentSignatures.some(s=>!s.signat) ? 'white' : 'primary'"
                  :text-color="props.row.documentSignatures && props.row.documentSignatures.some(s=>!s.signat) ? 'primary' : 'white'"
                  :disable="props.row.documentSignatures && props.row.documentSignatures.some(s=>!s.signat)"
                  round
                  dense
                  icon="send"
              />

              <q-btn
                  @click="deleteStudent()"
                  :color="!props.row.fitxer ? 'white' : 'primary'"
                  :text-color="!props.row.fitxer ? 'primary' : 'white'"
                  :disable="!props.row.fitxer"
                  round
                  dense
                  class="q-ml-xs"
                  icon="picture_as_pdf"
              />
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-page>
</template>

<script setup lang="ts">

import {ref} from "vue";
import {UsuariService} from "src/service/UsuariService";
import {Ref} from "vue/dist/vue";

const headerTable:Ref<string[]> = ref(["NºExpedient","Nom","1er Llinatge","2on Llinatge"]);
const studentData = [];
const file = ref<File | null>(null);
const initialPagination = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 0
}

function saveFile(){
    if(file !== null && file.value instanceof File){
        console.log(file.value);
        UsuariService.saveFileStudents(file.value);
    }else {
        console.log("El fitxer no s'ha guardat correctament");
    }
    file.value = null;
}
function updateStudent(){

}

function deleteStudent(){

}
</script>

<style scoped>

</style>
