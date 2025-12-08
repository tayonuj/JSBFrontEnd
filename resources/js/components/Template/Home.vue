<template>

  <div class="container">

    <div class="row g-3 mb-3 mt-4">
      <div class="col-md-12 col-sm-12 col-lg-12 ">
      <div class="card bg-dark text-white overflow-hidden light" style="max-width: 100rem; max-height: 25rem;">
        <div class="card-img-top">
<!--          <img class="img-fluid" src="/assets/img/generic/3.jpg" alt="Card image" />-->
<!--          <video class="img-fluid" controls autoplay loop>-->
          <video class="img-fluid" autoplay muted loop>
            <source src="/assets/video/blue_water.mp4" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
        <div class="card-img-overlay d-flex align-items-end">
          <div>
            <h5 class="card-title text-white">Blue Investment</h5>
            <p class="card-text">Ready to make waves with your next investment?</p>
          </div>
        </div>
      </div>
      </div>
    </div>

    <div class="row g-3 mb-3 d-flex align-items-stretch">
      <div
          :class="{'col-md-12 col-sm-12 col-lg-6 col-xxl-3': !card.fullWidth,'col-12': card.fullWidth}"
          v-for="(card, index) in cardIconStatData"
          :key="index"
      >

        <CardIconStat
            :title="card.title"
            :headingTag="'h4'"
            :badgeText="card.badgeText"
            :icon="card.icon"
            :href="card.href"
            :imageIndex="card.imageIndex"
            :textClass="card.textClass"
            :iconColor="card.colorCode"
            class="h-100"
        />
      </div>
    </div>

  </div>

</template>

<script setup>
import {ref} from "vue";
import CardIconStat from "../bootstrap/CardIconStat.vue";
import CardBody from "../bootstrap/CardBody.vue";
import Card from "../bootstrap/Card.vue";
import CardStat from "../bootstrap/CardStat.vue";

const user = JSON.parse(localStorage.getItem('user'));

const cardIconStatData = ref([
  {
    title: 'Tourism Sector',
    badgeText: '4 shorts',
    icon: 'fas fa-user-clock fs-5',
    colorCode:'#C5E1A5',
    href: '/tourismsector/asset',
    imageIndex: 2,
    textClass: 'text-warning'
  },
  {
    title: 'Boat Building',
    badgeText: '4 shorts',
    icon: 'fas fa-chalkboard-teacher fs-5',
    colorCode:'#64DD17',
    href: '/leave-requests',
    imageIndex: 2,
    textClass: 'text-warning'
  },
  {
    title: 'Conservation Base Financing',
    badgeText: '4 shorts',
    icon: 'fas fa-user-check fs-5',
    colorCode:'#D1C4E9',
    href: '/attendance',
    imageIndex: 2,
    textClass: 'text-warning'
  },
  {
    title: 'Renewable Energy',
    badgeText: '4 shorts',
    icon: 'far fa-handshake fs-5',
    colorCode:'#B39DDB',
    href: '#',
    imageIndex: 2,
    textClass: 'text-warning'
  },
  {
    title: 'Sustainable Industries & Innovations',
    badgeText: 'Special Card',
    icon: 'fas fa-star fs-5',
    colorCode: '#FFEB3B',
    href: '#',
    imageIndex: 2,
    textClass: 'text-info',
    fullWidth: true,
  },


]);



</script>
<style>
.video-container {
  position: relative;
  width: 120%;
  height: 100%;
  overflow: hidden;
}

.video-container video {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120%;
  height: 100%;
  transform: translate(-50%, -50%);
  object-fit: cover; /* Ensures the video covers the entire area without distortion */
}

</style>
