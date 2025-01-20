import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/FCTTeacherManager.vue') },
      { path: 'fct/generateDocumentation', component: () => import('pages/FCTGenerateDocumentation.vue') },
      { path: 'fct/manageDocumentation', component: () => import('pages/FCTDocumentationManager.vue') },
      { path: 'fct/formulari/list', component: () => import('pages/FCTFormulariList.vue') },
      { path: 'fct/formulari/form', component: () => import('pages/FCTFormulari.vue') },
      { path: 'fct/group', component: () => import('pages/FCTTeacherManager.vue') },
      { path: 'fct/empresaConfiguration', component: () => import('pages/FCTEmpresaConfiguration.vue') },
      { path: '/empresaForm/:id', name:'empresaForm', component: () => import('pages/FCTEmpresaForm.vue'), props: true },
      { path: 'fct/studentConfiguration', component: () => import('pages/FCTStudentConfiguration.vue') },
      { path: 'fct/programaFormatiu', component: () => import('pages/FCTProgramaFormatiu.vue') },
      { path: 'login', component: () => import('components/common/Login.vue'), props: { urlRedirect: "/fct/group" } },
      { path: 'logout', component: () => import('components/common/Logout.vue') },
    ],
  },
  {
    path: '/mobile',
    component: () => import('layouts/MobileLayout.vue'),
    children:[
      { path: 'fct/picture', component: () => import('pages/FCTPicture.vue') }
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
