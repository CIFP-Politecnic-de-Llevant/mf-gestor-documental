
<template>
  <q-page padding>
    <div>
      <p class="text-h5 q-mt-lg">Formulari</p>
    </div>
    <q-form>
      <p class="text-h5 q-mt-lg">Dades FCT</p>
      <div class="row flex justify-center q-gutter-y-md">
        <p class="text-h6 q-mt-lg col-md-12 text-wrap-center">Dades de l'alumne</p>
        <div class="col-md-3 q-mx-sm" v-for="(value,key,index) in studentSelect" :key="key" v-show="key !== 'idAlumne' && dadesPersonals.includes(labels[index])">
          <q-input
              v-if="key !== 'sexe'"
              :class="{'bg-primary': key === 'numeroExpedient'}"
              filled
              type="text"
              :label="dadesAlumne[index]"
              v-model="studentSelect[key]"
              :model-value="studentSelect[key]"
          />
          <q-select
              v-if="key === 'sexe'"
              filled
              v-model="studentSelect[key]"
              :model-value ="studentSelect[key] === 'H'? 'Home': studentSelect[key] && studentSelect[key] === 'D'? 'Dona': studentSelect[key]"
              :options="['Home','Dona']"
              label="Sexe"
          />
        </div>
      </div>
      <div class="row flex justify-center q-gutter-y-md">
        <p class="text-h6 q-mt-lg col-md-12 text-wrap-center">Dades del professor-tutor</p>
        <div class="col-md-3 q-mx-sm" v-for="(value,key,index) in studentSelect" :key="key" v-show="key !== 'idAlumne' && dadesPersonals.includes(labels[index])">
          <q-input
              v-if="key !== 'sexe'"
              :class="{'bg-primary': key === 'numeroExpedient'}"
              filled
              type="text"
              :label="dadesTutor[index]"
              v-model="studentSelect[key]"
              :model-value="studentSelect[key]"
          />
          <q-select
              v-if="key === 'sexe'"
              filled
              v-model="dadesTutor[key]"
              :model-value ="studentSelect[key] === 'H'? 'Home': studentSelect[key] && studentSelect[key] === 'D'? 'Dona': studentSelect[key]"
              :options="['Home','Dona']"
              label="Sexe"
          />
        </div>
        <div class="col-md-3 q-mx-sm"></div>
      </div>
      <div class="row flex justify-center q-gutter-y-md">
        <p class="text-h6 q-mt-lg col-md-12 text-wrap-center">Dades empresa</p>
        <div class="col-md-3 q-mx-sm" v-for="(value,key,index) in studentSelect" :key="key" v-show="key !== 'idAlumne' && dadesPersonals.includes(labels[index])">
          <q-input
              v-if="key !== 'sexe'"
              :class="{'bg-primary': key === 'numeroExpedient'}"
              filled
              type="text"
              :label="dadesEmpresa[index]"
              v-model="studentSelect[key]"
              :model-value="studentSelect[key]"
          />
          <q-select
              v-if="key === 'sexe'"
              filled
              v-model="studentSelect[key]"
              :model-value ="studentSelect[key] === 'H'? 'Home': studentSelect[key] && studentSelect[key] === 'D'? 'Dona': studentSelect[key]"
              :options="['Home','Dona']"
              label="Sexe"
          />
        </div>
        <div class="col-md-3 q-mx-sm"></div>
        <div class="col-md-3 q-mx-sm"></div>
      </div>
      <div class="row flex justify-center q-gutter-y-md">
        <p class="text-h6 q-mt-lg col-md-12 text-wrap-center">Altres informacions</p>
        <div class="col-md-3 q-mx-sm" v-for="(value,key,index) in studentSelect" :key="key" v-show="key !== 'idAlumne' && dadesPersonals.includes(labels[index])">
          <q-input
              v-if="key !== 'sexe'"
              :class="{'bg-primary': key === 'numeroExpedient'}"
              filled
              type="text"
              :label="dadesAltresInformacions[index]"
              v-model="studentSelect[key]"
              :model-value="studentSelect[key]"
          />
          <q-select
              v-if="key === 'sexe'"
              filled
              v-model="studentSelect[key]"
              :model-value ="studentSelect[key] === 'H'? 'Home': studentSelect[key] && studentSelect[key] === 'D'? 'Dona': studentSelect[key]"
              :options="['Home','Dona']"
              label="Sexe"
          />
        </div>
      </div>
      <div class="row flex justify-center q-gutter-y-md">
        <p class="text-h6 q-mt-lg col-md-12 text-wrap-center">Flexibilització en el mòdul FCT</p>
        <div class="col-md-3 q-mx-sm" v-for="(value,key,index) in studentSelect" :key="key" v-show="key !== 'idAlumne' && dadesPersonals.includes(labels[index])">
          <q-input
              v-if="key !== 'sexe'"
              :class="{'bg-primary': key === 'numeroExpedient'}"
              filled
              type="text"
              label="Hi ha algun tipus de flexibilització en el mòdul de FCT?"
              v-model="studentSelect[key]"
              :model-value="studentSelect[key]"
          />
          <q-select
              v-if="key === 'sexe'"
              filled
              v-model="studentSelect[key]"
              :model-value ="studentSelect[key] === 'H'? 'Home': studentSelect[key] && studentSelect[key] === 'D'? 'Dona': studentSelect[key]"
              :options="['Home','Dona']"
              label="Sexe"
          />
        </div>
        <div class="col-md-3 q-mx-sm"></div>
      </div>
    </q-form>
  </q-page>
</template>
<script setup lang="ts">



import {Ref} from "vue";

const studentSelect:Ref<
const dadesAlumne = ["Nom","Llinatges","Població","DNI","Nombre expedient","Número d'Expedient",
  "Es menor d'edat en el moment de començar la FCT? ","Edat de l'alumne (només número)","Estudis",
  "Cicle Formatiu","Grup","Durada del cicle", "Número d'hores totals proposades per FCT (només número)",
  "Número d'hores diàries (només número)","Km centre treball-població alumne (només número)","Període",
  "Data inicial","Data final","Data màxima acabament","Tipus de jornada","Horari"];
const dadesTutor = ["Nom","Llinatges","Telèfon mòbil"];
const dadesEmpresa = ["És una empresa nova?","És una empresa de l'Administració Pública?","Número de conveni",
  "Número d'annex","Nom","CIF","Adreça","Còdig postal","Població","Telèfon","Nom Centre de treball",
  "Adreça Centre de treball","Adreça Centre de treball","Població Centre de treball","Telèfon Centre de treball",
  "Activitat Centre de treball","Nom representant legal","Llinatges representant legal","NIF representant legal",
  "Nom tutor empresa","Llinatges tutor empresa","NIF tutor empresa","Nacionalitat tutor empresa","Municipi tutor empresa",
  "Càrrec del tutor dins l'empresa","Correu electrònic de l'empresa"];
const dadesAltresInformacions = ["Dia seguiment centre educatiu","Hora seguiment centre educatiu",
  "Dia seguiment amb responsable FCT","Hora seguiment amb responsable FCT"];

</script>
<style scoped>

</style>
