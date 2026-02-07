function byId(id) {
  return document.getElementById(id);
}

function setStatus(text) {
  byId("status").textContent = text;
}

function createInput(labelText, value, key, type = "text") {
  const label = document.createElement("label");
  label.textContent = labelText;

  const input = document.createElement("input");
  input.type = type;
  input.value = value || "";
  input.dataset.key = key;

  label.append(input);
  return label;
}

function createTextarea(labelText, value, key, rows = 2) {
  const label = document.createElement("label");
  label.textContent = labelText;

  const textarea = document.createElement("textarea");
  textarea.value = value || "";
  textarea.rows = rows;
  textarea.dataset.key = key;

  label.append(textarea);
  return label;
}

function createGroup(title, onRemove) {
  const group = document.createElement("div");
  group.className = "group";

  const head = document.createElement("div");
  head.className = "group-head";

  const h3 = document.createElement("h3");
  h3.textContent = title;

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "remove-btn";
  remove.textContent = "× 删除";
  remove.addEventListener("click", onRemove);

  head.append(h3, remove);
  group.append(head);
  return group;
}

function readField(node, key) {
  const field = node.querySelector(`[data-key="${key}"]`);
  return field ? field.value.trim() : "";
}

function parseContact(links) {
  const items = Array.isArray(links) ? links : [];
  const emailEntry = items.find((item) => (item?.url || "").trim().startsWith("mailto:"));
  const email = emailEntry ? (emailEntry.url || "").replace(/^mailto:/i, "").trim() : "";
  const socials = items.filter((item) => {
    const url = (item?.url || "").trim();
    return url && !url.startsWith("mailto:");
  });

  return { email, socials };
}

function normalizeEmail(email) {
  const value = (email || "").trim();
  if (!value) return "";
  if (value.startsWith("mailto:")) return value;
  return `mailto:${value}`;
}

function buildSiteDataFile(data) {
  const payload = JSON.stringify(data, null, 2);
  return `const STORAGE_KEY = "me-site-data-v1";

const DEFAULT_SITE_DATA = ${payload};

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function getSiteData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return clone(DEFAULT_SITE_DATA);
    const parsed = JSON.parse(raw);
    return mergeWithDefault(parsed);
  } catch {
    return clone(DEFAULT_SITE_DATA);
  }
}

function saveSiteData(data) {
  const merged = mergeWithDefault(data);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  return merged;
}

function resetSiteData() {
  localStorage.removeItem(STORAGE_KEY);
  return clone(DEFAULT_SITE_DATA);
}

function mergeWithDefault(data) {
  const merged = clone(DEFAULT_SITE_DATA);
  if (!data || typeof data !== "object") return merged;

  merged.meta = { ...merged.meta, ...(data.meta || {}) };
  merged.hero = { ...merged.hero, ...(data.hero || {}) };
  merged.about = { ...merged.about, ...(data.about || {}) };
  merged.works = { ...merged.works, ...(data.works || {}) };
  merged.timeline = { ...merged.timeline, ...(data.timeline || {}) };
  merged.contact = { ...merged.contact, ...(data.contact || {}) };

  if (Array.isArray(data.works?.items)) merged.works.items = data.works.items;
  if (Array.isArray(data.timeline?.items)) merged.timeline.items = data.timeline.items;
  if (Array.isArray(data.contact?.links)) merged.contact.links = data.contact.links;

  return merged;
}

window.SiteDataStore = {
  STORAGE_KEY,
  DEFAULT_SITE_DATA,
  getSiteData,
  saveSiteData,
  resetSiteData,
};`;
}

async function copyText(text) {
  if (!text) return false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {}
  return false;
}

function renderWorks(items) {
  const container = byId("works-items");
  container.innerHTML = "";

  items.forEach((item, idx) => {
    const group = createGroup(`作品 ${idx + 1}`, () => {
      items.splice(idx, 1);
      renderWorks(items);
    });

    group.append(
      createInput("标题", item.title || "", "title"),
      createTextarea("简介", item.desc || "", "desc"),
      createInput("链接", item.url || "", "url", "url")
    );

    container.append(group);
  });
}

function renderTimeline(items) {
  const container = byId("timeline-items");
  container.innerHTML = "";

  items.forEach((item, idx) => {
    const group = createGroup(`经历 ${idx + 1}`, () => {
      items.splice(idx, 1);
      renderTimeline(items);
    });

    group.append(
      createInput("时间", item.time || "", "time"),
      createInput("标题", item.title || "", "title"),
      createTextarea("描述", item.desc || "", "desc")
    );

    container.append(group);
  });
}

function renderSocials(items) {
  const container = byId("social-items");
  container.innerHTML = "";

  items.forEach((item, idx) => {
    const group = createGroup(`社媒 ${idx + 1}`, () => {
      items.splice(idx, 1);
      renderSocials(items);
    });

    group.append(
      createInput("名称", item.name || "", "name"),
      createInput("地址", item.url || "", "url")
    );

    container.append(group);
  });
}

function collectWorks() {
  return [...document.querySelectorAll("#works-items .group")]
    .map((node) => ({
      title: readField(node, "title"),
      desc: readField(node, "desc"),
      url: readField(node, "url"),
    }))
    .filter((item) => item.title || item.desc || item.url);
}

function collectTimeline() {
  return [...document.querySelectorAll("#timeline-items .group")]
    .map((node) => ({
      time: readField(node, "time"),
      title: readField(node, "title"),
      desc: readField(node, "desc"),
    }))
    .filter((item) => item.time || item.title || item.desc);
}

function collectSocials() {
  return [...document.querySelectorAll("#social-items .group")]
    .map((node) => ({
      name: readField(node, "name"),
      url: readField(node, "url"),
    }))
    .filter((item) => item.name && item.url);
}

function fillForm(data) {
  byId("meta-title").value = data.meta.title || "";
  byId("meta-logo").value = data.meta.logo || "";

  byId("hero-tag").value = data.hero.tag || "";
  byId("hero-name").value = data.hero.name || "";
  byId("hero-subtitle").value = data.hero.subtitle || "";
  byId("hero-cta").value = data.hero.ctaText || "";

  byId("about-title").value = data.about.title || "";
  byId("about-text").value = data.about.text || "";

  byId("works-title").value = data.works.title || "";
  byId("timeline-title").value = data.timeline.title || "";

  byId("contact-title").value = data.contact.title || "";
  byId("contact-copyright").value = data.contact.copyright || "";

  const contact = parseContact(data.contact.links || []);
  byId("contact-email").value = contact.email;

  const worksItems = [...(data.works.items || [])];
  const timelineItems = [...(data.timeline.items || [])];
  const socialItems = [...contact.socials];

  renderWorks(worksItems);
  renderTimeline(timelineItems);
  renderSocials(socialItems);

  byId("add-work-btn").onclick = () => {
    worksItems.push({ title: "", desc: "", url: "" });
    renderWorks(worksItems);
  };

  byId("add-timeline-btn").onclick = () => {
    timelineItems.push({ time: "", title: "", desc: "" });
    renderTimeline(timelineItems);
  };

  byId("add-social-btn").onclick = () => {
    socialItems.push({ name: "", url: "" });
    renderSocials(socialItems);
  };
}

function collectFormData() {
  const emailUrl = normalizeEmail(byId("contact-email").value);
  const socialLinks = collectSocials();
  const links = [];

  if (emailUrl) {
    links.push({ name: "邮箱", url: emailUrl });
  }
  links.push(...socialLinks);

  return {
    meta: {
      title: byId("meta-title").value.trim(),
      logo: byId("meta-logo").value.trim(),
    },
    hero: {
      tag: byId("hero-tag").value.trim(),
      name: byId("hero-name").value.trim(),
      subtitle: byId("hero-subtitle").value.trim(),
      ctaText: byId("hero-cta").value.trim(),
    },
    about: {
      title: byId("about-title").value.trim(),
      text: byId("about-text").value.trim(),
    },
    works: {
      title: byId("works-title").value.trim(),
      items: collectWorks(),
    },
    timeline: {
      title: byId("timeline-title").value.trim(),
      items: collectTimeline(),
    },
    contact: {
      title: byId("contact-title").value.trim(),
      intro: "",
      copyright: byId("contact-copyright").value.trim(),
      links,
    },
  };
}

function init() {
  const store = window.SiteDataStore;
  if (!store) {
    setStatus("加载失败：SiteDataStore 未找到");
    return;
  }

  fillForm(store.getSiteData());

  byId("editor-form").addEventListener("submit", (event) => {
    event.preventDefault();
    store.saveSiteData(collectFormData());
    setStatus("已保存。返回主页刷新后即可看到最新内容。");
  });

  byId("reset-btn").addEventListener("click", () => {
    if (!confirm("确定恢复默认内容吗？当前修改会被覆盖。")) return;
    fillForm(store.resetSiteData());
    setStatus("已恢复默认内容。");
  });

  byId("export-btn").addEventListener("click", () => {
    const json = JSON.stringify(collectFormData(), null, 2);
    byId("json-area").value = json;
    setStatus("已导出 JSON。");
  });

  byId("import-btn").addEventListener("click", () => {
    try {
      const parsed = JSON.parse(byId("json-area").value);
      const saved = store.saveSiteData(parsed);
      fillForm(saved);
      setStatus("导入成功，主页刷新后生效。");
    } catch {
      setStatus("导入失败：JSON 格式不正确。");
    }
  });

  byId("build-site-data-btn").addEventListener("click", () => {
    const code = buildSiteDataFile(collectFormData());
    byId("json-area").value = code;
    setStatus("已生成 site-data.js 代码。复制后覆盖 site-data.js 再 push 即可发布。");
  });

  byId("copy-site-data-btn").addEventListener("click", async () => {
    const area = byId("json-area");
    if (!area.value.trim()) {
      setStatus("请先点击“生成 site-data.js”。");
      return;
    }
    const ok = await copyText(area.value);
    setStatus(ok ? "已复制 site-data.js 代码。" : "复制失败，请手动复制文本框内容。");
  });
}

init();
