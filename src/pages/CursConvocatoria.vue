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
              :pagination="{ rowsPerPage: 0 }"
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
                <q-tr :props="props" :class="{ 'current-convocatoria-row': props.row.actual }">
                  <q-td key="nom" :props="props" class="text-wrap-center">
                    {{ props.row.nom }}
                  </q-td>
                  <q-td key="cursAcademic" :props="props" class="text-wrap-center">
                    {{ props.row.cursAcademic }}
                  </q-td>
                  <q-td key="actual" :props="props" class="text-wrap-center">
                    {{ props.row.actual ? 'Sí' : 'No' }}
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

      <div class="col-12">
        <q-card flat bordered>
          <q-card-section>
            <div class="section-title q-mb-md">Nova convocatòria</div>

            <q-form ref="convocatoriaFormRef" @submit="createConvocatoria">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="convocatoriaForm.nom"
                    label="Nom"
                    outlined
                    :rules="[(val:any) => !!val || 'El camp és obligatori']"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <q-select
                    v-model="convocatoriaForm.idCursAcademic"
                    :options="academicYearSelectOptions"
                    emit-value
                    map-options
                    outlined
                    label="Curs acadèmic"
                    :rules="[(val:any) => !!val || 'El camp és obligatori']"
                  />
                </div>

                <div class="col-12">
                  <q-checkbox
                    v-model="convocatoriaForm.actual"
                    label="Marcar com a convocatòria actual"
                    :rules="[(val:any) => val === true || val === false || 'El camp és obligatori']"
                  />
                </div>

                <div class="col-12">
                  <q-checkbox
                    v-model="convocatoriaForm.applyDriveChanges"
                    label="Aplicar automàticament els canvis a la unitat compartida de Google Drive"
                  />
                </div>

                <div class="col-12">
                  <q-banner class="bg-orange-2 text-dark q-mb-md" rounded>
                    <div class="text-weight-bold q-mb-xs">ATENCIÓ</div>
                    <div>Esborrar carpetes Q_FEMPO i FCT si no es tria fer-ho de forma automàtica</div>
                  </q-banner>
                </div>

                <div class="col-12">
                  <q-checkbox
                    v-model="deleteOriginDocuments"
                    label="Eliminar documents origen Q_FEMPO i FCT automàticament"
                  />
                </div>

                <template v-if="deleteOriginDocuments">
                  <div class="col-12">
                    <q-banner class="bg-red-2 text-dark q-mb-md" rounded>
                      <div class="text-weight-bold q-mb-xs">Avís</div>
                      <div>Documents dins FCT s'esborraran automàticament</div>
                    </q-banner>
                  </div>

                  <div class="col-12">
                    <div class="row items-center q-mb-sm">
                      <div class="text-subtitle1 text-weight-bold q-mr-md">Selecció de carpetes Q_FEMPO a eliminar</div>
                      <q-checkbox
                        v-if="availableQFempoFolders.length > 0"
                        :model-value="selectedQFempoFolders.length === availableQFempoFolders.length"
                        :indeterminate-value="selectedQFempoFolders.length > 0 && selectedQFempoFolders.length < availableQFempoFolders.length"
                        label="Seleccionar totes"
                        @update:model-value="toggleSelectAllFempoFolders"
                      />
                    </div>
                    <q-spinner v-if="isLoadingFempoFolders" />
                    <div v-else-if="availableQFempoFolders.length === 0" class="text-grey">
                      No s'han trobat carpetes Q_FEMPO
                    </div>
                    <div v-else class="row q-gutter-sm">
                      <div v-for="folder in availableQFempoFolders" :key="folder" class="col-12 col-sm-6 col-md-4">
                        <q-checkbox
                          v-model="selectedQFempoFolders"
                          :val="folder"
                          :label="folder"
                        />
                      </div>
                    </div>
                    <!-- Botó de test ocult per producció. Descomentar per provar el borrat de carpetes Q_FEMPO + FCT -->
                    <!--
                    <q-btn
                      color="warning"
                      text-color="dark"
                      label="TEST: Esborrar carpetes Q_FEMPO seleccionades"
                      class="q-mt-md"
                      :disable="selectedQFempoFolders.length === 0 || isDeletingTestFempo"
                      :loading="isDeletingTestFempo"
                      @click="testDeleteFempoFolders"
                    />
                    -->
                  </div>
                </template>

                <div class="col-12 col-md-6">
                  <q-input
                    v-model="convocatoriaForm.pathDesti"
                    label="Path destí de la nova convocatòria"
                    outlined
                    :rules="[(val:any) => !!val || 'El camp és obligatori']"
                  />
                </div>

                <div class="col-12 col-md-6">
                  <q-input
                    :model-value="previousConvocatoria?.nom || 'No hi ha convocatòria anterior'"
                    label="Convocatòria anterior"
                    outlined
                    readonly
                  />
                </div>

                <div class="col-12">
                  <q-input
                    v-model="previousConvocatoriaPathDesti"
                    label="Nou path destí de la convocatòria anterior"
                    outlined
                    :disable="!previousConvocatoria"
                    :rules="[(val:any) => !!val || 'El camp és obligatori']"
                  />
                </div>

                <div class="col-12">
                  <q-btn
                    type="submit"
                    color="primary"
                    label="Crear convocatòria"
                    :loading="isSavingConvocatoria"
                    :disable="!convocatoriaForm.nom || !convocatoriaForm.idCursAcademic || !convocatoriaForm.pathDesti || !previousConvocatoriaPathDesti"
                  />
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {computed, nextTick, onMounted, ref, Ref, watch} from "vue";
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
const allAcademicYears: Ref<CursAcademic[]> = ref([]);
const selectedCurrentAcademicYearId = ref<number | null>(null);
const nextAcademicYearName = ref('');
const markAsCurrent = ref(true);
const isSaving = ref(false);
const isUpdatingCurrent = ref(false);
const isSavingConvocatoria = ref(false);
const convocatoriaFormRef = ref(null);
const convocatories: Ref<Convocatoria[]> = ref([]);
const convocatoriesTableRows = ref([] as {
  id: number;
  nom: string;
  cursAcademic: string;
  actual: boolean;
  pathDesti: string;
}[]);
const convocatoriaForm = ref({
  nom: '',
  actual: true,
  idCursAcademic: null as number | null,
  pathDesti: '00FCT Tramit Actual',
  applyDriveChanges: true
});
const previousConvocatoriaPathDesti = ref('');
const deleteOriginDocuments = ref(false);
const selectedQFempoFolders = ref<string[]>([]);
const availableQFempoFolders = ref<string[]>([]);
const isLoadingFempoFolders = ref(false);
const isDeletingTestFempo = ref(false);

function toggleSelectAllFempoFolders(val: boolean) {
  selectedQFempoFolders.value = val ? [...availableQFempoFolders.value] : [];
}

async function testDeleteFempoFolders() {
  if (selectedQFempoFolders.value.length === 0) return;

  $q.dialog({
    title: 'Confirmar eliminació de test',
    message: `S'esborraran ${selectedQFempoFolders.value.length} carpeta/es Q_FEMPO. Aquesta acció és irreversible.`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    isDeletingTestFempo.value = true;
    try {
      await ConvocatoriaService.testDeleteFempoFolders(selectedQFempoFolders.value);
      $q.notify({
        color: 'positive',
        message: 'Carpetes Q_FEMPO esborrades correctament',
        icon: 'check'
      });
      selectedQFempoFolders.value = [];
      availableQFempoFolders.value = await ConvocatoriaService.getQFempoFolders();
    } catch (error) {
      $q.notify({
        color: 'negative',
        message: 'Error esborrant carpetes Q_FEMPO',
        icon: 'report_problem'
      });
    } finally {
      isDeletingTestFempo.value = false;
    }
  });
}

const convocatoriesColumns: QTableColumn[] = [
  {name: 'nom', label: 'Nom', field: 'nom', align: 'center', sortable: true},
  {name: 'cursAcademic', label: 'Curs acadèmic', field: 'cursAcademic', align: 'center', sortable: true},
  {name: 'actual', label: 'Actual', field: 'actual', align: 'center', sortable: true},
  {name: 'pathDesti', label: 'Path destí', field: 'pathDesti', align: 'center', sortable: true}
];

const orderedLastThreeAcademicYears = computed(() =>
  [...lastThreeAcademicYears.value].sort((a: CursAcademic, b: CursAcademic) =>
    a.nom.localeCompare(b.nom)
  )
);

const academicYearSelectOptions = computed(() =>
  allAcademicYears.value.map((cursAcademic: CursAcademic) => ({
    label: cursAcademic.nom,
    value: cursAcademic.idcursAcademic
  }))
);

const previousConvocatoria = computed(() => convocatories.value[0] || null);

watch(deleteOriginDocuments, async (newVal) => {
  if (newVal) {
    isLoadingFempoFolders.value = true;
    try {
      availableQFempoFolders.value = await ConvocatoriaService.getQFempoFolders();
      selectedQFempoFolders.value = [];
    } catch (error) {
      $q.notify({
        color: 'negative',
        message: 'No s\'han pogut carregar les carpetes Q_FEMPO',
        icon: 'report_problem'
      });
    } finally {
      isLoadingFempoFolders.value = false;
    }
  } else {
    selectedQFempoFolders.value = [];
  }
});

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
  const academicYears = await CursAcademicService.getAllCursosAcademics();
  const allConvocatories = await ConvocatoriaService.getAdminConvocatories();
  const actualAcademicYear = academicYears.find((cursAcademic: CursAcademic) => cursAcademic.actual) || null;
  const academicYearNamesById = new Map(
    academicYears.map((cursAcademic: CursAcademic) => [cursAcademic.idcursAcademic, cursAcademic.nom])
  );

  allAcademicYears.value = academicYears;
  convocatories.value = [...allConvocatories].sort((a: Convocatoria, b: Convocatoria) => b.id - a.id);
  lastThreeAcademicYears.value = academicYears.slice(0, 3);
  selectedCurrentAcademicYearId.value = actualAcademicYear?.idcursAcademic ?? null;
  nextAcademicYearName.value = buildNextAcademicYearName(academicYears);
  convocatoriesTableRows.value = [...convocatories.value]
    .sort((a: Convocatoria, b: Convocatoria) => a.id - b.id)
    .map((convocatoria: Convocatoria) => ({
      id: convocatoria.id,
      nom: convocatoria.nom,
      cursAcademic: academicYearNamesById.get(convocatoria.idCursAcademic) || '',
      actual: convocatoria.actual,
      pathDesti: convocatoria.pathDesti || ''
    }));

  if (!convocatoriaForm.value.idCursAcademic) {
    convocatoriaForm.value.idCursAcademic = academicYears[0]?.idcursAcademic || null;
  }
  previousConvocatoriaPathDesti.value = '';
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

async function createConvocatoria() {
  if (!convocatoriaForm.value.nom || !convocatoriaForm.value.idCursAcademic || !convocatoriaForm.value.pathDesti || !previousConvocatoriaPathDesti.value) {
    return;
  }

  isSavingConvocatoria.value = true;
  try {
    const result = await ConvocatoriaService.createConvocatoria({
      convocatoria: {
        nom: convocatoriaForm.value.nom,
        isActual: convocatoriaForm.value.actual,
        idCursAcademic: convocatoriaForm.value.idCursAcademic,
        pathDesti: convocatoriaForm.value.pathDesti
      },
      previousConvocatoriaId: previousConvocatoria.value?.id,
      previousPathDesti: previousConvocatoriaPathDesti.value,
      applyDriveChanges: convocatoriaForm.value.applyDriveChanges,
      deleteOriginDocuments: deleteOriginDocuments.value,
      selectedQFempoFolders: deleteOriginDocuments.value ? selectedQFempoFolders.value : []
    });

    // El resultat real del borrat el notifica el backend via notifyMessage (interceptor d'axios).
    if (result.carpetesNoEsborrades.length > 0) {
      console.warn('Carpetes Q_FEMPO no esborrades:', result.carpetesNoEsborrades);
    }

    convocatoriaForm.value = {
      nom: '',
      actual: true,
      idCursAcademic: allAcademicYears.value[0]?.idcursAcademic || null,
      pathDesti: '00FCT Tramit Actual',
      applyDriveChanges: true
    };
    previousConvocatoriaPathDesti.value = '';
    deleteOriginDocuments.value = false;
    selectedQFempoFolders.value = [];
    await nextTick();
    convocatoriaFormRef.value?.resetValidation();

    await loadData();
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'No s\'ha pogut crear la convocatòria',
      icon: 'report_problem'
    });
  } finally {
    isSavingConvocatoria.value = false;
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

.current-convocatoria-row {
  font-weight: 700;
}
</style>
