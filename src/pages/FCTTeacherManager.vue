<template>
  <q-page class="row items-center justify-evenly">

  </q-page>
</template>

<script setup lang="ts">
import {onMounted, Ref, ref} from "vue";
import {Usuari} from "src/model/Usuari";
import {UsuariService} from "src/service/UsuariService";

const grups=0;

const tutorsFCT:Ref<Usuari[]> = ref([] as Usuari[]);


onMounted(async ()=>{
  tutorsFCT.value = await UsuariService.getTutorsFCT();
})
</script>
