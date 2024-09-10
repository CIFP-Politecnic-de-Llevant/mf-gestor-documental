<template>
  <q-page padding>

    <div class="q-mb-lg">
      <q-btn-dropdown class="q-mt-md q-mr-md q-ml-sm" color="primary" label="Convocatòria" menu-self="top middle">
        <q-list>
          <q-item v-for="convocatoria in convocatories" clickable v-close-popup @click="selectConvocatoria(convocatoria)">
            <q-item-section>
              <q-item-label>{{convocatoria.nom}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>

    <div>
      <q-btn-dropdown color="primary" label="Grups">
        <q-list>
          <q-item v-for="grup in grups" clickable v-close-popup @click="selectGrup(grup)">
            <q-item-section>
              <q-item-label>{{grup.curs.nom}}{{grup.nom}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>

    <div v-if="isSearching">
      <h2>Cercant...</h2>
    </div>
    <div v-if="grupSelected && grupSelected.id && !isAuthorized && !isSearching">
      <h2>Usuari no autoritzat</h2>
    </div>
    <div v-if="grupSelected && grupSelected.id && isAuthorized && !isSearching">
      <p class="text-h5 q-mt-lg">Grup:  {{grupSelected.curs.nom}}{{grupSelected.nom}}</p>
      <p>Tutor FCT: {{tutorsFCT.map(t=>t.label).join(", ")}}</p>

      <q-btn @click="addDocument = true" label="Afegir documentació" color="primary" class="q-mt-md q-mb-lg" icon="post_add" />


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
                v-if="props.row.documentSignatures && props.row.documentSignatures.find(s=>s.signatura.id===signatura.id)"
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
                  :disable="props.row.documentSignatures && props.row.documentSignatures.some(s=>!s.signat)"
                  input-style="width: 50px;"
                  class="q-mr-xs"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>

                <q-btn
                  @click="sendFile(props.row)"
                  :color="props.row.documentSignatures && props.row.documentSignatures.some(s=>!s.signat) ? 'white' : 'primary'"
                  :text-color="props.row.documentSignatures && props.row.documentSignatures.some(s=>!s.signat) ? 'primary' : 'white'"
                  :disable="props.row.documentSignatures && props.row.documentSignatures.some(s=>!s.signat)"
                  round
                  dense
                  icon="send"
                />

                <q-btn
                  @click="viewPdf(props.row)"
                  :color="!props.row.fitxer ? 'white' : 'primary'"
                  :text-color="!props.row.fitxer ? 'primary' : 'white'"
                  :disable="!props.row.fitxer"
                  round
                  dense
                  class="q-ml-xs"
                  icon="plagiarism"
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

                <q-btn
                  @click="deleteDocument(props.row)"
                  :color="!props.row.fitxer ? 'white' : 'primary'"
                  :text-color="!props.row.fitxer ? 'primary' : 'white'"
                  :disable="!checkDeletePermission(props.row)"
                  round
                  dense
                  class="q-ml-xs"
                  icon="delete"
                />
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>

      <q-btn-group  class="q-mt-md q-mb-lg q-mr-lg">
        <q-btn @click="showAlumnes = false" label="Documents" :color="(!showAlumnes)?'primary':'grey'" icon="description" />
        <q-btn @click="showAlumnes = true" label="Alumnes" :color="(showAlumnes)?'primary':'grey'" icon="person" />
      </q-btn-group>

      <div v-if="!showAlumnes">
        <q-btn-group class="q-mt-md q-mb-lg q-mr-md">
          <q-select
            multiple
            v-model="alumnesSeleccionats"
            :options="alumnesGrup"
            option-label="nomComplet2"
            label="SELECCIONAR ALUMNES"
            filled
            dense
            use-chips
            hide-dropdown-icon
            bg-color="primary"
            label-color="accent"
            style="width: 250px"
            @update:model-value="filterDocuments"
          >
            <template v-slot:prepend>
              <q-icon name="group" color="accent" />
            </template>
          </q-select>
        </q-btn-group>
        <q-btn-group class="q-mt-md q-mb-lg q-mr-md">
          <q-btn-dropdown color="primary" label="visibilitat document" icon="visibility">
            <q-list>
              <q-item clickable v-close-popup @click="filterDocsByVisibilitat(null)">
                <q-item-label>TOTS</q-item-label>
              </q-item>
              <q-item clickable v-close-popup @click="filterDocsByVisibilitat(true)">
                <q-item-label>OBLIGATORIS</q-item-label>
              </q-item>
              <q-item clickable v-close-popup @click="filterDocsByVisibilitat(false)">
                <q-item-label>OPCIONALS</q-item-label>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-btn-group>
        <q-btn-group class="q-mt-md q-mb-lg">
          <q-btn-dropdown color="primary" label="estat document" icon="description">
            <q-list>
              <q-item v-for="estat in documentEstats" clickable v-close-popup @click="filterDocsByEstat(estat)">
                <q-item-label>{{ estat }}</q-item-label>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-btn-group>
      </div>


      <div v-if="!isAuthorizedDeleteDocuments && showAlumnes">
        <p class="text-negative">No tens autorització per eliminar documents d'alumnes</p>
      </div>

      <q-table v-if="showAlumnes"
        flat
        bordered
        title="Documents de l'usuari"
        :rows="alumnesGrup"
        :columns="columnsUsuari"
        row-key="name"
        binary-state-sort
        :pagination="initialPagination"
        class="sticky-header-table"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th class="text-wrap-center">
              {{ columnsUsuari[0].label }}
            </q-th>
            <q-th v-if="isAuthorizedDeleteDocuments" class="text-wrap-center">
              Accions
            </q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="alumne" :props="props" class="text-wrap-center">
              {{ props.row.nomComplet2 }}
            </q-td>
            <q-td class="text-wrap-center" v-if="isAuthorizedDeleteDocuments">
              <q-btn :props="props" @click="confirmDelete(props.row.id)" label="" icon="delete" color="primary" />
            </q-td>
          </q-tr>
        </template>
      </q-table>

      <q-table v-else
        flat
        bordered
        title="Documents de l'usuari"
        :rows="documentsUsuariFiltrats"
        :columns="columnsUsuari"
        row-key="name"
        binary-state-sort
        :pagination="initialPagination"
        class="sticky-header-table"
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
                v-if="props.row.documentSignatures && props.row.documentSignatures.find(s=>s.signatura.id===signatura.id)"
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
                  :disable="props.row.documentSignatures && props.row.documentSignatures.some(s=>!s.signat)"
                  input-style="width: 50px;"
                  class="q-mr-xs"
                >
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>

                <q-btn
                  @click="sendFile(props.row)"
                  :color="props.row.documentSignatures && props.row.documentSignatures.some(s=>!s.signat) ? 'white' : 'primary'"
                  :text-color="props.row.documentSignatures && props.row.documentSignatures.some(s=>!s.signat) ? 'primary' : 'white'"
                  :disable="props.row.documentSignatures && props.row.documentSignatures.some(s=>!s.signat)"
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

                <q-btn
                  @click="viewPdf(props.row)"
                  :color="!props.row.fitxer ? 'white' : 'primary'"
                  :text-color="!props.row.fitxer ? 'primary' : 'white'"
                  :disable="!props.row.fitxer"
                  round
                  dense
                  class="q-ml-xs"
                  icon="plagiarism"
                />

                <q-btn
                  @click="deleteDocument(props.row)"
                  :color="!props.row.fitxer ? 'white' : 'primary'"
                  :text-color="!props.row.fitxer ? 'primary' : 'white'"
                  :disable="!checkDeletePermission(props.row)"
                  round
                  dense
                  class="q-ml-xs"
                  icon="delete"
                />

               <!-- <q-btn
                  @click="canviarVisibilitat(props.row.id,props.row.visibilitat? false : true)"
                  :color="'primary'"
                  :text-color="'white'"
                  round
                  dense
                  class="q-ml-xs"
                  :icon="props.row.visibilitat ? 'visibility_off' : 'visibility'"
                >
                  <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
                    <strong>Posar el document com a {{props.row.visibilitat?'no visible':'visible'}}</strong>
                  </q-tooltip>
                </q-btn>-->
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
              v-if="tipusDocumentExtra"
              v-model="optionsDocumentExtraSelected"
              :options="optionsDocumentExtra"
              label="Document"
              input-debounce="0"
              clearable
              class="q-mb-md"
              @update:model-value="updateNomOriginal"
            />

            <q-input
              v-if="optionsDocumentExtraSelected"
              v-model="documentExtra.nomOriginal"
              label="Nom del document"
              hint="Annex 4, Justificant del metge..."
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

            <q-btn color="primary" class="q-mt-lg"
                   @click="saveDocumentExtra(documentExtra,tipusDocumentExtra,optionsDocumentExtraSelected,documentExtra.usuari?.id)"
                   :disable="uploadDocument"
            >Enviar document</q-btn>
            <q-btn color="primary" class="q-ml-md q-mt-lg" @click="addDocument=false">Tancar</q-btn>
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="showPdfDialog">
      <q-card class="no-scroll" style="background: gray; min-width: 80vw; min-height: 80vh; width: 100%; height: 100%;">
        <q-bar>
          <q-btn @click="showPdfDialog = false" color="white" flat icon="close"></q-btn>
        </q-bar>
        <div class="fit">
          <q-pdfviewer :src="pdf.url" />
        </div>
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
import {QTableColumn, useQuasar} from "quasar";
import {Rol} from "src/model/Rol";
import {FitxerBucket} from "src/model/google/FitxerBucket";
import {useRoute, useRouter} from "vue-router";
import {ConvocatoriaService} from "src/service/ConvocatoriaService";

const myUser:Ref<Usuari> = ref({} as Usuari);
const isSearching:Ref<boolean> = ref(false);
const isAuthorized:Ref<boolean> = ref(false);
const isAuthorizedDeleteDocuments:Ref<boolean> = ref(false);
const grups:Ref<Grup[]> = ref([] as Grup[]);
const grupSelected:Ref<Grup> = ref({} as Grup);
const tutorsFCT:Ref<Usuari[]> = ref([] as Usuari[]);
const documentsGrup:Ref<Document[]> = ref([] as Document[]);
const documentsUsuari:Ref<Document[]> = ref([] as Document[]);
const documentsUsuariFiltrats:Ref<Document[]> = ref([] as Document[]);
const signatures:Ref<Signatura[]> = ref([] as Signatura[]);
const addDocument = ref(false);

const columnsGrup:Ref<QTableColumn[]> = ref([] as QTableColumn[])
const columnsUsuari:Ref<QTableColumn[]> = ref([] as QTableColumn[])

const documentExtra:Ref<Document> = ref({} as Document);
const tipusDocumentExtra:Ref<string> = ref("");
const alumnes:Ref<Usuari[]> = ref([] as Usuari[]);
const alumnesFiltered:Ref<Usuari[]> = ref([] as Usuari[]);
const optionsDocumentExtraSelected:Ref<string> = ref('');
const optionsDocumentExtra:Ref<string[]> = ref([]);

const showAlumnes = ref(false);
const alumnesGrup:Ref<Usuari[]> = ref([] as Usuari[]);
const allDocumentsGrup:Ref<Document[]> = ref([] as Document[]);

// filters
const alumnesSeleccionats:Ref<Usuari[]> = ref([] as Usuari[]);
const visibilitatSeleccionada:Ref<boolean | null> = ref(null);
const estatSeleccionat:Ref<string | null> = ref('TOTS');
const documentEstats = ['TOTS', 'PENDENT_SIGNATURES', 'ACCEPTAT', 'REBUTJAT'];

// document
const uploadDocument = ref(false);
const showPdfDialog = ref(false);
const pdf:Ref<FitxerBucket | null> = ref({} as FitxerBucket);

const $q = useQuasar();
const router = useRouter()
const route = useRoute()

//Get query params
const idConvocatoria = route.query?.convocatoria;
console.log("Parameter: idConvocatoria",idConvocatoria, route.query?.convocatoria);

const convocatories:Ref<Convocatoria> = ref();

const initialPagination = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 0
}

async function selectGrup(grup:Grup){
  isSearching.value = true;
  grupSelected.value = grup;

  console.log("Entra filtre")
  alumnesFiltered.value = [];
  alumnesFiltered.value = alumnes.value.filter(a=>{
    return (a.grup && parseInt(a.grup))===grup.id ||
      (a.grup2 && parseInt(a.grup2))===grup.id ||
      (a.grup3 && parseInt(a.grup3))===grup.id;
  });

  tutorsFCT.value = await UsuariService.getTutorsFCTByCodiGrup(grupSelected.value.curs.nom+grupSelected.value.nom);
  console.log(tutorsFCT.value);
  const documentsAll = await DocumentService.getDocumentsByGrupCodi(grupSelected.value.curs.nom+grupSelected.value.nom, idConvocatoria);
  allDocumentsGrup.value = documentsAll;

  alumnesGrup.value = await getAlumnesAmbDocsFCT();
  alumnesGrup.value.sort((a: Usuari, b: Usuari) => {return a.cognom1!.localeCompare(b.cognom1!)});

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

  //Que es mostrin es visibles per defecte
  documentsUsuariFiltrats.value = documentsUsuari.value.filter(d => {
    return d.visibilitat;
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

async function saveDocumentExtra(document:Document,tipus:string,tipusDocument:string, idusuari?:number){
  uploadDocument.value = true;
  const documentSaved:Document= await DocumentService.saveDocumentExtra(document,grupSelected.value.curs.nom+grupSelected.value.nom,tipusDocument, idusuari);

  documentSaved.file = document.file;
  await sendFile(documentSaved);

  const documentFitxer:Document = await DocumentService.getDocumentById(documentSaved.id);
  const fitxer = await DocumentService.getURLFitxerDocument(documentFitxer);

  if(fitxer){
    documentSaved.fitxer = fitxer;
  }

  if(tipus==='Grup'){
    documentsGrup.value.push(documentSaved);
  } else {
    documentsUsuari.value.push(documentSaved);
  }
  filterDocuments();
  addDocument.value = false;
  uploadDocument.value = false;
}

async function sendFile(document:Document){
  console.log("Entra send file")
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

async function viewPdf(document: Document) {
  const documentSaved:Document = await DocumentService.getDocumentById(document.id);
  const fitxer = await DocumentService.getURLFitxerDocument(documentSaved, false);
  if(fitxer) {
    showPdfDialog.value = true;
    pdf.value = fitxer;
  }
}

function checkDeletePermission(document: Document) {
  if (isAuthorizedDeleteDocuments.value)
    return true;

  else return document.documentEstat !== 'ACCEPTAT' && document.id_googleDrive === '';
}

function deleteDocument(document: Document) {
  $q.dialog( {
    title: "Està segur que vol eliminar el document?",
    message: "Aquesta acció no es pot desfer",
    cancel: true
  }).onOk(async () => {
    await DocumentService.deleteDocument(document);
    if (documentsUsuari.value.indexOf(document) > -1)
      documentsUsuari.value.splice(documentsUsuari.value.indexOf(document), 1);

    if (documentsGrup.value.indexOf(document) > -1)
      documentsGrup.value.splice(documentsGrup.value.indexOf(document), 1);

    filterDocuments();
  });
}


function filterFn (val:string, update:Function, abort:Function) {
  console.log("Entra filtre")
  console.log('grup selected',grupSelected.value)
  console.log('alumnes',alumnes.value)
  update(() => {
    const needle = val.toLowerCase()
    alumnesFiltered.value = alumnes.value
      .filter(a=>{
          return (a.grup && a.grup)===grupSelected.value.gestibCodi ||
            (a.grup2 && a.grup2)===grupSelected.value.gestibCodi ||
            (a.grup3 && a.grup3)===grupSelected.value.gestibCodi;
        })
      .filter( (v:Usuari) => v.nomComplet2.toLowerCase().indexOf(needle) > -1)
  })
}

function updateDocuments(){
  optionsDocumentExtra.value = [];

  if(tipusDocumentExtra.value==='Alumnat'){
    optionsDocumentExtra.value.push("Annex 4");
    optionsDocumentExtra.value.push("Altra documentació alumne");
  } else {
    optionsDocumentExtra.value.push("Altra documentació grup");
  }

}

function updateNomOriginal(v:string){
  documentExtra.value.nomOriginal = v;
}

function confirmDelete(id:number) {
  $q.dialog( {
    title: "Està segur que vol eliminar l'alumne?",
    message: "Aquesta acció no es pot desfer",
    cancel: true
  }).onOk(() => {
    deleteAllDocumentsAlumneId(id);
  });
}

async function getAlumnesAmbDocsFCT() {
  const alumnesIds: number[] = [];
  //const alumnesFCT:Usuari[] = [];

  for (const doc of allDocumentsGrup.value) {
    if (doc.usuari !== undefined) {
      alumnesIds.push(doc.usuari.id);
    }
  }

  const idsUnics = [...new Set(alumnesIds)];

  const alumnesPromise = [];
  for (const id of idsUnics) {
    alumnesPromise.push(UsuariService.getById(String(id)));
  }

  const alumnesFCT:Usuari[] = await Promise.all(alumnesPromise)

  return alumnesFCT;
}

async function deleteAllDocumentsAlumneId(id:number) {
  const token = localStorage.getItem("token")||"";
  const payload = token.split(".")[1];
  const email = JSON.parse(atob(payload)).email;

  const documentIds: string[] = [];

  const docsAlumne: Document[] = allDocumentsGrup.value.filter(doc => doc.usuari !== undefined && doc.usuari.id === id);
  const docParts: string[] = docsAlumne[0].nomOriginal.split("_");
  const nomComplet: string = docParts[1] + " " + docParts[2];
  const cicle: string = docParts[0];

  for (const doc of docsAlumne) {
    documentIds.push(doc.id_googleDrive);
  }

  await DocumentService.deleteDocumentByGoogleDriveId(documentIds, nomComplet, cicle, email);
  alumnesGrup.value.splice(alumnesGrup.value.findIndex(alumne => alumne.id === id), 1);
}

function canviarVisibilitat(id:number,visibilitat:boolean){

  DocumentService.changeVisibilitatDocument(id,visibilitat);

  documentsUsuari.value = documentsUsuari.value.map(d => {

    if(d.id == id.toString()){
      console.log("Entra dedins id")
      return { ...d, visibilitat };
    }
    return d;
  })
  //Actualitza la pàgina sense tornar a fer la petició axios
  if(visibilitat){
    documentsNoVisibles();
  }else {
    documentsVisibles();
  }
}

function documentsVisibles(){

  documentsUsuariFiltrats.value = documentsUsuari.value.filter(d => {
    return d.visibilitat;
  });
}
function documentsNoVisibles(){

  documentsUsuariFiltrats.value = documentsUsuari.value.filter(d => {
    return !d.visibilitat;
  });
}

function filterDocsByVisibilitat(visible: boolean | null) {
  visibilitatSeleccionada.value = visible;
  filterDocuments();
}

function filterDocsByEstat(estat: string) {
  estatSeleccionat.value = estat;
  filterDocuments();
}

function filterDocuments() {
  documentsUsuariFiltrats.value = documentsUsuari.value;

  if (alumnesSeleccionats.value.length != 0)
    documentsUsuariFiltrats.value = documentsUsuari.value.filter(d => {
      return alumnesSeleccionats.value.some(alumne => alumne.nomComplet2 === d.usuari?.nomComplet2);
    });

  if (visibilitatSeleccionada.value != null)
    documentsUsuariFiltrats.value = documentsUsuariFiltrats.value.filter(d => {
      return d.visibilitat === visibilitatSeleccionada.value;
    });

  if (estatSeleccionat.value != 'TOTS')
    documentsUsuariFiltrats.value = documentsUsuariFiltrats.value.filter(d => {
      return d.documentEstat === estatSeleccionat.value;
    });
}

async function selectConvocatoria(convocatoria: Convocatoria) {
  //Refresh with new convocatoria
  await router.push({name: route.name as string, query: {convocatoria: convocatoria.id}});
  window.location.reload();
}

onMounted(async ()=>{
  grups.value = await GrupService.findAllGrups();
  grups.value.sort((a:Grup, b:Grup)=>(a.curs.nom+a.nom).localeCompare(b.curs.nom+b.nom));

  signatures.value = await SignaturaService.findAll();

  myUser.value = await UsuariService.getProfile();

  alumnes.value = await UsuariService.getAlumnes();
  alumnesFiltered.value = await UsuariService.getAlumnes();

  isAuthorizedDeleteDocuments.value = JSON.parse(localStorage.getItem("rol")).some((r:string)=>r===Rol.ADMINISTRADOR || r===Rol.ADMINISTRADOR_FCT);


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
    field: row => row.tipusDocumenttipusDocument.nom,
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

  convocatories.value = await ConvocatoriaService.getConvocatories();
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

.sticky-header-table {
  /* height or max-height is important */
  height: calc(100vh - 130px);

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th {
    /* bg color is important for th; just specify one */
    background-color: #eec005;
  }

  thead tr th {
    position: sticky;
    z-index: 1;
  }

  thead tr:first-child th {
    top: 0
  }

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th {
    /* height of all previous header rows */
    top: 48px;
  }

  /* prevent scrolling behind sticky top row on focus */
  tbody {
    /* height of all previous header rows */
    scroll-margin-top: 48px;
  }
}
</style>
