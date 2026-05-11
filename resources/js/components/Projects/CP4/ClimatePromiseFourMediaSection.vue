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

      <div class="cp-media-tabs" role="tablist" aria-label="Media galleries">
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
              <img v-if="activeImage" :src="activeImage.src" :alt="activeImage.alt" />
            </div>
            <div class="cp-image-browser" :aria-label="`Image gallery with ${imageGallery.length} thumbnails`">
              <button
                v-for="image in imageGallery"
                :key="image.id"
                type="button"
                class="cp-thumb-card"
                :class="{ active: image.id === activeImage?.id }"
                @click="activeImageId = image.id"
              >
                <img :src="image.src" :alt="image.alt" />
              </button>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'stories'" class="cp-panel cp-stories-panel">
          <div v-if="activeStory" class="cp-story-spotlight">
            <div class="cp-story-feature">
              <div class="cp-story-visual">
                <img :src="activeStory.thumbnailUrl" :alt="activeStory.title" />
                <div class="cp-story-title-overlay">
                  <h3>{{ activeStory.title }}</h3>
                </div>
              </div>
              <div class="cp-story-copy">
                <div class="cp-story-actions">
                  <button
                    v-if="activeStory.pdfUrl"
                    @click="openPdfModal"
                    class="cp-link-btn primary"
                  >
                    Read full story
                  </button>
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
            </div>
            <div class="cp-story-browser" :aria-label="`Success stories with ${storyCards.length} items`">
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
          <p v-else class="cp-empty-state">
            There are currently no success stories available for JSB4.
          </p>
        </div>

        <div v-else class="cp-panel cp-videos-panel">
          <div v-if="activeVideo" class="cp-video-layout">
            <div class="cp-video-feature">
              <div class="cp-video-player">
                <iframe
                  :src="activeVideoEmbedUrl"
                  :title="activeVideo.title"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
            </div>

            <div class="cp-video-browser" :aria-label="`Video gallery with ${videoStories.length} items`">
              <button
                v-for="video in videoStories"
                :key="video.id"
                type="button"
                class="cp-video-list-item"
                :class="{ active: video.id === activeVideo.id }"
                @click="activeVideoId = video.id"
              >
                <img :src="video.thumbnailUrl" :alt="video.title" />
                <span>{{ video.title }}</span>
                <small>{{ video.district }}</small>
              </button>
            </div>
          </div>

          <p v-else class="cp-empty-state">
            There are currently no video updates available for JSB4. Check back later for new media highlights.
          </p>
        </div>
      </div>
    </div>

    <!-- PDF Modal -->
    <div v-if="showPdfModal && activeStory" class="cp-pdf-modal" @click.self="closePdfModal">
      <div class="cp-pdf-modal-content">
        <div class="cp-pdf-modal-header">
          <h3>{{ activeStory.title }}</h3>
          <div class="cp-pdf-actions">
            <button class="cp-pdf-close" @click="closePdfModal">&times;</button>
          </div>
        </div>
        <div class="cp-pdf-modal-body">
          <iframe :src="activeStory.pdfUrl" width="100%" height="100%" frameborder="0"></iframe>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";

type MediaTab = "images" | "stories" | "videos";

const props = defineProps<{
  activeTab?: MediaTab;
}>();

const emit = defineEmits<{
  "update:activeTab": [tab: MediaTab];
}>();

const jsb4Stories = [
  {
    id: "jsb4-story-1",
    title: "Jeyathini",
    district: "Kilinochchi",
    programme: "JSB4",
    shortSummary: "Success story of Jeyathini from Kilinochchi.",
    pdfUrl: "/stories/JSB4/Kilinochchi/Jeyathini - Killinochchi.pdf",
    thumbnailUrl: "/stories/JSB4/Kilinochchi/Images/Jeyathini - Killinochchi.png",
    videoUrl: "",
  },
  {
    id: "jsb4-story-2",
    title: "Jokeshwaren",
    district: "Kilinochchi",
    programme: "JSB4",
    shortSummary: "Success story of Jokeshwaren from Kilinochchi.",
    pdfUrl: "/stories/JSB4/Kilinochchi/Jokeshwaren - Killinochchi.pdf",
    thumbnailUrl: "/stories/JSB4/Kilinochchi/Images/Jokeshwaren - Killinochchi.png",
    videoUrl: "",
  },
  {
    id: "jsb4-story-3",
    title: "Mallikathevi",
    district: "Kilinochchi",
    programme: "JSB4",
    shortSummary: "Success story of Mallikathevi from Kilinochchi.",
    pdfUrl: "/stories/JSB4/Kilinochchi/Mallikathevi - Killinochchi.pdf",
    thumbnailUrl: "/stories/JSB4/Kilinochchi/Images/Mallikathevi - Killinochchi.png",
    videoUrl: "",
  },
  {
    id: "jsb4-story-4",
    title: "HOPE Estate",
    district: "Nuwara Eliya",
    programme: "JSB4",
    shortSummary: "Success story of HOPE Estate from Nuwara Eliya.",
    pdfUrl: "/stories/JSB4/NuwaraEliya/HOPE Estate - Nuwara Eliya.pdf",
    thumbnailUrl: "/stories/JSB4/NuwaraEliya/Images/HOPE Estate - Nuwara Eliya.png",
    videoUrl: "",
  },
  {
    id: "jsb4-story-5",
    title: "Mekala",
    district: "Nuwara Eliya",
    programme: "JSB4",
    shortSummary: "Success story of Mekala from Nuwara Eliya.",
    pdfUrl: "/stories/JSB4/NuwaraEliya/Mekala - Nuwara Eliya.pdf",
    thumbnailUrl: "/stories/JSB4/NuwaraEliya/Images/Mekala - Nuwara Eliya.png",
    videoUrl: "",
  },
  {
    id: "jsb4-story-6",
    title: "Niluka",
    district: "Nuwara Eliya",
    programme: "JSB4",
    shortSummary: "Success story of Niluka from Nuwara Eliya.",
    pdfUrl: "/stories/JSB4/NuwaraEliya/Niluka- Nuwara Eliya.pdf",
    thumbnailUrl: "/stories/JSB4/NuwaraEliya/Images/Niluka - Nuwara Eliya.png.png",
    videoUrl: "",
  },
  {
    id: "jsb4-story-7",
    title: "Puvuneshuary",
    district: "Nuwara Eliya",
    programme: "JSB4",
    shortSummary: "Success story of Puvuneshuary from Nuwara Eliya.",
    pdfUrl: "/stories/JSB4/NuwaraEliya/Puvuneshuary - Nuwara Eliya.pdf",
    thumbnailUrl: "/stories/JSB4/NuwaraEliya/Images/Puvuneshuary - Nuwara Eliya.png",
    videoUrl: "",
  }
];

const storyCards = computed(() => jsb4Stories.filter((story) => story.pdfUrl || story.videoUrl));

const jsb4ImageFiles = [
  "1.png",
  "2.png",
  "3.png",
  "4.png",
  "5.png",
  "6.png",
  "7.png",
  "8.png",
  "9.png",
];

const imageGallery = jsb4ImageFiles.map((fileName, index) => ({
  id: `jsb4-img-${index + 1}`,
  src: `/images/JSB4/${fileName}`,
  alt: `JSB4 field image ${index + 1}`,
  title: `Community field moment ${String(index + 1).padStart(2, "0")}`,
  description: "Project activity from the JSB4 field image collection.",
}));

const createYoutubeEmbedUrl = (url: string, options?: { autoplay?: boolean }) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^?&]+)/);
  const videoId = match?.[1] ?? "";

  if (!videoId) return url;

  const params = new URLSearchParams({
    playsinline: "1",
    rel: "0",
    autoplay: options?.autoplay ? "1" : "0",
    mute: "0",
  });

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
};

const createYoutubeThumbnail = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^?&]+)/);
  const videoId = match?.[1] ?? "";
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
};

const jsb4Videos = [
  {
    url: "https://youtu.be/KRFtV73kbdA",
    title: "JSB 4 Solar Irrigation for Commercial Farming 1",
  },
  {
    url: "https://youtu.be/6x-M5oKVEz0",
    title: "JSB 4 Livelihood support for Estate Communities",
  },
  {
    url: "https://youtu.be/QIXcAf_rbsU",
    title: "JSB 4 Solar Irrigation for Commercial Farming 2",
  },
  {
    url: "https://youtu.be/Yujr6rBdXhk",
    title: "JSB 4 Rooftop Solar support for MSME",
  },
  {
    url: "https://youtu.be/coIsFlbz4sU",
    title: "JSB 4 Clean Energy for Resilient Livelihoods 1",
  },
  {
    url: "https://youtu.be/T4IYNwBe32s",
    title: "JSB 4 Building Food Security through Climate Resilient Agriculture 1",
  },
  {
    url: "https://youtu.be/-6sBdVs27FE",
    title: "JSB 4 Clean Energy for Resilient Livelihoods 2",
  },
  {
    url: "https://youtu.be/XKfWnyXWel4",
    title: "JSB 4 Building Food Security through Climate Resilient Agriculture 2",
  },
];

const videoStories = jsb4Videos.map((video, index) => ({
  id: `jsb4-video-${index + 1}`,
  title: video.title,
  district: "Climate Promise Project",
  programme: "JSB4",
  shortSummary: "Field video from the Climate Promise project.",
  longSummary: "Field video from the Climate Promise project.",
  videoUrl: createYoutubeEmbedUrl(video.url),
  youtubeUrl: video.url,
  thumbnailUrl: createYoutubeThumbnail(video.url),
}));

const tabs = computed(() => [
  { id: "images", label: "Image gallery", count: String(imageGallery.length).padStart(2, "0") },
  { id: "stories", label: "Success stories", count: String(storyCards.value.length).padStart(2, "0") },
  { id: "videos", label: "Video gallery", count: String(videoStories.length).padStart(2, "0") },
]);

const activeTab = ref<MediaTab>(props.activeTab ?? "images");

const activeImageId = ref(imageGallery[0]?.id ?? "");
const activeStoryId = ref(storyCards.value[0]?.id ?? "");
const activeVideoId = ref(videoStories[0]?.id ?? "");

const activeImage = computed(
  () => imageGallery.find((image) => image.id === activeImageId.value) || imageGallery[0] || null
);
const activeStory = computed(
  () => storyCards.value.find((story) => story.id === activeStoryId.value) || storyCards.value[0] || null
);
const activeVideo = computed(
  () => videoStories.find((story) => story.id === activeVideoId.value) || videoStories[0] || null
);
const activeVideoEmbedUrl = computed(() =>
  activeVideo.value
    ? createYoutubeEmbedUrl(activeVideo.value.youtubeUrl, {
        autoplay: activeTab.value === "videos",
      })
    : ""
);

const sectionRef = ref<HTMLElement | null>(null);

const showPdfModal = ref(false);

const openPdfModal = () => {
  showPdfModal.value = true;
  document.body.style.overflow = "hidden";
};

const closePdfModal = () => {
  showPdfModal.value = false;
  document.body.style.overflow = "";
};

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
  color: #1f7a3f;
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
  background: linear-gradient(135deg, #2ea44f 0%, #1f7a3f 100%);
  color: #ffffff;
  border-color: transparent;
  box-shadow: 0 10px 20px rgba(31, 122, 63, 0.22);
}

.cp-media-tab.active small {
  color: rgba(255, 255, 255, 0.75);
}

.cp-media-tab:not(.active):hover {
  transform: translateY(-1px);
  border-color: rgba(31, 122, 63, 0.22);
  color: #1f7a3f;
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
  min-height: 380px;
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

.cp-image-browser,
.cp-story-copy,
.cp-video-copy {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.85rem;
}

.cp-story-copy h3,
.cp-video-copy h3 {
  margin: 0;
  font-size: 1.6rem;
  color: #12233f;
}

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

.cp-image-browser {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
}

.cp-story-feature {
  display: grid;
  grid-template-rows: minmax(220px, 1fr) auto;
  height: 600px;
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 248, 252, 0.98) 100%);
  border: 1px solid rgba(16, 24, 40, 0.06);
}

.cp-video-feature {
  display: grid;
  grid-template-rows: minmax(220px, 1fr) auto;
  height: 600px;
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(245, 248, 252, 0.98) 100%);
  border: 1px solid rgba(16, 24, 40, 0.06);
}

.cp-image-browser {
  height: 600px;
  overflow-y: auto;
  padding-right: 0.35rem;
  align-content: start;
}

.cp-image-browser::-webkit-scrollbar {
  width: 8px;
}

.cp-image-browser::-webkit-scrollbar-thumb {
  background: rgba(31, 122, 63, 0.28);
  border-radius: 999px;
}

.cp-image-browser::-webkit-scrollbar-track {
  background: rgba(16, 24, 40, 0.05);
  border-radius: 999px;
}

.cp-story-browser {
  height: 600px;
  overflow-y: auto;
  padding-right: 0.35rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.9rem;
  align-content: start;
}

.cp-story-browser::-webkit-scrollbar {
  width: 8px;
}

.cp-story-browser::-webkit-scrollbar-thumb {
  background: rgba(31, 122, 63, 0.28);
  border-radius: 999px;
}

.cp-story-browser::-webkit-scrollbar-track {
  background: rgba(16, 24, 40, 0.05);
  border-radius: 999px;
}

.cp-video-browser {
  height: 600px;
  overflow-y: auto;
  padding-right: 0.35rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.9rem;
  align-content: start;
}

.cp-video-browser::-webkit-scrollbar {
  width: 8px;
}

.cp-video-browser::-webkit-scrollbar-thumb {
  background: rgba(31, 122, 63, 0.28);
  border-radius: 999px;
}

.cp-video-browser::-webkit-scrollbar-track {
  background: rgba(16, 24, 40, 0.05);
  border-radius: 999px;
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
  border-color: rgba(31, 122, 63, 0.26);
  box-shadow: 0 10px 24px rgba(16, 24, 40, 0.08);
}

.cp-thumb-card img,
.cp-story-card img {
  width: 100%;
  height: 104px;
  object-fit: cover;
  border-radius: 14px;
  display: block;
}

.cp-story-feature .cp-story-visual {
  min-height: 0;
  border-radius: 0;
  border: 0;
  position: relative;
}

.cp-story-title-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem 1.5rem 1rem;
  background: linear-gradient(to top, rgba(18, 35, 63, 0.9) 0%, rgba(18, 35, 63, 0) 100%);
  display: flex;
  align-items: flex-end;
}

.cp-story-title-overlay h3 {
  margin: 0;
  color: #ffffff;
  font-size: 1.6rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.cp-story-feature .cp-story-copy {
  padding: 1.1rem 1.1rem 1.2rem;
  gap: 0.95rem;
}

.cp-video-feature .cp-video-player {
  min-height: 0;
  border-radius: 0;
  border: 0;
}

.cp-video-feature .cp-video-copy {
  padding: 1.1rem 1.1rem 1.2rem;
  gap: 0.95rem;
}

.cp-story-browser .cp-story-card {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  grid-template-areas:
    "image title"
    "image district";
  gap: 0.2rem 0.85rem;
  align-items: center;
}

.cp-story-browser .cp-story-card img {
  grid-area: image;
  width: 96px;
  height: 82px;
  margin: 0;
}

.cp-story-browser .cp-story-card strong {
  grid-area: title;
  align-self: end;
}

.cp-story-browser .cp-story-card span {
  grid-area: district;
  align-self: start;
}

.cp-video-browser .cp-video-list-item {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  grid-template-areas:
    "image title"
    "image district";
  gap: 0.2rem 0.85rem;
  align-items: center;
}

.cp-video-browser .cp-video-list-item img {
  grid-area: image;
  width: 96px;
  height: 82px;
  object-fit: cover;
  border-radius: 14px;
  display: block;
}

.cp-video-browser .cp-video-list-item span {
  grid-area: title;
  align-self: end;
}

.cp-video-browser .cp-video-list-item small {
  grid-area: district;
  align-self: start;
}

.cp-story-card strong,
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
  cursor: pointer;
}

.cp-link-btn.primary {
  background: linear-gradient(135deg, #2ea44f 0%, #1f7a3f 100%);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 10px 20px rgba(31, 122, 63, 0.22);
}

.cp-video-player iframe {
  width: 100%;
  height: 100%;
  min-height: 340px;
  border: 0;
}

.cp-empty-state {
  margin: 0;
  color: #62708a;
}

.cp-pdf-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(16, 24, 40, 0.7);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.cp-pdf-modal-content {
  background: #fff;
  width: 100%;
  max-width: 1000px;
  height: 90vh;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.cp-pdf-modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fbfdff;
}

.cp-pdf-modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #12233f;
}

.cp-pdf-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.cp-pdf-close {
  background: none;
  border: none;
  font-size: 2rem;
  line-height: 1;
  color: #62708a;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.cp-pdf-close:hover {
  color: #12233f;
}

.cp-pdf-modal-body {
  flex: 1;
  background: #f5f8fc;
  position: relative;
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

  .cp-image-browser {
    height: auto;
    grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
    padding-right: 0;
  }

  .cp-story-feature,
  .cp-story-browser,
  .cp-video-feature,
  .cp-video-browser {
    height: auto;
  }

  .cp-story-browser,
  .cp-video-browser {
    padding-right: 0;
  }
}

@media (max-width: 768px) {
  .cp-pdf-modal {
    padding: 1rem;
  }

  .cp-pdf-modal-content {
    height: 95vh;
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
