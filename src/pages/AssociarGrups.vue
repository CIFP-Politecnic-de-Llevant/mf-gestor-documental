<template>
  <q-page padding>
    <p class="text-h3">Associar Grups</p>
    <p class="text-h5">Grups que compartiran permisos en les carpetes FEMPO/FCT del drive</p>

    <div>
      <q-btn-dropdown color="primary" label="Grups">
        <q-list>
          <q-item v-for="grup in grups" clickable v-close-popup @click="selectGrup(grup)">
            <q-item-section>
              <q-item-label>{{ grup.curs.nom }}{{ grup.nom }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>

    <div v-if="isSearching">
      <h2>Cercant...</h2>
    </div>
    <div v-if="grupSelected && grupSelected.id && !isAuthorized && !isSearching">
      <h2>Usuari no autoritzat</h2>
    </div>
    <div v-if="grupSelected && grupSelected.id && isAuthorized && !isSearching">
      <p class="text-h5 q-mt-lg">Grup: {{ grupSelected.curs.nom }}{{ grupSelected.nom }}</p>
      <p>Tutor FCT: {{ tutorsFCT.map((t: Usuari) => t.label).join(", ") }}</p>
    </div>

  </q-page>
</template>

<script setup lang="ts">
import {onMounted, Ref, ref} from "vue";
import {Usuari} from "src/model/Usuari";
import {Grup} from "src/model/Grup";
import {UsuariService} from "src/service/UsuariService";
import {GrupService} from "src/service/GrupService";
import {useQuasar} from "quasar";
import {Rol} from "src/model/Rol";
import {useRoute} from "vue-router";

const myUser: Ref<Usuari> = ref({} as Usuari);
const isSearching: Ref<boolean> = ref(false);
const isAuthorized: Ref<boolean> = ref(false);
const grups: Ref<Grup[]> = ref([] as Grup[]);
const grupSelected: Ref<Grup> = ref({} as Grup);
const tutorsFCT: Ref<Usuari[]> = ref([] as Usuari[]);


const $q = useQuasar();
const route = useRoute()

//Get query params
const idConvocatoria: string = route.query?.convocatoria?.toString() || '0';
console.log("Parameter: idConvocatoria", idConvocatoria, route.query?.convocatoria);


async function selectGrup(grup: Grup) {
  isSearching.value = true;
  grupSelected.value = grup;

  tutorsFCT.value = await UsuariService.getTutorsFCTByCodiGrup(grupSelected.value.curs.nom + grupSelected.value.nom);
  console.log(tutorsFCT.value);

  isSearching.value = false;

  const rolsUser = JSON.parse(<string>localStorage.getItem("rol")) || []; //Inicialitzem a un array buit si no existeix cap rol
  isAuthorized.value = !!tutorsFCT.value.find(u => u.email === myUser.value.email) || rolsUser.some((r: string) => r === Rol.ADMINISTRADOR || r === Rol.ADMINISTRADOR_FCT);
}


onMounted(async () => {
  $q.loading.show();

  grups.value = await GrupService.findAllGrups();
  grups.value.sort((a: Grup, b: Grup) => (a.curs.nom + a.nom).localeCompare(b.curs.nom + b.nom));
  $q.loading.hide();

  myUser.value = await UsuariService.getProfile();

})
</script>
