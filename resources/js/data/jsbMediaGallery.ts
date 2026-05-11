import { getJsbStories } from "./jsbStories";

export type MediaType = "image" | "video" | "story";

export interface MediaItem {
  id: string;
  type: MediaType;
  programme: string;
  district: string;
  title: string;
  thumbnailUrl: string;
  url?: string;
  pdfUrl?: string;
  videoUrl?: string;
  description?: string;
  tags?: string[];
  isFeatured?: boolean;
}

const createYoutubeEmbedUrl = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^?&]+)/);
  const videoId = match?.[1] ?? "";
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

const createYoutubeThumbnail = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^?&]+)/);
  const videoId = match?.[1] ?? "";
  return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "";
};

// --- Images Data ---
const jsb1ImageFiles = [
  "01.a.jpg", "01.b.jpg", "01.c.jpg", "02.a.jpg", "02.b.jpg", "02.c.jpg",
  "03.a.jpg", "03.b.jpg", "03.c.jpg", "03.d.jpg", "03.e.jpg", "04.a.JPG",
  "04.b.JPG", "Akram.png", "Asoka 1.jpg", "Danushka 02.png", "Danushka 03.png",
  "Danushka 1.png", "Jeewani.png", "Jinal Farm 01.jpg", "Jinal Farm 03.jpg",
  "Jinal Farm 2.JPG", "M.A. Ramzana.png", "Nilanka.png", "Niluka 1.JPG",
  "Niluka 2.JPG", "Nimala 01.png", "Nimala 02.png", "Nurturing.png",
  "Priyalatha 1.jpg", "Priyalatha 2.jpg", "Priyalatha 3.jpg", "Razmiya.png",
  "Renuka 02.jpg", "Renuka 1.jpg", "Rizana.png", "Saumya 1.jpg",
  "Saumya 2.jpg", "Sumithra 1.jpg", "Sumithra 2.jpg", "Tharuka 1.JPG",
  "Tharuka 2.jpg", "The rise of Subhashini.png", "mahesh.png", "mangalika.png"
];

const jsb3ImageFiles = [
  "JSB3_4.jpg", "jsb3_1.jpg", "JSB3_2.jpg", "JSB3_3.jpg",
  "JSB_3_6.jpg", "JSB3_8.jpg", "JSB3_9.jpg", "JSB3_10.jpg"
];

const jsb4ImageFiles = [
  "1.png", "2.png", "3.png", "4.png", "5.png",
  "6.png", "7.png", "8.png", "9.png",
];

export const getAllImages = (): MediaItem[] => {
  const fp1Images = jsb1ImageFiles.map((fileName, index) => ({
    id: `fp1-img-${index}`,
    type: "image" as MediaType,
    programme: "JSB1",
    district: "All Districts", // Fallback, since JSB1 images aren't district-specific
    title: `Food Security field image ${index + 1}`,
    thumbnailUrl: `/images/JSB1/${fileName}`,
    url: `/images/JSB1/${fileName}`,
  }));

  const cp3Images = jsb3ImageFiles.map((fileName, index) => ({
    id: `cp3-img-${index}`,
    type: "image" as MediaType,
    programme: "JSB3",
    district: "Mullaitivu",
    title: `JSB3 field image ${index + 1}`,
    thumbnailUrl: `/images/JSB3/${fileName}`,
    url: `/images/JSB3/${fileName}`,
  }));

  const cp4Images = jsb4ImageFiles.map((fileName, index) => ({
    id: `cp4-img-${index}`,
    type: "image" as MediaType,
    programme: "JSB4",
    district: "Nuwara Eliya / Kilinochchi",
    title: `JSB4 field image ${index + 1}`,
    thumbnailUrl: `/images/JSB4/${fileName}`,
    url: `/images/JSB4/${fileName}`,
  }));

  return [...fp1Images, ...cp3Images, ...cp4Images];
};


// --- Videos Data ---
const jsb1VideoLinks = [
  "https://youtu.be/gK-buIjic9s", "https://youtu.be/gNHsje0KURE", "https://youtu.be/EGMNGyVL88A",
  "https://youtu.be/cS5bDL_aw9Y", "https://youtu.be/ILUlQVfo0gU", "https://youtu.be/2DDWc1v6JVk",
  "https://youtu.be/zZNxMRPBk0c",
];

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

export const getAllVideos = (): MediaItem[] => {
  const fp1Videos = jsb1VideoLinks.map((url, index) => ({
    id: `fp1-video-${index}`,
    type: "video" as MediaType,
    programme: "JSB1",
    district: "All Districts",
    title: `Food Security Video ${index + 1}`,
    thumbnailUrl: createYoutubeThumbnail(url),
    videoUrl: createYoutubeEmbedUrl(url),
  }));

  const cp4Videos = jsb4Videos.map((video, index) => ({
    id: `cp4-video-${index}`,
    type: "video" as MediaType,
    programme: "JSB4",
    district: "All Districts",
    title: video.title,
    thumbnailUrl: createYoutubeThumbnail(video.url),
    videoUrl: createYoutubeEmbedUrl(video.url),
  }));

  return [...fp1Videos, ...cp4Videos];
};


// --- Stories Data ---
export const getAllStories = (): MediaItem[] => {
  return getJsbStories().map((s) => ({
    id: `story-${s.id}`,
    type: "story" as MediaType,
    programme: s.programme === "JSB-S" ? "JSB1" : (s.programme === "JSB" ? "JSB1" : s.programme), // Normalize old tags to JSB1
    district: s.district,
    title: s.title,
    thumbnailUrl: s.thumbnailUrl,
    pdfUrl: s.pdfUrl,
    videoUrl: s.videoUrl,
    description: s.shortSummary,
    tags: s.tags,
    isFeatured: s.isFeatured
  }));
};

// --- Unified Data ---
export const getAllMedia = (): MediaItem[] => {
  return [...getAllImages(), ...getAllVideos(), ...getAllStories()];
};
