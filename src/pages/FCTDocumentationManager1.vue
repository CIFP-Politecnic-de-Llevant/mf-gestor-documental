<template>
  <q-page padding>
    <p class="text-h3">Convocatòria {{convocatoria.nom}}</p>
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
      <q-btn-group push>
        <q-btn push label="Tots" icon="timeline" @click="filterDocuments('all')"/>
        <q-btn push label="Pendents de validar" icon="visibility" @click="filterDocuments('pending')"/>
        <q-btn push label="Acceptats" icon="done" @click="filterDocuments('accepted')"/>
        <q-btn push label="Rebutjats" icon="deleted" @click="filterDocuments('rejected')"/>
      </q-btn-group>
    </div>

    <div v-for="grupFCT in grupsFiltered">
      <div
        v-if="(grupFCT.documentsGrup && grupFCT.documentsGrup.length>0) || (grupFCT.documentsUsuari && grupFCT.documentsUsuari.length>0)">
        <h4>Grup: {{ grupFCT.grup.curs.nom }}{{ grupFCT.grup.nom }}</h4>
        <p v-if="tutorsGrupsFCT && tutorsGrupsFCT.get(grupFCT.grup.curs.nom + grupFCT.grup.nom)">
          Tutor FCT: {{ tutorsGrupsFCT!.get(grupFCT.grup.curs.nom + grupFCT.grup.nom).map(t => t.label).join(", ") }}
        </p>
        <p v-else>
          Tutor FCT: Carregant tutors...
        </p>

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
    </div>

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
import {nextTick, onMounted, Ref, ref, toRaw} from "vue";
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

const columnsGrup: Ref<QTableColumn[]> = ref([] as QTableColumn[])
const columnsUsuari: Ref<QTableColumn[]> = ref([] as QTableColumn[])

const grupsFCT = ref([] as any[]);
const grupsFiltered = ref([] as any[]);
const tutorsGrupsFCT = ref(new Map<string, Usuari[]>);

const abortController = new AbortController();

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
const idConvocatoria = route.query?.convocatoria;
console.log("Parameter: idConvocatoria", idConvocatoria, route.query?.convocatoria);

const convocatories: Ref<Convocatoria[]> = ref([] as Convocatoria[]);
const convocatoria:Ref<Convocatoria> = ref({} as Convocatoria);

async function setGrup(grup: Grup) {
  const documentsAll = await DocumentService.getDocumentsByGrupCodi(grup.curs.nom + grup.nom, idConvocatoria);

  const documentsUsuari = documentsAll.filter(d => d.usuari).sort((a: Document, b: Document) => {
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

  const documentsGrup = documentsAll.filter(d => !d.usuari).sort((a: Document, b: Document) => {
    if (!a.tipusDocument) {
      return -1;
    }
    if (!b.tipusDocument) {
      return 1;
    }
    return a.tipusDocument.nom.localeCompare(b.tipusDocument.nom)
  });

  //URL documents
  //console.log(documentsUsuari)
  //console.log(documentsGrup)

  const documentFCT = ref({
    grup: grup,
    tutorsFCT: [] as Usuari[],
    documentsUsuari: documentsUsuari,
    documentsGrup: documentsGrup,
  });

  grupsFCT.value.push(documentFCT.value);
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

function signDoc(document: Document, signatura: Signatura, signat: boolean) {
  //console.log("Entra sign student")
  DocumentService.signarDocument(document, signatura, signat);
}

function changeEstatDocument(document: Document, estat: string) {
  DocumentService.changeEstatDocument(document, estat);
}

const debouncedChangeObservacionsDocument = debounce((document: Document, observacions: string) => {
  changeObservacionsDocument(document, observacions);
}, 1000);

function changeObservacionsDocument(document: Document, observacions: string) {
  DocumentService.changeObservacionsDocument(document, observacions, idConvocatoria);
}

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
  const documentSaved: Document = await DocumentService.getDocumentById(document.id);
  const fitxer = await DocumentService.getURLFitxerDocument(documentSaved);
  if (fitxer) {
    window.open(fitxer.url, '_blank');
  }
}

async function viewPdf(document: Document) {
  showPdfDialog.value = true;
  pdf.value = await DocumentService.getURLFitxerDocument(document, false);
}


function filterDocuments(filter: string) {
  const filtered: any[] = [];
  grupsFiltered.value = [];

  if (filter === 'pending') {
    filtered.push(...grupsFCT.value.map(grup => {
      const grupClone = JSON.parse(JSON.stringify(grup));
      grupClone.documentsGrup = grupClone.documentsGrup.filter((d: any) => d.documentEstat === DocumentEstat.PENDENT_SIGNATURES);
      grupClone.documentsUsuari = grupClone.documentsUsuari.filter((d: any) => d.documentEstat === DocumentEstat.PENDENT_SIGNATURES);
      return grupClone;
    }));
  } else if (filter === 'accepted') {
    filtered.push(...grupsFCT.value.map(grup => {
      const grupClone = JSON.parse(JSON.stringify(grup));
      grupClone.documentsGrup = grupClone.documentsGrup.filter((d: any) => d.documentEstat === DocumentEstat.ACCEPTAT);
      grupClone.documentsUsuari = grupClone.documentsUsuari.filter((d: any) => d.documentEstat === DocumentEstat.ACCEPTAT);
      return grupClone;
    }));
  } else if (filter === 'rejected') {
    filtered.push(...grupsFCT.value.map(grup => {
      const grupClone = JSON.parse(JSON.stringify(grup));
      grupClone.documentsGrup = grupClone.documentsGrup.filter((d: any) => d.documentEstat === DocumentEstat.REBUTJAT);
      grupClone.documentsUsuari = grupClone.documentsUsuari.filter((d: any) => d.documentEstat === DocumentEstat.REBUTJAT);
      return grupClone;
    }));
  } else
    filtered.push(...grupsFCT.value);

  grupsFiltered.value = [...filtered];
}

async function loadGrups() {
  const grups = await GrupService.findGrupsAmbDocumentsFct(idConvocatoria);
  grups.sort((a: Grup, b: Grup) => (a.curs.nom + a.nom).localeCompare(b.curs.nom + b.nom))

  /*const promises = [];
  for(const grup of grups){
    promises.push(setGrup(grup));
  }

  await Promise.all(promises);*/

  //TODO: si feim promises.push dóna error de net::ERR_INSUFFICIENT_RESOURCES
  grupsFCT.value = [];
  for (const grup of grups) {
    await setGrup(grup);
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
  grupsFiltered.value = grupsFCT.value;

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
  convocatoria.value = convocatories.value.find(c=>c.id===parseInt(idConvocatoria)) || convocatories.value[0];
})

onBeforeRouteLeave((to, from) => {
  for(const w of workersAll){
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
