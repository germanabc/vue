import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import a1 from '@/components/a1'
import elSelect from '@/components/elSelect'
import table1 from '@/components/example/table1'
import form1 from '@/components/example/form1'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      // name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/example',
      name: 'example',
      component: a1,
      redirect: '/example/table1',
      children:[
        {
          path: 'table1',
          name: 'table1',
          component: () => import('@/components/example/table1'),
          meta: { title: '表格', icon: 'table' }
        },
        {
          path: 'form1',
          name: 'form1',
          component: () => import('@/components/example/form1'),
        }
      ]
    },
    {
      path: '/elSelect',
      name: 'elSelect',
      component: elSelect,
    }


  ]
})
