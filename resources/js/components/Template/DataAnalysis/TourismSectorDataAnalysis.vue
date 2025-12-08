<template>
  <div class="container">
    <div class="row g-3 mb-3 mt-4">
      <div class="col-lg-3 col-md-3 col-sm-3">
        <Card>
          <CardBody>
            <p>Spatial Layers</p>
            <div>
              <TreeView :nodes="BaseMapsData" />
            </div>
          </CardBody>
        </Card>
      </div>

      <div class="col-lg-6 col-md-6 col-sm-6" id="map_div">
        <Card>
          <CardBody>
            <div id="map" class="googlemap" data-theme="AssassianCreed"></div>
          </CardBody>
        </Card>
      </div>

      <div class="col-lg-3 col-md-3 col-sm-3 " id="news_div">
        <Card>
          <CardBody>
            <div class="scrollable-div news">
              <Card v-for="(card, index) in cards" :key="index">
                <CardBody>
                  <CardNews
                      :imageSrc="card.imageSrc"
                      :imageAlt="card.imageAlt"
                      :title="card.title"
                      :text="card.text"
                      :linkText="card.linkText"
                      :linkHref="card.linkHref"
                      :modelText="card.modelText"
                      @read-more="openModal(card)"
                  />
                </CardBody>
              </Card>

              <!-- Single Modal Instance -->
              <Modal ref="myModal" :title="modalTitle">
                <p>{{ modalText }}</p>
              </Modal>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>

    <div class="row g-3">
      <div class="col-lg-12 col-md-12 col-sm-12">
        <Card>
          <CardBody>
            <div class="col-lg-12 col-md-12 col-sm-12">
              <div class="col-lg-12 col-md-12 col-sm-12">
                <!-- Flexbox container for inline display -->
                <div class="d-flex align-items-center justify-content-between">
                  <!-- Province Select Box -->
                  <div class="form-floating me-2">
                    <select v-model="selectedProvince" class="form-select form-control-sm" id="provinceSelect" @change="onProvinceChange">
                      <option value="" disabled selected>Select Province</option>
                      <option v-for="(province, index) in provinces" :key="index" :value="province">{{ province }}</option>
                    </select>
                    <label for="provinceSelect">Province</label>
                  </div>

                  <!-- District Select Box (Always visible) -->
                  <div class="form-floating me-2">
                    <select v-model="selectedDistrict" class="form-select form-control-sm" id="districtSelect" @change="onDistrictChange">
                      <option value="" disabled selected>Select District</option>
                      <option v-for="(district, index) in availableDistricts" :key="index" :value="district">{{ district }}</option>
                    </select>
                    <label for="districtSelect">District</label>
                  </div>

                  <!-- DSD Select Box (Always visible) -->
                  <div class="form-floating me-2">
                    <select v-model="selectedDSD" class="form-select form-control-sm" id="dsdSelect" @change="onDSDChange">
                      <option value="" disabled selected>Select DSD</option>
                      <option v-for="(dsd, index) in availableDSDs" :key="index" :value="dsd">{{ dsd }}</option>
                    </select>
                    <label for="dsdSelect">DSD</label>
                  </div>

                  <!-- GND Select Box (Always visible) -->
                  <div class="form-floating me-2">
                    <select v-model="selectedGND" class="form-select form-control-sm" id="gndSelect">
                      <option value="" disabled selected>Select GND</option>
                      <option v-for="(gnd, index) in availableGNDs" :key="index" :value="gnd">{{ gnd }}</option>
                    </select>
                    <label for="gndSelect">GND</label>
                  </div>

                  <div class="form-floating">
                    <button class="btn btn-primary" @click="processSelection" :disabled="!isSelectionComplete">
                      Process
                    </button>
                  </div>
                </div>
              </div>


              <!-- Process Button -->

            </div>
          </CardBody>
        </Card>
      </div>
    </div>

    <div class="row g-3 mb-3 mt-1">
      <div class="col-lg-12 col-md-12 col-sm-12">
        <Card>
          <CardBody>

            <div>
              <Table :headers="tableHeaders" :data="tableData" />
            </div>

          </CardBody>
        </Card>

      </div>
    </div>

  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import Card from "../../bootstrap/Card.vue";
import CardBody from "../../bootstrap/CardBody.vue";
import CardNews from "../../bootstrap/CardNews.vue";
import Modal from '../../bootstrap/Modal.vue';
import TreeView from "../../bootstrap/TreeView.vue";
import Table from '../../bootstrap/Table.vue';

//Table Data
const tableHeaders = ref(['Province', '1', '2', '3', '4', '5', 'Grand Total']);
const tableData = ref([
  ['AMPARA', '2917', '923', '120', '', '', '3960'],
  ['BATTICALOA', '5231', '2637', '739', '', '', '8607'],
  ['COLOMBO', '673', '46', '95', '54', '', '868'],
  // Add more rows if necessary
]);

// BaseMapsData array
const BaseMapsData = [
  {
    label: 'Base Maps',
    children: [
      { label: 'GND' },
      { label: 'DSD' },
      { label: 'District' },
      { label: 'Province' },
      { label: 'Road Network' },
      { label: 'Place Names' },
      { label: 'Drone Layer Boundary' },
      { label: 'Drone Layer Buildings' },
    ],
  },
];

// Modal data
const modalTitle = ref('');
const modalText = ref('');
const myModal = ref(null);

const openModal = (card) => {
  modalTitle.value = card.title;
  modalText.value = card.modelText.join('\n');
  myModal.value.showModal();
};

// Google Map initialization
const initMap = () => {
  const mapOptions = {
    center: {lat: 7.8731, lng: 80.7718},
    zoom: 7, // Adjusted zoom level
    scrollwheel: false,
    mapTypeId: 'satellite',
  };

  const map = new google.maps.Map(document.getElementById('map'), mapOptions);
};

// Ensure the Google Maps API is loaded before initializing the map
window.initMap = initMap;

onMounted(() => {
  if (typeof google !== 'undefined') {
    initMap();
  } else {
    // If the Google Maps API isn't loaded yet, listen for it
    window.addEventListener('googleMapsLoaded', initMap);
  }
});

// Sample card data
const cards = [
  {
    imageSrc: "/assets/img/generic/investment1.jpg",
    imageAlt: "Blue Investment",
    title: "Blue Investment Project",
    text: "Ready to make waves with your next investment? Introducing Blue Investment, our latest project nestled in the heart of Sri Lanka's stunning coastline.",
    modelText:[
      "Ready to make waves with your next investment? Introducing Blue Investment, our latest project nestled in the heart of Sri Lanka's stunning coastline.",
      "Your investment here isn't just buying property; it's securing a future of endless possibilities.",
      "With breathtaking views and premium amenities, this project offers a unique opportunity to invest in your future.",
      "Join us in transforming the coastline into a vibrant hub for tourism and development."
    ],
    linkText: "Read More",
    linkHref: "#!"
  },
  {
    "imageSrc": "/assets/img/generic/investment2.jpg",
    "imageAlt": "Diving Investment",
    "title": "Invest in Underwater Exploration",
    "text": "Dive into a world of vibrant marine life and unparalleled beauty. Discover the opportunities of investing in Sri Lanka’s rich underwater ecosystems with Blue Investment.",
    modelText:[
      "Dive into a world of vibrant marine life and unparalleled beauty. Discover the opportunities of investing in Sri Lanka’s rich underwater ecosystems with Blue Investment.",
      "Imagine waking up to the soothing sound of waves and the sight of pristine beaches every day.",
      "By investing in Blue Investment, you're not just investing in land; you're becoming a part of a sustainable future for both the environment and local communities.",
      "We prioritize eco-friendly practices and work with local stakeholders to ensure that development is beneficial to all.",
      "Explore the potential of our marine resources, where sustainable practices lead to a prosperous future.",
      "Your investment will contribute to conservation efforts, protecting our rich biodiversity for generations to come."

    ],
    "linkText": "Read More",
    "linkHref": "#!"
  },
  {
    "imageSrc": "/assets/img/generic/investment3.jpg",
    "imageAlt": "Smart Investment",
    "title": "Capitalizing on Coastal Growth",
    "text": "Sri Lanka is a booming hotspot for investors. Join the wave and invest in prime land that offers endless possibilities for tourism and growth.",
    modelText: [
      "Sri Lanka is a booming hotspot for investors. Join the wave and invest in prime land that offers endless possibilities for tourism and growth.",
      "The country's rich culture and diverse landscapes create a unique blend that attracts tourists from around the world.",
      "Imagine a place where pristine beaches meet lush greenery, creating the perfect backdrop for your investment.",
      "With government support and increasing infrastructure development, there has never been a better time to invest.",
      "By choosing Blue Investment, you're not just buying land; you're becoming part of a growing community focused on sustainable tourism and economic growth.",
      "Seize this opportunity to be part of Sri Lanka's economic transformation and enjoy the benefits of a lucrative investment."
    ],
    "linkText": "Read More",
    "linkHref": "#!"
  }
];

// Sample data for selects
const provinces = ["Western", "Central", "Southern"];
const districtData = {
  Western: ["Colombo", "Gampaha", "Kalutara"],
  Central: ["Kandy", "Matale", "Nuwara Eliya"],
  Southern: ["Galle", "Matara", "Hambantota"],
};

const dsdData = {
  Colombo: ["Colombo DSD 1", "Colombo DSD 2"],
  Gampaha: ["Gampaha DSD 1", "Gampaha DSD 2"],
  Kalutara: ["Kalutara DSD 1", "Kalutara DSD 2"],
  Kandy: ["Kandy DSD 1", "Kandy DSD 2"],
  Matale: ["Matale DSD 1", "Matale DSD 2"],
  Galle: ["Galle DSD 1", "Galle DSD 2"],
};

const gndData = {
  "Colombo DSD 1": ["GND 1", "GND 2"],
  "Colombo DSD 2": ["GND 3", "GND 4"],
  "Gampaha DSD 1": ["GND 5", "GND 6"],
  "Kandy DSD 1": ["GND 7", "GND 8"],
};

// Selections
const selectedProvince = ref('');
const selectedDistrict = ref('');
const selectedDSD = ref('');
const selectedGND = ref('');

// Filtered data
const availableDistricts = ref([]);
const availableDSDs = ref([]);
const availableGNDs = ref([]);

// Selection change handlers
const onProvinceChange = () => {
  availableDistricts.value = districtData[selectedProvince.value] || [];
  selectedDistrict.value = '';
  selectedDSD.value = '';
  availableDSDs.value = [];
  availableGNDs.value = [];
};

const onDistrictChange = () => {
  availableDSDs.value = dsdData[selectedDistrict.value] || [];
  selectedDSD.value = '';
  availableGNDs.value = [];
};

const onDSDChange = () => {
  availableGNDs.value = gndData[selectedDSD.value] || [];
};

const isSelectionComplete = computed(() => selectedGND.value);

// Process button action
const processSelection = () => {
  alert(`Processing selection: ${selectedGND.value}`);
};
</script>

<style scoped>
.googlemap {
  height: 400px;
  width: 100%;
}
.news {
  height: 400px;
}

.scrollable-div {
  max-height: 600px;
  overflow-y: auto;
}
</style>
