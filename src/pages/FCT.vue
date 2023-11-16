<template>
  <q-page class="row items-center justify-evenly">
    hola
    {{autoritzats}}
  </q-page>
</template>

<script lang="ts" setup>

import {onMounted, Ref, ref} from "vue";
import {Usuari} from "src/model/Usuari";
import {DocumentService} from "src/service/DocumentService";
import {useRoute} from "vue-router";
import {useQuasar} from "quasar";

const $q = useQuasar();
const $route = useRoute()

const autoritzats:Ref<Usuari[]> = ref([] as Usuari[]);

onMounted(async ()=>{
  autoritzats.value = await DocumentService.getAutoritzats();
})

</script>
