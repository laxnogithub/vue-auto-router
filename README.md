<!--
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lax
 * @Date: 2020-04-07 20:46:09
 * @LastEditors: lax
 * @LastEditTime: 2020-09-22 16:55:26
 -->

# info

# how to use

```
import Vue from "vue";
import VueRouter from "vue-router";
import routerHandler from "vue-auto-router";
Vue.use(VueRouter);

const views = require.context("./../views/", true, /\.vue$/);

const routes = new routerHandler({ views }).load();

const router = new VueRouter({
	mode: "hash",
	base: process.env.BASE_URL,
	routes,
});

export default router;
```

# rule

if your views like:

```
views/
--| one.vue
--| two.vue
--| music/
-----| index.vue
-----| one.vue
-----| two.vue
```

this router like:

```
[
    {
        name:'one',
        path:'/one',
        component: () => import('@/views/one.vue')
    },
    {
        name:'two',
        path:'/two',
        component: () => import('@/views/two.vue')
    },
    {
        name:'music',
        path:'/music',
        component: () => import('@/views/music/index.vue')
        children:[
            {
                name:'one',
                path:'one',
                component: () => import('@/views/music/one.vue')
            },
            {
                name:'two',
                path:'two',
                component: () => import('@/views/music/two.vue')
            }
        ]
    }
]
```
