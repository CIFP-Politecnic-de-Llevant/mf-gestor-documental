<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          GestSuite - Gestor Documental
        </q-toolbar-title>

        <Menuapp v-if="enableApps && (rolsUser.find((rol:any)=>rol===rols.ADMINISTRADOR || rol===rols.DIRECTOR || rol===rols.CAP_ESTUDIS || rol===rols.ADMINISTRATIU || rol===rols.WEB))"></Menuapp>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item clickable to="/fct/generateDocumentation" v-if="rolsUser.find((rol:any)=>rol===rols.ADMINISTRADOR)">
          <q-item-section avatar>
            <q-icon name="add" />
          </q-item-section>
          <q-item-section>
            <q-item-label>FCT - Generar Documentació</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable :to="`/fct/manageDocumentation?convocatoria=${idconvocatoria}`" v-if="rolsUser.find((rol:any)=>rol===rols.ADMINISTRADOR || rol===rols.ADMINISTRADOR_FCT)">
          <q-item-section avatar>
            <q-icon name="folder" />
          </q-item-section>
          <q-item-section>
            <q-item-label>FCT - Gestionar Documentació</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/fct/formulari/list" v-if="rolsUser.find((rol:any)=>rol===rols.ADMINISTRADOR || rol===rols.ADMINISTRADOR_FCT || rol===rols.PROFESSOR)">
          <q-item-section avatar>
            <q-icon name="description" />
          </q-item-section>
          <q-item-section>
            <q-item-label>FCT - Formulari</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable :to="`/fct/group?convocatoria=${idconvocatoria}`">
          <q-item-section avatar>
            <q-icon name="group" />
          </q-item-section>
          <q-item-section>
            <q-item-label>FCT - Grup</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/fct/empresaConfiguration" v-if="rolsUser.find((rol:any)=>rol===rols.ADMINISTRADOR || rol===rols.ADMINISTRADOR_FCT)">
          <q-item-section avatar>
            <q-icon name="store" />
          </q-item-section>
          <q-item-section>
            <q-item-label>FCT - Configuració Empresa</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/fct/studentConfiguration" v-if="rolsUser.find((rol:any)=>rol===rols.ADMINISTRADOR)">
          <q-item-section avatar>
            <q-icon name="diversity_3" />
          </q-item-section>
          <q-item-section>
            <q-item-label>FCT - Configuració Alumnes</q-item-label>
          </q-item-section>
        </q-item>
        <!--q-item clickable to="/fct/programaFormatiu" v-if="rolsUser.find((rol:any)=>rol===rols.ADMINISTRADOR || rol===rols.ADMINISTRADOR_FCT)">
          <q-item-section avatar>
            <q-icon name="book" />
          </q-item-section>
          <q-item-section>
            <q-item-label>FCT - Programa Formatiu</q-item-label>
          </q-item-section>
        </q-item-->
        <q-item clickable to="/logout">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Sortir</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>


<script setup lang="ts">

import {onMounted, ref} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Menuapp from '../components/common/AppsMenu.vue';
import {ConvocatoriaService} from "src/service/ConvocatoriaService";
import {Rol} from "src/model/Rol";

    const leftDrawerOpen = ref(false)
    const rolsUser = JSON.parse(<string>localStorage.getItem("rol")) || []; //Inicialitzem a un array buit si no existeix cap rol
    const router = useRouter();
    const route = useRoute();
    const rols = Rol;

    const enableGrupsCooperatius = (process.env.APP_ENABLE_GRUPSCOOPERATIUS==='true');
    const enableConvalidacions=(process.env.APP_ENABLE_CONVALIDACIONS==='true');
    const enableProfessoratManager=(process.env.APP_ENABLE_PROFESSORATMANAGER==='true');

    const enableApps = enableGrupsCooperatius || enableConvalidacions || enableProfessoratManager;

    const idconvocatoria = ref(0);

    function toggleLeftDrawer () {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    function goBack(){
      router.go(-1);
    }

    onMounted(async () => {
      //Find convocatoria with max id
      const convocatories = await ConvocatoriaService.getConvocatories();
      idconvocatoria.value  = convocatories.find(c=>c.actual)?.id || 0;
      console.log("Convocatoria", idconvocatoria.value, convocatories)
    })
</script>
