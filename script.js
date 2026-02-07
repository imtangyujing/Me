const FALLBACK_EMAIL = "tangyujing2023@gmail.com";

function createLink(href, text) {
  const link = document.createElement("a");
  link.href = href || "#";
  link.textContent = text || "链接";

  if (href && !href.startsWith("mailto:")) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }

  return link;
}

function findEmailAddress(contactLinks) {
  const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

  for (const item of contactLinks) {
    const url = (item?.url || "").trim();
    if (url.toLowerCase().startsWith("mailto:")) {
      const email = url.replace(/^mailto:/i, "").trim();
      if (emailRegex.test(email)) return email;
    }
  }

  for (const item of contactLinks) {
    const url = (item?.url || "").trim();
    const name = (item?.name || "").trim();
    const urlMatch = url.match(emailRegex);
    if (urlMatch) return urlMatch[0];
    const nameMatch = name.match(emailRegex);
    if (nameMatch) return nameMatch[0];
  }

  return "";
}

function splitParagraphs(text) {
  const normalized = (text || "").replace(/\n+/g, "\n").trim();
  if (!normalized) return [];

  if (normalized.includes("\n")) {
    return normalized.split("\n").map((item) => item.trim()).filter(Boolean);
  }

  return normalized
    .split("。")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item, idx, arr) => (idx === arr.length - 1 ? `${item}` : `${item}。`));
}

function renderSite() {
  if (!window.SiteDataStore) return;
  const data = window.SiteDataStore.getSiteData();

  document.title = data.meta.title;

  const displayName = data.hero.name || "唐榆景 · Jay";
  document.getElementById("brand-name").textContent = displayName;
  document.getElementById("profile-name").textContent = displayName;

  document.getElementById("profile-tag").textContent = data.hero.tag || "写字的人，做音乐的人";

  document.getElementById("about-title").textContent = data.about.title || "关于我";

  const aboutGroup = document.getElementById("about-text-group");
  aboutGroup.innerHTML = "";
  splitParagraphs(data.about.text).forEach((line) => {
    const p = document.createElement("p");
    p.textContent = line;
    aboutGroup.append(p);
  });

  document.getElementById("works-title").textContent = data.works.title || "代表作品";
  const worksList = document.getElementById("works-list");
  worksList.innerHTML = "";
  (data.works.items || []).forEach((item) => {
    const card = document.createElement("article");
    card.className = "work-card";

    const h3 = document.createElement("h3");
    h3.textContent = item.title || "未命名作品";

    const p = document.createElement("p");
    p.textContent = item.desc || "暂无描述";

    const a = createLink(item.url, "查看详情");
    card.append(h3, p, a);
    worksList.append(card);
  });

  document.getElementById("timeline-title").textContent = data.timeline.title || "经历时间线";
  const timelineList = document.getElementById("timeline-list");
  timelineList.innerHTML = "";
  (data.timeline.items || []).forEach((item) => {
    const row = document.createElement("article");
    row.className = "timeline-item";

    const time = document.createElement("p");
    time.className = "time";
    time.textContent = item.time || "时间";

    const h3 = document.createElement("h3");
    h3.textContent = item.title || "阶段";

    const p = document.createElement("p");
    p.textContent = item.desc || "暂无描述";

    row.append(time, h3, p);
    timelineList.append(row);
  });

  document.getElementById("contact-title").textContent = data.contact.title || "联系方式";
  document.getElementById("copyright").textContent = data.contact.copyright || "";
  const emailRow = document.getElementById("contact-email-row");
  const emailValue = document.getElementById("contact-email-value");
  emailRow.hidden = true;
  emailValue.textContent = "";

  const links = document.getElementById("social-links");
  links.innerHTML = "";
  const contactLinks = data.contact.links || [];
  const email = findEmailAddress(contactLinks) || FALLBACK_EMAIL;
  emailRow.hidden = false;
  emailValue.textContent = email;

  contactLinks
    .filter((item) => {
      const name = (item?.name || "").trim();
      const url = (item?.url || "").trim();
      if (!name || !url) return false;
      if (name === "链接") return false;
      if (url.startsWith("mailto:")) return false;
      return true;
    })
    .forEach((item) => {
      links.append(createLink(item.url, item.name));
    });

}

function setupObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.14 }
  );

  document.querySelectorAll(".fade-in-up").forEach((el) => observer.observe(el));
}

renderSite();
setupObserver();
