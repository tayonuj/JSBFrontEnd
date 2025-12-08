<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-content">
          <div class="eyebrow">Japanese Supplementary Budget • UNDP Sri Lanka</div>
          <h1>JSB – Climate &amp; Food Systems Support for Sri Lankans</h1>
          <p>
            The <strong>Japanese Supplementary Budget (JSB)</strong> with
            <strong>UNDP Sri Lanka</strong> strengthens resilience of
            communities through two main windows:
            <strong>Climate Promise</strong> and
            <strong>Food Security</strong>.
          </p>
          <div class="hero-actions">
            <router-link to="/climate-promise" class="btn btn-primary">
              Explore Climate Promise
            </router-link>
            <router-link to="/food-security" class="btn btn-outline">
              Explore Food Security
            </router-link>
          </div>

          <div class="hero-pills">
            <span class="hero-pill">Climate Promise projects </span>
            <span class="hero-pill">Food Security projects </span>
            <span class="hero-pill">From the People of Japan</span>
          </div>
        </div>

        <div class="hero-visual">
          <div class="hero-visual-frame">
            <img
                src="/images/hero-srilanka.jpg"
                alt="Sri Lankan communities supported by JSB"
            />
          </div>
          <div class="hero-badges">
            <span class="hero-badge">
              <span class="dot dot-green"></span>
              Climate-resilient livelihoods
            </span>
            <span class="hero-badge">
              <span class="dot dot-blue"></span>
              Food systems &amp; MSMEs supported
            </span>
            <span class="hero-badge">
              <span class="dot dot-gold"></span>
              Partnership with the People of Japan
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Impact Snapshot -->
    <section class="section impact-section">
      <div class="container">
        <div class="section-header">
          <h2>JSB Impact at a Glance</h2>
          <p>
            Illustrative figures to showcase combined reach of Climate Promise
            and Food Security windows.
          </p>
        </div>

        <div class="grid grid-4 impact-grid">
          <div class="impact-card">
            <span class="impact-number" data-target="1200">0</span>
            <span class="impact-label">Beneficiaries reached*</span>
          </div>
          <div class="impact-card">
            <span class="impact-number" data-target="8">0</span>
            <span class="impact-label">Districts covered*</span>
          </div>
          <div class="impact-card">
            <span class="impact-number" data-target="65">0</span>
            <span class="impact-label">Women-led businesses*</span>
          </div>
          <div class="impact-card">
            <span class="impact-number" data-target="40">0</span>
            <span class="impact-label">Youth enterprises*</span>
          </div>
        </div>

<!--        <p class="impact-footnote">-->
<!--          <small>-->
<!--            *These are placeholder figures. Replace with consolidated programme-->
<!--            indicators from Climate Promise and Food Security when available.-->
<!--          </small>-->
<!--        </p>-->
      </div>
    </section>

    <!-- Benefits -->
    <section id="benefits" class="section bg-soft">
      <div class="container">
        <div class="section-header">
          <h2>What JSB Delivers for Communities</h2>
          <p>
            Through the Climate Promise and Food Security windows, JSB supports
            people, enterprises and local economies across Sri Lanka.
          </p>
        </div>

        <div class="grid grid-3">
          <article class="card feature-card">
            <h3>Climate Promise Window</h3>
            <p>
              <strong>Climate Promise Project 1, Climate Promise Project 2, …</strong> focus on reducing
              climate risks, strengthening adaptation and enabling
              low-carbon, climate-resilient livelihoods.
            </p>
            <ul class="tag-list">
              <li>Climate-resilient practices</li>
              <li>Green infrastructure</li>
              <li>Low-carbon development</li>
            </ul>
          </article>

          <article class="card feature-card">
            <h3>Food Security Window</h3>
            <p>
              <strong>Food Security Project 1, Food Security Project 2, …</strong> work with farmers,
              fishers, processors and MSMEs to keep food systems functioning and
              households food secure.
            </p>
            <ul class="tag-list">
              <li>Production &amp; processing</li>
              <li>Market access</li>
              <li>Nutrition &amp; resilience</li>
            </ul>
          </article>

          <article class="card feature-card">
            <h3>Business &amp; Livelihood Support</h3>
            <p>
              Across both windows, JSB helps micro and small enterprises restart,
              grow and create dignified jobs, with a strong focus on women and
              youth.
            </p>
            <ul class="tag-list">
              <li>Grants &amp; finance</li>
              <li>Coaching &amp; skills</li>
              <li>Digital &amp; market access</li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <!-- Parallax strip -->
    <section class="parallax-section">
      <div class="parallax-bg"></div>
      <div class="parallax-overlay"></div>
      <div class="parallax-content container">
        <h2>Lives Behind the JSB Windows</h2>
        <p>
          Each Climate Promise and Food Security intervention represents a
          real farmer, MSME, youth group or household whose future is more
          secure because of JSB support.
        </p>
        <router-link to="/jsb" class="btn btn-primary">
          Explore JSB Map &amp; Stories
        </router-link>
      </div>
    </section>

    <!-- Map preview -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2>Where JSB Works</h2>
          <p>
            The JSB platform maps interventions and success stories across
            Climate Promise and Food Security projects.
          </p>
        </div>

        <div class="card map-preview-card">
          <div class="map-preview-visual">
            <img
                src="/images/sl-map-highlighted.jpg"
                alt="JSB districts map"
            />
          </div>
          <div class="map-preview-text">
            <h3>District Coverage</h3>
            <p>
              Current stories highlight work in districts such as
              <strong>Anuradhapura</strong>,
              <strong>Polonnaruwa</strong> and
              <strong>Trincomalee</strong>, with more locations to be added as
              projects are documented.
            </p>
            <ul>
              <li>Anuradhapura – climate-resilient agriculture &amp; MSMEs</li>
              <li>Polonnaruwa – food systems &amp; services</li>
              <li>Trincomalee – coastal livelihoods &amp; farmshops</li>
            </ul>
            <router-link to="/jsb" class="btn btn-outline btn-sm">
              Open interactive JSB map
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects Overview -->
    <section id="projects" class="section">
      <div class="container">
        <div class="section-header">
          <h2>JSB Windows on This Platform</h2>
          <p>
            This platform organizes JSB interventions into two main windows.
            Within each window you can drill down to Climate Promise 1, 2… and
            Food Security 1, 2… as they are published.
          </p>
        </div>

        <div class="grid grid-3 project-grid">
          <article class="card project-card">
            <div class="project-tag jsb-tag">Window</div>
            <div class="project-thumb">
              <img src="/images/project-climate.jpg" alt="Climate Promise" />
            </div>
            <h3>Climate Promise Window</h3>
            <p>
              Climate Promise 1, 2, … support Sri Lanka’s climate ambitions by
              working with communities, businesses and local authorities on
              adaptation and mitigation.
            </p>
            <div class="project-meta">
              <span>Climate Promise 1, 2, …</span>
              <span>Resilient communities &amp; systems</span>
            </div>
            <router-link to="/climate-promise" class="btn btn-primary btn-sm">
              View Climate Promise
            </router-link>
          </article>

          <article class="card project-card">
            <div class="project-tag jsb-tag">Window</div>
            <div class="project-thumb">
              <img src="/images/project-food.jpg" alt="Food Security" />
            </div>
            <h3>Food Security Window</h3>
            <p>
              Food Security 1, 2, … stabilise food systems, support producers
              and help vulnerable households maintain access to nutritious food.
            </p>
            <div class="project-meta">
              <span>Food Security 1, 2, …</span>
              <span>Farmers, fishers &amp; MSMEs</span>
            </div>
            <router-link to="/food-security" class="btn btn-outline btn-sm">
              View Food Security
            </router-link>
          </article>

          <article class="card project-card">
            <div class="project-tag jsb-tag">Platform</div>
            <div class="project-thumb">
              <img src="/images/project-jsb.jpg" alt="JSB Map & Stories" />
            </div>
            <h3>JSB Map &amp; Story Hub</h3>
            <p>
              An interactive map and story hub that brings together
              beneficiaries and locations from both Climate Promise and
              Food Security projects.
            </p>
            <div class="project-meta">
              <span>Stories &amp; YouTube videos</span>
              <span>District &amp; sector filters</span>
            </div>
            <router-link to="/jsb" class="btn btn-outline btn-sm">
              Open JSB Map
            </router-link>
          </article>
        </div>
      </div>
    </section>

    <!-- Japan ribbon -->
    <section class="section japan-ribbon">
      <div class="container japan-ribbon-inner">
        <div class="japan-ribbon-flag">
          <img src="/images/japan-logo.png" alt="Japan Logo" />
        </div>
        <div class="japan-ribbon-text">
          <h3>From the People of Japan</h3>
          <p>
            The Japanese Supplementary Budget demonstrates how international
            partnerships translate into climate action and food security support
            for Sri Lankan communities.
          </p>
        </div>
        <router-link to="/jsb" class="btn btn-outline btn-sm">
          Learn more about JSB
        </router-link>
      </div>
    </section>

    <!-- Call to Action -->
    <section id="stories" class="section cta-section bg-soft">
      <div class="container cta-inner">
        <div>
          <h2>Want to highlight Climate Promise &amp; Food Security stories?</h2>
          <p>
            As new interventions are implemented, this platform can be expanded
            with additional Climate Promise 1, 2… and Food Security 1, 2…
            beneficiaries, districts and multimedia content.
          </p>
        </div>
        <router-link to="/jsb" class="btn btn-primary">
          Go to JSB Map &amp; Stories
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from "vue";

// simple port of your impact counters + parallax
const initImpactCounters = () => {
  const numbers = document.querySelectorAll<HTMLElement>(".impact-number");
  if (!numbers.length) return;

  let animated = false;

  const animate = () => {
    if (animated) return;
    const section = document.querySelector(".impact-section");
    if (!section) return;

    const rect = section.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;

    if (inView) {
      animated = true;
      numbers.forEach((el) => {
        const target = parseInt(el.dataset.target || "0", 10);
        const duration = 1200;
        const startTime = performance.now();

        const update = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const value = Math.floor(progress * target);
          el.textContent = value.toString();
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = target.toString();
        };

        requestAnimationFrame(update);
      });
    }
  };

  document.addEventListener("scroll", animate, { passive: true });
  animate();

  return () => document.removeEventListener("scroll", animate);
};

const initParallax = () => {
  const bg = document.querySelector<HTMLElement>(".parallax-bg");
  if (!bg) return;

  const onScroll = () => {
    const parent = bg.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const windowHeight =
        window.innerHeight || document.documentElement.clientHeight;

    if (rect.bottom < 0 || rect.top > windowHeight) return;

    const scrollFactor = (rect.top / windowHeight) * 30;
    bg.style.transform = `translateY(${scrollFactor}px)`;
  };

  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  return () => document.removeEventListener("scroll", onScroll);
};

let cleanupImpact: (() => void) | undefined;
let cleanupParallax: (() => void) | undefined;

onMounted(() => {
  cleanupImpact = initImpactCounters();
  cleanupParallax = initParallax();
});

onBeforeUnmount(() => {
  cleanupImpact && cleanupImpact();
  cleanupParallax && cleanupParallax();
});
</script>
