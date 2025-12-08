import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Authentication/Login.vue";

const router = createRouter({
    history: createWebHistory("/"),
    routes: [
        // New landing pages – PUBLIC
        {
            path: "/",
            name: "HomeLanding",
            component: () => import("../components/Landing/Home.vue"),
            meta: { requiresAuth: false, page: "home" }
        },
        {
            path: "/jsb",
            name: "JSBProject",
            component: () => import("../components/Landing/JSBProject.vue"),
            meta: { requiresAuth: false, page: "jsb" }
        },
        {
            path: "/climate/project",
            name: "project",
            component: () => import("../components/Projects/CP1/ClimatePromiseOne.vue"),
            meta: { requiresAuth: false, page: "project" }
        },
        {
            path: "/project3",
            name: "Project3",
            component: () => import("../components/Landing/ProjectPlaceholder.vue"),
            meta: { requiresAuth: false, page: "project" }
        },
        {
            path: "/project4",
            name: "Project4",
            component: () => import("../components/Landing/ProjectPlaceholder.vue"),
            meta: { requiresAuth: false, page: "project" }
        },
        {
            path: "/project5",
            name: "Project5",
            component: () => import("../components/Landing/ProjectPlaceholder.vue"),
            meta: { requiresAuth: false, page: "project" }
        },

        // keep your existing internal / GIS routes if you still use them
        {
            path: "/tourismsector/asset",
            component: () =>
                import("../components/Template/TourismSector/TourismSectorHome.vue"),
            meta: { requiresAuth: true }
        },
        {
            path: "/data_analysis/tourismsector",
            component: () =>
                import("../components/Template/DataAnalysis/TourismSectorDataAnalysis.vue"),
            meta: { requiresAuth: true }
        },

        // example dynamic route – keep if needed
        {
            path: "/sampel-withid/:id",
            component: () => import("../components/Template/Home.vue"),
            meta: { requiresAuth: true }
        },

        { path: "/login", component: Login, meta: { requiresAuth: false } }
    ]
});

// Auth guard – now respects public landing pages
router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(r => r.meta.requiresAuth);
    const isAuthenticated = localStorage.getItem("user");

    if (requiresAuth && !isAuthenticated) {
        next("/login");
    } else if (!requiresAuth && isAuthenticated && to.path === "/login") {
        next("/");
    } else {
        next();
    }
});

export default router;
