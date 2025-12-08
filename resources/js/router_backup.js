import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Dashboard/Home.vue';
import Login from "./components/Authentication/Login.vue";

const routes = [
    { path: '/', component: Home , meta: { requiresAuth: true }},
    { path: '/login', component: Login , meta: { requiresAuth: false }},
];

const router_backup = createRouter({
    history: createWebHistory(),
    routes
});

router_backup.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const isAuthenticated = localStorage.getItem("user");

    if (requiresAuth && !isAuthenticated) {
        next('/login');
    } else if (!requiresAuth && isAuthenticated && to.path === '/login') {
        next('/');
    } else {
        next();
    }
});
export default router_backup;
