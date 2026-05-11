<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const primaryLinks = [
  { label: "Home", href: "/" },
  { label: "Gallery", href: "/blog" },
  { label: "Contact Us", href: "/contactus" }
];

const projectLinks = [
  { label: "Food Security", href: "/foodsecurity/project" },
  // { label: "Climate Promise 1", href: "/climate/project/1" },
  { label: "Climate Promise 2", href: "/climate/project/2"},
  { label: "Climate Promise 3", href: "/climate/project/3" },
  { label: "Climate Promise 4", href: "/climate/project/4" }
];

const mobileBreakpoint = 992;
const navbarRef = ref<HTMLElement | null>(null);
const isMobileView = ref(false);
const isMobileMenuOpen = ref(false);
const isProjectsOpen = ref(false);

const isLinkActive = (href: string) => route.path === href;

const isProjectsActive = computed(() =>
  projectLinks.some((link) => route.path === link.href)
);

const headerLogoSrc = computed(() => {
  const climateLogoRoutes = new Set([
    "/climate/project/2",
    "/climate/project/3",
    "/climate/project/4"
  ]);

  return climateLogoRoutes.has(route.path)
    ? "/images/logo1.png"
    : "/images/logo2.png";
});

const syncViewportState = () => {
  if (typeof window === "undefined") return;

  isMobileView.value = window.innerWidth < mobileBreakpoint;

  if (!isMobileView.value) {
    isMobileMenuOpen.value = false;
  }
};

const closeAllMenus = () => {
  isMobileMenuOpen.value = false;
  isProjectsOpen.value = false;
};

const toggleMobileMenu = () => {
  if (!isMobileView.value) return;

  isMobileMenuOpen.value = !isMobileMenuOpen.value;

  if (!isMobileMenuOpen.value) {
    isProjectsOpen.value = false;
  }
};

const toggleProjectsMenu = () => {
  isProjectsOpen.value = !isProjectsOpen.value;
};

const handleDocumentClick = (event: MouseEvent) => {
  const target = event.target as Node | null;

  if (navbarRef.value && target && !navbarRef.value.contains(target)) {
    closeAllMenus();
  }
};

watch(
  () => route.fullPath,
  () => closeAllMenus()
);

onMounted(() => {
  syncViewportState();
  window.addEventListener("resize", syncViewportState);
  document.addEventListener("click", handleDocumentClick);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", syncViewportState);
  document.removeEventListener("click", handleDocumentClick);
});
</script>

<template>
  <main class="jsb-public-page">
    <div class="jsb-public-shell">
      <button
        v-if="isMobileView && isMobileMenuOpen"
        class="jsb-navbar__backdrop"
        type="button"
        aria-label="Close navigation drawer"
        @click="closeAllMenus"
      ></button>

      <header class="jsb-navbar-wrap">
        <div ref="navbarRef" class="jsb-navbar container-fluid">
          <button
            class="jsb-navbar__toggle"
            type="button"
            :aria-expanded="isMobileMenuOpen ? 'true' : 'false'"
            aria-label="Toggle navigation"
            @click="toggleMobileMenu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div class="jsb-navbar__brand">
            <router-link to="/" class="jsb-navbar__identity" @click="closeAllMenus">
              <img
                :src="headerLogoSrc"
                alt="JSB"
                class="jsb-navbar__logo jsb-navbar__logo--primary"
              />
            </router-link>
          </div>

          <nav
            class="jsb-navbar__nav"
            :class="{ 'is-open': isMobileMenuOpen }"
            aria-label="Primary navigation"
          >
            <div class="jsb-navbar__menu">
              <router-link
                v-for="link in primaryLinks.slice(0, 1)"
                :key="link.label"
                :to="link.href"
                class="jsb-navbar__link"
                :class="{ 'is-active': isLinkActive(link.href) }"
                @click="closeAllMenus"
              >
                {{ link.label }}
              </router-link>

              <div
                class="jsb-navbar__dropdown"
                :class="{ 'is-open': isProjectsOpen, 'is-active': isProjectsActive }"
              >
                <button
                  class="jsb-navbar__link jsb-navbar__link--dropdown"
                  type="button"
                  :aria-expanded="isProjectsOpen ? 'true' : 'false'"
                  @click="toggleProjectsMenu"
                >
                  <span>Projects</span>
                  <i class="bi bi-chevron-down"></i>
                </button>

                <div
                  class="jsb-navbar__dropdown-menu"
                  :class="{ 'is-open': isProjectsOpen }"
                >
                  <component
                    v-for="project in projectLinks"
                    :key="project.label"
                    :is="project.disabled ? 'span' : 'router-link'"
                    v-bind="project.disabled ? {} : { to: project.href }"
                    class="jsb-navbar__dropdown-link"
                    :class="{
                      'is-active': !project.disabled && isLinkActive(project.href),
                      'is-disabled': project.disabled
                    }"
                    :aria-disabled="project.disabled ? 'true' : undefined"
                    @click="project.disabled ? undefined : closeAllMenus"
                  >
                    {{ project.label }}
                  </component>
                </div>
              </div>

              <router-link
                v-for="link in primaryLinks.slice(1)"
                :key="link.label"
                :to="link.href"
                class="jsb-navbar__link"
                :class="{ 'is-active': isLinkActive(link.href) }"
                @click="closeAllMenus"
              >
                {{ link.label }}
              </router-link>
            </div>
          </nav>
        </div>
      </header>

      <section class="jsb-public-shell__content">
        <slot />
      </section>
    </div>
  </main>
</template>

<style scoped>
.jsb-public-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(30, 95, 191, 0.12), transparent 30%),
    linear-gradient(180deg, #eef4fb 0%, #f7f9fc 100%);
  color: #17233c;
  font-family: "Poppins", sans-serif;
}

.jsb-public-shell {
  min-height: 100vh;
  padding: 0 0 28px;
}

.jsb-navbar-wrap {
  position: sticky;
  top: 0;
  z-index: 46;
  padding: 0;
}

.jsb-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 12px 28px;
  border: 0;
  border-bottom: 1px solid rgba(13, 33, 64, 0.08);
  border-radius: 0;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 10px 28px rgba(16, 24, 40, 0.05);
  backdrop-filter: blur(14px);
}

.jsb-navbar__backdrop {
  position: fixed;
  inset: 0;
  z-index: 41;
  border: 0;
  background: rgba(9, 20, 39, 0.42);
}

.jsb-navbar__brand {
  min-width: 0;
  flex: 0 0 auto;
}

.jsb-navbar__identity {
  display: inline-flex;
  align-items: center;
  gap: 0;
  min-width: 0;
  line-height: 0;
  white-space: nowrap;
  color: inherit;
  text-decoration: none;
}

.jsb-navbar__logo {
  display: block;
  object-fit: contain;
  background: transparent;
}

.jsb-navbar__logo--primary {
  width: auto;
  max-width: 165px;
  height: 48px;
  margin-bottom: 0;
}

.jsb-navbar__toggle {
  display: none;
  flex: 0 0 auto;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 46px;
  height: 46px;
  padding: 0;
  border: 1px solid rgba(13, 33, 64, 0.1);
  border-radius: 8px;
  background: #fff;
}

.jsb-navbar__toggle span {
  display: block;
  width: 18px;
  height: 2px;
  margin: 0 auto;
  border-radius: 999px;
  background: #123c7a;
}

.jsb-navbar__nav {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 1 1 auto;
  min-width: 0;
}

.jsb-navbar__menu {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  width: 100%;
}

.jsb-navbar__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid transparent;
  border-radius: 8px;
  color: #304563;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  transition:
    color 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.jsb-navbar__link:hover,
.jsb-navbar__link.is-active,
.jsb-navbar__dropdown.is-active > .jsb-navbar__link {
  color: #1f7a3f;
  background: #edf8ef;
  border-color: rgba(31, 122, 63, 0.14);
  box-shadow: inset 0 0 0 1px rgba(31, 122, 63, 0.05);
}

.jsb-navbar__link--dropdown {
  background: transparent;
  cursor: pointer;
}

.jsb-navbar__link--dropdown i {
  font-size: 0.8rem;
  transition: transform 0.2s ease;
}

.jsb-navbar__dropdown {
  position: relative;
}

.jsb-navbar__dropdown.is-open .jsb-navbar__link--dropdown i {
  transform: rotate(180deg);
}

.jsb-navbar__dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  display: grid;
  gap: 6px;
  min-width: 240px;
  padding: 10px;
  border: 1px solid rgba(13, 33, 64, 0.08);
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 20px 44px rgba(16, 24, 40, 0.12);
  opacity: 0;
  visibility: hidden;
  transform: translateY(4px);
  transition:
    opacity 0.18s ease,
    transform 0.18s ease,
    visibility 0.18s ease;
}

.jsb-navbar__dropdown-menu.is-open {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.jsb-navbar__dropdown-link {
  display: flex;
  align-items: center;
  min-height: 42px;
  padding: 0 12px;
  border-radius: 6px;
  color: #2c4160;
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 500;
  transition: background-color 0.18s ease, color 0.18s ease;
}

.jsb-navbar__dropdown-link:hover,
.jsb-navbar__dropdown-link.is-active {
  color: #1f7a3f;
  background: #edf8ef;
}

.jsb-navbar__dropdown-link.is-disabled {
  color: #8a97ab;
  background: transparent;
  cursor: not-allowed;
  pointer-events: none;
}

.jsb-public-shell__content {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 18px;
}

.jsb-public-shell__content > * {
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
  font-size: 1.72rem;
  line-height: 1;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: #12233f;
}

:deep(.jsb-stat-card__content span) {
  font-size: 0.88rem;
  color: #4e5d78;
}

:deep(.jsb-stat-card__content small) {
  font-size: 0.76rem;
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

@media (max-width: 1199px) {
  .jsb-navbar {
    padding: 16px 18px;
  }

  .jsb-navbar__identity {
    gap: 12px;
  }

  .jsb-navbar__menu {
    gap: 8px;
  }

  :deep(.jsb-stats-grid) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  :deep(.jsb-stats-grid.jsb-stats-grid--projects) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 991px) {
  .jsb-navbar-wrap {
    padding: 0;
  }

  .jsb-navbar {
    position: relative;
    z-index: 47;
    flex-wrap: nowrap;
    padding: 14px;
    gap: 12px;
    justify-content: flex-start;
  }

  .jsb-navbar__identity {
    gap: 0;
    align-items: center;
    width: 100%;
  }

  .jsb-navbar__brand {
    flex: 1 1 auto;
    min-width: 0;
  }

  .jsb-navbar__logo--primary {
    width: auto;
    max-width: 108px;
    height: 40px;
    margin-bottom: 0;
  }

  .jsb-navbar__toggle {
    display: inline-flex;
  }

  .jsb-navbar__nav {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 48;
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    width: min(84vw, 320px);
    max-width: 320px;
    height: 100dvh;
    padding: 84px 14px 20px;
    background: rgba(255, 255, 255, 0.98);
    box-shadow: 18px 0 38px rgba(16, 24, 40, 0.16);
    transform: translateX(-100%);
    transition: transform 0.24s ease;
    pointer-events: none;
  }

  .jsb-navbar__nav.is-open {
    transform: translateX(0);
    pointer-events: auto;
  }

  .jsb-navbar__menu {
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    width: 100%;
    padding-top: 0;
    border-top: 0;
  }

  .jsb-navbar__link,
  .jsb-navbar__link--dropdown {
    justify-content: space-between;
    width: 100%;
    min-height: 48px;
  }

  .jsb-navbar__dropdown-menu {
    position: static;
    min-width: 100%;
    margin-top: 8px;
    opacity: 1;
    visibility: visible;
    transform: none;
    display: none;
    box-shadow: none;
    background: #f8fbff;
  }

  .jsb-navbar__dropdown-menu.is-open {
    display: grid;
  }

  .jsb-public-shell__content {
    padding: 14px;
  }

  :deep(.jsb-stats-grid) {
    grid-template-columns: 1fr;
  }

  :deep(.jsb-stats-grid.jsb-stats-grid--projects) {
    grid-template-columns: 1fr;
  }

  :deep(.jsb-dashboard-grid),
  :deep(.jsb-overview-visuals) {
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
