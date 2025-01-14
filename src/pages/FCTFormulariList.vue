<script setup lang="ts">
import {onMounted} from "vue";

const formularis = [];

onMounted(()=>{

})
</script>

<template>
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
</template>

<style scoped>

</style>
