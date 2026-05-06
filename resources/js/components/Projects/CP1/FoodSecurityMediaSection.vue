<template>
  <section ref="sectionRef" class="cp-media">
    <div class="cp-media-inner">
      <div class="cp-media-header">
        <div>
          <span class="cp-media-kicker">Project Gallery</span>
          <h2>Field stories, visuals, and media highlights</h2>
<!--          <p>-->
<!--            Explore the same project content through image galleries, beneficiary-->
<!--            stories, and embedded video updates.-->
<!--          </p>-->
        </div>
      </div>

      <div class="cp-media-tabs" role="tablist" aria-label="Food security media galleries">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          class="cp-media-tab"
          :class="{ active: activeTab === tab.id }"
          :aria-selected="activeTab === tab.id"
          @click="activeTab = tab.id"
        >
          <span>{{ tab.label }}</span>
          <small>{{ tab.count }}</small>
        </button>
      </div>

      <div class="cp-media-shell">
        <div v-if="activeTab === 'images'" class="cp-panel cp-images-panel">
          <div class="cp-image-hero">
            <div class="cp-image-frame">
              <img :src="activeImage.src" :alt="activeImage.alt" />
            </div>
            <div class="cp-image-copy">
              <span class="cp-panel-label">Image Gallery</span>
              <h3>{{ activeImage.title }}</h3>
              <p>{{ activeImage.description }}</p>
              <div class="cp-meta-row">
                <span>{{ imageGallery.length }} field images</span>
                <span>JSB4 collection</span>
              </div>
            </div>
          </div>

          <div class="cp-thumb-grid">
            <button
              v-for="image in imageGallery"
              :key="image.id"
              type="button"
              class="cp-thumb-card"
              :class="{ active: image.id === activeImage.id }"
              @click="activeImageId = image.id"
            >
              <img :src="image.src" :alt="image.alt" />
              <span>{{ image.title }}</span>
            </button>
          </div>
        </div>

        <div v-else-if="activeTab === 'stories'" class="cp-panel cp-stories-panel">
          <div class="cp-story-spotlight">
            <div class="cp-story-copy">
              <span class="cp-panel-label">Success Stories Gallery</span>
              <h3>{{ activeStory.title }}</h3>
              <p>{{ activeStory.longSummary || activeStory.shortSummary }}</p>

              <div class="cp-story-tags">
                <span class="cp-story-chip">{{ activeStory.district }}</span>
                <span v-if="activeStory.programme" class="cp-story-chip">
                  {{ activeStory.programme }}
                </span>
              </div>

              <div class="cp-story-actions">
                <a
                  v-if="activeStory.pdfUrl"
                  :href="activeStory.pdfUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="cp-link-btn primary"
                >
                  Read full story
                </a>
                <a
                  v-if="activeStory.videoUrl"
                  :href="activeStory.videoUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="cp-link-btn"
                >
                  Watch video
                </a>
              </div>
            </div>

            <div class="cp-story-visual">
              <img :src="activeStory.thumbnailUrl" :alt="activeStory.title" />
            </div>
          </div>

          <div class="cp-story-gallery">
            <button
              v-for="story in storyCards"
              :key="story.id"
              type="button"
              class="cp-story-card"
              :class="{ active: story.id === activeStory.id }"
              @click="activeStoryId = story.id"
            >
              <img :src="story.thumbnailUrl" :alt="story.title" />
              <strong>{{ story.title }}</strong>
              <span>{{ story.district }}</span>
            </button>
          </div>
        </div>

        <div v-else class="cp-panel cp-videos-panel">
          <div v-if="activeVideo" class="cp-video-layout">
            <div class="cp-video-player">
              <iframe
                :src="activeVideo.videoUrl"
                :title="activeVideo.title"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>

            <div class="cp-video-copy">
              <span class="cp-panel-label">Video Gallery</span>
              <h3>{{ activeVideo.title }}</h3>
              <p>{{ activeVideo.longSummary || activeVideo.shortSummary }}</p>

              <div class="cp-meta-row">
                <span>{{ activeVideo.district }}</span>
                <span>{{ activeVideo.programme }}</span>
              </div>

              <div class="cp-video-list">
                <button
                  v-for="video in videoStories"
                  :key="video.id"
                  type="button"
                  class="cp-video-list-item"
                  :class="{ active: video.id === activeVideo.id }"
                  @click="activeVideoId = video.id"
                >
                  <span>{{ video.title }}</span>
                  <small>{{ video.district }}</small>
                </button>
              </div>
            </div>
          </div>

          <p v-else class="cp-empty-state">
            Video stories will appear here as they are added to the shared blog dataset.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { getJsbStories } from "../../../data/jsbStories";

type MediaTab = "images" | "stories" | "videos";

const props = defineProps<{
  activeTab?: MediaTab;
}>();

const emit = defineEmits<{
  "update:activeTab": [tab: MediaTab];
}>();

const stories = getJsbStories();
const videoStories = computed(() => stories.filter((story) => story.videoUrl));
const storyCards = computed(() => stories.filter((story) => story.pdfUrl || story.videoUrl));

const tabs = computed(() => [
  { id: "images", label: "Image gallery", count: String(imageGallery.length).padStart(2, "0") },
  { id: "stories", label: "Success stories", count: String(storyCards.value.length).padStart(2, "0") },
  { id: "videos", label: "Video gallery", count: String(videoStories.value.length).padStart(2, "0") },
]);

const activeTab = ref<MediaTab>(props.activeTab ?? "images");

const imageGallery = [
  {
    id: "jsb4-1",
    src: "/images/jsb4/1.png",
    alt: "Food Security field image 1",
    title: "Community field moment 01",
    description: "Project activity captured from the JSB4 image set and positioned here as the first visual story frame.",
  },
  {
    id: "jsb4-2",
    src: "/images/jsb4/2.png",
    alt: "Food Security field image 2",
    title: "Community field moment 02",
    description: "A supporting project image that adds more lived context after the map and data section.",
  },
  {
    id: "jsb4-3",
    src: "/images/jsb4/3.png",
    alt: "Food Security field image 3",
    title: "Community field moment 03",
    description: "Field-facing documentation from the JSB4 collection to keep the page grounded in real activity.",
  },
  {
    id: "jsb4-4",
    src: "/images/jsb4/4.png",
    alt: "Food Security field image 4",
    title: "Community field moment 04",
    description: "A gallery frame that helps visitors connect charts and boundaries with people on the ground.",
  },
  {
    id: "jsb4-5",
    src: "/images/jsb4/5.png",
    alt: "Food Security field image 5",
    title: "Community field moment 05",
    description: "One of the project visuals used to broaden the field-story presentation on the Food Security page.",
  },
  {
    id: "jsb4-6",
    src: "/images/jsb4/6.png",
    alt: "Food Security field image 6",
    title: "Community field moment 06",
    description: "A supporting frame from the JSB4 image folder to create a richer and more trustworthy close to the page.",
  },
  {
    id: "jsb4-7",
    src: "/images/jsb4/7.png",
    alt: "Food Security field image 7",
    title: "Community field moment 07",
    description: "The final image in the set, rounding out the gallery with consistent project coverage.",
  },
];

const activeImageId = ref(imageGallery[0]?.id ?? "");
const activeStoryId = ref(storyCards.value[0]?.id ?? "");
const activeVideoId = ref(videoStories.value[0]?.id ?? "");

const activeImage = computed(
  () => imageGallery.find((image) => image.id === activeImageId.value) || imageGallery[0]
);
const activeStory = computed(
  () => storyCards.value.find((story) => story.id === activeStoryId.value) || storyCards.value[0]
);
const activeVideo = computed(
  () => videoStories.value.find((story) => story.id === activeVideoId.value) || videoStories.value[0] || null
);

const sectionRef = ref<HTMLElement | null>(null);

watch(
  () => props.activeTab,
  (value) => {
    if (value && value !== activeTab.value) {
      activeTab.value = value;
    }
  }
);

watch(activeTab, (value) => {
  emit("update:activeTab", value);
});

const scrollToSection = () => {
  sectionRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
};

defineExpose({
  scrollToSection,
});
</script>

<style scoped>
.cp-media {
  padding: 0.5rem 0 3rem;
  scroll-margin-top: 2rem;
}

.cp-media-inner {
  width: 100%;
  padding: 1.5rem;
  border-radius: 24px;
  border: 1px solid rgba(16, 24, 40, 0.06);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(246, 249, 253, 0.98) 100%);
  box-shadow: 0 10px 32px rgba(16, 24, 40, 0.06);
}

.cp-media-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.cp-media-header h2 {
  margin: 0.45rem 0 0;
  font-size: clamp(1.8rem, 3vw, 2.35rem);
  line-height: 1.02;
  letter-spacing: -0.04em;
  color: #12233f;
}

.cp-media-header p {
  margin: 0.75rem 0 0;
  max-width: 42rem;
  color: #62708a;
  line-height: 1.65;
}

.cp-media-kicker,
.cp-panel-label {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #1c63d6;
}

.cp-media-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.cp-media-tab {
  border: 1px solid rgba(16, 24, 40, 0.08);
  background: linear-gradient(180deg, #fbfdff 0%, #f2f7fd 100%);
  color: #51607b;
  border-radius: 999px;
  padding: 0.85rem 1.05rem;
  min-width: 168px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95);
  transition: border-color 0.2s ease, color 0.2s ease, transform 0.2s ease,
    box-shadow 0.2s ease, background 0.2s ease;
}

.cp-media-tab small {
  color: #7b879b;
}

.cp-media-tab.active {
  background: linear-gradient(135deg, #2c7ef3 0%, #1958c5 100%);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 10px 20px rgba(37, 100, 214, 0.22);
}

.cp-media-tab.active small {
  color: rgba(255, 255, 255, 0.75);
}

.cp-media-tab:hover {
  transform: translateY(-1px);
  border-color: rgba(31, 111, 229, 0.22);
  color: #1f6fe5;
}

.cp-panel {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 248, 252, 0.98) 100%);
  border: 1px solid rgba(16, 24, 40, 0.06);
  border-radius: 22px;
  padding: 1.5rem;
  box-shadow: 0 10px 32px rgba(16, 24, 40, 0.05);
}

.cp-image-hero,
.cp-story-spotlight,
.cp-video-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(300px, 0.85fr);
  gap: 1.25rem;
  align-items: stretch;
}

.cp-image-frame,
.cp-story-visual,
.cp-video-player {
  border-radius: 20px;
  overflow: hidden;
  min-height: 340px;
  background: linear-gradient(180deg, #edf4fb 0%, #e5eef8 100%);
  border: 1px solid rgba(16, 24, 40, 0.05);
}

.cp-image-frame img,
.cp-story-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cp-image-copy,
.cp-story-copy,
.cp-video-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.85rem;
}

.cp-image-copy h3,
.cp-story-copy h3,
.cp-video-copy h3 {
  margin: 0;
  font-size: 1.6rem;
  color: #12233f;
}

.cp-image-copy p,
.cp-story-copy p,
.cp-video-copy p {
  margin: 0;
  color: #62708a;
  line-height: 1.7;
}

.cp-meta-row,
.cp-story-tags,
.cp-story-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.cp-meta-row span,
.cp-story-chip {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 0.5rem 0.8rem;
  background: linear-gradient(180deg, #fbfdff 0%, #f2f7fd 100%);
  border: 1px solid rgba(16, 24, 40, 0.08);
  color: #51607b;
  font-size: 0.9rem;
  font-weight: 600;
}

.cp-thumb-grid,
.cp-story-gallery {
  margin-top: 1.25rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 0.9rem;
}

.cp-thumb-card,
.cp-story-card,
.cp-video-list-item {
  border: 1px solid rgba(16, 24, 40, 0.08);
  background: linear-gradient(180deg, #fbfdff 0%, #f2f7fd 100%);
  border-radius: 18px;
  padding: 0.6rem;
  text-align: left;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.cp-thumb-card:hover,
.cp-story-card:hover,
.cp-video-list-item:hover,
.cp-thumb-card.active,
.cp-story-card.active,
.cp-video-list-item.active {
  transform: translateY(-2px);
  border-color: rgba(31, 111, 229, 0.26);
  box-shadow: 0 10px 24px rgba(16, 24, 40, 0.08);
}

.cp-thumb-card img,
.cp-story-card img {
  width: 100%;
  height: 104px;
  object-fit: cover;
  border-radius: 14px;
  display: block;
  margin-bottom: 0.65rem;
}

.cp-thumb-card span,
.cp-story-card strong,
.cp-story-card span {
  display: block;
}

.cp-thumb-card span,
.cp-story-card span,
.cp-video-list-item small {
  color: #62708a;
  font-size: 0.85rem;
}

.cp-story-card strong,
.cp-video-list-item span {
  color: #12233f;
  margin-bottom: 0.2rem;
}

.cp-link-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(16, 24, 40, 0.08);
  color: #51607b;
  text-decoration: none;
  font-weight: 600;
  background: linear-gradient(180deg, #fbfdff 0%, #f2f7fd 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.95);
}

.cp-link-btn.primary {
  background: linear-gradient(135deg, #2c7ef3 0%, #1958c5 100%);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 10px 20px rgba(37, 100, 214, 0.22);
}

.cp-video-player iframe {
  width: 100%;
  height: 100%;
  min-height: 340px;
  border: 0;
}

.cp-video-list {
  display: grid;
  gap: 0.75rem;
}

.cp-empty-state {
  margin: 0;
  color: #62708a;
}

@media (max-width: 991px) {
  .cp-media-inner {
    padding: 1.5rem;
  }

  .cp-image-hero,
  .cp-story-spotlight,
  .cp-video-layout {
    grid-template-columns: 1fr;
  }

  .cp-image-frame,
  .cp-story-visual,
  .cp-video-player {
    min-height: 280px;
  }
}

@media (max-width: 575px) {
  .cp-media {
    padding: 0.5rem 0 2.5rem;
  }

  .cp-media-inner {
    border-radius: 22px;
    padding: 1.1rem;
  }

  .cp-panel {
    padding: 1rem;
    border-radius: 18px;
  }

  .cp-media-tab {
    width: 100%;
  }
}
</style>
