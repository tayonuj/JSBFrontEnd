<template>
  <PublicShell>
    <div class="page-placeholder">
      <section class="placeholder-stage jsb-panel">
        <div class="placeholder-stage__copy">
          <p class="placeholder-eyebrow">{{ projectEyebrow }}</p>
          <h1>{{ projectTitle }}</h1>
          <p class="placeholder-lead">
            This project page is currently pending. We are preparing the final content,
            visual summaries, and supporting project details before it goes live.
          </p>

          <div class="placeholder-status">
            <span class="placeholder-status__dot"></span>
            <span>Project page pending</span>
          </div>

          <div class="placeholder-pill-row">
            <span class="placeholder-pill">
              <i class="bi bi-clock-history"></i>
              <span>Content in progress</span>
            </span>
            <span class="placeholder-pill">
              <i class="bi bi-folder2-open"></i>
              <span>Assets being organized</span>
            </span>
            <span class="placeholder-pill">
              <i class="bi bi-stars"></i>
              <span>Page reveal coming soon</span>
            </span>
          </div>
        </div>

        <aside class="placeholder-visual" aria-hidden="true">
          <div class="placeholder-visual__orb placeholder-visual__orb--one"></div>
          <div class="placeholder-visual__orb placeholder-visual__orb--two"></div>

          <div class="placeholder-card placeholder-card--main">
            <div class="placeholder-card__icon">
              <i class="bi bi-hourglass-split"></i>
            </div>
            <strong>Pending</strong>
            <span>{{ projectShortLabel }}</span>
          </div>

          <div class="placeholder-card placeholder-card--floating placeholder-card--a">
            <i class="bi bi-bar-chart-line-fill"></i>
          </div>

          <div class="placeholder-card placeholder-card--floating placeholder-card--b">
            <i class="bi bi-map-fill"></i>
          </div>

          <div class="placeholder-card placeholder-card--floating placeholder-card--c">
            <i class="bi bi-images"></i>
          </div>
        </aside>
      </section>

      <section class="placeholder-info-grid">
        <article class="jsb-panel placeholder-info-card">
          <div class="placeholder-info-card__icon">
            <i class="bi bi-tools"></i>
          </div>
          <h2>What’s happening</h2>
          <p>
            We are still assembling the project narrative, media, and dashboard blocks
            for this section.
          </p>
        </article>

        <article class="jsb-panel placeholder-info-card">
          <div class="placeholder-info-card__icon">
            <i class="bi bi-lightning-charge-fill"></i>
          </div>
          <h2>What to expect</h2>
          <p>
            Once ready, this page will include the same polished project experience used
            across the active JSB pages.
          </p>
        </article>

        <article class="jsb-panel placeholder-info-card">
          <div class="placeholder-info-card__icon">
            <i class="bi bi-bell-fill"></i>
          </div>
          <h2>Status now</h2>
          <p>
            {{ projectShortLabel }} is marked as pending while the final content is being prepared.
          </p>
        </article>
      </section>
    </div>
  </PublicShell>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import PublicShell from "./PublicShell.vue";

const route = useRoute();

const projectNumber = computed(() => {
  if (route.path === "/climate/project/1") return "1";
  if (route.path === "/climate/project/2") return "2";
  if (route.path === "/project5") return "5";
  return "";
});

const projectEyebrow = computed(() =>
  projectNumber.value ? `Climate Project ${projectNumber.value}` : "Project Page"
);

const projectTitle = computed(() =>
  projectNumber.value
    ? `Climate Project ${projectNumber.value} is pending`
    : "This project page is pending"
);

const projectShortLabel = computed(() =>
  projectNumber.value ? `Project ${projectNumber.value}` : "This project"
);
</script>

<style scoped>
.page-placeholder {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  min-width: 0;
}

.placeholder-stage {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
  gap: 1.5rem;
  align-items: center;
  overflow: hidden;
  padding: clamp(1.5rem, 3vw, 2.5rem);
  background:
    radial-gradient(circle at top left, rgba(42, 123, 243, 0.16), transparent 26%),
    radial-gradient(circle at bottom right, rgba(27, 84, 197, 0.12), transparent 30%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.99) 0%, rgba(243, 247, 252, 0.98) 100%);
}

.placeholder-stage__copy {
  position: relative;
  z-index: 1;
}

.placeholder-eyebrow {
  margin: 0 0 0.8rem;
  font-size: 0.8rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-weight: 700;
  color: #1c63d6;
}

.placeholder-stage h1 {
  margin: 0;
  color: #12233f;
  font-size: clamp(2rem, 4vw, 3.4rem);
  line-height: 0.95;
  letter-spacing: -0.05em;
}

.placeholder-lead {
  margin: 1rem 0 0;
  max-width: 42rem;
  color: #5f6f8a;
  font-size: 1rem;
  line-height: 1.8;
}

.placeholder-status {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  margin-top: 1.25rem;
  padding: 0.7rem 1rem;
  border-radius: 999px;
  background: rgba(28, 99, 214, 0.08);
  color: #0d4a96;
  font-weight: 700;
}

.placeholder-status__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #1c63d6;
  box-shadow: 0 0 0 rgba(28, 99, 214, 0.4);
  animation: pulse-dot 1.8s ease-in-out infinite;
}

.placeholder-pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1.35rem;
}

.placeholder-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.75rem 1rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(42, 123, 243, 0.12);
  color: #163051;
  font-size: 0.88rem;
  font-weight: 600;
  box-shadow: 0 12px 28px rgba(16, 24, 40, 0.06);
}

.placeholder-pill i {
  color: #1c63d6;
}

.placeholder-visual {
  position: relative;
  min-height: 320px;
}

.placeholder-visual__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(2px);
}

.placeholder-visual__orb--one {
  top: 10%;
  right: 10%;
  width: 180px;
  height: 180px;
  background: radial-gradient(circle, rgba(42, 123, 243, 0.2) 0%, transparent 72%);
  animation: float-orb 5.5s ease-in-out infinite;
}

.placeholder-visual__orb--two {
  bottom: 6%;
  left: 8%;
  width: 130px;
  height: 130px;
  background: radial-gradient(circle, rgba(16, 149, 140, 0.16) 0%, transparent 70%);
  animation: float-orb 6.4s ease-in-out infinite reverse;
}

.placeholder-card {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(16, 24, 40, 0.08);
  box-shadow: 0 18px 38px rgba(16, 24, 40, 0.12);
}

.placeholder-card--main {
  inset: 3rem 3rem 3rem 3rem;
  flex-direction: column;
  gap: 0.85rem;
  text-align: center;
  backdrop-filter: blur(8px);
}

.placeholder-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 78px;
  height: 78px;
  border-radius: 22px;
  background: linear-gradient(180deg, #2a7bf3 0%, #1a55c5 100%);
  color: #fff;
  font-size: 2rem;
  animation: card-bob 3.4s ease-in-out infinite;
}

.placeholder-card--main strong {
  color: #12233f;
  font-size: 2rem;
  line-height: 1;
}

.placeholder-card--main span {
  color: #5f6f8a;
  font-size: 1rem;
  font-weight: 600;
}

.placeholder-card--floating {
  width: 64px;
  height: 64px;
  color: #1c63d6;
  font-size: 1.4rem;
  backdrop-filter: blur(8px);
}

.placeholder-card--a {
  top: 2rem;
  left: 1rem;
  animation: float-card 4.2s ease-in-out infinite;
}

.placeholder-card--b {
  top: 1.5rem;
  right: 1rem;
  animation: float-card 4.8s ease-in-out infinite;
}

.placeholder-card--c {
  right: 2.5rem;
  bottom: 1rem;
  animation: float-card 5.2s ease-in-out infinite;
}

.placeholder-info-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.placeholder-info-card {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 1.5rem;
}

.placeholder-info-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: rgba(28, 99, 214, 0.08);
  color: #1c63d6;
  font-size: 1.25rem;
}

.placeholder-info-card h2 {
  margin: 0;
  color: #12233f;
  font-size: 1.2rem;
}

.placeholder-info-card p {
  margin: 0;
  color: #5f6f8a;
  line-height: 1.75;
}

@keyframes pulse-dot {
  0%,
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(28, 99, 214, 0.4);
  }

  50% {
    transform: scale(1.12);
    box-shadow: 0 0 0 10px rgba(28, 99, 214, 0);
  }
}

@keyframes float-orb {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-12px);
  }
}

@keyframes card-bob {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

@keyframes float-card {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 1180px) {
  .placeholder-stage,
  .placeholder-info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 860px) {
  .placeholder-stage {
    padding: 1.4rem;
  }

  .placeholder-visual {
    min-height: 260px;
  }

  .placeholder-card--main {
    inset: 2rem;
  }
}
</style>
