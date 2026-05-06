<template>
  <PublicShell>
    <div class="contact-page">
      <section class="contact-hero">
        <div class="contact-orb contact-orb-a"></div>
        <div class="contact-orb contact-orb-b"></div>

        <div class="contact-shell">
          <div class="contact-hero-inner">
            <div class="hero-copy">
              <div class="contact-card contact-info-card">
                <div class="card-heading">
                  <p class="card-eyebrow">Coordination points</p>
                  <h2 class="card-title">Contact Information</h2>
                  <p class="card-copy">
                    Reach the UNDP Sri Lanka team through the official office contact points below.
                  </p>
                </div>

                <div class="info-grid">
                  <div class="info-row info-row-wide">
                    <span class="info-icon"><i class="bi bi-geo-alt-fill"></i></span>
                    <div>
                      <strong>United Nations Development Programme in Sri Lanka</strong>
                      <p>
                        UN Compound 202-204,<br />
                        Bauddhaloka Mawatha, Colombo 7,<br />
                        Sri Lanka.
                      </p>
                    </div>
                  </div>

                  <div class="info-row">
                    <span class="info-icon"><i class="bi bi-telephone-fill"></i></span>
                    <div>
                      <strong>Tel</strong>
                      <p><a href="tel:+94112580691">+94-112-580691</a></p>
                    </div>
                  </div>

                  <div class="info-row">
                    <span class="info-icon"><i class="bi bi-printer-fill"></i></span>
                    <div>
                      <strong>Fax</strong>
                      <p>+94-112-581116; 2501396</p>
                    </div>
                  </div>

                  <div class="info-row">
                    <span class="info-icon"><i class="bi bi-envelope-fill"></i></span>
                    <div>
                      <strong>Email</strong>
                      <p><a href="mailto:socialmedia.lk@undp.org">socialmedia.lk@undp.org</a></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="hero-spotlight">
              <div class="spotlight-frame">
                <div class="contact-image-title">
                  <span class="contact-image-title__eyebrow">UNDP Sri Lanka</span>
                  <h1>CONTACT US</h1>
                </div>
                <img src="/images/undp_contact_us.jpg" alt="Contact" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </PublicShell>
</template>

<script setup>
import PublicShell from "./PublicShell.vue";
</script>

<style scoped>
.contact-page {
  --contact-text: #17233c;
  --contact-muted: #5e6f67;
  --contact-border: rgba(21, 128, 61, 0.14);
  --contact-card:
    linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(244, 250, 246, 0.98) 100%);
  --contact-accent: #15803d;
  --contact-accent-strong: #166534;
  position: relative;
  overflow: hidden;
  min-height: calc(100vh - 72px);
  color: var(--contact-text);
  font-family: "Poppins", sans-serif;
}

.contact-hero {
  position: relative;
  padding: 0.9rem 0 1rem;
  min-height: calc(100vh - 72px);
  display: flex;
  align-items: stretch;
}

.contact-shell {
  position: relative;
  z-index: 1;
  width: min(100vw - 20px, 100%);
  margin: 0 auto;
  display: flex;
}

.contact-hero-inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 0.95fr);
  gap: 0.85rem;
  align-items: stretch;
  flex: 1 1 auto;
  min-height: 100%;
  width: 100%;
}

.hero-copy,
.hero-spotlight {
  min-width: 0;
}

.contact-orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(10px);
  opacity: 0.5;
  pointer-events: none;
}

.contact-orb-a {
  width: 18rem;
  height: 18rem;
  top: 3rem;
  left: -5rem;
  background: radial-gradient(circle, rgba(21, 128, 61, 0.18) 0%, transparent 72%);
}

.contact-orb-b {
  width: 20rem;
  height: 20rem;
  top: 7rem;
  right: -6rem;
  background: radial-gradient(circle, rgba(22, 101, 52, 0.12) 0%, transparent 72%);
}

.card-eyebrow {
  display: inline-flex;
  align-items: center;
  margin-bottom: 0.85rem;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--contact-accent);
  font-weight: 700;
}

.contact-card {
  height: 100%;
  padding: 1.2rem;
  border-radius: 22px;
  border: 1px solid var(--contact-border);
  background: var(--contact-card);
  box-shadow:
    0 18px 48px rgba(16, 24, 40, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.85);
  box-sizing: border-box;
}

.card-heading {
  margin-bottom: 1rem;
}

.card-title {
  margin: 0;
  font-size: clamp(1.9rem, 3vw, 2.6rem);
  line-height: 1.02;
  letter-spacing: -0.03em;
  color: #10233e;
}

.card-copy {
  margin: 0.55rem 0 0;
  max-width: 34rem;
  color: var(--contact-muted);
  line-height: 1.6;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.7rem;
  align-items: stretch;
}

.info-row {
  display: flex;
  gap: 0.95rem;
  align-items: flex-start;
  min-width: 0;
  min-height: 100%;
  padding: 0.9rem;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(21, 128, 61, 0.12);
  box-shadow: 0 10px 28px rgba(16, 24, 40, 0.04);
}

.info-row > div {
  min-width: 0;
  flex: 1 1 auto;
}

.info-row-wide {
  grid-column: span 3;
}

.info-icon {
  flex: 0 0 auto;
  width: 2.7rem;
  height: 2.7rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  background: rgba(21, 128, 61, 0.08);
  border: 1px solid rgba(21, 128, 61, 0.14);
  color: var(--contact-accent);
}

.info-icon :deep(i) {
  font-size: 1rem;
  line-height: 1;
}

.info-row strong {
  display: block;
  margin-bottom: 0.28rem;
  color: #10233e;
  font-size: 0.98rem;
}

.info-row p,
.info-row a {
  margin: 0;
  color: var(--contact-muted);
  text-decoration: none;
  line-height: 1.7;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.info-row a:hover {
  color: var(--contact-accent);
}

.hero-spotlight {
  display: flex;
}

.spotlight-frame {
  position: relative;
  display: flex;
  width: 100%;
  min-height: 100%;
  overflow: hidden;
  border-radius: 22px;
  box-shadow: 0 28px 60px rgba(3, 18, 43, 0.2);
}

.spotlight-frame::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(7, 20, 43, 0.18) 0%, rgba(7, 20, 43, 0.5) 100%),
    linear-gradient(90deg, rgba(7, 20, 43, 0.16) 0%, rgba(7, 20, 43, 0.02) 60%);
}

.contact-image-title {
  position: absolute;
  inset: auto 1rem 1rem 1rem;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.85rem 1rem;
  width: min(78%, 26rem);
  border-radius: 18px;
  background: rgba(10, 22, 42, 0.34);
  backdrop-filter: blur(8px);
}

.contact-image-title__eyebrow {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.82);
}

.contact-image-title h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 800;
  line-height: 0.98;
  letter-spacing: 0.01em;
  color: #ffffff;
  white-space: normal;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.spotlight-frame img {
  width: 100%;
  height: 100%;
  min-height: 100%;
  object-fit: cover;
}

@media (max-width: 980px) {
  .contact-page,
  .contact-hero {
    min-height: auto;
  }

  .contact-shell {
    display: block;
  }

  .contact-hero-inner {
    grid-template-columns: 1fr;
  }

  .hero-spotlight {
    order: -1;
  }

  .spotlight-frame img {
    min-height: 21rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .info-row-wide {
    grid-column: auto;
  }
}

@media (max-width: 640px) {
  .contact-hero {
    padding-top: 0.7rem;
  }

  .contact-shell {
    width: min(100vw - 20px, 100%);
  }

  .contact-card {
    padding: 1rem;
    border-radius: 18px;
  }

  .contact-image-title {
    inset: auto 1rem 1rem 1rem;
    width: auto;
    border-radius: 16px;
  }

  .spotlight-frame {
    border-radius: 18px;
  }

  .spotlight-frame img {
    min-height: 18rem;
  }
}
</style>
