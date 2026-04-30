<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const sidebarLinks = [
  { label: "Home", icon: "bi-house-fill", href: "/" },
  { label: "Food Security", icon: "bi-basket-fill", href: "/foodsecurity/project" },
  { label: "Climate Project 1", icon: "bi-cloud-sun-fill", href: "/climate/project/1" },
  { label: "Climate Project 2", icon: "bi-cloud-drizzle-fill", href: "/climate/project/2" },
  { label: "Climate Project 3", icon: "bi-cloud-haze2-fill", href: "/climate/project/3" },
  { label: "Climate Project 4", icon: "bi-lightning-charge-fill", href: "/climate/project/4" },
  { label: "Climate Project 5", icon: "bi-globe-central-south-asia", href: "/project5" },
  { label: "Gallery", icon: "bi-images", href: "/blog" },
  { label: "Contact Us", icon: "bi-envelope-fill", href: "/contactus" }
];

const topNavLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/climate/project/1" },
  { label: "Gallery", href: "/blog" },
  { label: "Contact Us", href: "/contactus" }
];

const mobileBreakpoint = 860;
const isSidebarLinkActive = (href: string) => route.path === href;
const isMobileView = ref(false);
const isMobileSidebarOpen = ref(false);

const activeTopNavLabel = computed(() => {
  if (route.path === "/") return "Home";
  if (route.path === "/blog") return "Gallery";
  if (route.path === "/contactus") return "Contact Us";
  return "Projects";
});

const syncViewportState = () => {
  if (typeof window === "undefined") return;

  isMobileView.value = window.innerWidth <= mobileBreakpoint;

  if (!isMobileView.value) {
    isMobileSidebarOpen.value = false;
  }
};

const toggleMobileSidebar = () => {
  if (!isMobileView.value) return;

  isMobileSidebarOpen.value = !isMobileSidebarOpen.value;
};

const closeMobileSidebar = () => {
  isMobileSidebarOpen.value = false;
};

watch(
  () => route.fullPath,
  () => closeMobileSidebar()
);

onMounted(() => {
  syncViewportState();
  window.addEventListener("resize", syncViewportState);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", syncViewportState);
});
</script>

<template>
  <main class="jsb-dashboard-page">
    <div class="jsb-dashboard-shell">
      <button
        v-if="isMobileView && isMobileSidebarOpen"
        class="jsb-sidebar-backdrop"
        type="button"
        aria-label="Close sidebar"
        @click="closeMobileSidebar"
      ></button>

      <aside
        class="jsb-sidebar"
        :class="{ 'is-mobile-open': isMobileSidebarOpen }"
      >
        <div class="jsb-sidebar__brand">
          <div class="jsb-sidebar__logo-box">
            <img src="/images/undp-logo.png" alt="UNDP" class="jsb-sidebar__logo" />
          </div>
          <div class="jsb-sidebar__brand-copy">
            <span>United Nations</span>
            <span>Development Programme</span>
          </div>
        </div>

        <nav id="jsb-sidebar-navigation" class="jsb-sidebar__nav" aria-label="Sidebar">
          <router-link
            v-for="link in sidebarLinks"
            :key="link.label"
            :to="link.href"
            class="jsb-sidebar__link"
            :class="{ 'is-active': isSidebarLinkActive(link.href) }"
            @click="closeMobileSidebar"
          >
            <i class="bi" :class="link.icon"></i>
            <span>{{ link.label }}</span>
          </router-link>
        </nav>
      </aside>

      <section class="jsb-dashboard-main">
        <header class="jsb-topbar">
          <div class="jsb-topbar__brand">
            <button
              v-if="isMobileView"
              class="jsb-topbar__menu-button"
              type="button"
              :aria-expanded="isMobileSidebarOpen ? 'true' : 'false'"
              aria-controls="jsb-sidebar-navigation"
              :aria-label="isMobileSidebarOpen ? 'Close sidebar' : 'Open sidebar'"
              @click="toggleMobileSidebar"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <div v-if="!isMobileView" class="jsb-topbar__flag-wrap">
              <img src="/images/japan-logo.png" alt="Japan" class="jsb-topbar__flag" />
            </div>
            <div v-else class="jsb-topbar__mobile-logo-wrap">
              <img src="/images/japan-logo.png" alt="JSB" class="jsb-topbar__mobile-logo" />
            </div>
            <div class="jsb-topbar__brand-copy">
              <span v-if="!isMobileView">UNDP SRI LANKA</span>
              <strong>Japanese Supplementary Budget</strong>
            </div>
          </div>

          <nav v-if="!isMobileView" class="jsb-topbar__nav" aria-label="Primary">
            <router-link
              v-for="item in topNavLinks"
              :key="item.label"
              :to="item.href"
              class="jsb-topbar__nav-link"
              :class="{ 'is-active': item.label === activeTopNavLabel }"
            >
              {{ item.label }}
            </router-link>
          </nav>
        </header>

        <div class="public-shell__content">
          <slot />
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.jsb-dashboard-page {
  --jsb-sidebar-width: 240px;
  --jsb-mobile-header-height: 72px;
  min-height: 100vh;
  padding: 0;
  background:
    radial-gradient(circle at top left, rgba(45, 116, 225, 0.14), transparent 28%),
    linear-gradient(180deg, #eef4fb 0%, #f5f8fc 100%);
  color: #17233c;
  font-family: "Poppins", sans-serif;
}

.jsb-dashboard-shell {
  display: block;
  min-height: 100vh;
}

.jsb-sidebar-backdrop {
  position: fixed;
  inset: 0;
  z-index: 29;
  border: 0;
  background: rgba(11, 24, 48, 0.42);
}

.jsb-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: var(--jsb-sidebar-width);
  height: 100vh;
  padding: 20px 14px 18px;
  overflow-y: auto;
  background: linear-gradient(180deg, #005cbf 0%, #0b57b1 44%, #0d4a96 100%);
  color: #fff;
  box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.08);
}

.jsb-sidebar__brand {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 4px 6px 10px;
}

.jsb-sidebar__logo-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 92px;
  padding: 4px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 4px;
}

.jsb-sidebar__logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.jsb-sidebar__brand-copy {
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 12px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.95);
}

.jsb-sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.jsb-sidebar__link {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 46px;
  padding: 0 16px;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.92);
  text-decoration: none;
  transition: background-color 0.18s ease, transform 0.18s ease;
}

.jsb-sidebar__link i {
  font-size: 1rem;
}

.jsb-sidebar__link:hover,
.jsb-sidebar__link.is-active {
  background: linear-gradient(180deg, rgba(79, 156, 255, 0.95), rgba(45, 129, 240, 0.95));
  transform: translateX(2px);
}

.jsb-dashboard-main {
  min-width: 0;
  min-height: 100vh;
  margin-left: var(--jsb-sidebar-width);
  padding: 18px 22px 24px;
}

.jsb-topbar {
  position: sticky;
  top: 0;
  z-index: 18;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 18px 22px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(16, 24, 40, 0.06);
  backdrop-filter: blur(18px);
  box-shadow: 0 10px 40px rgba(16, 24, 40, 0.06);
}

.jsb-topbar__brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.jsb-topbar__flag-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 32px;
  border: 1px solid rgba(16, 24, 40, 0.12);
  border-radius: 6px;
}

.jsb-topbar__flag {
  width: 26px;
  height: 26px;
  object-fit: contain;
}

.jsb-topbar__brand-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.jsb-topbar__brand-copy span {
  font-size: 0.72rem;
  color: #6a7487;
  letter-spacing: 0.08em;
}

.jsb-topbar__brand-copy strong {
  font-size: 1.05rem;
  font-weight: 700;
  color: #0f1f3d;
}

.jsb-topbar__mobile-logo-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
}

.jsb-topbar__mobile-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.jsb-topbar__menu-button {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 1px solid rgba(16, 24, 40, 0.08);
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(16, 24, 40, 0.08);
}

.jsb-topbar__menu-button span {
  display: block;
  width: 18px;
  height: 2px;
  margin: 0 auto;
  border-radius: 999px;
  background: #0f1f3d;
}

.jsb-topbar__nav {
  display: flex;
  align-items: center;
  gap: 32px;
}

.jsb-topbar__nav-link {
  position: relative;
  padding: 8px 2px 14px;
  color: #51607b;
  text-decoration: none;
  font-size: 0.96rem;
  font-weight: 500;
}

.jsb-topbar__nav-link.is-active {
  color: #1c63d6;
}

.jsb-topbar__nav-link.is-active::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(90deg, #2a7bf3, #1a55c5);
}

.public-shell__content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 16px;
}

.public-shell__content > * {
  min-width: 0;
}

:deep(.cp-page),
:deep(.contact-page),
:deep(.jsb-blog-page),
:deep(.page-placeholder),
:deep(.public-page) {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

:deep(.cp-main) {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 6px;
}

:deep(.cp-page),
:deep(.contact-page),
:deep(.jsb-blog-page),
:deep(.page-placeholder) {
  min-height: auto;
  padding-bottom: 0;
  color: #17233c;
}

:deep(.jsb-stats-grid) {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
}

:deep(.jsb-stats-grid.jsb-stats-grid--projects) {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

:deep(.jsb-stat-card) {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px;
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(246, 249, 253, 0.98) 100%);
  border: 1px solid rgba(16, 24, 40, 0.06);
  box-shadow: 0 10px 32px rgba(16, 24, 40, 0.06);
}

:deep(.jsb-stat-card__icon),
:deep(.jsb-overview-stat__icon) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border-radius: 50%;
}

:deep(.jsb-stat-card__icon) {
  width: 58px;
  height: 58px;
  font-size: 1.7rem;
}

:deep(.jsb-stat-card__content) {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

:deep(.jsb-stat-card__content strong) {
  font-size: 2.05rem;
  line-height: 1;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: #12233f;
}

:deep(.jsb-stat-card__content span) {
  font-size: 0.98rem;
  color: #4e5d78;
}

:deep(.jsb-stat-card__content small) {
  font-size: 0.85rem;
  color: #0c8c5c;
}

:deep(.jsb-dashboard-grid) {
  display: grid;
  grid-template-columns: minmax(0, 1.18fr) minmax(360px, 0.92fr);
  gap: 16px;
}

:deep(.jsb-panel) {
  border-radius: 24px;
  padding: 18px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(246, 249, 253, 0.98) 100%);
  border: 1px solid rgba(16, 24, 40, 0.06);
  box-shadow: 0 10px 32px rgba(16, 24, 40, 0.06);
}

:deep(.jsb-panel--filters) {
  padding: 12px 16px;
}

:deep(.jsb-panel__header) {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

:deep(.jsb-panel__header h2) {
  margin: 0;
  font-size: 1.55rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: #12233f;
}

:deep(.jsb-panel__header p) {
  margin: 6px 0 0;
  max-width: 500px;
  font-size: 0.92rem;
  line-height: 1.6;
  color: #62708a;
}

:deep(.jsb-overview-visuals) {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
  gap: 14px;
}

:deep(.jsb-mini-panel) {
  border-radius: 18px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(16, 24, 40, 0.05);
}

:deep(.jsb-mini-panel__title) {
  margin-bottom: 10px;
  font-size: 1rem;
  font-weight: 700;
  color: #162746;
}

:deep(.jsb-chart-shell) {
  min-height: 270px;
  padding: 8px 4px 0;
  border: 1px solid rgba(16, 24, 40, 0.05);
  border-radius: 18px;
  background: linear-gradient(180deg, #ffffff 0%, #f7faff 100%);
}

:deep(.jsb-map-card) {
  position: relative;
  overflow: hidden;
  min-height: 586px;
  border-radius: 20px;
  background: linear-gradient(180deg, #d6ecff 0%, #cee7fd 100%);
  padding: 0;
}

:deep(.cp-map-section) {
  padding: 0;
  height: 100%;
}

:deep(.cp-map) {
  min-height: 586px;
  height: 586px;
  margin-top: 0;
}

:deep(.jsb-panel--filters .container) {
  width: 100%;
  max-width: none;
  padding: 0;
}

:deep(.jsb-panel--filters .filters) {
  gap: 12px;
  padding: 0;
  background: transparent;
  box-shadow: none;
}

:deep(.jsb-panel--filters .filter-card) {
  border-radius: 16px;
  background: linear-gradient(180deg, #fbfdff 0%, #f4f8fd 100%);
  border: 1px solid rgba(16, 24, 40, 0.06);
  box-shadow: none;
}

:deep(.is-blue) {
  background: #e7f1ff;
  color: #1764d8;
}

:deep(.is-sky) {
  background: #e8f4ff;
  color: #2376f3;
}

:deep(.is-violet) {
  background: #efe9ff;
  color: #7558ef;
}

:deep(.is-teal) {
  background: #dff7f4;
  color: #10958c;
}

:deep(.is-green) {
  background: #eaf8e8;
  color: #24a249;
}

@media (max-width: 1180px) {
  .jsb-sidebar {
    position: static;
    width: auto;
    height: auto;
    gap: 18px;
    overflow: visible;
  }

  .jsb-dashboard-main {
    min-height: auto;
    margin-left: 0;
  }

  .jsb-topbar,
  .jsb-topbar__nav {
    flex-wrap: wrap;
  }

  :deep(.jsb-stats-grid) {
    grid-template-columns: 1fr 1fr;
  }

  :deep(.jsb-stats-grid.jsb-stats-grid--projects) {
    grid-template-columns: 1fr 1fr;
  }

  :deep(.jsb-dashboard-grid),
  :deep(.jsb-overview-visuals) {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 860px) {
  .jsb-dashboard-page {
    --jsb-mobile-header-height: 68px;
  }

  .jsb-dashboard-shell {
    min-height: 100vh;
  }

  .jsb-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 30;
    width: min(84vw, 300px);
    height: 100dvh;
    padding-top: 20px;
    transform: translateX(-100%);
    transition: transform 0.24s ease;
    overflow-y: auto;
  }

  .jsb-sidebar.is-mobile-open {
    transform: translateX(0);
  }

  .jsb-dashboard-main {
    min-height: 100vh;
    margin-left: 0;
    padding: 14px;
    padding-top: 10px;
  }

  .jsb-topbar {
    top: 10px;
    gap: 12px;
    min-height: var(--jsb-mobile-header-height);
    padding: 16px;
    border-radius: 18px;
  }

  .jsb-topbar__brand {
    width: 100%;
    justify-content: flex-start;
    gap: 12px;
  }

  .jsb-topbar__brand-copy {
    min-width: 0;
  }

  .jsb-topbar__brand-copy strong {
    display: block;
    font-size: 0.98rem;
    line-height: 1.25;
  }

  :deep(.jsb-topbar),
  :deep(.jsb-panel),
  :deep(.jsb-mini-panel),
  :deep(.jsb-stat-card) {
    padding: 16px;
  }

  :deep(.jsb-stats-grid) {
    grid-template-columns: 1fr;
  }

  :deep(.jsb-stats-grid.jsb-stats-grid--projects) {
    grid-template-columns: 1fr;
  }

  :deep(.jsb-map-card) {
    min-height: 420px;
  }

  :deep(.cp-map) {
    min-height: 420px;
    height: 420px;
  }
}
</style>
