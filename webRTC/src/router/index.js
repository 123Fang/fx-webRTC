import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)


let routes = [
  {
    path: '/',
    name: 'home',
    component: () => import("@/views/home"),
  },
  {
    path: '/virtualbg',
    name: 'virtualbg',
    component: () => import("@/views/virtualbg"),
  }
]


const router = new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: routes

})


export default router
