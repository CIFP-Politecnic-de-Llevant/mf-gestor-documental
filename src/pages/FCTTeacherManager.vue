<template>
  <q-page padding>
    <q-btn-dropdown color="primary" label="Grups">
      <q-list>
        <q-item v-for="grup in grups" clickable v-close-popup @click="selectGrup(grup)">
          <q-item-section>
            <q-item-label>{{grup.curs.nom}}{{grup.nom}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <div v-if="grupSelected && grupSelected.id">
      <p>Grup:  {{grupSelected.curs.nom}}{{grupSelected.nom}}</p>
      <p>Tutor FCT: {{tutorsFCT.map(t=>t.label).join(", ")}}</p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {onMounted, Ref, ref} from "vue";
import {Usuari} from "src/model/Usuari";
import {Grup} from "src/model/Grup";
import {UsuariService} from "src/service/UsuariService";
import {GrupService} from "src/service/GrupService";

const grups:Ref<Grup[]> = ref([] as Grup[]);
const grupSelected:Ref<Grup> = ref({} as Grup);
const tutorsFCT:Ref<Usuari[]> = ref([] as Usuari[]);
const alumnesFCT:Ref<Usuari[]> = ref([] as Usuari[]);

async function selectGrup(grup:Grup){
  grupSelected.value = grup;
  tutorsFCT.value = await UsuariService.getTutorsFCTByCodiGrup(grupSelected.value.curs.nom+grupSelected.value.nom);
}


onMounted(async ()=>{
  grups.value = await GrupService.findAllGrups();
})
</script>
