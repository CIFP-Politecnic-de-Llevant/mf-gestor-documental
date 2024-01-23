<template>
  <q-page padding>
    <q-btn-dropdown color="primary" label="Usuaris">
      <q-list>
        <q-item v-for="autoritzat in autoritzats" clickable v-close-popup @click="selectAutoritzat(autoritzat)">
          <q-item-section>
            <q-item-label>{{autoritzat.label}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <div v-if="autoritzatSelected && autoritzatSelected.id">
      <p class="q-mt-md">Usuari seleccionat:  {{autoritzatSelected.label}}</p>
      <q-input outlined v-model="path" label="Path origen" />
      <q-input outlined v-model="pathDesti" label="Path destí" />
      <q-btn label="Veure documents nous a traspassar" class="q-mt-md" color="primary" @click="getDocuments()" />
    </div>

    <div v-if="documents.length>0">
      <q-list>
        <q-item v-for="document in documents">
          <q-item-section>
            <q-item-label>{{document.nomOriginal}}</q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              <q-select v-model="document.tipusDocument"
                        :options="tipusDocuments"
                        option-value="id"
                        option-label="nom"
                        label="Tipus de document"
                />
            </q-item-label>
          </q-item-section>
          <q-item-section>
            <q-item-label v-if="document.tipusDocument?.propietari===TipusDocumentPropietari.ALUMNE">
              <q-select v-model="document.usuari"
                        :options="alumnesFiltered"
                        option-value="id"
                        option-label="nomComplet2"
                        label="Alumne"
                        use-input
                        hide-selected
                        fill-input
                        clearable
                        @filter="filterFn"
              />
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-btn label="Traspassar documents" @click="traspassar()" />
    </div>

    <div v-if="hasResponseDocument && documents.length===0">
      <h5>No hi ha cap document nou a traspassar</h5>
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
import {UsuariService} from "src/service/UsuariService";
import {TipusDocumentService} from "src/service/TipusDocumentService";
import {TipusDocument} from "src/model/TipusDocument";
import {TipusDocumentPropietari} from "src/model/TipusDocumentPropietari";

const $q = useQuasar();
const $route = useRoute()

const autoritzats:Ref<Usuari[]> = ref([] as Usuari[]);
const autoritzatSelected:Ref<Usuari> = ref({} as Usuari);
const path:Ref<string> = ref('/');
const pathDesti:Ref<string> = ref('/');
const documents:Ref<Document[]> = ref([] as Document[]);
const tipusDocuments:Ref<TipusDocument[]> = ref([] as TipusDocument[]);
const alumnes:Ref<Usuari[]> = ref([] as Usuari[]);
const alumnesFiltered:Ref<Usuari[]> = ref([] as Usuari[]);
const hasResponseDocument:Ref<Boolean> = ref(false);

function selectAutoritzat(autoritzat:Usuari){
  autoritzatSelected.value = autoritzat;
}

async function getDocuments(){
  hasResponseDocument.value = true;
  documents.value = await DocumentService.getDocumentsNoTraspassatsByPath(path.value,autoritzatSelected.value.email);

  documents.value = documents.value.map((document:Document)=>{
    const documentParts:string[] = document.nomOriginal.split("_");

    console.log("documentParts",documentParts);
    let nomTipusDocument = '';
    let numExpedient = '';
    if(documentParts.length === 2){
      nomTipusDocument = documentParts[1];
    } else if(documentParts.length === 5){
      nomTipusDocument = documentParts[4];
      numExpedient = documentParts[3];
    }

    document.tipusDocument = tipusDocuments.value.find((tipusDocument:TipusDocument)=>tipusDocument.nom.trim()===nomTipusDocument.trim());
    document.usuari = alumnes.value.find((alumne:Usuari)=>alumne.numExpedient===numExpedient);
    return document;
  });
}

async function traspassar(){
  await DocumentService.traspassarDocument(documents.value,autoritzatSelected.value.email)
}

function filterFn (val:string, update:Function, abort:Function) {
  update(() => {
    const needle = val.toLowerCase()
    alumnesFiltered.value = alumnes.value.filter( (v:Usuari) => v.nomComplet2.toLowerCase().indexOf(needle) > -1)
  })
}

onMounted(async ()=>{
  autoritzats.value = await UsuariService.getAutoritzats();
  tipusDocuments.value = await TipusDocumentService.findAllTipusDocument();
  alumnes.value = await UsuariService.getAlumnes();
  alumnesFiltered.value = await UsuariService.getAlumnes();
})

</script>
