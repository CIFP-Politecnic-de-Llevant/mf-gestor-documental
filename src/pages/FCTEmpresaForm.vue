<template>
  <q-page padding>
    <div>
      <p class="text-h5 q-mt-lg">Dades Empresa</p>
    </div>
    <q-form @submit="updateCompany" class="q-gutter-md border">
      <div class="row flex justify-center q-gutter-y-md">
        <div class="col-md-3 q-mx-sm" v-for="(value,key,index) in companyData" :key="key" v-show="key !== 'idEmpresa' || key !== 'llocsTreball'">
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
    </q-form>
      <q-btn icon="add" label="Lloc Treball" type="submit" class="q-mt-sm" color="primary"/>
  </q-page>
</template>

<script setup lang="ts">

import {onMounted, ref, Ref} from "vue";
import {Empresa} from "src/model/Empresa";
import {useRoute} from "vue-router";
import {EmpresaService} from "src/service/EmpresaService";

const edited = ref(false);
const idCompany = ref<number>(0);
const companyData:Ref<Empresa> = ref({} as Empresa);
const labels = ["Id","Número Conveni","Número Annnex","Nom","CIF","Adreça",
  "Codi Postal","Població","Provicia","Telèfon"];


function updateCompany(){

}

onMounted(async () =>{

  const route = useRoute();
  idCompany.value= Number(route.params.id);

  companyData.value = await EmpresaService.getCompanyById(idCompany.value);

})
</script>

<style scoped>
.text-wrap-center{
    text-wrap: wrap;
    text-align: center;
}
.text-wrap{
    text-wrap: wrap;
    text-align: left;
}
.border{
    border: 1px solid black;
}
</style>
