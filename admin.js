function byId(id) {
  return document.getElementById(id);
}

function setStatus(text) {
  byId("status").textContent = text;
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
  data.works.items.slice(0, 3).forEach((item, idx) => {
    const i = idx + 1;
    byId(`work-${i}-title`).value = item.title || "";
    byId(`work-${i}-desc`).value = item.desc || "";
    byId(`work-${i}-url`).value = item.url || "";
  });

  byId("timeline-title").value = data.timeline.title || "";
  data.timeline.items.slice(0, 3).forEach((item, idx) => {
    const i = idx + 1;
    byId(`timeline-${i}-time`).value = item.time || "";
    byId(`timeline-${i}-title`).value = item.title || "";
    byId(`timeline-${i}-desc`).value = item.desc || "";
  });

  byId("contact-title").value = data.contact.title || "";
  byId("contact-intro").value = data.contact.intro || "";
  byId("contact-copyright").value = data.contact.copyright || "";

  data.contact.links.slice(0, 5).forEach((item, idx) => {
    const i = idx + 1;
    byId(`contact-${i}-name`).value = item.name || "";
    byId(`contact-${i}-url`).value = item.url || "";
  });
}

function collectFormData() {
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
      items: [1, 2, 3].map((i) => ({
        title: byId(`work-${i}-title`).value.trim(),
        desc: byId(`work-${i}-desc`).value.trim(),
        url: byId(`work-${i}-url`).value.trim(),
      })),
    },
    timeline: {
      title: byId("timeline-title").value.trim(),
      items: [1, 2, 3].map((i) => ({
        time: byId(`timeline-${i}-time`).value.trim(),
        title: byId(`timeline-${i}-title`).value.trim(),
        desc: byId(`timeline-${i}-desc`).value.trim(),
      })),
    },
    contact: {
      title: byId("contact-title").value.trim(),
      intro: byId("contact-intro").value.trim(),
      copyright: byId("contact-copyright").value.trim(),
      links: [1, 2, 3, 4, 5].map((i) => ({
        name: byId(`contact-${i}-name`).value.trim(),
        url: byId(`contact-${i}-url`).value.trim(),
      })),
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
    setStatus("已保存。返回主页并刷新即可看到最新内容。")
  });

  byId("reset-btn").addEventListener("click", () => {
    if (!confirm("确定恢复默认内容吗？当前修改会被覆盖。")) return;
    fillForm(store.resetSiteData());
    setStatus("已恢复默认内容。")
  });

  byId("export-btn").addEventListener("click", () => {
    const json = JSON.stringify(collectFormData(), null, 2);
    byId("json-area").value = json;
    setStatus("已导出 JSON。")
  });

  byId("import-btn").addEventListener("click", () => {
    try {
      const parsed = JSON.parse(byId("json-area").value);
      const saved = store.saveSiteData(parsed);
      fillForm(saved);
      setStatus("导入成功，主页刷新后生效。")
    } catch {
      setStatus("导入失败：JSON 格式不正确。")
    }
  });
}

init();
