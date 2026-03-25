<template>
  <q-page padding>
    <p class="text-h4 q-mb-md">Curs Convocatòria</p>

    <div v-if="!isAuthorized">
      <h2>Usuari no autoritzat</h2>
    </div>

    <div v-else class="q-gutter-y-md">
      <q-card flat bordered>
        <q-card-section>
          <div class="text-subtitle1">Curs acadèmic actual</div>
          <div class="text-body1">
            {{ currentAcademicYear?.nom || 'No hi ha cap curs marcat com a actual' }}
          </div>
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

const currentAcademicYear: Ref<CursAcademic | null> = ref(null);
const nextAcademicYearName = ref('');
const markAsCurrent = ref(false);
const isSaving = ref(false);

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
  const [allAcademicYears, actualAcademicYear] = await Promise.all([
    CursAcademicService.getAllCursosAcademics(),
    CursAcademicService.getCursAcademicActual()
  ]);

  currentAcademicYear.value = actualAcademicYear;
  nextAcademicYearName.value = buildNextAcademicYearName(allAcademicYears);
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

    markAsCurrent.value = false;
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
