import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/FEMPOTeacherManager.vue') },
      { path: 'fempo/generateDocumentation', component: () => import('pages/FEMPOGenerateDocumentation.vue') },
      { path: 'fempo/manageDocumentation', component: () => import('pages/FEMPODocumentationManager.vue') },
      { path: 'fct/formulari/list', component: () => import('pages/FCTFormulariList.vue') },
      { path: 'fct/formulari/form', component: () => import('pages/FCTFormulari.vue') },
      { path: 'fempo/formulari/list', component: () => import('pages/FEMPOFormulariList.vue') },
      { path: 'fempo/formulari/form', component: () => import('pages/FEMPOFormulari.vue') },
      { path: 'fempo/group', component: () => import('pages/FEMPOTeacherManager.vue') },
      { path: 'fempo/empresaConfiguration', component: () => import('pages/FEMPOEmpresaConfiguration.vue') },
      { path: 'fempo/empresaForm/:id', name:'empresaForm', component: () => import('pages/FEMPOEmpresaForm.vue'), props: true },
      { path: 'fempo/studentConfiguration', component: () => import('pages/FEMPOStudentConfiguration.vue') },
      { path: 'fempo/programaFormatiu', component: () => import('pages/FEMPOProgramaFormatiu.vue') },
      { path: 'login', component: () => import('components/common/Login.vue'), props: { urlRedirect: "/fempo/group" } },
      { path: 'logout', component: () => import('components/common/Logout.vue') },
    ],
  },
  {
    path: '/mobile',
    component: () => import('layouts/MobileLayout.vue'),
    children:[
      { path: 'fempo/picture', component: () => import('pages/FEMPOPicture.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
