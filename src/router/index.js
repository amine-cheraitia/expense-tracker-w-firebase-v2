import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Dashboard from "../views/DashboardView.vue";
import Ressources from "../views/RessourcesView.vue";
import Analytics from "../views/AnalyticsView.vue";
import Signup from "../views/SignUpView.vue";
import Login from "../views/LoginView.vue";
import store from "../store/index.js";

const routes = [
	{
		path: "/",
		name: "/",
		component: HomeView,
		meta: { requiresAuth: true },
	},

	{
		path: "/about",
		name: "about",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () =>
			import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
		meta: { requiresAuth: true },
	},

	{
		path: "/mouvements",
		name: "mouvements",
		component: Dashboard,
		meta: { requiresAuth: true },
	},
	{
		path: "/ressources",
		name: "ressources",
		component: Ressources,
		meta: { requiresAuth: true },
	},
	{
		path: "/analytics",
		name: "Analytics",
		component: Analytics,
		meta: { requiresAuth: true },
	},
	{
		path: "/login",
		name: "Login",
		component: Login,
		meta: { requiresAuth: false },
		beforeEnter: (to, from, next) => {
			if (store.getters["auth/userId"]) {
				console.log(from);
				console.log(to.name);
				next({ name: from.name });
				/* next({ name: "/" }); */
			} else {
				next();
			}
		},
	},
	{
		path: "/signup",
		name: "Signup",
		component: Signup,
		/* meta: { requiresAuth: false }, */
		beforeEnter: (to, from, next) => {
			if (store.getters["auth/userId"]) {
				next({ name: "/" });
			} else {
				next();
			}
		},
	},
	{
		path: "/logout",
		name: "logout",
		/* meta: { requiresAuth: true }, */
		beforeEnter: (to, from, next) => {
			store.dispatch("auth/logout");
			console.log("deco");
			next({ name: "Login" });
		},
	},
	{
		path: "/:pathMatch(.*)*",
		name: "NotFound",
		component: HomeView,
		meta: { requiresAuth: true },
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

router.beforeEach((to, from, next) => {
	if (to.meta.requiresAuth && !store.getters["auth/userId"]) {
		next({ name: "Login" });
	} else {
		next();
	}
});

export default router;
