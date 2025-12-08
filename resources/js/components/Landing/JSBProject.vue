<template>
  <div>
    <!-- JSB Hero -->
    <section class="hero hero-jsb">
      <div class="container hero-inner">
        <div class="hero-content">
          <div class="eyebrow">Poultry Livelihoods • Sri Lanka</div>
          <h1>JSB Supporting Small Chicken Farms &amp; Egg Producers</h1>
          <p>
            The JSB project helps rural families in Sri Lanka to establish and
            expand small-scale poultry units — brooding centres, layer farms and
            home-based egg production — with support from the
            <strong>People of Japan</strong>.
          </p>
          <ul class="inline-list">
            <li>Small poultry farms</li>
            <li>Brooding centres &amp; layer units</li>
            <li>Home-based egg production</li>
          </ul>
        </div>

        <div class="hero-sidecard">
          <div class="flag-card">
            <img src="/images/japan-logo.png" alt="Japan Logo" class="flag-logo" />
            <div class="flag-text">
              <span class="flag-label">Supported by</span>
              <span class="flag-title">The People of Japan</span>
            </div>
          </div>
          <p class="hero-highlight">
            JSB strengthens poultry micro-enterprises in districts such as
            Anuradhapura, Polonnaruwa and Trincomalee, improving incomes and
            food security for families and communities.
          </p>
        </div>
      </div>
    </section>

    <!-- JSB Parallax Strip -->
    <section class="parallax-section jsb-parallax">
      <div class="parallax2-bg"></div>
      <div class="parallax-overlay"></div>
      <div class="parallax-content container">
        <h2>From Backyard Coops to Sustainable Poultry Businesses</h2>
        <p>
          With small grants, basic equipment and practical coaching, JSB helps
          families turn chicken coops, brooders and egg trays into reliable
          income sources and more resilient livelihoods.
        </p>
      </div>
    </section>

    <!-- Map + description -->
    <section class="section">
      <div class="container jsb-map-vertical-layout">
        <div class="jsb-map-card card">
          <div class="section-header section-header-left">
            <h2>JSB Beneficiaries – Map</h2>
            <p>
              Each point represents a JSB-supported poultry micro-enterprise or
              brooding centre across three districts.
            </p>
          </div>

          <p>
            The JSB programme supports egg production and poultry micro-farms in
            <strong>Anuradhapura</strong>, <strong>Polonnaruwa</strong> and
            <strong>Trincomalee</strong>, working with local partners and
            communities.
          </p>

          <div class="card-pill-row">
            <span class="card-pill">
              <span class="pill-icon">📍</span>
              3 focus districts
            </span>
            <span class="card-pill">
              <span class="pill-icon">🐔</span>
              Poultry livelihoods
            </span>
            <span class="card-pill">
              <span class="pill-icon">🗺️</span>
              District-level view
            </span>
          </div>

          <p class="map-note">
            <small>
              Note: Marker locations are approximate and visualised at district level
              for storytelling.
            </small>
          </p>
        </div>

        <div class="jsb-map-wrapper-tall">
          <div id="jsb-map" ref="mapRef" class="jsb-map jsb-map-tall"></div>
        </div>
      </div>
    </section>

    <!-- Operational GIS Panel link -->
    <section class="section">
      <div class="container">
        <div class="card jsb-gis-card">
          <div class="section-header section-header-left">
            <h2>Operational GIS Panel (Registered Officers)</h2>
            <p>
              The operational GIS panel provides authorised officers with tools
              to manage beneficiary locations, overlay project layers and review
              real-time field updates.
            </p>
          </div>

          <p>
            Only registered and authorised officers can access the JSB GIS panel.
            Use your assigned credentials to manage spatial data, beneficiary
            information and monitoring views.
          </p>

          <div class="card-pill-row">
            <span class="card-pill">
              <span class="pill-icon">🛰️</span>
              Layer overlays
            </span>
            <span class="card-pill">
              <span class="pill-icon">📊</span>
              Monitoring views
            </span>
            <span class="card-pill">
              <span class="pill-icon">🔐</span>
              Registered officers only
            </span>
          </div>

          <div class="gis-card-actions">
            <a
                href="https://jsb.gsentry.club/"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-primary"
            >
              Open JSB GIS Operational Panel
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured video -->
    <section class="section bg-soft jsb-video-section">
      <div class="container jsb-video-layout-large">
        <div class="jsb-video-text">
          <div class="section-header section-header-left">
            <h2>Featured Video Story</h2>
            <p>
              A real UNDP success story that reflects the kind of impact JSB
              aims to create through livelihood support.
            </p>
          </div>
          <p>
            This video showcases how targeted assistance, coaching and community
            partnerships can transform lives, strengthen resilience and support
            dignified work across Sri Lanka.
          </p>
        </div>

        <div class="jsb-video-frame-large">
          <iframe
              src="https://www.youtube.com/embed/wtvuqYOy7uc"
              title="UNDP Success Story - Jayaseel"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
          ></iframe>
        </div>
      </div>
    </section>

    <!-- Success Stories -->
    <section class="section bg-soft">
      <div class="container">
        <div class="section-header">
          <h2>JSB Success Stories</h2>
          <p>
            Stories collected from the dataset you shared, including Google Drive
            documents and a YouTube video.
          </p>
        </div>

        <div class="stories-toolbar">
          <div class="stories-summary">
            <span>{{ filteredStories.length }}</span> stories loaded
          </div>
          <div class="stories-filter">
            <label for="districtFilter">Filter by district:</label>
            <select id="districtFilter" v-model="selectedDistrict">
              <option value="all">All districts</option>
              <option
                  v-for="d in districts"
                  :key="d"
                  :value="d"
              >
                {{ d }}
              </option>
            </select>
          </div>
        </div>

        <div class="grid grid-3 story-grid">
          <article
              v-for="story in filteredStories"
              :key="story.id"
              class="card story-card"
          >
            <div class="story-header">
              <h3>{{ story.title }}</h3>
              <div class="story-meta">
                <span v-if="story.district">{{ story.district }}</span>
                <span v-if="story.programme">&bull; {{ story.programme }}</span>
              </div>
            </div>
            <div class="story-body">
              {{ story.shortDescription }}
            </div>
            <div class="story-actions">
              <a
                  v-if="story.googleDriveUrl"
                  :href="story.googleDriveUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-outline btn-sm"
              >
                View full story (Drive)
              </a>
              <button
                  v-if="story.youtubeUrl"
                  class="btn btn-primary btn-sm"
                  @click="toggleVideo(story)"
              >
                {{ story.showVideo ? "Hide video" : "Watch video" }}
              </button>
            </div>
            <div
                v-if="story.youtubeUrl && story.showVideo"
                class="story-video"
            >
              <iframe
                  :src="story.youtubeUrl"
                  title="YouTube video player"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
              ></iframe>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
// Make sure Leaflet is globally available via <script> in welcome.blade,
// or install via npm and import { map, tileLayer, marker, featureGroup } from 'leaflet'

const mapRef = ref<HTMLElement | null>(null);

// Copy of your jsbSuccessStories from main.js:
const stories = ref([
  {
    id: 1,
    title: "Danushka's Story",
    district: "Anuradhapura",
    programme: "JSB-S",
    shortDescription:
        "A JSB-S supported beneficiary from Anuradhapura district. Full story available as a PDF via Google Drive.",
    googleDriveUrl:
        "https://drive.google.com/file/d/1h0D2favkBau_3BPpeOwEIK5Pv4zPybR8/view?usp=sharing",
    youtubeUrl: "",
    lat: 8.3114,
    lng: 80.4037,
    showVideo: false
  },
  // ... add the rest of your stories from main.js ...
]);

const selectedDistrict = ref<"all" | string>("all");

const districts = computed(() => {
  const set = new Set<string>();
  stories.value.forEach(s => {
    if (s.district) set.add(s.district.trim());
  });
  return Array.from(set).sort();
});

const filteredStories = computed(() => {
  if (selectedDistrict.value === "all") return stories.value;
  return stories.value.filter(
      s => s.district && s.district.trim() === selectedDistrict.value
  );
});

const toggleVideo = (story: any) => {
  story.showVideo = !story.showVideo;
};

const initJSBMap = () => {
  if (!mapRef.value || !(window as any).L) return;
  const L = (window as any).L;

  const map = L.map(mapRef.value).setView([7.8731, 80.7718], 5);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 7,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  const markers: any[] = [];

  stories.value.forEach(story => {
    if (typeof story.lat === "number" && typeof story.lng === "number") {
      const m = L.marker([story.lat, story.lng]).addTo(map);
      m.bindPopup(`<strong>${story.title}</strong><br/>${story.district || ""}`);
      markers.push(m);
    }
  });

  if (markers.length > 0) {
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.2));
  }
};

onMounted(() => {
  initJSBMap();
});
</script>
