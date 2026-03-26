<template>
  <q-page padding>
    <p class="text-h4 q-mb-md">Configuració de Curs Acadèmic i Convocatòria</p>

    <div v-if="!isAuthorized">
      <h2>Usuari no autoritzat</h2>
    </div>

    <div v-else class="q-gutter-y-md">
      <q-card flat bordered>
        <q-card-section>
          <div class="text-subtitle1 q-mb-md">Tres darrers cursos acadèmics</div>

          <q-option-group
            v-model="selectedCurrentAcademicYearId"
            :options="lastThreeAcademicYearOptions"
            type="radio"
          />

          <q-btn
            color="primary"
            label="Guardar curs actual"
            class="q-mt-md"
            :disable="!selectedCurrentAcademicYearId || isUpdatingCurrent"
            :loading="isUpdatingCurrent"
            @click="updateCurrentAcademicYear"
          />
        </q-card-section>
      </q-card>

      <q-card flat bordered>
        <q-card-section>
          <div class="text-subtitle1 q-mb-md">Crear pròxim curs acadèmic</div>

          <q-form @submit="createNextAcademicYear">
            <q-input
              v-model="nextAcademicYearName"
              label="Pròxim curs acadèmic"
              outlined
              readonly
              class="q-mb-md"
            />

            <q-checkbox
              v-model="markAsCurrent"
              label="Marcar com a curs actual"
              class="q-mb-md"
            />

            <div>
              <q-btn
                type="submit"
                color="primary"
                label="Crear curs acadèmic"
                :disable="!nextAcademicYearName || isSaving"
                :loading="isSaving"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, Ref} from "vue";
import {useQuasar} from "quasar";
import {Rol} from "src/model/Rol";
import {CursAcademic} from "src/model/CursAcademic";
import {CursAcademicService} from "src/service/CursAcademicService";

const $q = useQuasar();

const rolsUser = JSON.parse(<string>localStorage.getItem("rol")) || [];
const isAuthorized = computed(() => rolsUser.some((r: string) => r === Rol.ADMINISTRADOR));

const lastThreeAcademicYears: Ref<CursAcademic[]> = ref([]);
const selectedCurrentAcademicYearId = ref<number | null>(null);
const nextAcademicYearName = ref('');
const markAsCurrent = ref(true);
const isSaving = ref(false);
const isUpdatingCurrent = ref(false);

const lastThreeAcademicYearOptions = computed(() =>
  lastThreeAcademicYears.value.map((cursAcademic: CursAcademic) => ({
    label: cursAcademic.nom,
    value: cursAcademic.idcursAcademic
  }))
);

function parseAcademicYearStart(nom: string): number | null {
  const match = nom.match(/^(\d{4})\/(\d{2}|\d{4})$/);
  if (!match) {
    return null;
  }

  return Number(match[1]);
}

function buildNextAcademicYearName(cursosAcademics: CursAcademic[]): string {
  const latestStartYear = cursosAcademics
    .map((cursAcademic: CursAcademic) => parseAcademicYearStart(cursAcademic.nom))
    .filter((year: number | null): year is number => year !== null)
    .sort((a: number, b: number) => b - a)[0];

  const baseYear = latestStartYear ?? (new Date().getFullYear() - 1);
  const nextYear = baseYear + 1;
  const nextYearShort = String((nextYear + 1) % 100).padStart(2, '0');

  return `${nextYear}/${nextYearShort}`;
}

async function loadData() {
  const allAcademicYears = await CursAcademicService.getAllCursosAcademics();
  const actualAcademicYear = allAcademicYears.find((cursAcademic: CursAcademic) => cursAcademic.actual) || null;

  lastThreeAcademicYears.value = allAcademicYears.slice(0, 3);
  selectedCurrentAcademicYearId.value = actualAcademicYear?.idcursAcademic ?? null;
  nextAcademicYearName.value = buildNextAcademicYearName(allAcademicYears);
}

async function updateCurrentAcademicYear() {
  const academicYearToUpdate = lastThreeAcademicYears.value.find((cursAcademic: CursAcademic) =>
    cursAcademic.idcursAcademic === selectedCurrentAcademicYearId.value
  );

  if (!academicYearToUpdate) {
    return;
  }

  isUpdatingCurrent.value = true;
  try {
    await CursAcademicService.save({
      idcursAcademic: academicYearToUpdate.idcursAcademic,
      nom: academicYearToUpdate.nom,
      actual: true
    });

    $q.notify({
      color: 'positive',
      message: 'Curs actual actualitzat correctament',
      icon: 'check'
    });

    await loadData();
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'No s\'ha pogut actualitzar el curs actual',
      icon: 'report_problem'
    });
  } finally {
    isUpdatingCurrent.value = false;
  }
}

async function createNextAcademicYear() {
  if (!isAuthorized.value || !nextAcademicYearName.value) {
    return;
  }

  isSaving.value = true;
  try {
    await CursAcademicService.save({
      nom: nextAcademicYearName.value,
      actual: markAsCurrent.value
    });

    $q.notify({
      color: 'positive',
      message: 'Curs acadèmic creat correctament',
      icon: 'check'
    });

    markAsCurrent.value = true;
    await loadData();
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'No s\'ha pogut crear el curs acadèmic',
      icon: 'report_problem'
    });
  } finally {
    isSaving.value = false;
  }
}

onMounted(async () => {
  if (!isAuthorized.value) {
    return;
  }

  $q.loading.show({
    message: 'Carregant cursos acadèmics...'
  });

  try {
    await loadData();
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'No s\'han pogut carregar els cursos acadèmics',
      icon: 'report_problem'
    });
  } finally {
    $q.loading.hide();
  }
});
</script>
