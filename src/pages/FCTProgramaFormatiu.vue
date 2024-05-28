<template>
  <q-page padding>
    <q-btn-dropdown color="primary" label="Grups">
      <q-list>
        <q-item v-for="grup in grups" clickable v-close-popup @click="selectGrup(grup)">
          <q-item-section>
            <q-item-label>{{grup.curs.nom}}{{grup.nom}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <div v-if="isSearching">
        <div>
            <p class="text-h5 q-mt-lg">Programa Formatiu: {{grupSelected.curs.nom}}{{grupSelected.nom}}</p>
            <q-btn icon="add" @click="addTask = true" label="Programa Formatiu" type="submit" color="primary"/>
        </div>
      <q-banner rounded v-if="maxTasks" inline-actions class="text-white q-mt-sm bg-red">
        Al programa formatiu de l'alumne només sortiran 10 ítems.
      </q-banner>
      <q-table
        flat bordered
        title="Programa Formatiu"
        :rows="pFormatiuGrupSelected"
        row-key="descripcio"
        binary-state-sort
        class="q-mb-lg q-mt-sm"
        :pagination="initialPagination"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th class="text-wrap-center" style="width: 75%">
              DESCRIPCIO
            </q-th>
            <q-th class="text-wrap-center">
              ACCIONS
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="descripcio" :props="props" class="text-wrap-center">
              {{ props.row.descripcio }}
            </q-td>
            <q-td class="text-wrap-center">
              <div>
                <q-btn
                  @click="editTask(props.row.idPFormatiu)"
                  :color="'primary'"
                  :text-color="'white'"
                  round
                  dense
                  class="q-ml-lg"
                  icon="save"
                />
                <q-btn
                  @click="deleteConfirmation(props.row.idPFormatiu)"
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
        <q-dialog v-model="addTask" persistent>
            <q-card style="max-width: 1000px;">
                <q-card-section>
                    <q-form @submit="saveTask"  class="q-gutter-md ">
                        <p class="text-h5 q-mt-lg">Crear Tasca</p>
                        <q-input
                          filled
                          type="textarea"
                          label="Descripció"
                          v-model="task.descripcio"
                        />
                        <div class="flex justify-end q-gutter-sm">
                            <q-btn label="Guardar Tasca" type="submit" color="primary" v-close-popup/>
                            <q-btn label="Tancar" color="primary"  v-close-popup/>
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>
        <q-dialog v-model="taskEdit" persistent>
            <q-card style="max-width: 1000px;">
                <q-card-section>
                    <q-form @submit="saveTask"  class="q-gutter-md ">
                        <p class="text-h5 q-mt-lg">Modificar Tasca</p>
                        <q-input
                                filled
                                type="textarea"
                                label="Descripció"
                                v-model="updateTask.descripcio"
                        />
                        <div class="flex justify-end q-gutter-sm">
                            <q-btn label="Actualitzar Tasca" type="submit" color="primary" v-close-popup/>
                            <q-btn label="Tancar" color="primary"  v-close-popup/>
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>
        <q-dialog v-model="confirmation" persistent>
            <q-card style="width: 300px">
                <q-card-section class="bg-primary">
                    <div class="text-h6">Esborrar Tasca</div>
                </q-card-section>
                <q-card-section class="q-pt-md">
                    ¿Vols esborrar aquesta tasca?
                </q-card-section>
                <q-card-actions align="right" class="bg-white text-teal">
                    <q-btn color="primary" @click="deleteTask" label="SI" v-close-popup />
                    <q-btn color="primary"  label="NO" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </div>
  </q-page>
</template>

<script setup lang="ts">

import {onMounted, ref, Ref} from "vue";
import {Grup} from "src/model/Grup";
import {GrupService} from "src/service/GrupService";
import {ProgramaFormatiu} from "src/model/ProgramaFormatiu";
import {ProgramaFormatiuService} from "src/service/ProgramaFormatiuService";

const maxTasks:Ref<boolean> = ref(false);
const addTask:Ref<boolean> = ref(false);
const isSearching:Ref<boolean> = ref(false);
const confirmation:Ref<boolean> = ref(false);
const taskEdit:Ref<boolean> = ref(false);
const idTask = ref<number>(0);
const grups:Ref<Grup[]> = ref([] as Grup[]);
const allPFormatiu:Ref<ProgramaFormatiu[]> = ref([] as ProgramaFormatiu[]);
const pFormatiuGrupSelected:Ref<ProgramaFormatiu[]> = ref([] as ProgramaFormatiu[]);
const task:Ref<ProgramaFormatiu> = ref({} as ProgramaFormatiu);
const updateTask:Ref<ProgramaFormatiu> = ref({} as ProgramaFormatiu);
const grupSelected:Ref<Grup> = ref({} as Grup);
const initialPagination = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 0
}

async function deleteTask(){

    const index = pFormatiuGrupSelected.value.findIndex(pf => pf.idPFormatiu == idTask.value)

    if(index !== -1) {
        pFormatiuGrupSelected.value.splice(index, 1);
        await ProgramaFormatiuService.deleteTask(idTask.value);
    }
  maximumTasks();
}

function deleteConfirmation(id:number){

    idTask.value = id;
    confirmation.value = true;

}

async function editTask(id:number){

  const taskUpdated = pFormatiuGrupSelected.value.find(pf => pf.idPFormatiu === id);

  if(taskUpdated){
    updateTask.value = taskUpdated;
  }
  taskEdit.value = true;
}

async function saveTask(){

    if(addTask.value){
        task.value.idGrup = grupSelected.value.id;
        await ProgramaFormatiuService.saveTask(task.value);
        allPFormatiu.value = await ProgramaFormatiuService.findAllPFormatiu();
        pFormatiuGrupSelected.value = allPFormatiu.value.filter((pf) => pf.idGrup === grupSelected.value.id);
        task.value.descripcio = "";
    }else{
        await ProgramaFormatiuService.saveTask(updateTask.value);
    }

    maximumTasks();
}

function maximumTasks(){

  pFormatiuGrupSelected.value.length > 10 ? maxTasks.value = true : maxTasks.value = false;
  console.log(pFormatiuGrupSelected.value.length)
  console.log(maxTasks.value);
}
async function selectGrup(grup:Grup){

    isSearching.value = true;
    grupSelected.value = grup;
    allPFormatiu.value = await ProgramaFormatiuService.findAllPFormatiu();
    pFormatiuGrupSelected.value = allPFormatiu.value.filter((pf) => pf.idGrup === grup.id);
    maximumTasks();
}

onMounted(async()=>{
  grups.value = await GrupService.findAllGrups();
  grups.value.sort((a:Grup, b:Grup)=>(a.curs.nom+a.nom).localeCompare(b.curs.nom+b.nom))
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
