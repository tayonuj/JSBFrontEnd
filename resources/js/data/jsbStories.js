export const rawJsbSuccessStories = [
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
    thumbnailUrl: "/images/stories/1.png",
    lat: 8.3114,
    lng: 80.4037,
  },
  {
    id: 3,
    title: "Asoka's Story",
    district: "Anuradhapura",
    programme: "JSB-S",
    shortDescription:
      "Asoka's journey as a JSB-S beneficiary in Anuradhapura, highlighting enterprise growth and resilience.",
    googleDriveUrl:
      "https://drive.google.com/file/d/1JBjy1rrfWIrHg0Rkq7dZ7ob2OXZOMmMQ/view?usp=sharing",
    youtubeUrl: "",
    thumbnailUrl: "/images/stories/2.jpeg",
    lat: 8.3114,
    lng: 80.4037,
  },
  {
    id: 4,
    title: "Jinal Farm's Success story",
    district: "Anuradhapura",
    programme: "JSB-S",
    shortDescription:
      "Jinal Farm's success story under JSB-S support in Anuradhapura, focusing on improved livelihoods.",
    googleDriveUrl:
      "https://drive.google.com/file/d/14Hw0Bl8dzs762tPtLVMmR4bJSbQ2Gq0j/view?usp=sharing",
    youtubeUrl: "",
    thumbnailUrl: "/images/stories/3.png",
    lat: 8.3114,
    lng: 80.4037,
  },
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
    thumbnailUrl: "/images/stories/4.jpeg",
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
    thumbnailUrl: "/images/stories/5.jpeg",
    lat: 7.9403,
    lng: 81.0188,
  },
  {
    id: 22,
    title: "Akram farmshop story",
    district: "Trincomalee",
    programme: "JSB",
    shortDescription:
      "Akram Farmshop's story from Trincomalee, supported by JSB to enhance farm-based livelihoods.",
    googleDriveUrl:
      "https://drive.google.com/file/d/1vbjPHTV7ENSVRwX5bihknigXNenG1AcY/view?usp=sharing",
    youtubeUrl: "",
    thumbnailUrl: "/images/stories/6.png",
    lat: 8.5874,
    lng: 81.2152,
  },
  {
    id: 23,
    title: "broodin centre 2",
    district: "Trincomalee",
    programme: "JSB",
    shortDescription:
      "'broodin centre 2' from Trincomalee, highlighting enterprise strengthening under JSB support.",
    googleDriveUrl:
      "https://drive.google.com/file/d/1v2Tvs_1nxF9FvYYoS6o59GoqGptkNml3/view?usp=sharing",
    youtubeUrl: "",
    thumbnailUrl: "/images/stories/7.jpg",
    lat: 8.5874,
    lng: 81.2152,
  },
  {
    id: 24,
    title: "broodin centre 3",
    district: "Trincomalee",
    programme: "JSB",
    shortDescription:
      "'broodin centre 3' in Trincomalee, another JSB-supported facility contributing to local livelihoods.",
    googleDriveUrl:
      "https://drive.google.com/file/d/1xUvSf2Eb0jqNPhZ_THEZeOw7CEYm1lm3/view?usp=sharing",
    youtubeUrl: "",
    thumbnailUrl: "/images/stories/8.jpg",
    lat: 8.5874,
    lng: 81.2152,
  },
  {
    id: 34,
    title: "The rise of Subhashini",
    district: "Trincomalee",
    programme: "JSB",
    shortDescription:
      "Subhashini's rise as a JSB beneficiary in Trincomalee, focusing on empowerment and business growth.",
    googleDriveUrl:
      "https://drive.google.com/file/d/1-Y6PAAfPUBeaxd8Q3VVSV10ArvmYVT-p/view?usp=sharing",
    youtubeUrl: "",
    thumbnailUrl: "/images/stories/3.png",
    lat: 8.5874,
    lng: 81.2152,
  },
  {
    id: 2,
    title: "UNDP - Success Stories - Jayaseel",
    district: "Sri Lanka (National)",
    programme: "UNDP",
    shortDescription:
      "A national-level UNDP success story video, showcasing broader impact across Sri Lanka.",
    googleDriveUrl: "",
    youtubeUrl: "https://www.youtube.com/embed/wtvuqYOy7uc",
    thumbnailUrl: "/images/stories/10.jpeg",
    lat: 7.8731,
    lng: 80.7718,
  },
];

export const driveToPdfUrl = (url) => {
  if (!url) return "";
  const match = url.match(/\/d\/([^/]+)\//);
  const fileId = match ? match[1] : null;
  if (!fileId) return url;
  return `https://drive.google.com/file/d/${fileId}/preview`;
};

export const buildTags = (story) => {
  const tags = [];
  if (story.programme) tags.push(story.programme.toLowerCase());
  if (story.district) tags.push(story.district.toLowerCase());
  tags.push("jsb-success");
  return tags;
};

export const getJsbStories = () =>
  rawJsbSuccessStories.map((story, index) => ({
    id: story.id,
    title: story.title,
    district: story.district,
    programme: story.programme,
    shortSummary: story.shortDescription,
    shortDescription: story.shortDescription,
    longSummary: story.shortDescription,
    beneficiaryName: "",
    projectType: "",
    isFeatured: story.programme === "UNDP" || story.programme === "JSB-S" || index < 4,
    tags: buildTags(story),
    thumbnailUrl: story.thumbnailUrl || "",
    pdfUrl: story.googleDriveUrl ? driveToPdfUrl(story.googleDriveUrl) : "",
    googleDriveUrl: story.googleDriveUrl || "",
    videoUrl: story.youtubeUrl || "",
    youtubeUrl: story.youtubeUrl || "",
    lat: story.lat,
    lng: story.lng,
  }));
