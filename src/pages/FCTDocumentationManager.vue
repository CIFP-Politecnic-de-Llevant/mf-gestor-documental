<template>
  <q-page padding>

    <q-btn-group push>
      <q-btn push label="Tots" icon="timeline" @click="filterDocuments('all')" />
      <q-btn push label="Pendents de validar" icon="visibility" @click="filterDocuments('pending')" />
      <q-btn push label="Acceptats" icon="done" @click="filterDocuments('accepted')" />
      <q-btn push label="Rebutjats" icon="deleted" @click="filterDocuments('rejected')" />
    </q-btn-group>

    <div v-for="grupFCT in grupsFCT">
      <h4>Grup:  {{grupFCT.grup.curs.nom}}{{grupFCT.grup.nom}}</h4>
      <p>Tutor FCT: {{grupFCT.tutorsFCT.map(t=>t.label).join(", ")}}</p>

      <q-table
        flat bordered
        title="Documents del grup"
        :rows="grupFCT.documentsGrup"
        :columns="columnsGrup"
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
              <q-select v-model="props.row.documentEstat" :options="[
                'PENDENT_SIGNATURES', 'ACCEPTAT', 'REBUTJAT'
              ]" label="Validat?" @update:model-value="changeEstatDocument(props.row,props.row.documentEstat)" />
            </q-td>
            <q-td key="tipusDocument" :props="props" class="text-wrap">
              {{ props.row.tipusDocument.nom }}
            </q-td>
            <q-td v-for="signatura in signatures" :key="signatura.id" :props="props">
              <q-checkbox
                v-if="props.row.documentSignatures.find(s=>s.signatura.id===signatura.id)"
                v-model="props.row.documentSignatures.find(s=>s.signatura.id===signatura.id).signat"
                @update:model-value="signDoc(props.row,signatura,props.row.documentSignatures.find(s=>s.signatura.id===signatura.id).signat)"
              />
            </q-td>
            <q-td>
              <div class="flex flex-center" style="width: 200px;">
                <q-btn
                  @click="getURL(props.row)"
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

      <q-table
        flat
        bordered
        title="Documents de l'usuari"
        :rows="grupFCT.documentsUsuari"
        :columns="columnsUsuari"
        row-key="name"
        binary-state-sort
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
              <q-select v-model="props.row.documentEstat" :options="[
                'PENDENT_SIGNATURES', 'ACCEPTAT', 'REBUTJAT'
              ]" label="Validat?" @update:model-value="changeEstatDocument(props.row,props.row.documentEstat)" />
            </q-td>
            <q-td key="alumne" :props="props" class="text-wrap">
              {{ props.row.usuari.nomComplet2 }}
            </q-td>
            <q-td key="tipusDocument" :props="props" class="text-wrap">
              {{ props.row.tipusDocument.nom }}
            </q-td>
            <q-td v-for="signatura in signatures" :key="signatura.id" :props="props">
              <q-checkbox
                v-if="props.row.documentSignatures.find(s=>s.signatura.id===signatura.id)"
                v-model="props.row.documentSignatures.find(s=>s.signatura.id===signatura.id).signat"
                @update:model-value="signDoc(props.row,signatura,props.row.documentSignatures.find(s=>s.signatura.id===signatura.id).signat)"
              />
            </q-td>
            <q-td>
              <div class="flex flex-center" style="width: 200px;">
                <q-btn
                  @click="getURL(props.row)"
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
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {onMounted, Ref, ref} from "vue";
import {Usuari} from "src/model/Usuari";
import {Grup} from "src/model/Grup";
import {Document} from "src/model/Document";
import {DocumentEstat} from "src/model/DocumentEstat";
import {Signatura} from "src/model/Signatura";
import {UsuariService} from "src/service/UsuariService";
import {GrupService} from "src/service/GrupService";
import {DocumentService} from "src/service/DocumentService";
import {SignaturaService} from "src/service/SignaturaService";
import {QTableColumn} from "quasar";

const grups:Ref<Grup[]> = ref([] as Grup[]);
const signatures:Ref<Signatura[]> = ref([] as Signatura[]);

const columnsGrup:Ref<QTableColumn[]> = ref([] as QTableColumn[])
const columnsUsuari:Ref<QTableColumn[]> = ref([] as QTableColumn[])

const grupsFCT = ref([] as any[]);

const initialPagination = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 0
}

async function setGrup(grup:Grup){
  const tutorsFCT = await UsuariService.getTutorsFCTByCodiGrup(grup.curs.nom+grup.nom);
  const documentsAll = await DocumentService.getDocumentsByGrupCodi(grup.curs.nom+grup.nom);

  const documentsUsuari = documentsAll.filter(d=>d.usuari).sort((a:Document, b:Document)=>{
    if(a.usuari && b.usuari && a.usuari.id!=b.usuari.id){
      return a.usuari.nomComplet2.localeCompare(b.usuari.nomComplet2);
    }
    if(!a.tipusDocument){
      return -1;
    }
    if(!b.tipusDocument){
      return 1;
    }
    if(a.tipusDocument.nom === b.tipusDocument.nom){
      return a.tipusDocument.nom.localeCompare(b.tipusDocument.nom);
    }
    return 0;
  });

  const documentsGrup = documentsAll.filter(d=>!d.usuari).sort((a:Document, b:Document)=>{
    if(!a.tipusDocument){
      return -1;
    }
    if(!b.tipusDocument){
      return 1;
    }
    return  a.tipusDocument.nom.localeCompare(b.tipusDocument.nom)
  });

  //URL documents
  console.log(documentsUsuari)
  console.log(documentsGrup)

  const documentFCT = {
    grup: grup,
    tutorsFCT: tutorsFCT,
    documentsUsuari: documentsUsuari,
    documentsGrup: documentsGrup,
  }

  grupsFCT.value.push(documentFCT);
}

function signDoc(document:Document, signatura:Signatura, signat:boolean){
  console.log("Entra sign student")
  DocumentService.signarDocument(document,signatura,signat);
}

function changeEstatDocument(document:Document, estat:string){
  DocumentService.changeEstatDocument(document, estat);
}

async function getURL(document:Document){
  const documentSaved:Document = await DocumentService.getDocumentById(document.id);
  const fitxer = await DocumentService.getURLFitxerDocument(documentSaved);
  if(fitxer) {
    window.open(fitxer.url, '_blank');
  }
}


async function filterDocuments(filter:string){
  await loadGrups()
  if(filter==='pending'){
    grupsFCT.value = grupsFCT.value.map(grupFCT=>{
      grupFCT.documentsGrup = grupFCT.documentsGrup.filter((d:any)=>d.documentEstat===DocumentEstat.PENDENT_SIGNATURES);
      grupFCT.documentsUsuari = grupFCT.documentsUsuari.filter((d:any)=>d.documentEstat===DocumentEstat.PENDENT_SIGNATURES);
      return grupFCT;
    });
  }else if(filter==='accepted'){
    grupsFCT.value = grupsFCT.value.map(grupFCT=>{
      grupFCT.documentsGrup = grupFCT.documentsGrup.filter((d:any)=>d.documentEstat===DocumentEstat.ACCEPTAT);
      grupFCT.documentsUsuari = grupFCT.documentsUsuari.filter((d:any)=>d.documentEstat===DocumentEstat.ACCEPTAT);
      return grupFCT;
    });
  } else if(filter==='rejected'){
    grupsFCT.value = grupsFCT.value.map(grupFCT=>{
      grupFCT.documentsGrup = grupFCT.documentsGrup.filter((d:any)=>d.documentEstat===DocumentEstat.REBUTJAT);
      grupFCT.documentsUsuari = grupFCT.documentsUsuari.filter((d:any)=>d.documentEstat===DocumentEstat.REBUTJAT);
      return grupFCT;
    });
  }
}

async function loadGrups(){
  grups.value = await GrupService.findAllGrups();
  grups.value.sort((a:Grup, b:Grup)=>(a.curs.nom+a.nom).localeCompare(b.curs.nom+b.nom))

  grupsFCT.value = [];
  for(const grup of grups.value){
    await setGrup(grup);
  }
}

onMounted(async ()=>{
  await loadGrups();

  signatures.value = await SignaturaService.findAll();

  //Grup
  columnsGrup.value.push({
    name: 'validat',
    label: 'Validat?',
    field: row => row.documentEstat,
    sortable: true
  });

  columnsGrup.value.push({
    name: 'tipusDocument',
    label: 'Document',
    field: row => row.tipusDocument.nom,
    sortable: true
  });

  for(const signatura of signatures.value){
    columnsGrup.value.push({
      name: signatura.id,
      label: signatura.nom,
      field: signatura.id,
      sortable: false
    });
  }
  columnsGrup.value.push({
    name: 'document',
    label: 'Document',
    field: row => row,
    sortable: false
  });

  //Usuari
  columnsUsuari.value.push({
    name: 'validat',
    label: 'Validat?',
    field: row => row.documentEstat,
    sortable: true
  });

  columnsUsuari.value.push({
    name: 'alumne',
    label: 'Alumne',
    field: row => row.usuari.nomComplet2,
    sortable: true
  });

  columnsUsuari.value.push({
    name: 'tipusDocument',
    label: 'Document',
    field: row => row.tipusDocument.nom,
    sortable: true
  });

  for(const signatura of signatures.value){
    columnsUsuari.value.push({
      name: signatura.id,
      label: signatura.nom,
      field: signatura.id,
      sortable: false
    });
  }

  columnsUsuari.value.push({
    name: 'document',
    label: 'Document',
    field: row => row,
    sortable: false
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
