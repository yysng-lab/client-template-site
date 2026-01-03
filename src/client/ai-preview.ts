// src/client/ai-preview.ts

window.addEventListener("ai-preview", (e: any) => {
  const { section, data } = e.detail;

  console.log("AI Preview:", section, data);

  if (section === "hero") {
    const title = document.querySelector("[data-hero-title]");
    const subtitle = document.querySelector("[data-hero-subtitle]");
    const cta = document.querySelector("[data-hero-cta]");

    if (title) title.textContent = data.title;
    if (subtitle) subtitle.textContent = data.subtitle;
    if (cta) cta.textContent = data.cta.label;
  }

  if (section === "cta") {
    const heading = document.querySelector("[data-cta-heading]");
    const description = document.querySelector("[data-cta-description]");
    const button = document.querySelector("[data-cta-button]");

    if (heading) heading.textContent = data.heading;
    if (description) description.textContent = data.description;
    if (button) button.textContent = data.button.label;
  }
});