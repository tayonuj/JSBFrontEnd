<template>
  <PublicShell>
    <div class="contact-page">
      <section class="contact-hero">
        <div class="contact-orb contact-orb-a"></div>
        <div class="contact-orb contact-orb-b"></div>

        <div class="contact-shell">
          <div class="contact-hero-inner">
            <div class="hero-copy">
              <div class="contact-card contact-form-card hero-form-card">
                <div class="card-heading">
                  <p class="card-eyebrow">Direct message</p>
                  <h2 class="card-title">Send us a message</h2>
                  <p class="card-copy">
                    Share a short note and we will route it to the right programme or
                    implementation contact.
                  </p>
                </div>

                <form @submit.prevent="submitForm" class="form">
                  <div class="form-grid">
                    <div class="form-group">
                      <label>Name</label>
                      <input v-model="form.name" type="text" placeholder="Your name" required />
                    </div>

                    <div class="form-group">
                      <label>Email</label>
                      <input v-model="form.email" type="email" placeholder="your@email.com" required />
                    </div>
                  </div>

                  <div class="form-group">
                    <label>Message</label>
                    <textarea
                        v-model="form.message"
                        placeholder="Tell us what you need, the district involved, and any project context."
                        rows="6"
                        required
                    ></textarea>
                  </div>

                  <div class="form-actions">
                    <button class="contact-btn contact-btn-primary" type="submit" :disabled="isSubmitting">
                    {{ isSubmitting ? "Sending..." : "Send Message" }}
                    </button>
                    <p class="form-hint">
                      For faster follow-up, mention the project page or location relevant to your request.
                    </p>
                  </div>

                  <p v-if="success" class="success-msg">
                    Your message has been sent. We’ll get back to you soon.
                  </p>
                  <p v-if="errorMessage" class="error-msg">
                    {{ errorMessage }}
                  </p>
                </form>
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

      <section class="contact-grid-section">
      <div class="contact-shell contact-grid">
          <div class="contact-card contact-info-card">
            <div class="card-heading">
              <p class="card-eyebrow">Coordination points</p>
              <h2 class="card-title">Contact Information</h2>
            </div>

            <div class="info-grid">
              <div class="info-row info-row-wide">
                <span class="info-icon"><i class="bi bi-geo-alt-fill"></i></span>
                <div>
                  <strong>United Nations Development Programme in Sri Lanka | Country Office</strong>
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
                  <p><a href="mailto:registry.lk@undp.org">registry.lk@undp.org</a></p>
                </div>
              </div>
            </div>
          </div>
      </div>
      </section>
    </div>
  </PublicShell>
</template>

<script setup>
import { ref } from "vue";
import PublicShell from "./PublicShell.vue";

const form = ref({
  name: "",
  email: "",
  message: "",
});

const success = ref(false);
const errorMessage = ref("");
const isSubmitting = ref(false);

const submitForm = async () => {
  success.value = false;
  errorMessage.value = "";
  isSubmitting.value = true;

  try {
    await window.axios.post("/contactus/message", form.value);

    success.value = true;
    form.value = { name: "", email: "", message: "" };

    setTimeout(() => {
      success.value = false;
    }, 4000);
  } catch (error) {
    errorMessage.value =
      error?.response?.data?.message ||
      "We could not send your message right now. Please try again shortly.";
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.contact-page {
  --contact-text: #17233c;
  --contact-muted: #5f6f8a;
  --contact-border: rgba(42, 123, 243, 0.14);
  --contact-card: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(246, 250, 255, 0.98) 100%);
  --contact-accent: #1c63d6;
  --contact-accent-strong: #0d4a96;
  position: relative;
  overflow: hidden;
  padding-bottom: 0;
  color: var(--contact-text);
  font-family: "Poppins", sans-serif;
  background: transparent;
}

.contact-hero {
  position: relative;
  padding: 2rem 0 0.75rem;
}

.contact-shell {
  position: relative;
  z-index: 1;
  width: min(1600px, calc(100vw - 20px));
  margin: 0 auto;
}

.contact-hero-inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1.6rem;
  align-items: stretch;
}

.contact-orb {
  position: absolute;
  border-radius: 999px;
  filter: blur(6px);
  opacity: 0.45;
}

.contact-orb-a {
  width: 16rem;
  height: 16rem;
  top: 4rem;
  left: -4rem;
  background: radial-gradient(circle, rgba(42, 123, 243, 0.18) 0%, transparent 72%);
}

.contact-orb-b {
  width: 18rem;
  height: 18rem;
  top: 8rem;
  right: -5rem;
  background: radial-gradient(circle, rgba(13, 74, 150, 0.12) 0%, transparent 72%);
}

.hero-eyebrow,
.card-eyebrow,
.spotlight-kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-bottom: 0.8rem;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--contact-accent);
  font-weight: 700;
}

.hero-stat-card,
.contact-card,
.spotlight-card {
  background: var(--contact-card);
  border: 1px solid var(--contact-border);
  box-shadow: 0 10px 40px rgba(16, 24, 40, 0.08);
}

.hero-spotlight {
  display: flex;
}

.spotlight-frame {
  position: relative;
  display: flex;
  width: 100%;
  overflow: hidden;
  border-radius: 1.5rem;
  min-height: 100%;
  height: 100%;
  box-shadow: 0 22px 52px rgba(0, 10, 24, 0.28);
}

.spotlight-frame::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(7, 20, 43, 0.52) 0%, rgba(7, 20, 43, 0.22) 34%, rgba(7, 20, 43, 0.08) 60%, rgba(7, 20, 43, 0.12) 100%);
}

.contact-image-title {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  width: min(72%, 34rem);
  transform: translate(-50%, -50%);
  text-align: center;
  align-items: center;
}

.contact-image-title__eyebrow {
  margin: 0;
  font-size: clamp(0.95rem, 1.4vw, 1.9rem);
  font-weight: 500;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.95);
}

.contact-image-title h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 4rem);
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: 0.02em;
  color: #ffffff;
  white-space: nowrap;
}

.spotlight-frame img {
  width: 100%;
  height: 100%;
  min-height: 100%;
  object-fit: cover;
}

.spotlight-card h2,
.card-title,
.contact-support-card h3 {
  font-family: "Poppins", sans-serif;
  color: #12233f;
  letter-spacing: -0.02em;
}

.spotlight-card p,
.card-copy {
  color: var(--contact-muted);
  line-height: 1.6;
}

.contact-grid-section {
  padding: 1.5rem 0 0;
}

.contact-grid {
  display: block;
}

.contact-card {
  border-radius: 1.4rem;
  padding: 1.5rem;
}

.hero-form-card {
  padding: 1.6rem;
  height: 100%;
}

.contact-info-card {
  width: 100%;
  max-width: none;
  margin: 0;
}

.card-heading {
  margin-bottom: 1.3rem;
}

.card-title {
  font-size: 1.95rem;
  margin-bottom: 0.5rem;
}

.form {
  display: grid;
  gap: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.form-group {
  display: grid;
  gap: 0.45rem;
}

label {
  font-size: 0.82rem;
  color: var(--contact-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
}

input,
textarea {
  width: 100%;
  padding: 0.9rem 1rem;
  font-size: 0.95rem;
  color: #17233c;
  border-radius: 0.95rem;
  border: 1px solid rgba(42, 123, 243, 0.14);
  background: #ffffff;
  transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--contact-accent);
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(42, 123, 243, 0.12);
}

input::placeholder,
textarea::placeholder {
  color: rgba(95, 111, 138, 0.8);
}

.form-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.contact-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.9rem 1.35rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 0.92rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.16s ease, box-shadow 0.16s ease, background 0.16s ease;
}

.contact-btn-primary {
  background: linear-gradient(135deg, #2a7bf3 0%, #1a55c5 100%);
  color: #ffffff;
  box-shadow: 0 16px 28px rgba(26, 85, 197, 0.24);
}

.contact-btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 20px 34px rgba(26, 85, 197, 0.28);
}

.contact-btn:disabled {
  cursor: wait;
  opacity: 0.8;
  transform: none;
  box-shadow: 0 12px 24px rgba(26, 85, 197, 0.18);
}

.form-hint,
.success-msg {
  margin: 0;
  font-size: 0.82rem;
  color: var(--contact-muted);
}

.success-msg {
  color: #0c8c5c;
}

.error-msg {
  margin: 0;
  font-size: 0.82rem;
  color: #c0392b;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem 1.2rem;
  align-items: stretch;
}

.info-row {
  display: flex;
  gap: 0.9rem;
  align-items: flex-start;
  min-height: 100%;
  padding: 1rem;
  border-radius: 1.1rem;
  background: rgba(255, 255, 255, 0.74);
  border: 1px solid rgba(42, 123, 243, 0.12);
}

.info-row-wide {
  grid-column: span 3;
}

.info-icon {
  flex: 0 0 auto;
  width: 2.3rem;
  height: 2.3rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(42, 123, 243, 0.08);
  border: 1px solid var(--contact-border);
  color: var(--contact-accent);
  font-size: 0.82rem;
  font-weight: 700;
}

.info-icon :deep(i) {
  font-size: 0.95rem;
  line-height: 1;
}

.info-row strong {
  display: block;
  margin-bottom: 0.22rem;
  color: #12233f;
}

.info-row p,
.info-row a {
  color: var(--contact-muted);
  text-decoration: none;
  line-height: 1.6;
}

.info-row a:hover {
  color: #ffffff;
}

@media (max-width: 900px) {
  .contact-hero-inner,
  .contact-grid {
    grid-template-columns: 1fr;
  }

  .hero-spotlight {
    order: -1;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .spotlight-frame img {
    min-height: 20rem;
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
    padding-top: 1.2rem;
  }

  .contact-image-title {
    width: min(84%, 24rem);
  }

  .contact-card {
    padding: 1.2rem;
  }

  .card-title {
    font-size: 1.65rem;
  }

  .form-actions {
    align-items: stretch;
  }
}
</style>
