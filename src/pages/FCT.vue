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
      <q-input outlined v-model="path" label="Path origen" />
      <q-input outlined v-model="pathDesti" label="Path destí" />
      <q-btn label="Veure documents" @click="getDocuments()" />
    </div>


  </q-page>
</template>

<script lang="ts" setup>

import {onMounted, Ref, ref} from "vue";
import {Usuari} from "src/model/Usuari";
import {Document} from "src/model/Document";
import {DocumentService} from "src/service/DocumentService";
import {useRoute} from "vue-router";
import {useQuasar} from "quasar";

const $q = useQuasar();
const $route = useRoute()

const autoritzats:Ref<Usuari[]> = ref([] as Usuari[]);
const autoritzatSelected:Ref<Usuari> = ref({} as Usuari);
const path:Ref<string> = ref('/');
const pathDesti:Ref<string> = ref('/');
const documents:Ref<Document[]> = ref([] as Document[]);

function selectAutoritzat(autoritzat:Usuari){
  autoritzatSelected.value = autoritzat;
}

async function getDocuments(){
  documents.value = await DocumentService.getDocumentsByPath(path.value,autoritzatSelected.value.email);
}

onMounted(async ()=>{
  autoritzats.value = await DocumentService.getAutoritzats();
})

</script>
