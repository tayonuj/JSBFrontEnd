<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const isActive = (path: string) => route.path === path;
const isProjectsActive = computed(() =>
  route.path.startsWith("/climate/project") ||
  route.path.startsWith("/foodsecurity/project") ||
  route.path === "/project5"
);
</script>

<template>
  <header class="site-header">
    <div class="container header-inner">
      <!-- BRAND -->
      <div class="brand">
        <div class="brand-logos">
          <img
              src="/images/undp-logo.png"
              alt="UNDP Logo"
              class="brand-logo undp-logo"
          />
          <img
              src="/images/japan-logo.png"
              alt="Japan Logo"
              class="brand-logo japan-logo"
          />
        </div>
        <div class="brand-text">
          <span class="brand-kicker">UNDP Sri Lanka</span>
          <span class="brand-title">Japanese Supplementary Budget</span>
        </div>
      </div>

      <!-- NAVIGATION -->
      <nav class="main-nav">
        <!-- HOME -->
        <router-link
            to="/"
            class="nav-link"
            :class="{ active: isActive('/') }"
        >
          Home
        </router-link>

        <!-- PROJECTS (HOVER DROPDOWN) -->
        <div class="nav-item dropdown">
          <div
              class="nav-link nav-link-projects"
              :class="{ active: isProjectsActive }"
          >
            <span class="nav-link-projects-label">Projects</span>
            <span class="nav-link-projects-icon" aria-hidden="true">
              <svg viewBox="0 0 20 20" fill="none">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>
          </div>

          <ul class="dropdown-menu root-menu">
            <li>
              <router-link
                  to="/foodsecurity/project"
                  class="sub-dropdown-link"
              >
                Foodsecurity
              </router-link>
            </li>
            <li>
              <router-link
                  to="/climate/project/1"
                  class="sub-dropdown-link"
              >
                Climate Promise 1
              </router-link>
            </li>
            <li>
              <router-link
                  to="/climate/project/2"
                  class="sub-dropdown-link"
              >
                Climate Promise 2
              </router-link>
            </li>
            <li>
              <router-link
                  to="/climate/project/3"
                  class="sub-dropdown-link"
              >
                Climate Promise 3
              </router-link>
            </li>
            <li>
              <router-link
                  to="/climate/project/4"
                  class="sub-dropdown-link"
              >
                Climate Promise 4
              </router-link>
            </li>
            <li>
              <router-link
                  to="/project5"
                  class="sub-dropdown-link"
              >
                Climate Promise 5
              </router-link>
            </li>
          </ul>
        </div>


        <!-- BLOG -->
        <router-link
            to="/blog"
            class="nav-link"
            :class="{ active: isActive('/blog') }"
        >
          Blog
        </router-link>


        <!-- CONTACT -->
        <router-link
            to="/contactus"
            class="nav-link"
            :class="{ active: isActive('/contactus') }"
        >
          Contact Us
        </router-link>
      </nav>
    </div>
  </header>
</template>
