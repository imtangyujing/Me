const STORAGE_KEY = "me-site-data-v1";

const DEFAULT_SITE_DATA = {
  meta: {
    title: "唐榆景 | 个人网站",
    logo: "MY SITE",
  },
  hero: {
    tag: "欢迎来到我的小世界",
    name: "你好，我是唐榆景 · Jay",
    subtitle: "写字的人，做音乐的人，正在学习用代码表达世界。",
    ctaText: "先看我的作品",
  },
  about: {
    title: "个人简介",
    text: "唐榆景，内容创作者与科技编辑。长期关注技术、文化与个体经验的交汇点，写作涵盖科技观察、文化评论与个人表达。同时以 Jay 的名字进行音乐创作，尝试用说唱记录成长、焦虑与时代情绪。相信创作是理解世界的方式，也是在不断试错中靠近自我的过程。",
  },
  works: {
    title: "我的作品",
    items: [
      {
        title: "《Days Before Asianrock》",
        desc: "说唱歌手 Jay 唐榆景的首张 EP。用三首歌，记录一段接近尾声的青春与尚未定型的自我。",
        url: "https://music.163.com/album?id=273002773&uct2=U2FsdGVkX19OjLXFV5PwaqVeawFvEbbo4wKxbgR8qrw=",
      },
      {
        title: "《时隔30年，我们仍被困在那面镜子里》",
        desc: "以《攻壳机动队》三十周年为起点，讨论技术、意识与个体边界的长期命题。",
        url: "https://mp.weixin.qq.com/s/Vi-Ic-FHOIe5hULX3-d9AQ",
      },
      {
        title: "《从火海中走向世界，日本政府做了什么？》",
        desc: "回到泡沫破裂前夕，复盘日本经济高速增长背后的制度选择与历史条件。",
        url: "https://mp.weixin.qq.com/s/tSweNrb5jHpaqRIEjTBLiA",
      },
    ],
  },
  timeline: {
    title: "经历时间线",
    items: [
      {
        time: "2024.06",
        title: "嘻哈歌手",
        desc: "以音乐为出口进行个人表达，完成首张 EP，探索叙事、情绪与节奏的结合。",
      },
      {
        time: "2025.09",
        title: "科技编辑",
        desc: "进入科技媒体工作，关注 AI、技术产业与社会议题，进行长期写作与研究。",
      },
      {
        time: "2026.02",
        title: "Vibe Coder",
        desc: "从零开始学习用代码搭建表达空间，尝试将创作、工具与个人网站连接起来。",
      },
    ],
  },
  contact: {
    title: "联系方式",
    intro: "欢迎来找我交流合作。",
    links: [
      { name: "邮箱", url: "mailto:tangyujing2023@gmail.com" },
      { name: "抖音", url: "https://v.douyin.com/A3YuWJLKVL4/" },
      { name: "小红书", url: "https://xhslink.com/m/2XsZaMSRTM9" },
      { name: "B站", url: "https://space.bilibili.com/174488379?spm_id_from=333.1007.0.0" },
      { name: "网易云", url: "https://163cn.tv/0TZhAlH" },
    ],
    copyright: "© 2026 Jay 唐榆景",
  },
};

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
};
