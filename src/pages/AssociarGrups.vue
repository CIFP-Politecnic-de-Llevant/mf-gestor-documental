<template>
  <q-page padding>
    <p class="text-h3">Associar Grups</p>
    <p class="text-h5">Grups que compartiran permisos en les carpetes FEMPO/FCT del drive</p>

    <div>
      <q-select
        label="Grup principal a associar"
        v-model="grupSelected"
        :options="grupsFiltered"
        :option-label="(grup:Grup) => grup ? grup.nom : ''"
        use-input
        @filter="filterFn"
        clearable
        style="width: 300px"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No s'han trobat resultats
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

    <div v-if="isSearching">
      <p class="text-h5 q-mt-lg">Grup: {{ grupSelected.nom }}</p>
      <p>Cercant tutors FEMPO/FCT...</p>
    </div>
    <div v-if="grupSelected && grupSelected.id && !isAuthorized && !isSearching">
      <h2>Usuari no autoritzat</h2>
    </div>
    <div v-if="grupSelected && grupSelected.id && isAuthorized && !isSearching">
      <p class="text-h5 q-mt-lg">Grup: {{ grupSelected.nom }}</p>
      <p>Tutor FCT: {{ tutorsFCT.map((t: Usuari) => t.label).join(", ") || 'Sense tutors FCT assignats' }}</p>
    </div>

    <q-list v-if="grupsWithTutors.length > 0" bordered separator class="q-mt-md">
      <q-item-label header class="row items-center justify-between">
        <span v-if="grupSelected && isAuthorized">Selecciona els grups a associar</span>
        <span v-else>Selecciona un grup principal per poder associar-hi altres grups</span>
        <span>
          <q-btn
            label="Guardar Associació"
            color="primary"
            @click="associar"
            :disable="!grupSelected || !isAuthorized"
          />
        </span>
      </q-item-label>
      <q-item v-for="item in grupsWithTutors" :key="item.grup.id" tag="label" v-ripple
              :class="{'bg-grey-2': item.grup.id === grupSelected?.id}">
        <q-item-section avatar>
          <q-checkbox v-model="associatedGrups" :val="item.grup.id"
                      :disable="!grupSelected || !isAuthorized || item.grup.id === grupSelected.id"/>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ item.grup.nom }}</q-item-label>
          <q-item-label caption>
              <span v-if="item.loadingTutors">
                <q-spinner-dots color="primary" size="1em" class="q-mr-sm"/>
                Carregant tutors...
              </span>
            <span v-else>
                {{ item.tutors.map((t:Usuari) => t.label).join(', ') || 'Sense tutors FCT assignats' }}
              </span>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <div class="q-mt-md">
      <q-btn
        label="Guardar Associació"
        color="primary"
        @click="associar"
        :disable="!grupSelected || !isAuthorized"
      />
    </div>

  </q-page>
</template>

<script setup lang="ts">
import {onMounted, onUnmounted, Ref, ref, watch} from "vue";
import {Usuari} from "src/model/Usuari";
import {Grup} from "src/model/Grup";
import {UsuariService} from "src/service/UsuariService";
import {GrupService} from "src/service/GrupService";
import {useQuasar} from "quasar";
import {Rol} from "src/model/Rol";
import GrupTutorsWorker from 'src/worker/GrupTutorsWorker?worker';

// Interfície per a contenir un grup amb els seus tutors i l'estat de càrrega
interface GrupWithTutors {
  grup: Grup;
  tutors: Usuari[];
  loadingTutors: boolean;
}

const myUser: Ref<Usuari> = ref({} as Usuari);
const isSearching: Ref<boolean> = ref(false);
const isAuthorized: Ref<boolean> = ref(false);
const grups: Ref<Grup[]> = ref([] as Grup[]);
const grupsFiltered: Ref<Grup[]> = ref([] as Grup[]);
const grupSelected: Ref<Grup | null> = ref(null);
const tutorsFCT: Ref<Usuari[]> = ref([] as Usuari[]);
const associatedGrups: Ref<number[]> = ref([]);
const grupsWithTutors: Ref<GrupWithTutors[]> = ref([]);

const $q = useQuasar();
const worker = new GrupTutorsWorker();
let backgroundLoadTimeout: number | undefined;


worker.onmessage = (event) => {
  const { grup, tutors } = event.data;

  // Actualitzar tutors per al grup principal seleccionat
  if (grup.id === grupSelected.value?.id) {
    tutorsFCT.value = tutors;
    isSearching.value = false;
  }

  // Actualitzar tutors a la llista
  const grupIndex = grupsWithTutors.value.findIndex(item => item.grup.id === grup.id);
  if (grupIndex !== -1) {
    grupsWithTutors.value[grupIndex].tutors = tutors;
    grupsWithTutors.value[grupIndex].loadingTutors = false;
  }
};

watch(grupSelected, async (newGrup) => {
  // Reiniciar l'estat quan la selecció canvia o s'esborra
  isAuthorized.value = false;
  tutorsFCT.value = [];
  associatedGrups.value = [];

  if (newGrup && newGrup.id) {
    isSearching.value = true;

    const rolsUser = JSON.parse(<string>localStorage.getItem("rol")) || [];
    isAuthorized.value = rolsUser.some((r: string) => r === Rol.ADMINISTRADOR || r === Rol.ADMINISTRADOR_FCT);

    if (isAuthorized.value) {
      $q.loading.show({
        message: 'Carregant grups associats...'
      });
      try {
        // Aquesta és una crida d'alta prioritat i no s'ha de bloquejar
        const relacions = await GrupService.getRelacions(newGrup.id);
        associatedGrups.value = relacions.map(g => g.id);
      } catch (e) {
        // Sense contingut
        associatedGrups.value = [];
      } finally {
        $q.loading.hide();
      }
    }

    // Obtenir tutors per al grup seleccionat (alta prioritat)
    const token = localStorage.getItem("token");
    const plainGrup = JSON.parse(JSON.stringify(newGrup));
    worker.postMessage({ grup: plainGrup, token, apiUrl: process.env.API });
  }
});

async function associar() {
  if (!grupSelected.value || !grupSelected.value.id) {
    return;
  }

  $q.loading.show({
    message: 'Guardant associacions...'
  });

  try {
    await GrupService.actualitzarRelacions(grupSelected.value.id, associatedGrups.value);
    $q.notify({
      color: 'positive',
      message: 'Associacions guardades correctament'
    });
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Error en guardar les associacions'
    });
  } finally {
    $q.loading.hide();
  }
}

function filterFn(val: string, update: (arg0: () => void) => void) {
  if (val === '') {
    update(() => {
      grupsFiltered.value = grups.value
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    grupsFiltered.value = grups.value.filter(v => (v.nom).toLowerCase().indexOf(needle) > -1)
  })
}


onMounted(async () => {
  $q.loading.show();

  myUser.value = await UsuariService.getProfile();
  grups.value = await GrupService.findAllGrupsGestorDocumental();
  grups.value.sort((a: Grup, b: Grup) => (a.nom).localeCompare(b.nom));
  grupsFiltered.value = grups.value;

  grupsWithTutors.value = grups.value.map(grup => ({
    grup,
    tutors: [],
    loadingTutors: true,
  }));

  $q.loading.hide();

  // Iniciar la càrrega en segon pla de tots els tutors en lots petits per evitar la saturació de la xarxa
  const token = localStorage.getItem("token");
  const groupsToLoad = [...grups.value];

  const loadNextBatch = () => {
    const batchSize = 3; // Processar 5 grups a la vegada
    const batch = groupsToLoad.splice(0, batchSize);

    if (batch.length > 0) {
      batch.forEach(grup => {
        const plainGrup = JSON.parse(JSON.stringify(grup));
        worker.postMessage({ grup: plainGrup, token, apiUrl: process.env.API });
      });

      // Programar el següent lot
      backgroundLoadTimeout = window.setTimeout(loadNextBatch, 400); // 400ms de retard entre lots
    }
  };

  // Iniciar el procés després d'un breu retard inicial
  backgroundLoadTimeout = window.setTimeout(loadNextBatch, 200);
});

onUnmounted(() => {
  worker.terminate();
  if (backgroundLoadTimeout) {
    clearTimeout(backgroundLoadTimeout);
  }
});
</script>
