<template>
  <q-page padding>
    <q-btn-dropdown color="primary" label="Usuaris">
      <q-list>
        <q-item v-for="autoritzat in autoritzats" clickable v-close-popup @click="selectAutoritzat(autoritzat)">
          <q-item-section>
            <q-item-label>{{autoritzat.label}}</q-item-label>
          </q-item-section>
        </q-item>
        <!--q-item clickable v-close-popup @click="onItemClick">
          <q-item-section>
            <q-item-label>Photos</q-item-label>
          </q-item-section>
        </q-item-->
      </q-list>
    </q-btn-dropdown>
    <div v-if="autoritzatSelected && autoritzatSelected.id">
      <p>Usuari seleccionat:  {{autoritzatSelected.label}}</p>
      <q-input outlined v-model="path" label="Path" />
      <q-btn label="Veure documents" @click="getDocuments()" />
    </div>


  </q-page>
</template>

<script lang="ts" setup>

import {onMounted, Ref, ref} from "vue";
import {Usuari} from "src/model/Usuari";
import {DocumentService} from "src/service/DocumentService";
import {useRoute} from "vue-router";
import {useQuasar} from "quasar";

const $q = useQuasar();
const $route = useRoute()

const autoritzats:Ref<Usuari[]> = ref([] as Usuari[]);
const autoritzatSelected:Ref<Usuari> = ref({} as Usuari);
const path:Ref<string> = ref('/');

function selectAutoritzat(autoritzat:Usuari){
  autoritzatSelected.value = autoritzat;
}

function getDocuments(){
  DocumentService.getDocumentsByPath(path.value,autoritzatSelected.value.email).then((documents)=>{

  })
}

onMounted(async ()=>{
  autoritzats.value = await DocumentService.getAutoritzats();
})

</script>
