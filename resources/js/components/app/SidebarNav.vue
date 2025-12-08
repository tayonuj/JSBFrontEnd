<script setup lang="ts">
import { useRouter } from 'vue-router';
import { getCurrentInstance, onMounted } from 'vue';

defineProps<{
  menu: {
    icon: String,
    text: String,
    url: String,
    highlight: Boolean,
    children: Object
  };
}>();

function subIsActive(urls: Array<{ url: String }>) {
  const currentRoute = useRouter().currentRoute.value.path;
  return urls.some(urlObj => urlObj.url === currentRoute);
}

const { proxy } = getCurrentInstance();
const signOut = async () => {
  localStorage.removeItem('user');
  window.location.reload();
};

const user = JSON.parse(localStorage.getItem('user') || '{}');

onMounted(() => {
  // Additional logic if needed on mount
});
</script>

<template>
  <nav class="navbar navbar-vertical navbar-expand-xl navbar-light">
    <!-- Content-->
    <div class="collapse navbar-collapse">
      <div class="row">

        <div class="col-auto col-lg-2">

          <button
              class="btn navbar-toggler-humburger-icon navbar-vertical-toggle mt-3"
              data-bs-toggle="collapse"
              data-bs-target="#navbarVerticalCollapse"
              title="Toggle Navigation">
          <span class="navbar-toggle-icon">
            <span class="toggle-line"></span>
          </span>
          </button>
        </div>


      <div class="col-12 col-lg-6">
        <a class="navbar-brand" href="index.html">
          <div class="d-flex align-items-center py-3">
            <img class="me-2" src="/assets/img/slpa_logo.png" alt="" width="40" />
            <span class="font-sans-serif" style="color:#02adef">HR<span style="color: #f2b00f">IS</span></span>
          </div>
        </a>
      </div>






      </div>


      <div class="navbar-vertical-content scrollbar" id="navbarVerticalCollapse">
        <ul class="navbar-nav flex-column mb-3" id="navbarVerticalNav">
          <li class="nav-item">
            <a class="nav-link dropdown-indicator" href="#quicklinks" role="button" data-bs-toggle="collapse" aria-expanded="true" aria-controls="quicklinks">
              <div class="d-flex align-items-center">
                <span class="nav-link-icon">
                  <span class="fas fa-chart-pie"></span>
                </span>
                <span class="nav-link-text ps-1">Quick Links</span>
              </div>
            </a>
            <ul class="nav collapse show" id="quicklinks">
              <li class="nav-item">
                <RouterLink class="nav-link active" to="/employee">
                  <div class="d-flex align-items-center">
                    <span class="nav-link-text ps-1">Dashboard</span>
                  </div>
                </RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" :to="`/employee-profile/${user.EMP_NUMBER}`" target="_blank">
                  <div class="d-flex align-items-center">
                    <span class="nav-link-text ps-1">My Information</span>
                  </div>
                </RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" to="/leave-apply" target="_blank">
                  <div class="d-flex align-items-center">
                    <span class="nav-link-text ps-1">Apply Leave</span>
                  </div>
                </RouterLink>
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <div class="row navbar-vertical-label-wrapper mt-3 mb-2">
              <div class="col-auto navbar-vertical-label">Module Options</div>
              <div class="col ps-0">
                <hr class="mb-0 navbar-vertical-divider" />
              </div>
            </div>
            <RouterLink class="nav-link" to="app/calendar.html" role="button">
              <div class="d-flex align-items-center">
                <span class="nav-link-icon">
                  <span class="fas fa-calendar-alt"></span>
                </span>
                <span class="nav-link-text ps-1">HR Admin</span>
              </div>
            </RouterLink>
            <RouterLink class="nav-link" to="app/chat.html" role="button">
              <div class="d-flex align-items-center">
                <span class="nav-link-icon">
                  <span class="fas fa-comments"></span>
                </span>
                <span class="nav-link-text ps-1">Employee Information Manager</span>
              </div>
            </RouterLink>
          </li>
          <li class="nav-item">
            <div class="menu-item">
              <a href="#" class="menu-link" @click="signOut">
                <div class="menu-icon">
                  <i class="bi bi-box-arrow-in-left bi--xs"></i> SignOut
                </div>
              </a>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
<!--  <nav class="navbar navbar-light navbar-vertical navbar-expand-xl">-->
<!--    <div class="d-flex align-items-center">-->
<!--      <div class="toggle-icon-wrapper">-->

<!--      </div>-->

<!--    </div>-->
<!--    <div class="collapse navbar-collapse" id="navbarVerticalCollapse">-->
<!--      <div class="navbar-vertical-content scrollbar">-->

<!--      </div>-->
<!--    </div>-->
<!--  </nav>-->
  <div class="container">
    <nav class="navbar navbar-light navbar-top navbar-expand">
      <button class="btn navbar-toggler-humburger-icon navbar-toggler me-1 me-sm-3" type="button" data-bs-toggle="collapse" data-bs-target="#navbarVerticalCollapse" aria-controls="navbarVerticalCollapse" aria-expanded="false" aria-label="Toggle Navigation">
        <span class="navbar-toggle-icon">
          <span class="toggle-line"></span>
        </span>
      </button>
    </nav>
    <div class="container">
      <slot />
    </div>
  </div>
</template>

<style>
/* Add any custom styles here */
</style>
