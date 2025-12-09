<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const isActive = (path: string) => route.path === path;
const isProjectsActive = computed(() => route.path.startsWith("/projects"));
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
          <span class="brand-title">UNDP Sri Lanka</span>
          <span class="brand-subtitle">
            Japanese Supplementary Budget (JSB) Project
          </span>
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
              class="nav-link"
              :class="{ active: isProjectsActive }"
          >
            Projects
            <span class="nav-caret">▾</span>
          </div>

          <!-- LEVEL 1: Climate Promise / Food Security -->
          <ul class="dropdown-menu root-menu">
            <!-- Climate Promise -->
            <li class="dropdown-submenu">
              <div class="dropdown-link">
                <span>Climate Promise</span>
                <span class="caret-right">▸</span>
              </div>

              <!-- LEVEL 2: Climate Promise 1, 2 -->
              <ul class="dropdown-menu sub-menu">
                <li>
                  <router-link
                      to="/climate/project"
                      class="sub-dropdown-link"
                  >
                    Climate Promise Project 1
                  </router-link>
                </li>
                <li>
                  <router-link
                      to="/climate/project"
                      class="sub-dropdown-link"
                  >
                    Climate Promise Project 2
                  </router-link>
                </li>

                <li>
                  <router-link
                      to="/climate/project"
                      class="sub-dropdown-link"
                  >
                    Climate Promise Project 3
                  </router-link>
                </li>
              </ul>
            </li>

            <!-- Food Security -->
            <li class="dropdown-submenu">
              <div class="dropdown-link">
                <span>Food Security</span>
                <span class="caret-right">▸</span>
              </div>

              <!-- LEVEL 2: Food Security 1, 2 -->
              <ul class="dropdown-menu sub-menu">
                <li>
                  <router-link
                      to="/foodsecurity/project"
                      class="sub-dropdown-link"
                  >
                    Food Security Project 1
                  </router-link>
                </li>
                <li>
                  <router-link
                      to="/foodsecurity/project"
                      class="sub-dropdown-link"
                  >
                    Food Security Project 2
                  </router-link>
                </li>

                <li>
                  <router-link
                      to="/foodsecurity/project"
                      class="sub-dropdown-link"
                  >
                    Food Security Project 3
                  </router-link>
                </li>

                <li>
                  <router-link
                      to="/foodsecurity/project"
                      class="sub-dropdown-link"
                  >
                    Food Security Project 4
                  </router-link>
                </li>
              </ul>
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



        <!-- JSB MAP & STORIES -->
        <a
            href="https://jsb.gsentry.club/"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-ghost"
        >
          GeoInsights Portal
        </a>

      </nav>
    </div>
  </header>
</template>
