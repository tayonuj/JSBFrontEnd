<template>
  <div class="jsb-blog-page">
    <!-- HERO VIDEO (no card) -->
    <section class="hero hero-jsb">
      <div class="hero-inner hero-video-inner">
        <div class="hero-video-copy">
          <div class="hero-eyebrow">Success Stories • JSB Sri Lanka</div>
          <h1>From Small Coops to Big Dreams</h1>
          <p>
            Explore real journeys of JSB-supported poultry micro-entrepreneurs,
            read their full stories as PDFs, and watch the videos that bring
            their livelihoods to life.
          </p>

          <div class="hero-pill-row">
            <span class="hero-pill">
              <span class="pill-icon">📖</span> Stories as mini blog posts
            </span>
            <span class="hero-pill">
              <span class="pill-icon">📄</span> In-app PDF reader
            </span>
            <span class="hero-pill">
              <span class="pill-icon">🎥</span> Embedded video stories
            </span>
          </div>
        </div>

        <div class="hero-video-frame">
          <iframe
              :src="heroVideoAutoplayUrl"
              title="JSB Video Story"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
          ></iframe>
        </div>
      </div>
    </section>

    <!-- FEATURED CAROUSEL (full-width row) -->
    <section class="section section-featured mt-5">
      <div class="featured-carousel ">

        <div v-if="featuredStories.length" class="carousel">
          <!-- Blurred background image -->
          <div class="carousel-bg-image" :style="carouselBackgroundStyle"></div>

          <!-- Foreground content -->
          <div class="carousel-content">
            <div class="carousel-track">
              <article
                  class="carousel-slide"
                  v-for="(story, index) in featuredStories"
                  :key="story.id"
                  :class="{ active: index === activeSlideIndex }"
              >
                <div class="slide-header">
                  <span class="slide-district-pill">
                    📍 {{ story.district }}
                  </span>
                  <h3 class="slide-title">{{ story.title }}</h3>
                </div>
                <p class="slide-summary">
                  {{ story.shortSummary }}
                </p>

                <div class="slide-meta">
                  <span
                      class="meta-tag"
                      v-for="tag in story.tags"
                      :key="tag"
                  >
                    #{{ tag }}
                  </span>
                </div>

                <div class="slide-footer">
                  <button
                      class="btn btn-primary"
                      @click="openStory(story, 'overview')"
                  >
                    Read more
                  </button>
                  <button
                      v-if="story.pdfUrl"
                      class="btn btn-ghost"
                      @click="openStory(story, 'pdf')"
                  >
                    Open PDF
                  </button>
                  <button
                      v-if="story.videoUrl"
                      class="btn btn-ghost"
                      @click="openStory(story, 'video')"
                  >
                    Watch video
                  </button>
                </div>
              </article>
            </div>

            <!-- Carousel controls -->
            <div class="carousel-controls">
              <button class="circle-btn" @click="prevSlide">
                ‹
              </button>
              <div class="carousel-dots">
                <button
                    v-for="(story, index) in featuredStories"
                    :key="story.id"
                    class="dot"
                    :class="{ active: index === activeSlideIndex }"
                    @click="goToSlide(index)"
                ></button>
              </div>
              <button class="circle-btn" @click="nextSlide">
                ›
              </button>
            </div>
          </div>
        </div>

        <p v-else class="empty-text">No featured stories available.</p>
      </div>
    </section>

    <!-- FILTERS + GRID -->
    <section class="section section-grid">
      <div class="toolbar">
        <div class="toolbar-left">
          <h2>All Success Stories</h2>
        </div>

        <div class="toolbar-right">
          <div class="toolbar-group">
            <label>District</label>
            <select v-model="selectedDistrict">
              <option value="all">All districts</option>
              <option
                  v-for="district in distinctDistricts"
                  :key="district"
                  :value="district"
              >
                {{ district }}
              </option>
            </select>
          </div>

          <div class="toolbar-group">
            <label>Search</label>
            <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by title, district, or keywords..."
            />
          </div>
        </div>
      </div>

      <div class="story-grid">
        <article
            v-for="story in filteredStories"
            :key="story.id"
            class="story-card card"
        >
          <div class="story-thumb" v-if="story.thumbnailUrl">
            <img :src="story.thumbnailUrl" :alt="story.title" />
          </div>

          <div class="story-body">
            <div class="story-meta-top">
              <span class="meta-district">📍 {{ story.district }}</span>
              <span v-if="story.isFeatured" class="meta-featured">
                ★ Featured
              </span>
            </div>

            <h3 class="story-title">
              {{ story.title }}
            </h3>

            <p class="story-snippet">
              {{ story.shortSummary }}
            </p>

            <div class="story-tags">
              <span
                  v-for="tag in story.tags"
                  :key="tag"
                  class="tag-pill"
              >
                #{{ tag }}
              </span>
            </div>
          </div>

          <div class="story-footer">
            <button
                class="btn btn-primary"
                @click="openStory(story, 'overview')"
            >
              Read Story
            </button>
            <button
                v-if="story.pdfUrl"
                class="btn btn-ghost"
                @click="openStory(story, 'pdf')"
            >
              PDF
            </button>
            <button
                v-if="story.videoUrl"
                class="btn btn-ghost"
                @click="openStory(story, 'video')"
            >
              Video
            </button>
          </div>
        </article>

        <p v-if="!filteredStories.length" class="empty-text">
          No stories match your filters yet.
        </p>
      </div>
    </section>

    <!-- MODAL: STORY DETAIL + PDF + VIDEO -->
    <transition name="fade">
      <div
          v-if="activeStory"
          class="modal-backdrop"
          @click.self="closeStory"
      >
        <div class="modal-dialog">
          <header class="modal-header">
            <div>
              <span class="modal-district">📍 {{ activeStory.district }}</span>
              <h2>{{ activeStory.title }}</h2>
            </div>
            <button class="icon-btn" @click="closeStory">✕</button>
          </header>

          <!-- Tabs -->
          <div class="modal-tabs">
            <button
                class="tab-btn"
                :class="{ active: activeTab === 'overview' }"
                @click="activeTab = 'overview'"
            >
              Overview
            </button>
            <button
                v-if="activeStory.pdfUrl"
                class="tab-btn"
                :class="{ active: activeTab === 'pdf' }"
                @click="activeTab = 'pdf'"
            >
              PDF Story
            </button>
            <button
                v-if="activeStory.videoUrl"
                class="tab-btn"
                :class="{ active: activeTab === 'video' }"
                @click="activeTab = 'video'"
            >
              Video
            </button>
          </div>

          <!-- TAB PANELS -->
          <div class="modal-body">
            <!-- Overview -->
            <div v-if="activeTab === 'overview'" class="tab-panel">
              <p class="overview-text">
                {{ activeStory.longSummary || activeStory.shortSummary }}
              </p>

              <ul class="overview-meta-list">
                <li><strong>District:</strong> {{ activeStory.district }}</li>
                <li v-if="activeStory.beneficiaryName">
                  <strong>Beneficiary:</strong> {{ activeStory.beneficiaryName }}
                </li>
                <li v-if="activeStory.projectType">
                  <strong>Project Type:</strong> {{ activeStory.projectType }}
                </li>
              </ul>

              <div
                  v-if="activeStory.tags && activeStory.tags.length"
                  class="overview-tags"
              >
                <span
                    v-for="tag in activeStory.tags"
                    :key="tag"
                    class="tag-pill"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>

            <!-- PDF -->
            <div v-if="activeTab === 'pdf'" class="tab-panel pdf-panel">
              <div v-if="activeStory.pdfUrl" class="pdf-wrapper">
                <!-- Native browser PDF viewer (no Google Docs) -->
                <iframe
                    :src="pdfViewerSrc(activeStory.pdfUrl)"
                    class="pdf-frame"
                    title="Story PDF"
                ></iframe>
              </div>
              <p class="pdf-helper">
                If the PDF does not load, you can
                <a :href="activeStory.pdfUrl" target="_blank" rel="noopener">
                  open it in a new tab
                </a>.
              </p>
            </div>

            <!-- VIDEO -->
            <div v-if="activeTab === 'video'" class="tab-panel video-panel">
              <div v-if="activeStory.videoUrl" class="modal-video-frame">
                <iframe
                    :src="activeStory.videoUrl"
                    title="Story Video"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                ></iframe>
              </div>
            </div>
          </div>

          <footer class="modal-footer">
            <button class="btn btn-ghost" @click="closeStory">Close</button>
            <a
                v-if="activeStory.pdfUrl"
                :href="activeStory.pdfUrl"
                target="_blank"
                rel="noopener"
                class="btn btn-secondary"
            >
              Download PDF
            </a>
          </footer>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from "vue";

/**
 * Raw JSB success stories from your sheet
 */
const jsbSuccessStories = [
  // Anuradhapura (JSB-S)
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
  },
  {
    id: 3,
    title: "Asoka's Story",
    district: "Anuradhapura",
    programme: "JSB-S",
    shortDescription:
        "Asoka’s journey as a JSB-S beneficiary in Anuradhapura, highlighting enterprise growth and resilience.",
    googleDriveUrl:
        "https://drive.google.com/file/d/1JBjy1rrfWIrHg0Rkq7dZ7ob2OXZOMmMQ/view?usp=sharing",
    youtubeUrl: "",
    lat: 8.3114,
    lng: 80.4037,
  },
  {
    id: 4,
    title: "Jinal Farm's Success story",
    district: "Anuradhapura",
    programme: "JSB-S",
    shortDescription:
        "Jinal Farm’s success story under JSB-S support in Anuradhapura, focusing on improved livelihoods.",
    googleDriveUrl:
        "https://drive.google.com/file/d/14Hw0Bl8dzs762tPtLVMmR4bJSbQ2Gq0j/view?usp=sharing",
    youtubeUrl: "",
    lat: 8.3114,
    lng: 80.4037,
  },

  // Polonnaruwa (JSB)
  {
    id: 12,
    title: "Polonnaruwa-01",
    district: "Polonnaruwa",
    programme: "JSB",
    shortDescription:
        "A JSB-supported initiative in Polonnaruwa, demonstrating how targeted support strengthens local enterprises.",
    googleDriveUrl:
        "https://drive.google.com/file/d/18nY9FaHh-x7RhFAGA4iVCEYHuWD_PXSo/view?usp=sharing",
    youtubeUrl: "",
    lat: 7.9403,
    lng: 81.0188,
  },
  {
    id: 14,
    title: "Polonnaruwa-03",
    district: "Polonnaruwa",
    programme: "JSB",
    shortDescription:
        "Another JSB success story from Polonnaruwa, showing business recovery and income generation.",
    googleDriveUrl:
        "https://drive.google.com/file/d/1IC1MdnsdetW93q2j84JnbVQPDn8Oa4EC/view?usp=sharing",
    youtubeUrl: "",
    lat: 7.9403,
    lng: 81.0188,
  },

  // Trincomalee (JSB)
  {
    id: 22,
    title: "Akram farmshop story",
    district: "Trincomalee",
    programme: "JSB",
    shortDescription:
        "Akram Farmshop’s story from Trincomalee, supported by JSB to enhance farm-based livelihoods.",
    googleDriveUrl:
        "https://drive.google.com/file/d/1vbjPHTV7ENSVRwX5bihknigXNenG1AcY/view?usp=sharing",
    youtubeUrl: "",
    lat: 8.5874,
    lng: 81.2152,
  },
  {
    id: 23,
    title: "broodin centre 2",
    district: "Trincomalee",
    programme: "JSB",
    shortDescription:
        "‘broodin centre 2’ from Trincomalee, highlighting enterprise strengthening under JSB support.",
    googleDriveUrl:
        "https://drive.google.com/file/d/1v2Tvs_1nxF9FvYYoS6o59GoqGptkNml3/view?usp=sharing",
    youtubeUrl: "",
    lat: 8.5874,
    lng: 81.2152,
  },
  {
    id: 24,
    title: "broodin centre 3",
    district: "Trincomalee",
    programme: "JSB",
    shortDescription:
        "‘broodin centre 3’ in Trincomalee, another JSB-supported facility contributing to local livelihoods.",
    googleDriveUrl:
        "https://drive.google.com/file/d/1xUvSf2Eb0jqNPhZ_THEZeOw7CEYm1lm3/view?usp=sharing",
    youtubeUrl: "",
    lat: 8.5874,
    lng: 81.2152,
  },
  {
    id: 34,
    title: "The rise of Subhashini",
    district: "Trincomalee",
    programme: "JSB",
    shortDescription:
        "Subhashini’s rise as a JSB beneficiary in Trincomalee, focusing on empowerment and business growth.",
    googleDriveUrl:
        "https://drive.google.com/file/d/1-Y6PAAfPUBeaxd8Q3VVSV10ArvmYVT-p/view?usp=sharing",
    youtubeUrl: "",
    lat: 8.5874,
    lng: 81.2152,
  },

  // UNDP YouTube story (national)
  {
    id: 2,
    title: "UNDP - Success Stories - Jayaseel",
    district: "Sri Lanka (National)",
    programme: "UNDP",
    shortDescription:
        "A national-level UNDP success story video, showcasing broader impact across Sri Lanka.",
    googleDriveUrl: "",
    youtubeUrl: "https://www.youtube.com/embed/wtvuqYOy7uc",
    lat: 7.8731,
    lng: 80.7718,
  },
];

/**
 * Helpers
 */

// Convert Google Drive "view" URL -> a direct PDF-friendly URL
// Convert Google Drive "view" URL -> an embeddable PREVIEW URL
const driveToPdfUrl = (url) => {
  if (!url) return "";

  // Matches: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const match = url.match(/\/d\/([^/]+)\//);
  const fileId = match ? match[1] : null;
  if (!fileId) return url; // fallback if pattern doesn't match

  // Use Google Drive preview endpoint (good for iframe)
  return `https://drive.google.com/file/d/${fileId}/preview`;
};


// Simple thumbnail chooser so we "keep images" but reuse your existing assets
const pickThumbnail = (story, index) => {
  if (story.district === "Anuradhapura") {
    return index % 2 === 0
        ? "/images/stories/sample-story-1.jpg"
        : "/images/stories/sample-story-4.jpg";
  }
  if (story.district === "Polonnaruwa") {
    return index % 2 === 0
        ? "/images/stories/sample-story-2.jpg"
        : "/images/stories/sample-story-5.jpg";
  }
  if (story.district === "Trincomalee") {
    return index % 2 === 0
        ? "/images/stories/sample-story-3.jpg"
        : "/images/stories/sample-story-4.jpg";
  }
  // National / fallback
  return "/images/stories/sample-story-1.jpg";
};

const buildTags = (story) => {
  const tags = [];
  if (story.programme) tags.push(story.programme.toLowerCase());
  if (story.district) tags.push(story.district.toLowerCase());
  tags.push("jsb-success");
  return tags;
};

/**
 * Normalized stories for the UI
 */
const stories = ref(
    jsbSuccessStories.map((s, idx) => ({
      id: s.id,
      title: s.title,
      district: s.district,
      programme: s.programme,
      shortSummary: s.shortDescription,
      longSummary: s.shortDescription, // you can replace later if you have longer text
      beneficiaryName: "", // not in sheet, keep empty for now
      projectType: "", // not in sheet
      isFeatured:
          s.programme === "UNDP" ||
          s.programme === "JSB-S" ||
          idx < 4, // simple rule: highlight national + JSB-S + first few
      tags: buildTags(s),
      thumbnailUrl: pickThumbnail(s, idx),
      pdfUrl: s.googleDriveUrl ? driveToPdfUrl(s.googleDriveUrl) : "",
      videoUrl: s.youtubeUrl || "",
    }))
);

/**
 * Hero video = first story that has a YouTube URL (UNDP – Jayaseel)
 */
const mainVideoUrl = computed(() => {
  const videoStory = stories.value.find((s) => !!s.videoUrl);
  return videoStory ? videoStory.videoUrl : "https://www.youtube.com/embed/wtvuqYOy7uc";
});

const heroVideoAutoplayUrl = computed(() => {
  const base = mainVideoUrl.value || "";
  if (!base) return "";

  // If your embed URL already has ?, append with & — otherwise start with ?
  const hasQuery = base.includes("?");
  return (
      base +
      (hasQuery ? "&" : "?") +
      "autoplay=1&mute=1&playsinline=1&rel=0"
  );
});


// Filters
const selectedDistrict = ref("all");
const searchQuery = ref("");

// Carousel state
const activeSlideIndex = ref(0);
let autoScrollTimer = null;

const featuredStories = computed(() =>
    stories.value.filter((s) => s.isFeatured)
);

const distinctDistricts = computed(() => {
  const set = new Set(stories.value.map((s) => s.district));
  return Array.from(set).sort();
});

const filteredStories = computed(() => {
  let list = [...stories.value];

  if (selectedDistrict.value !== "all") {
    list = list.filter((s) => s.district === selectedDistrict.value);
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter((s) => {
      return (
          s.title.toLowerCase().includes(q) ||
          s.district.toLowerCase().includes(q) ||
          (s.programme || "").toLowerCase().includes(q) ||
          (s.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    });
  }

  return list;
});

// Blurred background style for carousel
const carouselBackgroundStyle = computed(() => {
  const list = featuredStories.value;
  if (!list.length) return {};
  const active = list[activeSlideIndex.value] || list[0];
  if (!active.thumbnailUrl) return {};
  return {
    backgroundImage: `url('${active.thumbnailUrl}')`,
  };
});

// Carousel controls
const nextSlide = () => {
  if (!featuredStories.value.length) return;
  activeSlideIndex.value =
      (activeSlideIndex.value + 1) % featuredStories.value.length;
};

const prevSlide = () => {
  if (!featuredStories.value.length) return;
  activeSlideIndex.value =
      (activeSlideIndex.value - 1 + featuredStories.value.length) %
      featuredStories.value.length;
};

const goToSlide = (index) => {
  activeSlideIndex.value = index;
};

// Modal / active story
const activeStory = ref(null);
const activeTab = ref("overview");

const openStory = (story, tab = "overview") => {
  activeStory.value = story;
  activeTab.value = tab;
  document.body.classList.add("no-scroll");
};

const closeStory = () => {
  activeStory.value = null;
  document.body.classList.remove("no-scroll");
};

/**
 * PDF viewer:
 * Uses native browser PDF rendering by embedding the file directly.
 * For Drive files we converted the link to a raw file URL above.
 */
const pdfViewerSrc = (url) => {
  if (!url) return "";

  // If it's a Google Drive preview URL, just return as-is
  if (url.includes("drive.google.com/file/d/") && url.includes("/preview")) {
    return url;
  }

  // For normal PDFs on your own server / other hosts
  return `${url}#view=FitH&scrollbar=1&toolbar=1&navpanes=0`;
};


// Auto-scroll carousel
onMounted(() => {
  if (featuredStories.value.length > 1) {
    autoScrollTimer = setInterval(() => {
      nextSlide();
    }, 6000); // 6 seconds
  }
});

onBeforeUnmount(() => {
  if (autoScrollTimer) {
    clearInterval(autoScrollTimer);
    autoScrollTimer = null;
  }
});
</script>

