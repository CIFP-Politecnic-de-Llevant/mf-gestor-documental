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
        <q-btn label="Obrir" type="submit" color="primary"/>
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
          <q-td key="numeroExpedient" :props="props" class="text-wrap-center">
            {{ props.row.numeroExpedient }}
          </q-td>
          <q-td key="nom" :props="props" class="text-wrap-center">
            {{ props.row.nom }}
          </q-td>
          <q-td key="cognom1" :props="props" class="text-wrap-center">
            {{ props.row.cognom1 }}
          </q-td>
          <q-td key="cognom2" :props="props" class="text-wrap-center">
            {{ props.row.cognom2 }}
          </q-td>
          <q-td class="text-wrap-center">
            <div>
              <q-btn
                  @click="editStudent(props.row.idAlumne)"
                  :color="'primary'"
                  :text-color="'white'"
                  round
                  dense
                  icon="drive_file_rename_outline"
              />

              <q-btn
                  @click="deleteConfirmation(props.row.numeroExpedient)"
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
    <q-dialog v-model="seeStudentEdition" persistent>
      <q-card style="max-width: 1000px;">
        <q-card-section>
          <q-form @submit="updateStudent"  class="q-gutter-md ">
            <p class="text-h5 q-mt-lg">Editar Alumne</p>
            <div class="row flex justify-center q-gutter-y-md">
              <div class="col-md-3 q-mx-sm" v-for="(value,key,index) in studentSelect" :key="key" v-show="key !== 'idAlumne'">
                <q-input
                filled
                type="text"
                :label="labels[index]"
                :readonly=" key === 'numeroExpedient'"
                v-model="studentSelect[key]"
                :model-value="studentSelect[key]"
                />
              </div>
                <div class="col-md-3 q-mx-sm">
                </div>
            </div>
            <div class="flex justify-end q-gutter-sm">
              <q-btn label="Guardar" type="submit" color="primary" v-close-popup/>
              <q-btn label="Tancar"  color="primary"  v-close-popup/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="listStudents" persistent>
      <q-card style="max-width: 1000px;">
        <q-card-section>
          <q-form @submit="saveStudents"  class="q-gutter-md ">
            <p class="text-h5 q-mt-lg">Alumnes a guardar</p>
            <div class="row flex justify-center">
              <div class="col-5 q-mx-sm" v-for="(student, index) in selectListStudents" :key="index">
                  <q-checkbox
                    dense
                    v-model="student.noExisteix"
                    :label=" student.numeroExpedient + ' - ' + student.nom + ' '  + student.cognom1 + ' ' + student.cognom2"
                    color="teal" />
              </div>
                <div v-if="selectListStudents.length % 2 !== 0" class="col-5 q-mx-sm">
                </div>
            </div>
            <div class="flex justify-end q-gutter-sm">
              <q-btn label="Guardar Alumnes" type="submit" color="primary" v-close-popup/>
              <q-btn label="Tancar"  color="primary"  v-close-popup/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirmation" persistent>
      <q-card style="width: 300px">
          <q-card-section class="bg-primary">
              <div class="text-h6">Esborrar Alumne</div>
          </q-card-section>
        <q-card-section class="q-pt-md">
          ¿Segur que vols esborrar l'alumne?
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn color="primary" @click="deleteStudent" label="SI" v-close-popup />
          <q-btn color="primary"  label="NO" v-close-popup />
        </q-card-actions>
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
import { outlinedDriveFileRenameOutline } from '@quasar/extras/material-icons-outlined'


const seeStudentEdition = ref(false);
const listStudents = ref(false);
const confirmation = ref(false);
const nExpAlumne = ref<number>(0);
const studentData:Ref<Alumne[]> = ref([] as Alumne[]);
const studentSelect:Ref<Alumne> = ref({} as Alumne);
const selectListStudents:Ref<Alumne[]> = ref([] as Alumne[]);
const file = ref<File | null>(null);
const columns:Ref<QTableColumn[]> = ref([] as QTableColumn[]);
const initialPagination = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 0
};
const labels = ["Id","Nom","1er Llinatge","2on Llinatge","Ensenyament","Estudis","Grup","Número d'Expedient",
  "Sexe","Data Naixement","Nacionalitat","País Naixement","Província Naixement","Localitat Naixement",
  "DNI","Targeta Sanitària","CIP","Adreça Completa","Municipi","Localitat","Codi Postal","Telèfon",
  "Telèfon Fix","E-mail","Tutor","Telèfon Tutor","E-mail Tutor","DNI Tutor","Adreça Tutor","Nacionalitat Tutor"];

async function saveFile(){
    if(file !== null && file.value instanceof File){

      selectListStudents.value = await UsuariService.getStudentFromFile(file.value);
      listStudents.value = true;
    }else {
    }
    file.value = null;
    //studentData.value = await UsuariService.allStudents();
}
async function saveStudents(){

    const studentsToSave = selectListStudents.value.filter(student => student.noExisteix);
    await UsuariService.saveStudents(studentsToSave);
    studentData.value = await UsuariService.allStudents();
}

async function updateStudent(){

  await UsuariService.updateStudent(studentSelect.value);

}
function editStudent(id:number){

  const student  = studentData.value.find(a => a.idAlumne === id);

  if(student){
    studentSelect.value = student;
  }
  seeStudentEdition.value = true;

}

function deleteConfirmation(exp:number){

  nExpAlumne.value = exp;
  confirmation.value = true;
}

async function deleteStudent(){

  const index = studentData.value.findIndex(a => a.numeroExpedient == nExpAlumne.value)

  if(index !== -1){
    studentData.value.splice(index,1);
    await UsuariService.deleteStudent(nExpAlumne.value);
  }
}
onMounted(async () =>{

  studentData.value = await UsuariService.allStudents();

columns.value.push({
    name:'numeroExpedient',
    label:'NºExpedient',
    field: row => row.numeroExpedient,
    sortable: true

});
columns.value.push({
    name:'nom',
    label:'Nom',
    field: row => row.nom,
    sortable: true

});
columns.value.push({
    name:'cognom1',
    label:'1er Llinatge',
    field: row => row.alumne.cognom1,
    sortable: true

});
columns.value.push({
    name:'cognom2',
    label:'2on Llinatge',
    field: row => row.alumne.cognom2,
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
