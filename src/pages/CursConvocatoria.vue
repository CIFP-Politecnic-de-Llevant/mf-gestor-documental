<template>
  <q-page padding>
    <p class="text-h4 q-mb-md">Configuració de Curs Acadèmic i Convocatòria</p>

    <div v-if="!isAuthorized">
      <h2>Usuari no autoritzat</h2>
    </div>

    <div v-else class="row q-col-gutter-lg">
      <div class="col-12 col-lg-6">
        <q-card flat bordered class="full-height">
          <q-card-section>
            <div class="section-title q-mb-md">Tres darrers cursos acadèmics</div>

          <div class="column q-gutter-sm">
            <q-radio
              v-for="cursAcademic in orderedLastThreeAcademicYears"
              :key="cursAcademic.idcursAcademic"
              v-model="selectedCurrentAcademicYearId"
              :val="cursAcademic.idcursAcademic"
            >
              <span :class="{ 'current-academic-year-label': cursAcademic.actual }">
                {{ cursAcademic.nom }}<span v-if="cursAcademic.actual"> (actual)</span>
              </span>
            </q-radio>
          </div>

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
      </div>

      <div class="col-12 col-lg-6">
        <q-card flat bordered class="full-height">
          <q-card-section>
            <div class="section-title q-mb-md">Crear pròxim curs acadèmic</div>

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

      <div class="col-12">
        <q-card flat bordered>
          <q-card-section>
            <div class="section-title q-mb-md">Convocatòries</div>

            <q-table
              flat
              bordered
              :rows="convocatoriesTableRows"
              :columns="convocatoriesColumns"
              row-key="id"
              binary-state-sort
            >
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                    class="text-wrap-center table-header-cell"
                  >
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="nom" :props="props" class="text-wrap-center">
                    {{ props.row.nom }}
                  </q-td>
                  <q-td key="actual" :props="props" class="text-wrap-center">
                    {{ props.row.actual ? 'Sí' : 'No' }}
                  </q-td>
                  <q-td key="cursAcademic" :props="props" class="text-wrap-center">
                    {{ props.row.cursAcademic }}
                  </q-td>
                  <q-td key="pathDesti" :props="props" class="text-wrap-center">
                    {{ props.row.pathDesti }}
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, Ref} from "vue";
import {QTableColumn, useQuasar} from "quasar";
import {Rol} from "src/model/Rol";
import {CursAcademic} from "src/model/CursAcademic";
import {CursAcademicService} from "src/service/CursAcademicService";
import {ConvocatoriaService} from "src/service/ConvocatoriaService";
import {Convocatoria} from "src/model/Convocatoria";

const $q = useQuasar();

const rolsUser = JSON.parse(<string>localStorage.getItem("rol")) || [];
const isAuthorized = computed(() => rolsUser.some((r: string) => r === Rol.ADMINISTRADOR));

const lastThreeAcademicYears: Ref<CursAcademic[]> = ref([]);
const selectedCurrentAcademicYearId = ref<number | null>(null);
const nextAcademicYearName = ref('');
const markAsCurrent = ref(true);
const isSaving = ref(false);
const isUpdatingCurrent = ref(false);
const convocatoriesTableRows = ref([] as {
  id: number;
  nom: string;
  cursAcademic: string;
  actual: boolean;
  pathDesti: string;
}[]);

const convocatoriesColumns: QTableColumn[] = [
  {name: 'nom', label: 'Nom', field: 'nom', align: 'center', sortable: true},
  {name: 'actual', label: 'Actual', field: 'actual', align: 'center', sortable: true},
  {name: 'cursAcademic', label: 'Curs acadèmic', field: 'cursAcademic', align: 'center', sortable: true},
  {name: 'pathDesti', label: 'Path destí', field: 'pathDesti', align: 'center', sortable: true}
];

const orderedLastThreeAcademicYears = computed(() =>
  [...lastThreeAcademicYears.value].sort((a: CursAcademic, b: CursAcademic) =>
    a.nom.localeCompare(b.nom)
  )
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
  const convocatories = await ConvocatoriaService.getConvocatories();
  const actualAcademicYear = allAcademicYears.find((cursAcademic: CursAcademic) => cursAcademic.actual) || null;
  const academicYearNamesById = new Map(
    allAcademicYears.map((cursAcademic: CursAcademic) => [cursAcademic.idcursAcademic, cursAcademic.nom])
  );

  lastThreeAcademicYears.value = allAcademicYears.slice(0, 3);
  selectedCurrentAcademicYearId.value = actualAcademicYear?.idcursAcademic ?? null;
  nextAcademicYearName.value = buildNextAcademicYearName(allAcademicYears);
  convocatoriesTableRows.value = convocatories.map((convocatoria: Convocatoria) => ({
    id: convocatoria.id,
    nom: convocatoria.nom,
    cursAcademic: academicYearNamesById.get(convocatoria.idCursAcademic) || '',
    actual: convocatoria.actual,
    pathDesti: convocatoria.pathDesti || ''
  }));
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

<style scoped>
.section-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #000;
  letter-spacing: 0.01em;
}

.table-header-cell {
  background: #f3f3f3;
  font-weight: 700;
  color: #000;
}

.current-academic-year-label {
  font-weight: 700;
}
</style>
