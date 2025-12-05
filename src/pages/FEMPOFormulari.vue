<template>
  <q-page padding>
    <div class="row flex">
      <div class="col-md-3">
        <p class="text-h5 q-mt-lg">Formulari FEMPO</p>
      </div>
      <div class="row col-md-8 q-mt-xs">
        <p class="q-pt-lg q-mr-sm text-apartat">Curs Escolar: </p>
        <q-input placeholder="25/26" dense class="q-pt-sm q-mt-xs" color="primary" v-model="formData.anyCurs"
                 label="      "/>
      </div>
    </div>
    <div class="border">
      <q-form @submit="confirmSave" @validationError="errorForm" ref="formulariAlumnes">
        <div class="bg-primary border-bottom">
          <p class="text-apartat text-center col-md-12 q-pt-md text-wrap-center">Dades de l'alumne</p>
        </div>

        <div class="q-pa-md">
          <div class="q-gutter-md row">
            <q-select
              standout
              v-model="selectedStudent"
              emit-value
              map-options
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              :options="filteredStudentOptions"
              @filter="filterStudentsFn"
              style="width: 250px; padding-bottom: 32px"
              label="Alumne"
              color="white"
              bg-color="primary"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sense resultats
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>


        <div class="row flex justify-start q-mt-sm q-gutter-y-md">
          <div class="col-md-2">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Número expedient"
              v-model="formData.numeroExpedient"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>
          <div class="col-md-3">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Nom alumne"
              v-model="formData.nomAlumne"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>
          <div class="col-md-4">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Llinatges alumne"
              v-model="formData.llinatgesAlumne"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>
          <div class="col-md-3">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="DNI/NIE"
              v-model="formData.dniAlumne"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>
          <div class="col-md-3">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Població"
              v-model="formData.poblacioAlumne"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>
          <div class="col-md-3">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Telèfon"
              v-model="formData.telefonAlumne"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>
          <div class="col-md-3">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="E-mail"
              v-model="formData.emailAlumne"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>
        </div>

        <div class="row flex justify-start q-mt-sm q-gutter-y-md">
          <div class=" q-pl-sm">
            <p class="q-pt-sm q-pr-sm q-pl-sm q-mb-none ">Estudis</p>
            <div class="q-gutter-sm">
              <q-radio size="sm" v-model="formData.estudis" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                       val="FP Bàsica" label="FP Bàsica"/>
              <q-radio size="sm" v-model="formData.estudis" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                       val="CF Grau Mitjà" label="CF Grau Mitjà"/>
              <q-radio size="sm" v-model="formData.estudis" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                       val="CF Grau Superior" label="CF Grau Superior"/>
            </div>
          </div>

          <div class="col-md-3">
            <q-select
              outlined
              class="q-pa-sm"
              v-model="formData.cicleFormatiu"
              :options="ciclesFormatius"
              label="Cicle Formatiu"
            />
          </div>

          <div class="col-md-2">
            <q-select
              outlined
              class="q-pa-sm"
              v-model="formData.grup"
              :options="allNomGrups"
              label="Grup"
              :clearable="false"
            />
          </div>

          <div class=" q-pl-sm">
            <p class="q-pt-sm q-pr-sm q-pl-sm q-mb-none ">Durada del cicle</p>
            <div class="q-gutter-sm">
              <q-radio size="sm" v-model="formData.duradaCicle" checked-icon="task_alt"
                       unchecked-icon="panorama_fish_eye" val="1 any" label="1 any"/>
              <q-radio size="sm" v-model="formData.duradaCicle" checked-icon="task_alt"
                       unchecked-icon="panorama_fish_eye" val="2 anys" label="2 anys"/>
            </div>
          </div>
        </div>

        <div class="row flex justify-start q-mt-sm q-gutter-md q-gutter-y-md">
          <div class="col-12 col-md-2 q-pl-sm">
            <p class="q-pt-sm q-pr-sm q-pl-sm q-mb-none">Curs d'estada</p>
            <div class="q-gutter-sm">
              <q-radio size="sm" v-model="formData.cursEstada" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                       val="1r" label="1r"/>
              <q-radio size="sm" v-model="formData.cursEstada" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                       val="2n" label="2n"/>
            </div>
          </div>

          <div class="col-12 col-md-2 q-pl-sm">
            <p class="q-pt-sm q-pr-sm q-pl-sm q-mb-none">Ocasió</p>
            <div class="q-gutter-sm">
              <q-radio size="sm" v-model="formData.ocasio" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                       val="1a" label="1a"/>
              <q-radio size="sm" v-model="formData.ocasio" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                       val="2a" label="2a"/>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <div class="q-pl-sm q-pt-md">
              <q-toggle v-model="formData.acumulaEstadesPrimer" label="Acumula estades de primer"/>
            </div>
          </div>

          <div class="col-12 col-md-3">
            <q-input
              class="q-pa-sm"
              outlined
              type="number"
              label="Hores de primer que es fan a segón"
              v-model.number="formData.horesPrimerASegon"
              :rules="[(val:any) => (val !== null && val !== undefined && Number(val) >= 0) || 'Ha de ser un enter positiu o zero']"
            />
          </div>
        </div>

        <div class="row flex justify-start q-mt-sm q-gutter-md q-gutter-y-md">
          <div class="col-12 col-md-2">
            <div class="q-pl-sm q-pt-md">
              <q-toggle v-model="formData.mobilitat" label="Mobilitat"/>
            </div>
          </div>

          <div class="col-12 col-md-3" v-if="formData.mobilitat">
            <q-select
              class="q-pa-sm"
              outlined
              v-model="formData.zonaMobilitat"
              :options="['Illes Balears', 'Altres comunitats', 'Altres països']"
              label="Zona"
              :clearable="false"
            />
          </div>

          <div class="col-12 col-md-6" v-if="formData.mobilitat">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Característiques"
              v-model="formData.caracteristiquesMobilitat"
            />
          </div>
        </div>

        <div class="row flex justify-center q-mt-sm q-gutter-y-md">
          <div class="col-md-6 q-pa-md flex justify-center">
            <div>
              <p class="text-h6">Data inici pràctiques</p>
              <q-date
                v-model="formData.dataInici"
                minimal
                mask="YYYY-MM-DD"
                @update:model-value="ageCalculate(formData.dataInici)"
              />
            </div>
          </div>
          <div class="col-md-6 q-pa-md flex justify-center">
            <div>
              <p class="text-h6">Data final pràctiques</p>
              <q-date
                v-model="formData.dataFi"
                minimal
                mask="YYYY-MM-DD"
              />
            </div>
          </div>
        </div>

        <div class="row flex justify-start q-mt-sm q-gutter-y-md">
          <div class=" q-pl-sm">
            <p class="q-pt-sm q-pr-sm q-pl-sm q-mb-none ">Període</p>
            <div class="q-gutter-sm ">
              <q-radio size="sm" v-model="formData.periode" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                       val="Ordinari" label="Ordinari"/>
              <q-radio size="sm" v-model="formData.periode" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                       val="No ordinari" label="No ordinari"/>
            </div>
          </div>

          <div class=" q-pl-sm">
            <p class="q-pt-sm q-pr-sm q-pl-sm q-mb-none ">Es menor d'edat en el moment de començar la FEMPO?</p>
            <div class="q-gutter-sm ">
              <q-radio size="sm" v-model="formData.menorEdat" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                       :val="true" label="Si"/>
              <q-radio size="sm" v-model="formData.menorEdat" checked-icon="task_alt" unchecked-icon="panorama_fish_eye"
                       :val="false" label="No"/>
            </div>
            <small>Si s'emplena la data d'inici de la FEMPO aquest camps s'emplena automàticament</small>
          </div>

          <div class="col-md-4">
            <q-input
              class="q-pa-sm"
              outlined
              type="number"
              label="Edat de l'alumne (només número)"
              v-model="formData.edat"
              hint="Si s'emplena la data d'inici de la FEMPO aquest camps s'emplena automàticament"
            />
          </div>

        </div>


        <div class="row flex justify-start q-mt-sm q-gutter-y-md">

          <div class="col-md-2">
            <q-input
              class="q-pa-sm"
              outlined
              type="number"
              label="Número hores proposades"
              v-model="formData.totalHoresProposadesFct"
              hint="Només número"
            />
          </div>

          <div class="col-md-2">
            <q-input
              class="q-pa-sm"
              outlined
              type="number"
              label="Número hores diàries"
              v-model="formData.horesDiaries"
              hint="Només número"
            />
          </div>

          <div class="col-md-3">
            <q-select
              class="q-pa-sm"
              v-model="formData.tipusJornada"
              outlined
              label="Tipus jornada"
              :options="['Continuada', 'Partida', 'Continuada i Partida']"/>
          </div>

          <div class="col-md-3">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Horari"
              v-model="formData.horari"
              hint="Exemple: jornada partida: 8.00-12:00 15:00-18:00"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>
        </div>


        <div class="bg-primary border-bot-top q-mt-lg">
          <p class="text-apartat text-center col-md-12 q-pt-md text-wrap-center">Dades del professor-tutor</p>
        </div>
        <div class="row flex justify-start q-mt-sm q-gutter-y-md">
          <div class="col-md-3">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Nom tutor"
              v-model="formData.nomTutor"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>
          <div class="col-md-3">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Llinatges tutor"
              v-model="formData.llinatgesTutor"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>
          <div class="col-md-3">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Telèfon mòbil tutor"
              v-model="formData.telefonTutor"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>
          <div class="col-md-3">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Correu electrònic tutor"
              v-model="formData.emailTutor"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>
        </div>


        <div class="bg-primary border-bot-top q-mt-lg">
          <p class="text-apartat text-center col-md-12 q-pt-md text-wrap-center">Dades empresa</p>
        </div>

        <div class="q-pa-md">
          <div class="q-gutter-md row">
            <q-select
              standout
              v-model="selectedCompany"
              emit-value
              map-options
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              :options="filteredCompanyOptions"
              @filter="filterCompaniesFn"
              label="Empresa"
              color="white"
              bg-color="primary"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sense resultats
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-btn-dropdown v-if="companySelected" class="q-mt-md q-ml-sm" color="primary" label="Lloc de treball">
              <q-list>
                <q-item v-for="workspace in allCompanyWorkspace" clickable v-close-popup
                        @click="selectWorkspace(workspace)">
                  <q-item-section>
                    <q-item-label>{{ workspace.nom }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>

            <q-btn v-if="companySelected" @click="addWorkspace=true" color="grey" icon="add">
              <q-tooltip>
                NOU LLOC DE TREBALL
              </q-tooltip>
            </q-btn>

            <q-btn-dropdown v-if="companySelected" class="q-mt-md q-ml-sm" color="primary" label="Tutor d'empresa">
              <q-list>
                <q-item v-for="tutorEmpresa in allCompanyTutorEmpresa" clickable v-close-popup
                        @click="selectTutorEmpresa(tutorEmpresa)">
                  <q-item-section>
                    <q-item-label>{{ tutorEmpresa.nom }} {{ tutorEmpresa.cognom1 }} {{ tutorEmpresa.cognoms2 }}
                      ({{ tutorEmpresa.carrec }})
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>

            <q-btn v-if="companySelected" @click="addTutorEmpresa=true" color="grey" icon="add">
              <q-tooltip>
                NOU TUTOR D'EMPRESA
              </q-tooltip>
            </q-btn>
          </div>
        </div>


        <!--      <q-btn-dropdown class="q-mt-md q-mr-md q-ml-sm" color="primary" label="Empresa">-->
        <!--        <q-list>-->
        <!--          <q-item v-for="company in allCompanies" clickable v-close-popup @click="selectCompany(company)">-->
        <!--            <q-item-section>-->
        <!--              <q-item-label>{{company.nom}}</q-item-label>-->
        <!--            </q-item-section>-->
        <!--          </q-item>-->
        <!--        </q-list>-->
        <!--      </q-btn-dropdown>-->


        <div class="row flex justify-start q-mt-sm q-gutter-y-md">
          <div class=" q-pl-sm">
            <p class="q-pt-sm q-pr-sm q-pl-sm q-mb-none ">És una empresa nova?</p>
            <div class="q-gutter-sm ">
              <q-radio size="sm" v-model="formData.empresaNova" checked-icon="task_alt"
                       unchecked-icon="panorama_fish_eye" :val="true" label="Si"/>
              <q-radio size="sm" v-model="formData.empresaNova" checked-icon="task_alt"
                       unchecked-icon="panorama_fish_eye" :val="false" label="No"/>
            </div>
          </div>

          <div class=" q-pl-sm">
            <p class="q-pt-sm q-pr-sm q-pl-sm q-mb-none ">És una empresa de l'Administració Pública?</p>
            <div class="q-gutter-sm ">
              <q-radio size="sm" v-model="formData.empresaAdministracioPublica" checked-icon="task_alt"
                       unchecked-icon="panorama_fish_eye" :val="true" label="Si"/>
              <q-radio size="sm" v-model="formData.empresaAdministracioPublica" checked-icon="task_alt"
                       unchecked-icon="panorama_fish_eye" :val="false" label="No"/>
            </div>
          </div>

          <div class="col-md-4">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Número de conveni"
              v-model="formData.numeroConveni"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>

          <div class="col-md-4">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Correu electrònic empresa"
              v-model="formData.emailEmpresa"
            />
          </div>
        </div>

        <div class="row flex justify-start q-mt-sm q-gutter-y-md">
          <div class="col-md-4">
            <q-input
              class="q-pa-sm"
              outlined
              bg-color="primary"
              type="text"
              label="Nom de l'empresa"
              v-model="formData.nomEmpresa"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>

          <div class="col-md-4">
            <q-input
              class="q-pa-sm"
              outlined
              bg-color="primary"
              type="text"
              label="CIF de l'empresa"
              v-model="formData.cif"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>

          <div class="col-md-4">
            <q-input
              class="q-pa-sm"
              outlined
              bg-color="primary"
              type="text"
              label="Nom representant legal"
              v-model="formData.nomRepresentantLegal"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>
          <div class="col-md-4">
            <q-input
              class="q-pa-sm"
              outlined
              bg-color="primary"
              type="text"
              label="Llinatges representant legal"
              v-model="formData.cognomsRepresentantLegal"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>
          <div class="col-md-4">
            <q-input
              class="q-pa-sm"
              outlined
              bg-color="primary"
              type="text"
              label="NIF representant legal"
              v-model="formData.nifRepresentantLegal"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>

          <div class="col-md-4">
            <q-input
              class="q-pa-sm"
              outlined
              bg-color="primary"
              type="text"
              label="Adreça de l'empresa"
              v-model="formData.adrecaEmpresa"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>
        </div>
        <div class="row flex justify-start q-mt-sm q-gutter-y-md">
          <div class="col-md-4">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Població empresa"
              v-model="formData.poblacioEmpresa"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>

          <div class="col-md-4">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Codi postal empresa"
              v-model="formData.cpempresa"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>

          <div class="col-md-4">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Telèfon"
              v-model="formData.telefonEmpresa"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>
        </div>


        <p class="text-apartat text-center col-md-12 q-pt-md text-wrap-center">Lloc de treball</p>

        <div class="row flex justify-start q-mt-sm q-gutter-y-md">
          <div class="col-md-4">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Nom centre de treball"
              v-model="formData.nomLlocTreball"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>

          <div class="col-md-4">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Telèfon lloc de treball"
              v-model="formData.telefonLlocTreball"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>

          <div class="col-md-4">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Activitat centre de treball"
              v-model="formData.activitatLlocTreball"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>
        </div>

        <div class="row flex justify-center q-mt-sm q-gutter-y-md">
          <div class="col-md-4">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Adreça centre de treball"
              v-model="formData.adrecaLlocTreball"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>

          <div class="col-md-4">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Població centre de treball"
              v-model="formData.poblacioLlocTreball"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>

          <div class="col-md-4">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="CP centre de treball"
              v-model="formData.cpLlocTreball"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>
        </div>

        <p class="text-apartat text-center col-md-12 q-pt-md text-wrap-center">Tutor d'empresa</p>

        <div class="row flex justify-start q-mt-sm q-gutter-y-md">
          <div class="col-md-4">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Nom tutor empresa"
              v-model="formData.nomTutorEmpresa"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>

          <div class="col-md-4">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="LLinatges tutor empresa"
              v-model="formData.cognomsTutorEmpresa"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>


          <div class="col-md-4">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="NIF/NIE tutor empresa"
              v-model="formData.nifTutorEmpresa"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>

          <div class="col-md-4">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Nacionalitat tutor empresa"
              v-model="formData.nacionalitatTutorEmpresa"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>

          <div class="col-md-4">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Telèfon tutor empresa"
              v-model="formData.telefonTutorEmpresa"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>

          <div class="col-md-4">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Correu electrònic tutor empresa"
              v-model="formData.emailTutorEmpresa"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>

          <div class="col-md-4">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Municipi DNI tutor empresa"
              v-model="formData.municipiTutorEmpresa"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>

          <div class="col-md-4">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Càrrec empresa"
              v-model="formData.carrecTutorEmpresa"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>
        </div>


        <!--div class="bg-primary border-bot-top q-mt-lg">
            <p class="text-apartat text-center col-md-12 q-pt-md text-wrap-center">Altres informacions</p>
        </div>

        <div class="row flex justify-center q-mt-sm q-gutter-y-md">
          <div class="col-md-3">
            <q-select
              outlined
              class="q-pa-sm"
              v-model="formData.diaSeguimentCentreEducatiu"
              :options= "['Dilluns','Dimarts','Dimecres','Dijous','Divendres']"
              label="Dia seguiment centre educatiu"
            />
          </div>
          <div class="col-md-3">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Hora seguiment centre educatiu"
              v-model="formData.horaSeguimentCentreEducatiu"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>
          <div class="col-md-3">
            <q-select
              outlined
              class="q-pa-sm"
              v-model="formData.diaSeguimentResponsableFct"
              :options= "['Dilluns','Dimarts','Dimecres','Dijous','Divendres']"
              label="Dia seguiment amb responsable FCT"
            />
          </div>
          <div class="col-md-3">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Hora seguiment amb responsable FCT"
              v-model="formData.horaSeguimentResponsableFct"
              :rules="[(val:any) => !!val || 'El camp és obligatori']"
            />
          </div>
        </div-->


        <!--div class="bg-primary border-bot-top q-mt-md">
            <p class="text-apartat text-center col-md-12 q-pt-md text-wrap-center">Flexibilització en el mòdul FCT</p>
        </div>
        <div class="row flex justify-center q-my-sm q-gutter-y-md">
            <div class="col-md-4  q-pl-sm">
                <p class="q-pt-sm q-pr-sm q-pl-sm q-mb-none ">Hi ha algun tipus de flexibilització en el mòdul de FCT?</p>
                <div class="q-gutter-sm ">
                    <q-radio v-model="formData.flexibilitzacioModulFct" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="true" label="Si" />
                    <q-radio v-model="formData.flexibilitzacioModulFct" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="false" label="No" />
                </div>
            </div>
          <div class="col-md-4"></div>
          <div class="col-md-4"></div>
        </div-->

        <div class="bg-primary border-bot-top q-mt-md">
          <p class="text-apartat text-center col-md-12 q-pt-md text-wrap-center">Mesures educatives</p>
        </div>
        <div class=" q-pl-sm">
          <p class="q-pt-sm q-pr-sm q-pl-sm q-mb-none ">Requereix mesures, suports o adaptacions per a persones amb
            necessitats específiques de suport.</p>
          <div class="q-gutter-sm ">
            <q-radio size="sm" v-model="formData.isMesuresEducatives" checked-icon="task_alt"
                     unchecked-icon="panorama_fish_eye" :val="true" label="Si"/>
            <q-radio size="sm" v-model="formData.isMesuresEducatives" checked-icon="task_alt"
                     unchecked-icon="panorama_fish_eye" :val="false" label="No"/>
          </div>
          <div v-if="formData.isMesuresEducatives">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Especifica les mesures educatives"
              v-model="formData.mesuresEducativesDescripcio"
              :rules="[(val:any) => (formData.isMesuresEducatives && !!val) || 'El camp és obligatori']"
            />
          </div>
        </div>

        <div class="bg-primary border-bot-top q-mt-md">
          <p class="text-apartat text-center col-md-12 q-pt-md text-wrap-center">Requereix autorització
            extraordinària</p>
        </div>
        <div class=" q-pl-sm">
          <p class="q-pt-sm q-pr-sm q-pl-sm q-mb-none ">Es considera</p>
          <ul>
            <li>Periode ordinari: El que correspon al calendari escolar</li>
            <li>Horari ordinari: màxim de 8 hores diàries</li>
            <li>Horari ordinari: entre les 7:00-22:00h</li>
          </ul>
          <p>Si l'alumne és menor d'edat en cap cas pot tenir un horari diferent de l'horari establert com a
            ordinari</p>
          <div class="q-gutter-sm ">
            <p class="q-pt-sm q-pr-sm q-pl-sm q-mb-none ">Requereix autorització extraordinària</p>
            <q-radio size="sm" v-model="formData.isAutoritzacioExtraordinaria" checked-icon="task_alt"
                     unchecked-icon="panorama_fish_eye" :val="true" label="Si"/>
            <q-radio size="sm" v-model="formData.isAutoritzacioExtraordinaria" checked-icon="task_alt"
                     unchecked-icon="panorama_fish_eye" :val="false" label="No"/>
          </div>
          <div v-if="formData.isAutoritzacioExtraordinaria">
            <q-input
              class="q-pa-sm"
              outlined
              type="text"
              label="Especifica per quin motiu"
              v-model="formData.motiu"
              :rules="[(val:any) => (formData.isAutoritzacioExtraordinaria && !!val) || 'El camp és obligatori']"
            />
          </div>
        </div>

        <div class="bg-primary border-bot-top q-mt-md">
          <p class="text-apartat text-center col-md-12 q-pt-md text-wrap-center"></p>
        </div>
        <div class="flex justify-center q-gutter-sm q-ma-lg">
          <q-btn label="Desar Formulari" type="submit" color="primary" size="lg"/>
          <!--q-btn label="Desar" type="submit" @click="confirmSave" color="primary"/-->
        </div>
      </q-form>
    </div>

    <q-dialog v-model="addWorkspace" persistent>
      <q-card style="max-width: 1000px;">
        <q-card-section>
          <q-form @submit="saveWorkspace" class="q-gutter-md ">
            <p class="text-h5 q-mt-lg">Crear Lloc de treball</p>
            <div class="row flex justify-start items-start q-my-sm">
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Nom"
                  v-model="workspace.nom"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Adreça"
                  v-model="workspace.adreca"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Codi Postal"
                  v-model="workspace.codiPostal"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Telèfon"
                  v-model="workspace.telefon"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Població"
                  v-model="workspace.poblacio"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Municipi"
                  v-model="workspace.municipi"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Activitat"
                  v-model="workspace.activitat"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Nom Contacte"
                  v-model="workspace.nomContacte"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Cognom 1 Contacte"
                  v-model="workspace.cognom1Contacte"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Cognom 2 Contacte"
                  v-model="workspace.cognom2Contacte"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Telèfon Contacte"
                  v-model="workspace.telefonContacte"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Correu Electrònic Contacte"
                  v-model="workspace.emailContacte"
                  class="q-pa-sm "
                />
              </div>
            </div>
            <div class="flex justify-end q-gutter-sm">
              <q-btn label="Guardar" type="submit" color="primary" v-close-popup/>
              <q-btn label="Tancar" color="primary" v-close-popup/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>


    <!-- TUTORS EMPRESA -->
    <q-dialog v-model="addTutorEmpresa" persistent>
      <q-card style="max-width: 1000px;">
        <q-card-section>
          <q-form @submit="saveTutorEmpresa" class="q-gutter-md ">
            <p class="text-h5 q-mt-lg">Crear Tutor d'Empresa</p>
            <div class="row flex justify-start items-start q-my-sm">
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Nom"
                  v-model="tutorEmpresa.nom"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Cognom 1"
                  v-model="tutorEmpresa.cognom1"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Cognom 2"
                  v-model="tutorEmpresa.cognom2"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="DNI/NIE"
                  v-model="tutorEmpresa.dni"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Nacionalitat"
                  v-model="tutorEmpresa.nacionalitat"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Càrrec"
                  v-model="tutorEmpresa.carrec"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Telèfon"
                  v-model="tutorEmpresa.telefon"
                  class="q-pa-sm "
                />
              </div>
              <div class="col-md-4">
                <q-input
                  filled
                  type="text"
                  label="Correu electrònic"
                  v-model="tutorEmpresa.email"
                  class="q-pa-sm "
                />
              </div>
            </div>
            <div class="flex justify-end q-gutter-sm">
              <q-btn label="Guardar" type="submit" color="primary" v-close-popup/>
              <q-btn label="Tancar" color="primary" v-close-popup/>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>
<script setup lang="ts">

import {useQuasar} from "quasar";
import {onMounted, ref, Ref, watch} from "vue";
import {Alumne} from "src/model/Alumne";
import {Empresa} from "src/model/Empresa";
import {UsuariService} from "src/service/UsuariService";
import {EmpresaService} from "src/service/EmpresaService";
import {DadesFormulari} from "src/model/DadesFormulari";
import {LlocTreball} from "src/model/LlocTreball";
import {Usuari} from "src/model/Usuari";
import {DocumentService} from "src/service/DocumentService";
import IStudentListItem from "src/Interfaces/IStudentListItem";
import ICompanyListItem from "src/Interfaces/ICompanyListItem";
import {GrupService} from "src/service/GrupService";
import {TutorEmpresa} from "src/model/TutorEmpresa";

const $q = useQuasar();

const allStudents: Ref<Alumne[]> = ref([] as Alumne[]);        // Tots els alumnes
let studentSelectList: IStudentListItem[] = [];                // Llista d'opcions pel select amb filtre
const selectedStudent: Ref<Alumne | null> = ref<Alumne | null>(null);  // Alumne seleccionat pel select amb filtre
const studentSelect: Ref<Alumne> = ref({} as Alumne);          // Antic alumne seleccionat en el formulari
const filteredStudentOptions = ref<IStudentListItem[]>([])


const allCompanies: Ref<Empresa[]> = ref([] as Empresa[]);
let companySelectList: ICompanyListItem[] = []
const selectedCompany: Ref<Empresa | null> = ref<Empresa | null>(null)
const filteredCompanyOptions = ref<ICompanyListItem[]>([])

const companySelected: Ref<boolean> = ref(false);

const addWorkspace = ref(false);
const workspace: Ref<LlocTreball> = ref({} as LlocTreball)

const addTutorEmpresa = ref(false);
const tutorEmpresa: Ref<TutorEmpresa> = ref({} as TutorEmpresa)


const allCompanyWorkspace: Ref<LlocTreball[]> = ref([] as LlocTreball[]);
const allCompanyTutorEmpresa: Ref<TutorEmpresa[]> = ref([] as TutorEmpresa[]);
const tutorFCT: Ref<Usuari> = ref({} as Usuari);

const formulariAlumnes = ref(null)

const allNomGrups = ref([] as string[]);

const ciclesFormatius = [
  'FP Bàsica Manteniment de vehicles',
  'FP Bàsica Serveis Comercials',
  'CFGM Activitats comercials',
  'CFGM Carroseria',
  'CFGM Electromecànica de vehicles',
  'CFGM Gestió Administrativa',
  'CFGM Instal·lacions elèctriques i automàtiques',
  'CFGM Sistemes microinformàtics i xarxes',
  'CFGS Administració i finances',
  'CFGS Administració de sistemes informàtics',
  'CFGS Assistència a la Direcció',
  'CFGS Automoció',
  "CFGS Desenvolupament d'aplicacions web",
  'CFGS Gestió de Vendes i Espais Comercials',
  'CFGS Màrketing i publicitat',
  'CFGS Sistemes electrotècnics i automàtics'
];

const formData: Ref<DadesFormulari> = ref({
  anyCurs: '2025/26',
  nomAlumne: '',
  llinatgesAlumne: '',
  poblacioAlumne: '',
  dniAlumne: '',
  telefonAlumne: '',
  emailAlumne: '',
  numeroExpedient: '',
  menorEdat: false,
  edat: '',
  estudis: localStorage.getItem('estudis') || 'FP Bàsica',
  cicleFormatiu: localStorage.getItem('cicleformatiu') || ciclesFormatius[0],
  grup: '',
  duradaCicle: localStorage.getItem('duradacicle') || '2 anys',
  cursEstada: '1r',
  ocasio: '1a',
  acumulaEstadesPrimer: false,
  horesPrimerASegon: 0,
  mobilitat: false,
  zonaMobilitat: 'Illes Balears',
  caracteristiquesMobilitat: '',
  totalHoresProposadesFct: '',
  horesDiaries: '',
  km: '',
  periode: localStorage.getItem('periode') || 'Ordinari',
  dataInici: '',
  dataFi: '',
  dataAcabament: '',
  tipusJornada: 'Continuada',
  horari: '',
  nomTutor: '',
  llinatgesTutor: '',
  telefonTutor: '',
  empresaNova: false,
  empresaAdministracioPublica: false,
  numeroConveni: '',
  nomEmpresa: '',
  cif: '',
  adrecaEmpresa: '',
  cpempresa: '',
  poblacioEmpresa: '',
  telefonEmpresa: '',
  nomLlocTreball: '',
  adrecaLlocTreball: '',
  cpLlocTreball: '',
  poblacioLlocTreball: '',
  telefonLlocTreball: '',
  activitatLlocTreball: '',
  nomCompletRepresentantLegal: '',
  nomRepresentantLegal: '',
  cognomsRepresentantLegal: '',
  nifRepresentantLegal: '',
  nomCompletTutorEmpresa: '',
  nomTutorEmpresa: '',
  cognomsTutorEmpresa: '',
  nifTutorEmpresa: '',
  nacionalitatTutorEmpresa: '',
  municipiTutorEmpresa: '',
  carrecTutorEmpresa: '',
  telefonTutorEmpresa: '',
  emailEmpresa: '',
  emailTutorEmpresa: '',
  diaSeguimentCentreEducatiu: '',
  horaSeguimentCentreEducatiu: '',
  diaSeguimentResponsableFct: '',
  horaSeguimentResponsableFct: '',
  flexibilitzacioModulFct: false,
} as DadesFormulari);


async function selectStudent(student: Alumne) {
  console.log(student)
  studentSelect.value = student;
  formData.value.nomAlumne = student.nom;
  formData.value.llinatgesAlumne = student.cognom1 + " " + student.cognom2;
  formData.value.poblacioAlumne = student.municipi;
  formData.value.dniAlumne = student.dni;
  formData.value.telefonAlumne = student.telefon;


  if (student && typeof student.numeroExpedient !== 'undefined') {
    formData.value.numeroExpedient = student.numeroExpedient;
    const alumneGestib = await UsuariService.getByNumeroExpedient(student.numeroExpedient);
    formData.value.emailAlumne = alumneGestib.email;
  }
  formData.value.grup = allNomGrups.value.find(g => g === ((student.estudis || '') + (student.grup || ''))) || allNomGrups.value[0];

  formData.value.cicleFormatiu = ciclesFormatius[0];
  //Fem el mapeig de les dades de l'usuari
  /*
  0- 'FP Bàsica Manteniment de vehicles', - TMV11
  1- 'FP Bàsica Serveis Comercials', - COM11
  2- 'CFGM Activitats comercials', - COM21
  3- 'CFGM Carroseria', - TMV21
  4- 'CFGM Electromecànica de vehicles', - TMV22
  5- 'CFGM Gestió Administrativa', - ADG21
  6- 'CFGM Instal·lacions elèctriques i automàtiques', - ELE21
  7- 'CFGM Sistemes microinformàtics i xarxes', - IFC21
  8- 'CFGS Administració i finances', - ADG32
  9- 'CFGS Administració de sistemes informàtics', - IFC31
  10- 'CFGS Assistència a la Direcció', - ADG31
  11- 'CFGS Automoció', - TMV31
  12- "CFGS Desenvolupament d'aplicacions web", - IFC33
  13- 'CFGS Gestió de Vendes i Espais Comercials', - COM33
  14- 'CFGS Màrketing i publicitat' - COM31
  15- 'CFGS Sistemes electrotècnics i automàtics' - ELE31
   */
  /*
    Mapeig de Cicles Formatius
    "FP Bàsica", "CF Grau Mitjà", "CF Grau Superior"
   */
  if (student.estudis === 'TMV11') {
    formData.value.cicleFormatiu = ciclesFormatius[0];
    formData.value.estudis = 'FP Bàsica';
  } else if (student.estudis === 'COM11') {
    formData.value.cicleFormatiu = ciclesFormatius[1];
    formData.value.estudis = 'FP Bàsica';
  } else if (student.estudis === 'COM21') {
    formData.value.cicleFormatiu = ciclesFormatius[2];
    formData.value.estudis = 'CF Grau Mitjà';
  } else if (student.estudis === 'TMV21') {
    formData.value.cicleFormatiu = ciclesFormatius[3];
    formData.value.estudis = 'CF Grau Mitjà';
  } else if (student.estudis === 'TMV22') {
    formData.value.cicleFormatiu = ciclesFormatius[4];
    formData.value.estudis = 'CF Grau Mitjà';
  } else if (student.estudis === 'ADG21') {
    formData.value.cicleFormatiu = ciclesFormatius[5];
    formData.value.estudis = 'CF Grau Mitjà';
  } else if (student.estudis === 'ELE21') {
    formData.value.cicleFormatiu = ciclesFormatius[6];
    formData.value.estudis = 'CF Grau Mitjà';
  } else if (student.estudis === 'IFC21') {
    formData.value.cicleFormatiu = ciclesFormatius[7];
    formData.value.estudis = 'CF Grau Mitjà';
  } else if (student.estudis === 'ADG32') {
    formData.value.cicleFormatiu = ciclesFormatius[8];
    formData.value.estudis = 'CF Grau Superior';
  } else if (student.estudis === 'IFC31') {
    formData.value.cicleFormatiu = ciclesFormatius[9];
    formData.value.estudis = 'CF Grau Superior';
  } else if (student.estudis === 'ADG31') {
    formData.value.cicleFormatiu = ciclesFormatius[10];
    formData.value.estudis = 'CF Grau Superior';
  } else if (student.estudis === 'TMV31') {
    formData.value.cicleFormatiu = ciclesFormatius[11];
    formData.value.estudis = 'CF Grau Superior';
  } else if (student.estudis === 'IFC33') {
    formData.value.cicleFormatiu = ciclesFormatius[12];
    formData.value.estudis = 'CF Grau Superior';
  } else if (student.estudis === 'COM33') {
    formData.value.cicleFormatiu = ciclesFormatius[13];
    formData.value.estudis = 'CF Grau Superior';
  } else if (student.estudis === 'COM31') {
    formData.value.cicleFormatiu = ciclesFormatius[14];
    formData.value.estudis = 'CF Grau Superior';
  } else if (student.estudis === 'ELE31') {
    formData.value.cicleFormatiu = ciclesFormatius[15];
    formData.value.estudis = 'CF Grau Superior';
  }
}

const filterStudentsFn = (val, update, abort) => {
  update(() => {
    const needle = (val || '').toLowerCase()
    filteredStudentOptions.value = studentSelectList.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
}

const filterCompaniesFn = (val, update, abort) => {
  update(() => {
    const needle = (val || '').toLowerCase()
    filteredCompanyOptions.value = companySelectList.filter(v => v.label.toLowerCase().indexOf(needle) > -1)
  })
}

watch(selectedStudent, (newValue, oldValue) => {
  if (selectedStudent.value !== null) {
    selectStudent(selectedStudent.value);
  }
});

watch(selectedCompany, (newValue, oldValue) => {
  if (newValue !== null) {
    selectCompany(newValue);
    console.log("Empresa seleccionada", newValue);
  }
});

function selectCompany(company: Empresa) {

  formData.value.empresaNova = false;
  formData.value.numeroConveni = company.numeroConveni;
  formData.value.nomEmpresa = company.nom;
  formData.value.emailEmpresa = company.emailEmpresa;
  formData.value.cif = company.cif;
  formData.value.adrecaEmpresa = company.adreca;
  formData.value.cpempresa = company.codiPostal;
  formData.value.telefonEmpresa = company.telefon;
  formData.value.poblacioEmpresa = company.poblacio;
  formData.value.nomCompletRepresentantLegal = `${company.nomRepresentantLegal ?? ''} ${company.cognom1RepresentantLegal ?? ''} ${company.cognom2RepresentantLegal ?? ''}`.trim();
  formData.value.nomRepresentantLegal = company.nomRepresentantLegal;
  formData.value.cognomsRepresentantLegal = `${company.cognom1RepresentantLegal ?? ''} ${company.cognom2RepresentantLegal ?? ''}`.trim();
  formData.value.nifRepresentantLegal = company.dniRepresentantLegal;

  if (company.llocsTreball !== undefined) {
    allCompanyWorkspace.value = company.llocsTreball;
  }

  if (company.tutorsEmpresa !== undefined) {
    allCompanyTutorEmpresa.value = company.tutorsEmpresa;
  }

  companySelected.value = true;
}

function selectWorkspace(workspace: LlocTreball) {

  formData.value.nomLlocTreball = workspace.nom;
  formData.value.adrecaLlocTreball = workspace.adreca;
  formData.value.cpLlocTreball = workspace.codiPostal;
  formData.value.poblacioLlocTreball = workspace.poblacio;
  formData.value.telefonLlocTreball = workspace.telefon;
  formData.value.activitatLlocTreball = workspace.activitat;
  formData.value.municipiTutorEmpresa = workspace.municipi;
}

function selectTutorEmpresa(tutorEmpresa: TutorEmpresa) {
  formData.value.nomCompletTutorEmpresa = `${tutorEmpresa.nom ?? ''} ${tutorEmpresa.cognom1 ?? ''} ${tutorEmpresa.cognom2 ?? ''}`.trim();
  formData.value.nomTutorEmpresa = tutorEmpresa.nom;
  formData.value.cognomsTutorEmpresa = `${tutorEmpresa.cognom1 ?? ''} ${tutorEmpresa.cognom2 ?? ''}`.trim();
  formData.value.nifTutorEmpresa = tutorEmpresa.dni;
  formData.value.nacionalitatTutorEmpresa = tutorEmpresa.nacionalitat;
  formData.value.carrecTutorEmpresa = tutorEmpresa.carrec;
  formData.value.telefonTutorEmpresa = tutorEmpresa.telefon;
  formData.value.emailTutorEmpresa = tutorEmpresa.email;
}

function ageCalculate(date: string) {

  if (!date || !studentSelect.value || !studentSelect.value.dataNaixement) {
    return;
  }

  if (studentSelect.value.dataNaixement !== undefined) {
    const fechaNaixement = studentSelect.value.dataNaixement.toString().split("-");
    const fechaInici = date.toString().split("-");
    let age = parseInt(fechaInici[0]) - parseInt(fechaNaixement[0]);

    if (parseInt(fechaNaixement[1]) > parseInt(fechaInici[1])) {
      age = age - 1;
    } else if (parseInt(fechaNaixement[1]) === parseInt(fechaInici[1])) {

      if (parseInt(fechaNaixement[2]) > parseInt(fechaInici[2])) {
        age = age - 1;
      }
    }
    formData.value.edat = age.toString();
    age >= 18 ? formData.value.menorEdat = false : formData.value.menorEdat = true;
  }
}

function errorForm() {
  $q.notify({
    color: 'negative',
    message: 'Hi ha camps incorrectes',
    icon: 'report_problem'
  });
}

function confirmSave() {
  console.log('confirm save form');

  if (!formData.value.cursEstada) {
    $q.notify({
      color: 'negative',
      message: "El camp 'Curs d'estada' és obligatori",
      icon: 'report_problem'
    });
    return;
  }

  if (!formData.value.ocasio) {
    $q.notify({
      color: 'negative',
      message: "El camp 'Ocasió' és obligatori",
      icon: 'report_problem'
    });
    return;
  }

  if (formData.value.mobilitat && !formData.value.zonaMobilitat) {
    $q.notify({
      color: 'negative',
      message: "El camp 'Zona' és obligatori si hi ha mobilitat",
      icon: 'report_problem'
    });
    return;
  }

  // Valiem mesures educatives
  console.log("Mesures educatives", formData.value.isMesuresEducatives);
  if (formData.value.isMesuresEducatives === undefined || formData.value.isMesuresEducatives === null) {
    $q.notify({
      color: 'negative',
      message: 'El camp de mesures educatives ha de tenir valor',
      icon: 'report_problem'
    });
    return;
  }

  if (formData.value.isAutoritzacioExtraordinaria === undefined || formData.value.isAutoritzacioExtraordinaria === null) {
    $q.notify({
      color: 'negative',
      message: "El camp de d'autorització extraordinària ha de tenir valor",
      icon: 'report_problem'
    });
    return;
  }

  if (!formulariAlumnes || !formulariAlumnes.value) {
    $q.notify({
      color: 'negative',
      message: 'Hi ha camps incorrectes',
      icon: 'report_problem'
    });
    return;
  }

  formulariAlumnes.value.validate().then(success => {
    if (success) {
      // yay, models are correct
      $q.dialog({
        title: 'Alerta',
        message: 'Està segur que vol desar el formulari? No es podrà modificar després',
        cancel: true,
        persistent: true
      }).onOk(() => {
        saveForm();
      });
    } else {
      console.log('error')
      $q.notify({
        color: 'negative',
        message: 'Hi ha camps incorrectes',
        icon: 'report_problem'
      });
    }
  }).catch(() => {
    // error
    console.log('error')
    $q.notify({
      color: 'negative',
      message: 'Hi ha camps incorrectes',
      icon: 'report_problem'
    })
  })

}

async function saveForm() {

  if (formData.value.cicleFormatiu) {
    localStorage.setItem('cicleformatiu', formData.value.cicleFormatiu);
  }
  if (formData.value.estudis) {
    localStorage.setItem('estudis', formData.value.estudis);
  }
  if (formData.value.duradaCicle) {
    localStorage.setItem('duradacicle', formData.value.duradaCicle);
  }
  if (formData.value.periode) {
    localStorage.setItem('periode', formData.value.periode);
  }

  $q.loading.show({ message: 'Guardant Formulari...' });
  try {
    await DocumentService.saveFormFEMPO(formData.value, tutorFCT.value.email);
  } finally {
    $q.loading.hide();
  }

  setTimeout(function () {
    window.location.reload();
  }, 4000);
}

// async function saveWorkspace() {
//   workspace.value.empresa = selectedCompany.value;
//   await EmpresaService.saveWorkspace(workspace.value);
//   selectedCompany.value = await EmpresaService.getCompanyById(selectedCompany.value.idEmpresa);
//   selectWorkspace(workspace.value);
// }

async function saveWorkspace() {
  if (!selectedCompany.value) {
    return;
  }

  workspace.value.empresa = selectedCompany.value; // Use the Empresa object
  await EmpresaService.saveWorkspace(workspace.value);

  updateCompanySelector();

  selectWorkspace(workspace.value);
}

async function saveTutorEmpresa() {
  if (!selectedCompany.value) {
    return;
  }

  tutorEmpresa.value.empresa = selectedCompany.value;
  await EmpresaService.saveTutorEmpresa(tutorEmpresa.value);

  updateCompanySelector();

  selectTutorEmpresa(tutorEmpresa.value);
}

async function updateCompanySelector() {

  if (!selectedCompany.value) {
    return;
  }

  const updatedEmpresa = await EmpresaService.getCompanyById(selectedCompany.value.idEmpresa);

  const updatedOption = {
    label: updatedEmpresa.nom,
    value: updatedEmpresa
  };

  const idx = companySelectList.findIndex(opt => opt.value.idEmpresa === updatedEmpresa.idEmpresa);
  if (idx !== -1) {
    companySelectList[idx] = updatedOption;
  }

  filteredCompanyOptions.value = [...companySelectList];

  selectedCompany.value = updatedEmpresa;
}

onMounted(async () => {

  const dialog = $q.dialog({
    message: 'Carregant...',
    progress: true, // we enable default settings
    persistent: true, // we want the user to not be able to close it
    ok: false // we want the user to not be able to close it
  })

  allStudents.value = await UsuariService.allStudents();
  allCompanies.value = await EmpresaService.allCompanies();
  tutorFCT.value = await UsuariService.getProfile();

  formData.value.nomTutor = tutorFCT.value.nom;
  formData.value.llinatgesTutor = tutorFCT.value.cognom1 + " " + tutorFCT.value.cognom2;
  formData.value.emailTutor = tutorFCT.value.email;


  studentSelectList = allStudents.value.map(student => ({
    label: student.cognom1 + " " + student.cognom2 + ", " + student.nom,
    value: student
  }));

  companySelectList = allCompanies.value
    .map(company => ({
      label: company.nom,
      value: company
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  filteredStudentOptions.value = studentSelectList;
  filteredCompanyOptions.value = companySelectList;


  const allGrups = await GrupService.findAllGrups();
  for (const grup of allGrups) {
    const nomGrup = grup.curs.nom + grup.nom;
    allNomGrups.value.push(nomGrup);
  }
  allNomGrups.value.sort((a, b) => a.localeCompare(b));
  dialog.hide();
})
</script>
<style scoped>

.text-apartat {
  font-size: 18px;
}

.border {
  border: 1px solid black;
}

.border-bottom {
  border-bottom: 1px solid black;
}

.border-bot-top {
  border-bottom: 1px solid black;
  border-top: 1px solid black;
}


</style>
