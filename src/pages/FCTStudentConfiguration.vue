<template>
  <q-page padding>
    <div>
      <p class="text-h5 q-mt-lg">Alumnes</p>
    </div>
    <q-form @submit="saveFile" class="q-gutter-md q-mt-md" style="display: flex">
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
        :columns="columns"
        row-key="numeroExpedient"
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
          <q-td key="numeroExpedient" :props="props" class="text-wrap">
            {{ props.row.numeroExpedient }}
          </q-td>
          <q-td key="nom" :props="props" class="text-wrap">
            {{ props.row.nom }}
          </q-td>
          <q-td key="cognom1" :props="props" class="text-wrap">
            {{ props.row.cognom1 }}
          </q-td>
          <q-td key="cognom2" :props="props" class="text-wrap">
            {{ props.row.cognom2 }}
          </q-td>
          <q-td>
            <div class="flex flex-end" style="width: 200px;">
              <q-btn
                  @click="editStudent(props.row.idAlumne)"
                  :color="'primary'"
                  :text-color="'white'"
                  round
                  dense
                  :icon="outlinedDriveFileRenameOutline"
              />

              <q-btn
                  @click="deleteStudent(props.row.numeroExpedient)"
                  :color="'primary'"
                  :text-color="'white'"
                  round
                  dense
                  class="q-ml-lg"
                  :icon="outlinedDelete"
              />
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <q-dialog v-model="seeStudentEdition">
      <q-card style="width: 400px;">
        <q-card-section>
          <q-card-section>
            <q-form @submit="updateStudent"  class="q-gutter-md">


            </q-form>
          </q-card-section>

          <q-separator />

          <q-card-section>

            <q-btn label="Guardar" type="submit" color="primary" v-close-popup/>
            <q-btn label="Tancar"  color="primary" v-close-popup/>
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">

import {onMounted, ref} from "vue";
import {UsuariService} from "src/service/UsuariService";
import {Ref} from "vue/dist/vue";
import {QTableColumn} from "quasar";
import {Alumne} from "src/model/Alumne";
const seeStudentEdition = ref(false);
import { outlinedDriveFileRenameOutline } from '@quasar/extras/material-icons-outlined'
import { outlinedDelete } from '@quasar/extras/material-icons-outlined'

const studentData:Ref<Alumne[]> = ref([] as Alumne[]);
const studentSelect:Ref<Alumne> = ref({} as Alumne);
const file = ref<File | null>(null);
const columns:Ref<QTableColumn[]> = ref([] as QTableColumn[])
const initialPagination = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 0
}

async function saveFile(){
    if(file !== null && file.value instanceof File){
        console.log(file.value);
        UsuariService.saveFileStudents(file.value);
    }else {
        console.log("El fitxer no s'ha guardat correctament");
    }
    file.value = null;
    studentData.value = await UsuariService.allStudents();
}
function updateStudent(){

}


function editStudent(id:number){

  const student  = studentData.value.find(a => a.idAlumne = id);

  if(student){
    studentSelect.value = student;
  }
  seeStudentEdition.value = true;

}

async function deleteStudent(exp:number){

  const index = studentData.value.findIndex(a => a.numeroExpedient == exp)

  if(index !== -1){
    studentData.value.splice(index,1);
    await UsuariService.deleteStudent(exp);
  }
}
onMounted(async () =>{

  studentData.value = await UsuariService.allStudents();

columns.value.push({
    name:'NumExp',
    label:'NºExpedient',
    field: 'NumExp',
    sortable: true

});
columns.value.push({
    name:'nom',
    label:'Nom',
    field: 'nom',
    sortable: true

});
columns.value.push({
    name:'cognom1',
    label:'1er Llinatge',
    field: 'cognom1',
    sortable: true

});
columns.value.push({
    name:'cognom2',
    label:'2on Llinatge',
    field: 'cognom2',
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
