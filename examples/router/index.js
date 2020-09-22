/*
 * @Description: router rules
 * @Version: 2.0.0
 * @Autor: lax
 * @Date: 2020-04-07 14:34:37
 * @LastEditors: lax
 * @LastEditTime: 2020-09-22 16:42:09
 */
import Vue from "vue";
import VueRouter from "vue-router";
import routerHandler from "./../../packages/index.js";
Vue.use(VueRouter);

/**
 * load components from view folder
 *
 */
const views = require.context("./../views/", true, /\.vue$/);

const routes = new routerHandler({ views }).load();

const router = new VueRouter({
	mode: "hash",
	base: process.env.BASE_URL,
	routes,
});

export default router;
