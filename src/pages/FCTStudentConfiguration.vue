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
        class="q-mb-lg q-mt-lg"
        :filter="filter"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Cerca">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>


      <template v-slot:body-cell-accions="props">
        <q-td :props="props">
            <div class="flex-inline">
              <q-btn
                  @click="editStudent(props.row.idAlumne)"
                  :color="'primary'"
                  :text-color="'white'"
                  round
                  dense
                  icon="drive_file_rename_outline"
              />

              <q-btn
                  @click="deleteConfirmation(props.row.numeroExpedient,props.row.nom,
                  props.row.cognom1,props.row.cognom2)"
                  :color="'primary'"
                  :text-color="'white'"
                  round
                  dense
                  class="q-ml-lg"
                  icon="delete"
              />
            </div>
          </q-td>
      </template>
    </q-table>
    <q-dialog v-model="seeStudentEdition" persistent>
      <q-card style="max-width: 1000px;">
        <q-card-section>
          <q-form @submit="updateStudent"  class="q-gutter-md ">
            <p class="text-h5 q-mt-lg">Editar Alumne</p>
            <div class="row flex justify-center q-gutter-y-md">
              <p class="text-h6 q-mt-lg col-md-12 text-wrap-center">Dades Personals</p>
              <div class="col-md-3 q-mx-sm" v-for="(value,key,index) in studentSelect" :key="key" v-show="key !== 'idAlumne' && dadesPersonals.includes(labels[index])">
                <q-input
                v-if="key !== 'sexe'"
                :class="{'bg-primary': key === 'numeroExpedient'}"
                filled
                type="text"
                :label="labels[index]"
                :readonly=" key === 'numeroExpedient'"
                v-model="studentSelect[key]"
                :model-value="studentSelect[key]"
                />
                <q-select
                v-if="key === 'sexe'"
                 filled
                 v-model="studentSelect[key]"
                :model-value ="studentSelect[key] === 'H'? 'Home': studentSelect[key] && studentSelect[key] === 'D'? 'Dona': studentSelect[key]"
                 :options="['Home','Dona']"
                 label="Sexe"
                />

              </div>
              <div class="col-md-3 q-mx-sm"></div>
              <div class="col-md-3 q-mx-sm"></div>
            </div>
            <div class="row flex justify-center q-gutter-y-md">
              <p class="text-h6 q-mt-lg col-md-12 text-wrap-center">Adreça</p>
              <div class="col-md-3 q-mx-sm" v-for="(value,key,index) in studentSelect" :key="key" v-show="key !== 'idAlumne' && adreca.includes(labels[index])">
                  <q-input
                    :class="{'bg-primary': key === 'numeroExpedient'}"
                    filled
                    type="text"
                    :label="labels[index]"
                    :readonly=" key === 'numeroExpedient'"
                    v-model="studentSelect[key]"
                    :model-value="studentSelect[key]"
                  />
                </div>
              <div class="col-md-3 q-mx-sm"></div>
              <div class="col-md-3 q-mx-sm"></div>
            </div>
            <div class="row flex justify-center q-gutter-y-md">
              <p class="text-h6 q-mt-lg col-md-12 text-wrap-center">Dades Tutor/a</p>
              <div class="col-md-3 q-mx-sm" v-for="(value,key,index) in studentSelect" :key="key" v-show="key !== 'idAlumne' && dadesTutor.includes(labels[index])">
                <q-input
                  :class="{'bg-primary': key === 'numeroExpedient'}"
                  filled
                  type="text"
                  :label="labels[index]"
                  :readonly=" key === 'numeroExpedient'"
                  v-model="studentSelect[key]"
                  :model-value="studentSelect[key]"
                />
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
          <q-btn @click="selectAll" label="Seleccionar tots" color="primary" class="q-mb-md"/>
          <q-btn @click="unselectAll" label="Desmarcar tots" color="primary" class="q-mb-md"/>
          <q-form @submit="saveStudents"  class="q-gutter-md ">
            <p class="text-h5 q-mt-lg">Alumnes a guardar</p>
            <div class="row flex justify-center">
              <div class="col-5 q-mx-sm" v-for="(student, index) in selectListStudents.sort(((a:any,b:any)=>(a.cognom1+a.cognom2+a.nom).localeCompare(b.cognom1+b.cognom1+b.nom)))" :key="index">
                  <q-checkbox
                    dense
                    v-model="student.noExisteix"
                    :label="`${student.cognom1} ${student.cognom2}, ${student.nom} (${student.numeroExpedient})`"
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
          ¿Vols esborrar a {{fulNameSelected}}?
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

const seeStudentEdition = ref(false);
const listStudents = ref(false);
const confirmation = ref(false);
const nExpAlumneSelected = ref<number>(0);
const fulNameSelected = ref<string>('');
const studentData:Ref<Alumne[]> = ref([] as Alumne[]);
const studentSelect:Ref<Alumne> = ref({} as Alumne);
const selectListStudents:Ref<Alumne[]> = ref([] as Alumne[]);
const file = ref<File | null>(null);
const columns:Ref<QTableColumn[]> = ref([] as QTableColumn[]);
const filter:Ref<string> = ref<string>('')

const labels = ["Id","Nom","1er Llinatge","2on Llinatge","Ensenyament","Estudis","Grup","Número d'Expedient",
  "Sexe","Data Naixement","Nacionalitat","País Naixement","Província Naixement","Localitat Naixement",
  "DNI","Targeta Sanitària","CIP","Adreça Completa","Municipi","Localitat","Codi Postal","Telèfon",
  "Telèfon Fix","E-mail","Tutor","Telèfon Tutor","E-mail Tutor","DNI Tutor","Adreça Tutor","Nacionalitat Tutor"];
const dadesPersonals = ["Nom","1er Llinatge","2on Llinatge","Ensenyament","Estudis","Grup","Número d'Expedient",
  "Sexe","Data Naixement","Nacionalitat","País Naixement","Província Naixement","Localitat Naixement",
  "DNI","Targeta Sanitària","CIP","Telèfon","Telèfon Fix","E-mail"];
const adreca = ["Adreça Completa","Municipi","Localitat","Codi Postal"];
const dadesTutor = ["Tutor","Telèfon Tutor","E-mail Tutor","DNI Tutor","Adreça Tutor","Nacionalitat Tutor"]

async function saveFile(){
    if(file !== null && file.value instanceof File){

      selectListStudents.value = await UsuariService.getStudentFromFile(file.value);
      listStudents.value = true;
    }else {
    }
    file.value = null;

}
async function saveStudents(){

  const studentsToSave = selectListStudents.value.filter(student => student.noExisteix);
  await UsuariService.saveStudents(studentsToSave);
  studentData.value = await UsuariService.allStudents();
}

async function updateStudent(){

    studentSelect.value.sexe = studentSelect.value.sexe?.substring(0,1);
    await UsuariService.updateStudent(studentSelect.value);

}
function editStudent(id:number){

  const student  = studentData.value.find(a => a.idAlumne === id);

  if(student){
    studentSelect.value = student;
  }
  seeStudentEdition.value = true;

}

function deleteConfirmation(exp:number, nom:string, cognom1:string, cognom2:string){

  fulNameSelected.value = nom + " " + cognom1 + " " + cognom2;
  nExpAlumneSelected.value = exp;
  confirmation.value = true;
}

async function deleteStudent(){

  const index = studentData.value.findIndex(a => a.numeroExpedient == nExpAlumneSelected.value)

  if(index !== -1){
    studentData.value.splice(index,1);
    await UsuariService.deleteStudent(nExpAlumneSelected.value);
  }
}

function selectAll(){
  selectListStudents.value.forEach(student => student.noExisteix = true);
}

function unselectAll(){
  selectListStudents.value.forEach(student => student.noExisteix = false);
}

onMounted(async () =>{

  studentData.value = await UsuariService.allStudents();

columns.value.push({
    name:'numeroExpedient',
    label:'NºExpedient',
    required: true,
    field: row => row.numeroExpedient,
    sortable: true,
    align: 'left'
});
columns.value.push({
    name:'nom',
    label:'Nom',
    required: true,
    field: row => row.nom,
    sortable: true,
    align: 'left'
});
columns.value.push({
    name:'cognom1',
    label:'1er Llinatge',
    required: true,
    field: row => row.cognom1,
    sortable: true,
    align: 'left'
});
columns.value.push({
    name:'cognom2',
    label:'2on Llinatge',
    field: row => row.cognom2,
    sortable: true,
    align: 'left'
});
columns.value.push({
    name:'accions',
    label:'Accions',
    field: 'accions',
    align: 'right'
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
