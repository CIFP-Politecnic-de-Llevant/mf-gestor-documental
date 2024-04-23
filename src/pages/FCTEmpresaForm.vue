<template>
  <q-page padding>
    <div>
      <p class="text-h5 q-mt-lg">Formulari Empresa</p>
    </div>
    <q-form @submit="updateCompany" class="q-gutter-md">
      <div class="row flex justify-center q-gutter-y-md">
        <div class="col-md-3 q-mx-sm" v-for="(value,key,index) in companyData" :key="key">
          <q-input
              filled
              type="text"
              :label="labels[index]"
              :readonly=" key === 'numeroExpedient'"
              v-model="companyData[key]"
              :model-value="companyData[key]"
          />
        </div>
        <div class="col-md-3 q-mx-sm">
        </div>
      </div>
      <q-btn icon="add" label="Lloc Treball" type="submit" color="primary"/>

      <div class="flex justify-end q-gutter-sm">
        <q-btn label="Guardar" type="submit" color="primary"/>
      </div>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">

import {onMounted, ref, Ref} from "vue";
import {Empresa} from "src/model/Empresa";
import {useRoute} from "vue-router";

const edited = ref(false);
const idCompany = ref<string | null>(null);
const companyData:Ref<Empresa[]> = ref([] as Empresa[]);
const labels = ["Id","Número Conveni","Número Annnex","Nom","CIF","Adreça",
  "Codi Postal","Població","Provicia","Telèfon","Llocs Treball"];


function updateCompany(){

}

onMounted(async () =>{

  const route = useRoute();
  const id = route.params.idEmpresa

  idCompany.value = Array.isArray(id) ? id[0] : id;

})
</script>

<style scoped>

</style>
