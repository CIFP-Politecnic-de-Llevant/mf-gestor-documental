<template>
  <q-page padding>
    <p class="text-h3">Convocatòria {{ convocatoria.nom }}</p>
    <div class="q-mb-lg">
      <q-btn-dropdown class="q-mt-md q-mr-md q-ml-sm" color="primary" label="Convocatòria" menu-self="top middle">
        <q-list>
          <q-item v-for="convocatoria in convocatories" clickable v-close-popup
                  @click="selectConvocatoria(convocatoria)">
            <q-item-section>
              <q-item-label>{{ convocatoria.nom }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>

    <div>
      <p class="text-h5 q-mt-lg">Selecciona els grups a visualitzar</p>
    </div>
    <div class="q-mb-md">
      <q-checkbox v-for="grupFCT in grupsFCT" v-model="grupFCT.visible" @update:model-value="(value:boolean) => showGrup(value, grupFCT.grup.id)" :label="grupFCT.grup.curs.nom + grupFCT.grup.nom" class="q-mr-md"/>
    </div>

    <q-tabs
      v-model="filtre"
      dense
      no-caps
      inline-label
      align="left"
      class="bg-grey-2 text-black shadow-2">

      <q-tab name="TOTS" icon="timeline" label="Tots"  />
      <q-tab name="PENDENT_SIGNATURES" icon="visibility" label="Pendents de validar" />
      <q-tab name="ACCEPTAT" icon="done" label="Acceptats" />
      <q-tab name="REBUTJAT" icon="deleted" label="Rebutjats" />
    </q-tabs>

    <q-list bordered class="rounded-borders">
      <q-expansion-item v-for="grupFCT in grupsFCT?.filter(g => g.visible) || []"
                        :key="grupFCT.grup.id" expand-separator>
        <template v-slot:header>
          <span class="text-h4 q-my-sm">{{ grupFCT.grup.curs.nom }}{{ grupFCT.grup.nom }}</span>
        </template>
        <q-card>
          <q-card-section v-if="grupFCT.loaded">
            <div>
              <p v-if="tutorsGrupsFCT && tutorsGrupsFCT.get(grupFCT.grup.curs.nom + grupFCT.grup.nom)">
                Tutor FCT: {{
                  tutorsGrupsFCT!.get(grupFCT.grup.curs.nom + grupFCT.grup.nom).map(t => t.label).join(", ")
                }}
              </p>
              <p v-else>
                Tutor FCT: Carregant tutors...
              </p>
            </div>
            <div v-if="(grupFCT.documentsGrupFiltered && grupFCT.documentsGrupFiltered.length>0) || (grupFCT.documentsUsuariFiltered && grupFCT.documentsUsuariFiltered.length>0)">
              <!-- DOCUMENTS DE GRUP -->
              <q-table
                flat bordered
                title="Documents del grup"
                :rows="grupFCT.documentsGrupFiltered"
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
                ]" label="Validat?" @update:model-value="changeEstatDocument(props.row,props.row.documentEstat)"/>
                    </q-td>
                    <q-td key="observacions" :props="props" class="text-wrap" style="width: 300px;">
                      <q-input v-model="props.row.observacions"
                               @update:model-value="debouncedChangeObservacionsDocument(props.row,props.row.observacions)">
                        <template v-if="tutorsGrupsFCT && tutorsGrupsFCT.get(grupFCT.grup.curs.nom + grupFCT.grup.nom)"
                                  v-slot:after>
                          <q-btn
                            @click="sendMailToTutorFCT(tutorsGrupsFCT!.get(grupFCT.grup.curs.nom + grupFCT.grup.nom), props.row)"
                            round dense flat icon="send"/>
                        </template>
                      </q-input>
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
                      <div v-if="props.row.fitxer && props.row.fitxer.signants.length > 0" class="flex flex-center">
                        <p v-for="nom in props.row.fitxer.signants">
                          {{ nom }}
                        </p>
                      </div>
                    </q-td>
                    <q-td>
                      <div class="flex flex-center" style="width: 100px;">
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
                      </div>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>

              <!-- DOCUMENTS D'USUARI -->
              <q-table
                flat
                bordered
                title="Documents de l'usuari"
                :rows="grupFCT.documentsUsuariFiltered"
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
                ]" label="Validat?" @update:model-value="changeEstatDocument(props.row,props.row.documentEstat)"/>
                    </q-td>
                    <q-td key="observacions" :props="props" class="text-wrap" style="width: 300px;">
                      <q-input v-model="props.row.observacions"
                               @update:model-value="debouncedChangeObservacionsDocument(props.row,props.row.observacions)">
                        <template v-slot:after>
                          <q-btn
                            @click="sendMailToTutorFCT(tutorsGrupsFCT!.get(grupFCT.grup.curs.nom + grupFCT.grup.nom), props.row)"
                            round dense flat icon="send"/>
                        </template>
                      </q-input>
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
                      <div v-if="props.row.fitxer && props.row.fitxer.signants.length > 0" class="flex flex-center">
                        <p v-for="nom in props.row.fitxer.signants">
                          {{ nom }}
                        </p>
                      </div>
                    </q-td>
                    <q-td>
                      <div class="flex flex-center" style="width: 100px;">
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
                      </div>
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
            <div v-else><span class="text-h4 text-grey">Sense documents {{filtreText}}</span></div>
          </q-card-section>
          <q-card-section v-else>
            <h3>Carregant dades...</h3>
          </q-card-section>
          <q-inner-loading :showing="!grupFCT.loaded">
            <q-spinner-gears size="100px" color="primary" />
          </q-inner-loading>
        </q-card>
      </q-expansion-item>
    </q-list>

    <q-dialog v-model="showPdfDialog">
      <q-card class="no-scroll" style="background: gray; min-width: 80vw; min-height: 80vh; width: 100%; height: 100%;">
        <q-bar>
          <q-btn @click="showPdfDialog = false" color="white" flat icon="close"></q-btn>
        </q-bar>
        <div class="fit">
          <q-pdfviewer :src="pdf.url"/>
        </div>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import {computed, nextTick, onMounted, Ref, ref, toRaw} from "vue";
import {Usuari} from "src/model/Usuari";
import {Grup} from "src/model/Grup";
import {Document} from "src/model/Document";
import {DocumentEstat} from "src/model/DocumentEstat";
import {Signatura} from "src/model/Signatura";
import {GrupService} from "src/service/GrupService";
import {DocumentService} from "src/service/DocumentService";
import {SignaturaService} from "src/service/SignaturaService";
import {QTableColumn, useQuasar} from "quasar";
import {FitxerBucket} from "src/model/google/FitxerBucket";
import {ConvocatoriaService} from "src/service/ConvocatoriaService";
import {onBeforeRouteLeave, useRoute, useRouter} from "vue-router";
import debounce from 'lodash/debounce';
import {Convocatoria} from "src/model/Convocatoria";

const $q = useQuasar();
const router = useRouter()
const route = useRoute()

const signatures: Ref<Signatura[]> = ref([] as Signatura[]);

const filtre:Ref<string> = ref("TOTS")

const filtreText = computed(() => {
  switch (filtre.value) {
    case "ACCEPTAT":
      return "ACCEPTATS";
    case "REBUTJAT":
      return "REBUTJATS";
    case "PENDENT_SIGNATURES":
      return "PENDENTS DE VALIDAR";
    default:
      return "...";
  }
});

const columnsGrup: Ref<QTableColumn[]> = ref([] as QTableColumn[])
const columnsUsuari: Ref<QTableColumn[]> = ref([] as QTableColumn[])

const grupsFCT = ref([] as any[]);
const tutorsGrupsFCT = ref(new Map<string, Usuari[]>);

const showPdfDialog = ref(false);
const pdf: Ref<FitxerBucket | null> = ref({} as FitxerBucket);

const workersAll = [];

const initialPagination = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 0
}

//Get query params
const idConvocatoria:string = route.query?.convocatoria?.toString() || '0';
console.log("Parameter: idConvocatoria", idConvocatoria, route.query?.convocatoria);

const convocatories: Ref<Convocatoria[]> = ref([] as Convocatoria[]);
const convocatoria: Ref<Convocatoria> = ref({} as Convocatoria);



async function createGrup(grup: Grup) {
  let documentsUsuari: Document[] = []
  let documentsGrup: Document[] = []

  const documentFCT = ref({
    grup: grup,
    tutorsFCT: [] as Usuari[],
    documentsUsuari: documentsUsuari,
    documentsGrup: documentsGrup,
    loaded: false,
    visible: false
  });

  grupsFCT.value.push(documentFCT.value);
}

async function setGrup(documentFCT: any) {
  let documentsUsuari: Document[] = []
  let documentsGrup: Document[] = []

  const grup: Grup = documentFCT.grup;

  console.log(documentFCT);

  const documentsAll = await DocumentService.getDocumentsByGrupCodi(grup.curs.nom + grup.nom, convocatoria.value.id.toString());

  documentsUsuari = documentsAll.filter(d => d.usuari).sort((a: Document, b: Document) => {
    if (a.usuari && b.usuari && a.usuari.id != b.usuari.id) {
      return a.usuari.nomComplet2.localeCompare(b.usuari.nomComplet2);
    }
    if (!a.tipusDocument) {
      return -1;
    }
    if (!b.tipusDocument) {
      return 1;
    }
    if (a.tipusDocument.nom === b.tipusDocument.nom) {
      return a.tipusDocument.nom.localeCompare(b.tipusDocument.nom);
    }
    return 0;
  });

  documentsGrup = documentsAll.filter(d => !d.usuari).sort((a: Document, b: Document) => {
    if (!a.tipusDocument) {
      return -1;
    }
    if (!b.tipusDocument) {
      return 1;
    }
    return a.tipusDocument.nom.localeCompare(b.tipusDocument.nom)
  });

  documentFCT.documentsUsuari = documentsUsuari
  documentFCT.documentsGrup = documentsGrup

  documentFCT.documentsUsuariFiltered = computed(() =>{
    if (filtre.value != "TOTS")
      return documentFCT.documentsUsuari.filter((d: any) => d.documentEstat === filtre.value)
    return documentFCT.documentsUsuari
  })

  documentFCT.documentsGrupFiltered = computed(() =>{
    if (filtre.value != "TOTS")
      return documentFCT.documentsGrup.filter((d: any) => d.documentEstat === filtre.value)
    return documentFCT.documentsGrup
  })

  documentFCT.loaded = true
}

function setTutors(index: number) {
  if (index >= grupsFCT.value.length)
    return;

  const doc = grupsFCT.value[index];

  const worker = new Worker(new URL("../worker/TutorsWorker.js", import.meta.url), {type: "classic"});
  const token = localStorage.getItem("token");
  const codiGrup = doc.grup.curs.nom + doc.grup.nom;
  const data = {
    token: token,
    grup: codiGrup
  }
  worker.postMessage(data);
  worker.onmessage = async (e) => {
    //console.log("data message",e.data);
    tutorsGrupsFCT.value.set(codiGrup, e.data as Usuari[]);
    //documentFCT.value.tutorsFCT.push(e.data as Usuari)
    setTutors(++index);
    worker.terminate();
  }
  workersAll.push(worker);
}

function signDoc(document: Document, signatura: Signatura, signat: boolean, idConvocatoria: string) {
  //console.log("Entra sign student")
  DocumentService.signarDocument(document, signatura, signat, idConvocatoria);
}

function changeEstatDocument(document: Document, estat: string) {
  DocumentService.changeEstatDocument(document, estat);
}

const debouncedChangeObservacionsDocument = debounce((document: Document, observacions: string) => {
  changeObservacionsDocument(document, observacions);
}, 1000);

function changeObservacionsDocument(document: Document, observacions: string) {
  DocumentService.changeObservacionsDocument(document, observacions, convocatoria.value.id.toString());
}

const showGrup = (newValue: boolean, id:number) => {
  const grupFCT = grupsFCT.value.find(d => d.grup.id === id);
  if (!grupFCT) return;
  if (newValue) {
    grupFCT.visible = true;
    if (!grupFCT.loaded)
      setGrup(grupFCT);
  } else {
    grupFCT.visible = false;
  }
};


const sendMailToTutorFCT = (tutors: Usuari[], document: Document) => {
  var errors = ""
  if (!tutors || tutors.length == 0)
    errors += "No es troben dades de tutor FCT \n"
  if (!document.observacions)
    errors += "No hi ha observacions a enviar \n"

  if (!errors)
    tutors.forEach(tutor => {
      if (tutor.email)
        DocumentService.sendMailToTutorFCT(tutor.email, document.nomOriginal, document.documentEstat, document.observacions)
      else
        errors += `El tutor ${tutor.nomComplet} no té email on enviar el missatge \n`
    })

  if (errors)
    alert("No es possible enviar el mail:\n" + errors)
}

async function getURL(document: Document) {
  const documentSaved: Document = await DocumentService.getDocumentById(document.id, convocatoria.value.id.toString());
  const fitxer = await DocumentService.getURLFitxerDocument(documentSaved);
  if (fitxer) {
    window.open(fitxer.url, '_blank');
  }
}

async function viewPdf(document: Document) {
  showPdfDialog.value = true;
  pdf.value = await DocumentService.getURLFitxerDocument(document, false);
}


async function loadGrups() {
  const grups = await GrupService.findGrupsAmbDocumentsFct(convocatoria.value.id.toString());
  grups.sort((a: Grup, b: Grup) => (a.curs.nom + a.nom).localeCompare(b.curs.nom + b.nom))

  grupsFCT.value = [];
  for (const grup of grups) {
    await createGrup(grup);
  }
}

async function selectConvocatoria(convocatoria: Convocatoria) {
  //Refresh with new convocatoria
  await router.push({name: route.name as string, query: {convocatoria: convocatoria.id}});
  window.location.reload();
}

onMounted(async () => {
  const dialog = $q.dialog({
    message: 'Carregant...',
    progress: true, // we enable default settings
    persistent: true, // we want the user to not be able to close it
    ok: false // we want the user to not be able to close it
  })
  await loadGrups();
  await nextTick();
  grupsFCT.value.sort((a, b) => (a.grup.curs.nom + a.grup.nom).localeCompare(b.grup.curs.nom + b.grup.nom));

  setTutors(0);

  const documentsSignats: Document[] = [];
  for (const g of grupsFCT.value) {
    documentsSignats.push(...g.documentsUsuari.filter((d: any) => d.fitxer != undefined && d.fitxer.id != null));
    documentsSignats.push(...g.documentsGrup.filter((d: any) => d.fitxer != undefined && d.fitxer.id != null));
  }

  const worker = new Worker(new URL("../worker/SignaturesWorker.js", import.meta.url), {type: "classic"});
  const token = localStorage.getItem("token");
  const data = {
    token: token,
    docs: documentsSignats.map(d => toRaw(d)),
  }
  worker.postMessage(data);
  worker.onmessage = async (e) => {
    for (const doc of e.data) {
      const document = documentsSignats.find(d => d.id === doc.id)!;
      document.fitxer!.signants = doc.fitxer.signants;
    }
  }
  workersAll.push(worker);

  signatures.value = await SignaturaService.findAll();
  // grupsFiltered.value = grupsFCT.value;

  //Grup
  columnsGrup.value.push({
    name: 'validat',
    label: 'Validat?',
    field: row => row.documentEstat,
    sortable: true
  });

  columnsGrup.value.push({
    name: 'observacions',
    label: 'Observacions',
    field: row => row.observacions,
    sortable: true
  });

  columnsGrup.value.push({
    name: 'tipusDocument',
    label: 'Document',
    field: row => row.tipusDocument.nom,
    sortable: true
  });

  for (const signatura of signatures.value) {
    columnsGrup.value.push({
      name: signatura.id,
      label: signatura.nom,
      field: signatura.id,
      sortable: false
    });
  }

  columnsGrup.value.push({
    name: 'signants',
    label: 'Signants',
    field: row => row,
    sortable: false
  });

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
    name: 'observacions',
    label: 'Observacions',
    field: row => row.observacions,
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

  for (const signatura of signatures.value) {
    columnsUsuari.value.push({
      name: signatura.id,
      label: signatura.nom,
      field: signatura.id,
      sortable: false
    });
  }

  columnsUsuari.value.push({
    name: 'signants',
    label: 'Signants',
    field: row => row,
    sortable: false
  });

  columnsUsuari.value.push({
    name: 'document',
    label: 'Document',
    field: row => row,
    sortable: false
  });

  dialog.hide();

  signatures.value = await SignaturaService.findAll();
  convocatories.value = await ConvocatoriaService.getConvocatories();
  if(idConvocatoria=='0'){
    convocatoria.value = convocatories.value.find(c=>c.actual) || convocatories.value[0];
  } else {
    convocatoria.value = convocatories.value.find(c => c.id === parseInt(idConvocatoria)) || convocatories.value[0];
  }
})

onBeforeRouteLeave((to, from) => {
  for (const w of workersAll) {
    w.terminate();
  }
})
</script>

<style scoped>
.text-wrap-center {
  text-wrap: wrap;
  text-align: center;
}

.text-wrap {
  text-wrap: wrap;
  text-align: left;
}
</style>
