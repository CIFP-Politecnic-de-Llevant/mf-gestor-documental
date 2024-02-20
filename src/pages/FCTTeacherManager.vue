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
      <h2>Cercant...</h2>
    </div>
    <div v-if="grupSelected && grupSelected.id && !isAuthorized && !isSearching">
      <h2>Usuari no autoritzat</h2>
    </div>
    <div v-if="grupSelected && grupSelected.id && isAuthorized && !isSearching">
      <p class="text-h5 q-mt-lg">Grup:  {{grupSelected.curs.nom}}{{grupSelected.nom}}</p>
      <p>Tutor FCT: {{tutorsFCT.map(t=>t.label).join(", ")}}</p>
      <!--q-btn @click="addDocument = true" label="Afegir documentació" color="primary" class="q-mt-md q-mb-lg" /-->

      <q-table
        flat bordered
        title="Documents del grup"
        :rows="documentsGrup"
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
                <q-file
                  v-model="props.row.file"
                  accept=".pdf"
                  label="Fitxer"
                  hint=".pdf"
                  clearable
                  dense
                  :disable="props.row.documentSignatures.some(s=>!s.signat)"
                  input-style="width: 50px;"
                  class="q-mr-xs"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>

                <q-btn
                  @click="sendFile(props.row)"
                  :color="props.row.documentSignatures.some(s=>!s.signat) ? 'white' : 'primary'"
                  :text-color="props.row.documentSignatures.some(s=>!s.signat) ? 'primary' : 'white'"
                  :disable="props.row.documentSignatures.some(s=>!s.signat)"
                  round
                  dense
                  icon="send"
                />

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
        :rows="documentsUsuari"
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
                <q-file
                  v-model="props.row.file"
                  accept=".pdf"
                  label="Fitxer"
                  hint=".pdf"
                  clearable
                  dense
                  :disable="props.row.documentSignatures.some(s=>!s.signat)"
                  input-style="width: 50px;"
                  class="q-mr-xs"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>

                <q-btn
                  @click="sendFile(props.row)"
                  :color="props.row.documentSignatures.some(s=>!s.signat) ? 'white' : 'primary'"
                  :text-color="props.row.documentSignatures.some(s=>!s.signat) ? 'primary' : 'white'"
                  :disable="props.row.documentSignatures.some(s=>!s.signat)"
                  round
                  dense
                  icon="send"
                />

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

    <q-dialog v-model="addDocument">
      <q-card style="width: 400px;">
        <q-card-section>
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">Afegir documentació</div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <q-select
              v-model="tipusDocumentExtra"
              :options="['Grup','Alumnat']"
              label="Tipus"
              input-debounce="0"
              clearable
              class="q-mb-md"
              @update:model-value="updateDocuments"
            />

            <q-select
              v-model="documentExtra.nomOriginal"
              :options="optionsDocumentExtra"
              label="Document"
              input-debounce="0"
              clearable
              class="q-mb-md"
            />

            <q-select v-if="tipusDocumentExtra==='Alumnat'" v-model="documentExtra.usuari"
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

            <q-file
              v-model="documentExtra.file"
              accept=".pdf"
              label="Fitxer"
              hint=".pdf"
              clearable
              dense
              class="q-mt-lg"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>

            <q-btn color="primary" class="q-mt-lg" @click="saveDocument(documentExtra,tipusDocumentExtra,documentExtra.usuari?.id)">Enviar document</q-btn>
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import {onMounted, Ref, ref} from "vue";
import {Usuari} from "src/model/Usuari";
import {Grup} from "src/model/Grup";
import {Document} from "src/model/Document";
import {Signatura} from "src/model/Signatura";
import {UsuariService} from "src/service/UsuariService";
import {GrupService} from "src/service/GrupService";
import {DocumentService} from "src/service/DocumentService";
import {SignaturaService} from "src/service/SignaturaService";
import {QTableColumn} from "quasar";
import {Rol} from "src/model/Rol";

const myUser:Ref<Usuari> = ref({} as Usuari);
const isSearching:Ref<boolean> = ref(false);
const isAuthorized:Ref<boolean> = ref(false);
const grups:Ref<Grup[]> = ref([] as Grup[]);
const grupSelected:Ref<Grup> = ref({} as Grup);
const tutorsFCT:Ref<Usuari[]> = ref([] as Usuari[]);
const documentsGrup:Ref<Document[]> = ref([] as Document[]);
const documentsUsuari:Ref<Document[]> = ref([] as Document[]);
const signatures:Ref<Signatura[]> = ref([] as Signatura[]);
const addDocument = ref(false);

const columnsGrup:Ref<QTableColumn[]> = ref([] as QTableColumn[])
const columnsUsuari:Ref<QTableColumn[]> = ref([] as QTableColumn[])

const documentExtra:Ref<Document> = ref({} as Document);
const tipusDocumentExtra:Ref<string> = ref("");
const alumnes:Ref<Usuari[]> = ref([] as Usuari[]);
const alumnesFiltered:Ref<Usuari[]> = ref([] as Usuari[]);
const optionsDocumentExtra:Ref<string[]> = ref([]);

const initialPagination = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 0
}

async function selectGrup(grup:Grup){
  isSearching.value = true;
  grupSelected.value = grup;
  tutorsFCT.value = await UsuariService.getTutorsFCTByCodiGrup(grupSelected.value.curs.nom+grupSelected.value.nom);
  const documentsAll = await DocumentService.getDocumentsByGrupCodi(grupSelected.value.curs.nom+grupSelected.value.nom);

  documentsUsuari.value = documentsAll.filter(d=>d.usuari).sort((a:Document, b:Document)=>{
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

  documentsGrup.value = documentsAll.filter(d=>!d.usuari).sort((a:Document, b:Document)=>{
    if(!a.tipusDocument){
      return -1;
    }
    if(!b.tipusDocument){
      return 1;
    }
    return  a.tipusDocument.nom.localeCompare(b.tipusDocument.nom)
  });

  //URL documents
  console.log(documentsUsuari.value)
  console.log(documentsGrup.value)
  isSearching.value = false;

  const rolsUser = JSON.parse(localStorage.getItem("rol")) || []; //Inicialitzem a un array buit si no existeix cap rol
  isAuthorized.value=!!tutorsFCT.value.find(u=>u.email===myUser.value.email) || rolsUser.some((r:string)=>r===Rol.ADMINISTRADOR || r===Rol.ADMINISTRADOR_FCT);
}

function signDoc(document:Document, signatura:Signatura, signat:boolean){
  console.log("Entra sign student")
  DocumentService.signarDocument(document,signatura,signat);
}

async function saveDocument(document:Document,tipus:string,idusuari?:number){
  const documentSaved:Document= await DocumentService.save(document,grupSelected.value.curs.nom+grupSelected.value.nom,idusuari);
  await sendFile(documentSaved);
  if(tipus==='Grup'){
    documentsGrup.value.push(documentSaved);
  } else {
    documentsUsuari.value.push(documentSaved);
  }
}

async function sendFile(document:Document){
  await DocumentService.uploadDocument(document);
  const documentSaved:Document = await DocumentService.getDocumentById(document.id);
  const fitxer = await DocumentService.getURLFitxerDocument(documentSaved);
  if(fitxer) {
    const documentGrup = documentsGrup.value.find(d=>d.id===documentSaved.id);
    const documentUsuari = documentsUsuari.value.find(d=>d.id===documentSaved.id);

    if(documentGrup){
      documentsGrup.value.find(d=>d.id===documentSaved.id)!.fitxer = fitxer;
    }

    if(documentUsuari){
      documentsUsuari.value.find(d=>d.id===documentSaved.id)!.fitxer = fitxer;
    }
  }
}

async function getURL(document:Document){
  const documentSaved:Document = await DocumentService.getDocumentById(document.id);
  const fitxer = await DocumentService.getURLFitxerDocument(documentSaved);
  if(fitxer) {
    window.open(fitxer.url, '_blank');
  }
}


function filterFn (val:string, update:Function, abort:Function) {
  update(() => {
    const needle = val.toLowerCase()
    alumnesFiltered.value = alumnes.value.filter( (v:Usuari) => v.nomComplet2.toLowerCase().indexOf(needle) > -1)
  })
}

function updateDocuments(){
  optionsDocumentExtra.value = [];

  if(tipusDocumentExtra.value==='Alumnat'){
    optionsDocumentExtra.value.push("Annex 4");
  }
  optionsDocumentExtra.value.push("Altra documentació");
}

onMounted(async ()=>{
  grups.value = await GrupService.findAllGrups();
  grups.value.sort((a:Grup, b:Grup)=>(a.curs.nom+a.nom).localeCompare(b.curs.nom+b.nom))

  signatures.value = await SignaturaService.findAll();

  myUser.value = await UsuariService.getProfile();

  alumnes.value = await UsuariService.getAlumnes();
  alumnesFiltered.value = await UsuariService.getAlumnes();


  //Grup
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
