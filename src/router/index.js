import Vue from 'vue'
import Router from 'vue-router'
import store from '../vuex';

Vue.use(Router)

const Login = resolve => {
  require.ensure(['../components/Login.vue'], () => {
    resolve(require('../components/Login.vue'));
  });
};

const Home = resolve => {
  require.ensure(['../components/Home.vue'], () => {
    resolve(require('../components/Home.vue'));
  });
};

const Main = resolve => {
  require.ensure(['../components/Main.vue'], () => {
    resolve(require('../components/Main.vue'));
  });
};

const NotFound = resolve => {
  require.ensure(['../components/404.vue'], () => {
    resolve(require('../components/404.vue'));
  });
};

const AddWork = resolve => {
  require.ensure(['../components/AddWork.vue'], () => {
    resolve(require('../components/AddWork.vue'));
  });
};

const PersonSet = resolve => {
  require.ensure(['../components/PersonSet.vue'], () => {
    resolve(require('../components/PersonSet.vue'));
  });
};

const Help = resolve => {
  require.ensure(['../components/Help.vue'], () => {
    resolve(require('../components/Help.vue'));
  });
};

const SystemSet = resolve => {
  require.ensure(['../components/SystemSet.vue'], () => {
    resolve(require('../components/SystemSet.vue'));
  });
};

const FastCheck = resolve => {
  require.ensure(['../components/FastCheck.vue'], () => {
    resolve(require('../components/FastCheck.vue'));
  });
};

 const router = new Router({
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: Login,
      meta: {
        title: '登录 - 代码抄袭检测系统'
      }
    },
    {
      path: '/404',
      component: NotFound,
      name: '',
      hidden: true
    },
    {
      path: '/',
      name: 'index',
      component: Home,
      redirect: '/main',
      children: [
        { 
          path: '/main', 
          component: Main, 
          name: '主页', 
          meta: {
            title: '仪表盘 - 代码抄袭检测系统',
            requireAuth: true
          }
        },
        {
          path: '/addwork',
          component: AddWork,
          name: '新建作业集',
          meta: {
            title: '新建作业集 - 代码抄袭检测系统',
            requireAuth: true
          }
        },
        {
          path: '/personset',
          component: PersonSet,
          name: '个人设置',
          meta: {
            title: '个人设置 - 代码抄袭检测系统',
            requireAuth: true
          }
        },
        {
          path: '/help',
          component: Help,
          name: '帮助',
          meta: {
            title: '帮助 - 代码抄袭检测系统',
            requireAuth: true
          }
        },
        {
          path: '/systemset',
          component: SystemSet,
          name: '系统设置',
          meta: {
            title: '系统设置 - 代码抄袭检测系统',
            requireAuth: true
          }
        },
        {
          path: '/fastcheck',
          component: FastCheck,
          name: '快速检测',
          meta: {
            title: '快速检测 - 代码抄袭检测系统',
            requireAuth: true
          }
        }
      ],
      meta: {
        title: '首页 - 代码抄袭检测系统',
        requireAuth: true
      }
    },
    {
      path: '*',
      hidden: true,
      redirect: { path: '/404' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  let token = store.state.token;
  if(to.meta.requireAuth){
    if(token){
      if (to.meta.title) {
        document.title = to.meta.title;
      }
      next();
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    }
  }else{
    if (to.meta.title) {
      document.title = to.meta.title;
    }
    next();
  }
})

export default router;