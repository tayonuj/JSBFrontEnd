<template>
  <div class="contact-page">
    <!-- HERO -->
    <section class="contact-hero">
      <div class="contact-hero-inner">
        <div class="hero-text">
          <div class="hero-eyebrow">Get in touch</div>
          <h1>We’re Here to Help</h1>
          <p>
            Whether you want to learn more about JSB activities, request support,
            or share your success story—we would love to hear from you.
          </p>
        </div>

        <div class="hero-illustration">
          <img src="/images/contact-us.jpg" alt="Contact" />
        </div>
      </div>
    </section>

    <!-- CONTACT GRID -->
    <section class="section contact-grid-section">
      <div class="contact-grid">

        <!-- CONTACT FORM -->
        <div class="contact-card">
          <h2 class="card-title">Send us a message</h2>

          <form @submit.prevent="submitForm" class="form">
            <div class="form-group">
              <label>Name</label>
              <input v-model="form.name" type="text" placeholder="Your name" required />
            </div>

            <div class="form-group">
              <label>Email</label>
              <input v-model="form.email" type="email" placeholder="your@email.com" required />
            </div>

            <div class="form-group">
              <label>Message</label>
              <textarea
                  v-model="form.message"
                  placeholder="Write your message here..."
                  rows="5"
                  required
              ></textarea>
            </div>

            <button class="btn btn-primary w-100" type="submit">
              Send Message
            </button>

            <p v-if="success" class="success-msg">
              ✔ Your message has been sent. We’ll get back to you soon.
            </p>
          </form>
        </div>

        <!-- CONTACT INFO CARD -->
        <div class="contact-card">
          <h2 class="card-title">Contact Information</h2>

          <div class="info-row">
            <span class="info-icon">📍</span>
            <div>
              <strong>Office Address</strong>
              <p>UNDP Sri Lanka<br />Colombo 07</p>
            </div>
          </div>

          <div class="info-row">
            <span class="info-icon">📞</span>
            <div>
              <strong>Phone</strong>
              <p>+94 11 123 4567</p>
            </div>
          </div>

          <div class="info-row">
            <span class="info-icon">✉️</span>
            <div>
              <strong>Email</strong>
              <p>undp-support@srilanka.org</p>
            </div>
          </div>

          <div class="info-row">
            <span class="info-icon">🌐</span>
            <div>
              <strong>Website</strong>
              <p><a href="#" target="_blank">www.undp.org/srilanka</a></p>
            </div>
          </div>

          <div class="social-row">
            <a href="#" class="social-icon">🌎</a>
            <a href="#" class="social-icon">📘</a>
            <a href="#" class="social-icon">▶️</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";

const form = ref({
  name: "",
  email: "",
  message: "",
});

const success = ref(false);

const submitForm = () => {
  console.log("Form submitted:", form.value);

  // Simulate success
  success.value = true;

  // Reset form (optional)
  form.value = { name: "", email: "", message: "" };

  setTimeout(() => (success.value = false), 4000);
};
</script>

<style scoped>
/* PAGE BASE */
.contact-page {
  background: #f5f7fb;
  min-height: 100vh;
  padding-bottom: 3rem;
  color: #0b1b3b;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

/* HERO */
.contact-hero {
  padding: 4rem 1.5rem 3rem;
  background: radial-gradient(circle at top left, #eaf3ff, #f5f7fb 50%);
}

.contact-hero-inner {
  max-width: 1150px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 2rem;
  align-items: center;
}

.hero-text h1 {
  font-size: 2.3rem;
  margin-bottom: 0.6rem;
}

.hero-text p {
  font-size: 1rem;
  color: #4b5563;
}

.hero-illustration img {
  width: 100%;
  max-width: 430px;
}

/* CARDS */
.contact-grid-section {
  padding-top: 1rem;
}

.contact-grid {
  max-width: 1150px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 2rem;
}

.contact-card {
  background: #ffffff;
  padding: 1.8rem;
  border-radius: 1.2rem;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.card-title {
  font-size: 1.3rem;
  margin-bottom: 1.3rem;
}

/* FORM */
.form-group {
  margin-bottom: 1rem;
}

label {
  font-size: 0.85rem;
  color: #6b7280;
}

input,
textarea {
  width: 100%;
  padding: 0.6rem 0.8rem;
  font-size: 0.9rem;
  border-radius: 0.6rem;
  border: 1px solid #d1d5db;
  background: #f9fafb;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #2563eb;
  background: #ffffff;
}

.success-msg {
  margin-top: 0.7rem;
  font-size: 0.85rem;
  color: #16a34a;
}

/* CONTACT INFO */
.info-row {
  display: flex;
  gap: 0.8rem;
  margin-bottom: 1.1rem;
  align-items: flex-start;
}

.info-icon {
  font-size: 1.3rem;
}

.social-row {
  display: flex;
  gap: 0.6rem;
  margin-top: 1.4rem;
}

.social-icon {
  display: inline-flex;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  justify-content: center;
  align-items: center;
  background: #eef2ff;
  color: #1d4ed8;
  font-size: 1.1rem;
  cursor: pointer;
}

/* MOBILE */
@media (max-width: 900px) {
  .contact-hero-inner,
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
