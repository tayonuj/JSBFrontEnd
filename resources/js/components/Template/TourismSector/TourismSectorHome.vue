<template>
  <div class="container">

    <div class="row g-3 mb-3 mt-4">
      <div class="col-lg-12 col-md-12 col-sm-12">
        <Card>
          <CardBody>
            
          </CardBody>
        </Card>

      </div>
    </div>
    <div class="row g-3 mb-3 mt-4">
        <div class="col-lg-10 col-md-10 col-sm-10">
          <Card custom-class="overflow-hidden" custom-style="min-width: 12rem">
            <CardBody custom-class="p-4">
              <div class="row flex-between-center">
                <div class="col-auto">
                  <h5>Tourism Sector</h5>
                </div>
              </div>
              <ul class="nav nav-tabs" id="myTab" role="tablist">

                <li class="nav-item">
                  <a class="nav-link active" id="personal-tab" data-bs-toggle="tab" href="#tab-personal" role="tab" aria-controls="tab-personal" aria-selected="true">
                    Asset
                  </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" id="employee-tab" data-bs-toggle="tab" href="#tab-employee" role="tab" aria-controls="tab-employee" aria-selected="false">
                    Conflict
                  </a>
                </li>
                
              </ul>
              <div class="tab-content border border-top-0 p-3" id="myTabContent">
                <div class="tab-pane fade show active" id="tab-personal" role="tabpanel" aria-labelledby="personal-tab">

                  <div>
                    <TreeView :nodes="AssetData" />
                  </div>


                  <div class="button-group d-flex justify-content-end mt-3">
                    <button class="btn btn-outline-primary me-1 mb-1" type="button" @click="openEmployeeTab">
                      <span class="fa-solid fa-hand-point-right me-1"></span>Next
                    </button>

                    <router-link to="/data_analysis/tourismsector">
                    <button class="btn btn-outline-secondary me-1 mb-1" type="button">
                      <span class="fa-solid fa-database me-1" data-fa-transform="shrink-3"></span>Process
                    </button>
                    </router-link>

                  </div>

                </div>
                <div class="tab-pane fade" id="tab-employee" role="tabpanel" aria-labelledby="employee-tab">

                  <div>
                    <TreeView :nodes="ConflictData" />
                  </div>

                  <!-- Buttons section -->
                  <div class="button-group d-flex justify-content-end mt-3">

                    <button class="btn btn-outline-primary me-1 mb-1" type="button">
                      <span class="fa-solid fa-hand-point-left me-1"></span>Previous
                    </button>
                    <router-link to="/data_analysis/tourismsector">
                      <button class="btn btn-outline-secondary me-1 mb-1" type="button">
                        <span class="fa-solid fa-database me-1" data-fa-transform="shrink-3"></span>Process
                      </button>
                    </router-link>

                  </div>
                </div>

              </div>
            </CardBody>
          </Card>

        </div>
        <div class="col-lg-2 col-md-2 col-sm-2">
          <Card>
            <CardBody>
              <CardNews
                  v-for="(card, index) in cards"
                  :key="index"
                  :imageSrc="card.imageSrc"
                  :imageAlt="card.imageAlt"
                  :title="card.title"
                  :text="card.text"
                  :linkText="card.linkText"
                  :linkHref="card.linkHref"
                  :modelText="card.modelText"
                  @read-more="openModal(card.title, card.modelText)"
              />
            </CardBody>
          </Card>
          <!-- Single Modal Instance -->
          <Modal ref="myModal" :title="modalTitle">
            <p>{{ modalText }}</p>
          </Modal>
        </div>


    </div>  
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import {useStore} from "vuex";
import {findLocalStorage} from "../../../composables/storage/LocalStorageHandler";
import Card from "../../bootstrap/Card.vue";
import CardBody from "../../bootstrap/CardBody.vue";
import TreeView from "../../bootstrap/TreeView.vue";
import CardNews from "../../bootstrap/CardNews.vue";
import Modal from '../../bootstrap/Modal.vue';

const modalTitle = ref('');
const modalText = ref('');
const myModal = ref(null);

const openModal = (title, text) => {
  modalTitle.value = title;
  modalText.value = text.join('\n');
  myModal.value.showModal();
};

//Data set tree
const AssetData = [
  {
    label: 'Infrastructure',
    children: [
      {
        label: 'Accessibility',
        children: [
          {
            label: 'Proximity to a main road',
            children: [
              { label: '0m-200m' },
              { label: '200m-400m' },
              { label: '400m-600m' },
              { label: '600m-800m' },
              { label: '800m-1000m' },
            ],
          },
          {
            label: 'Proximity to a secondary road',
            children: [
              { label: '0m-200m' },
              { label: '200m-400m' },
              { label: '400m-600m' },
              { label: '600m-800m' },
              { label: '800m-1000m' },
            ],
          },
          {
            label: 'Proximity to a track',
            children: [
              { label: '0m-200m' },
              { label: '200m-400m' },
              { label: '400m-600m' },
            ],
          },
          {
            label: 'Proximity to a Highway',
            children: [
              { label: '0km-5km' },
              { label: '5km-10km' },
              { label: '10km-15km' },
              { label: '15km-20km' },
              { label: '21km-25km' },
            ],
          },
          {
            label: 'Proximity to a railway station',
            children: [
              { label: '0km-5km' },
              { label: '5km-10km' },
              { label: '10km-15km' },
              { label: '15km-20km' },
              { label: '21km-25km' },
            ],
          },
        ],
      },
      {
        label: 'Water',
        children: [
          {
            label: 'Availability of ground water',
            children: [
              { label: 'Yes' },
              { label: 'No' },
            ],
          },
          {
            label: 'Availability of pipeborne water',
            children: [],
          },
        ],
      },
      {
        label: 'Availability of accommodation facilities',
        children: [
          { label: 'Classified Hotels (1-5 Star)', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Tourist Hotels', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Boutique Hotels & Villas', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Guest Houses', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Bangalow\'s', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Home Stay Units', children: [{ label: 'Yes' }, { label: 'No' }] },
        ],
      },
      {
        label: 'Security and life saving',
        children: [
          { label: 'Locations of Police marine units', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Existing Police tourist units', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Establishments of Police life saving units', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Search and Rescue Region (SRR LINE)', children: [] },
        ],
      },
      {
        label: 'Other Infrastructure',
        children: [
          { label: 'Proximity to School', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Proximity to Hospital', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Availability of Bank/ATM', children: [{ label: 'Yes' }, { label: 'No' }] },
        ],
      },
    ],
  },
  {
    label: 'Natural Resources and Land use',
    children: [
      {
        label: 'Land use',
        children: [
          { label: 'Agricultural land', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Built Up Area', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Forest Land', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Sandy Land', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Water Body', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Wetland', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Bare Land', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Rocky Area', children: [{ label: 'Yes' }, { label: 'No' }] },
        ],
      },
      {
        label: 'Wind speed (100m)',
        children: [
          { label: 'Low area', children: [] },
          { label: 'High area', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Moderate area', children: [{ label: 'Yes' }, { label: 'No' }] },
        ],
      },
      {
        label: 'Solar irradiance',
        children: [
          { label: 'High area', children: [] },
          { label: 'Moderate area', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Low area', children: [{ label: 'Yes' }, { label: 'No' }] },
        ],
      },
      {
        label: 'Annual Rainfall (mm)',
        children: [
          { label: 'Annual Rainfall (mm)', children: [{ label: '>1750' }, { label: '1750-2500' }, { label: '<2500' }] },
        ],
      },
      {
        label: 'Distance from the coast (m)',
        children: [
          { label: 'Distance from the coast (m)', children: [
              { label: '0m-200m' },
              { label: '200m-400m' },
              { label: '400m-600m' },
              { label: '600m-800m' },
              { label: '800m-1000m' },
            ]},
        ],
      },
    ],
  },
  {
    label: 'Natural Environment & Biodiversity',
    children: [
      {
        label: 'Natural Environment',
        children: [
          { label: 'Proximity to Department of Wildlife protected area', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Proximity to Forest Department protected area', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Proximity to Environmental Protected Area', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Proximity to mangrove areas', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Proximity to terrestrial/coastal archaeological site', children: [{ label: 'Yes' }, { label: 'No' }] },
        ],
      },
      {
        label: 'Biodiversity and recreation',
        children: [
          { label: 'Whales', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Dolphins', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Sharks', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Sea turtles', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Coral reefs', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Sea grass', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Bivalve', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Mudflats', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Sand dune', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Lagoon', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Estuary', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Bathing site', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Surfing area', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'River mouth', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Beach area', children: [{ label: 'Yes' }, { label: 'No' }] },
        ],
      },
      {
        label: 'Marine Archeology (10 Km)',
        children: [
          { label: 'Near to DWC PAs', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Near to FD PAs', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Near to EPAS', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Near to Mangrove areas', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Near to Archeological sites', children: [{ label: 'Yes' }, { label: 'No' }] },
        ],
      },
    ],
  },
];

const ConflictData = [
  {
    label: 'Conservation Areas',
    children: [
      {
        label: 'Terrestrial',
        children: [
          { label: 'Department of Wildlife protected area', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Forest Department protected area', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Environmental Protected Area', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Environmentally sensitive area', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Mangrove area', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Terrestrial/coastal archaeological site', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Sand dune', children: [{ label: 'Yes' }, { label: 'No' }] },
        ],
      },
      {
        label: 'Geospatial characteristics',
        children: [
          { label: 'Heavy mineral deposit', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'River mouth', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Sea erosion', children: [{ label: 'Yes' }, { label: 'No' }] },
        ],
      },
    ],
  },
  {
    label: 'Existing Human/Development Activities',
    children: [
      {
        label: 'Current Activities',
        children: [
          { label: 'Population density', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Port', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Fishery harbor', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Landing site', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Madel Padu', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Anchorage', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Fishing ground', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Light house', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Wind farm', children: [{ label: 'Yes' }, { label: 'No' }] },
        ],
      },
      {
        label: 'Pollution',
        children: [
          { label: 'Beach Pollution (risk level)', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Sea outfall', children: [{ label: 'Yes' }, { label: 'No' }] },
        ],
      },
    ],
  },
  {
    label: 'Other Conflicts',
    children: [
      {
        label: 'Natural Hazards',
        children: [
          { label: 'Flood', children: [{ label: 'Yes' }, { label: 'No' }] },
        ],
      },
      {
        label: 'Proposed projects',
        children: [
          { label: 'Proposed oil well location', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Proposed harbour', children: [{ label: 'Yes' }, { label: 'No' }] },
          { label: 'Proposed priority wind farm areas', children: [{ label: 'Yes' }, { label: 'No' }] },
        ],
      },
    ],
  },
];


// array of card objects
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

const store = useStore();
// State to track the current step of the wizard
const currentStep = ref(1);

// Function to update the current step
const setCurrentStep = (step) => {
  currentStep.value = step;
};

const trigureStepper = computed(() => {
  return store.getters.stepperStep;
});
watch(trigureStepper,function (step,oldStep) {
  setCurrentStep(step);
});

onMounted(()=>{
  let step = findLocalStorage('stepper');
  if (step){
      setCurrentStep(step);
  }
})

</script>


<style scoped>
.nav-item a.disabled {
  pointer-events: none;
  color: #ccc;
}

.nav-item a.active {
  font-weight: bold;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>
