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

        <Menuapp v-if="enableApps && (rolsUser.find(rol=>rol===rols.ADMINISTRADOR || rol===rols.DIRECTOR || rol===rols.CAP_ESTUDIS || rol===rols.ADMINISTRATIU || rol===rols.WEB))"></Menuapp>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item clickable to="/fct/generateDocumentation" v-if="rolsUser.find(rol=>rol===rols.ADMINISTRADOR || rol===rols.ADMINISTRADOR_FCT)">
          <q-item-section avatar>
            <q-icon name="description" />
          </q-item-section>
          <q-item-section>
            <q-item-label>FCT - Generar Documentació</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/fct/manageDocumentation" v-if="rolsUser.find(rol=>rol===rols.ADMINISTRADOR || rol===rols.ADMINISTRADOR_FCT)">
          <q-item-section avatar>
            <q-icon name="description" />
          </q-item-section>
          <q-item-section>
            <q-item-label>FCT - Gestionar Documentació</q-item-label>
          </q-item-section>
        </q-item>
        <!--q-item clickable to="/fct/formulari" v-if="rolsUser.find(rol=>rol===rols.ADMINISTRADOR || rol===rols.ADMINISTRADOR_FCT)">
          <q-item-section avatar>
            <q-icon name="description" />
          </q-item-section>
          <q-item-section>
            <q-item-label>FCT - Formulari</q-item-label>
          </q-item-section>
        </q-item-->
        <q-item clickable to="/fct/group">
          <q-item-section avatar>
            <q-icon name="group" />
          </q-item-section>
          <q-item-section>
            <q-item-label>FCT - Grup</q-item-label>
          </q-item-section>
        </q-item>
        <!--q-item clickable to="/fct/empresaConfiguration" >
          <q-item-section avatar>
            <q-icon name="description" />
          </q-item-section>
          <q-item-section>
            <q-item-label>FCT - Configuració Empresa</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/fct/studentConfiguration">
          <q-item-section avatar>
            <q-icon name="description" />
          </q-item-section>
          <q-item-section>
            <q-item-label>FCT - Configuració Alumnes</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable to="/fct/programaFormatiu">
          <q-item-section avatar>
            <q-icon name="group" />
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


<script lang="ts">

import {defineComponent, onMounted, reactive, Ref, ref} from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {Rol} from '../model/Rol.ts'
import Menuapp from '../components/common/AppsMenu.vue';


export default defineComponent({
  name: 'MainLayout',
  components:{
    Menuapp
  },
  setup () {
    const leftDrawerOpen = ref(false)
    const rolsUser = JSON.parse(localStorage.getItem("rol")) || []; //Inicialitzem a un array buit si no existeix cap rol
    const router = useRouter()
    const route = useRoute()
    const rols = Rol;

    const enableGrupsCooperatius = (process.env.APP_ENABLE_GRUPSCOOPERATIUS==='true');
    const enableConvalidacions=(process.env.APP_ENABLE_CONVALIDACIONS==='true');
    const enableProfessoratManager=(process.env.APP_ENABLE_PROFESSORATMANAGER==='true');

    const enableApps = enableGrupsCooperatius || enableConvalidacions || enableProfessoratManager;


    return {
      rolsUser,
      rols,
      enableApps,
      leftDrawerOpen,
      route,
      router,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      },
      goBack(){
        router.go(-1);
      }
    }
  },
  async mounted (){
    //this.calendaris = await ReservatService.findAllCalendaris();
    //console.log("Calendaris",this.calendaris)
  }
})
</script>
