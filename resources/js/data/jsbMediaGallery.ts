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
  "Picture1.jpg", "Picture2.jpg", "Picture2.png", "Picture3.jpg", "Picture4.jpg",
  "Picture5.jpg", "Picture6.jpg", "Picture7.jpg", "Picture8.jpg", "Picture9.jpg",
  "Picture10.jpg", "Picture11.jpg", "Picture12.jpg", "Picture13.jpg", "Picture14.jpg",
  "Picture15.jpg", "Picture16.jpg", "Picture17.jpg", "Picture18.png", "Picture19.jpg",
  "Picture20.jpg", "Picture21.jpg", "Picture22.jpg", "Picture23.jpg", "Picture24.jpg",
  "Picture25.jpg", "Picture26.jpg", "Picture27.jpg",
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
    thumbnailUrl: `/Images/JSB3/${fileName}`,
    url: `/Images/JSB3/${fileName}`,
  }));

  const cp4Images = jsb4ImageFiles.map((fileName, index) => ({
    id: `cp4-img-${index}`,
    type: "image" as MediaType,
    programme: "JSB4",
    district: "Nuwara Eliya / Kilinochchi",
    title: `JSB4 field image ${index + 1}`,
    thumbnailUrl: `/Images/JSB4/${fileName}`,
    url: `/Images/JSB4/${fileName}`,
  }));

  return [...fp1Images, ...cp3Images, ...cp4Images];
};


// --- Videos Data ---
const jsb1VideoLinks = [
  "https://youtu.be/gK-buIjic9s", "https://youtu.be/gNHsje0KURE", "https://youtu.be/EGMNGyVL88A",
  "https://youtu.be/cS5bDL_aw9Y", "https://youtu.be/ILUlQVfo0gU", "https://youtu.be/2DDWc1v6JVk",
  "https://youtu.be/zZNxMRPBk0c",
];

const jsb4VideoLinks = [
  "https://www.youtube.com/watch?v=NuD60H7tC4I"
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

  const cp4Videos = jsb4VideoLinks.map((url, index) => ({
    id: `cp4-video-${index}`,
    type: "video" as MediaType,
    programme: "JSB4",
    district: "All Districts",
    title: `Climate Promise 4 Video ${index + 1}`,
    thumbnailUrl: createYoutubeThumbnail(url),
    videoUrl: createYoutubeEmbedUrl(url),
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
