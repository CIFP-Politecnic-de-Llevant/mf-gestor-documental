<template>
  <q-page padding>
    <div class="row items-center justify-between q-mb-md">
      <p class="text-h5 q-my-none">Manteniment Documents Generals</p>
      <q-btn icon="add" label="Document General" color="primary" @click="openCreateDialog" />
    </div>

    <q-table
      flat
      bordered
      :rows="documents"
      :columns="columns"
      row-key="idGoogleDrive"
      :pagination="initialPagination"
      :filter="filter"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="idGoogleDrive" :props="props">{{ props.row.idGoogleDrive }}</q-td>
          <q-td key="nomOriginal" :props="props">{{ props.row.nomOriginal }}</q-td>
          <q-td key="accions" :props="props" class="text-center">
            <q-btn
              color="primary"
              text-color="white"
              round
              dense
              icon="drive_file_rename_outline"
              @click="openEditDialog(props.row)"
            />
            <q-btn
              color="primary"
              text-color="white"
              round
              dense
              class="q-ml-md"
              icon="delete"
              @click="openDeleteDialog(props.row)"
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>

    <q-dialog v-model="showEditDialog" persistent>
      <q-card style="min-width: 500px">
        <q-card-section>
          <p class="text-h6 q-my-none">{{ isEdit ? "Editar" : "Crear" }} Document General</p>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="saveDocumentGeneral" class="q-gutter-md">
            <q-input
              filled
              v-model="form.idGoogleDrive"
              label="ID Google Drive"
              :rules="[(val) => !!val || 'Camp obligatori']"
            />
            <q-input
              filled
              v-model="form.nomOriginal"
              label="Nom original"
              :rules="[(val) => !!val || 'Camp obligatori']"
            />
            <div class="row justify-end q-gutter-sm">
              <q-btn flat label="Cancel·lar" color="primary" v-close-popup />
              <q-btn label="Guardar" type="submit" color="primary" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card style="width: 350px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Esborrar Document General</div>
        </q-card-section>

        <q-card-section class="q-pt-md">
          Vols esborrar el document {{ selected.nomOriginal }}?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="No" color="primary" v-close-popup />
          <q-btn label="Si" color="primary" @click="deleteDocumentGeneral" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, Ref, ref } from "vue";
import { QTableColumn } from "quasar";
import { DocumentGeneral } from "src/model/DocumentGeneral";
import { DocumentGeneralService } from "src/service/DocumentGeneralService";

const documents: Ref<DocumentGeneral[]> = ref([] as DocumentGeneral[]);
const filter = ref("");

const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const isEdit = ref(false);
const originalIdGoogleDrive = ref("");

const form: Ref<DocumentGeneral> = ref({
  idGoogleDrive: "",
  nomOriginal: "",
});

const selected: Ref<DocumentGeneral> = ref({
  idGoogleDrive: "",
  nomOriginal: "",
});

const initialPagination = {
  sortBy: "nomOriginal",
  descending: false,
  page: 1,
  rowsPerPage: 0,
};

const columns: QTableColumn[] = [
  {
    name: "idGoogleDrive",
    label: "ID Google Drive",
    field: "idGoogleDrive",
    align: "left",
    sortable: true,
  },
  {
    name: "nomOriginal",
    label: "Nom Original",
    field: "nomOriginal",
    align: "left",
    sortable: true,
  },
  {
    name: "accions",
    label: "Accions",
    field: "accions",
    align: "center",
  },
];

async function loadData(): Promise<void> {
  documents.value = await DocumentGeneralService.findAll();
}

function openCreateDialog(): void {
  isEdit.value = false;
  originalIdGoogleDrive.value = "";
  form.value = { idGoogleDrive: "", nomOriginal: "" };
  showEditDialog.value = true;
}

function openEditDialog(documentGeneral: DocumentGeneral): void {
  isEdit.value = true;
  originalIdGoogleDrive.value = documentGeneral.idGoogleDrive;
  form.value = { ...documentGeneral };
  showEditDialog.value = true;
}

function openDeleteDialog(documentGeneral: DocumentGeneral): void {
  selected.value = { ...documentGeneral };
  showDeleteDialog.value = true;
}

async function saveDocumentGeneral(): Promise<void> {
  if (isEdit.value) {
    await DocumentGeneralService.update(originalIdGoogleDrive.value, form.value);
  } else {
    await DocumentGeneralService.create(form.value);
  }
  showEditDialog.value = false;
  await loadData();
}

async function deleteDocumentGeneral(): Promise<void> {
  await DocumentGeneralService.delete(selected.value.idGoogleDrive);
  await loadData();
}

onMounted(async () => {
  await loadData();
});
</script>
