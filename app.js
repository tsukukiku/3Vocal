const state = {
  selectedFile: null,
  selectedClip: "hamilton",
  currentTaskId: null,
  progressTimer: null,
  mediaRecorder: null,
  recordingChunks: [],
  resultUrl: null,
  audioCtx: null,
  stageGender: "female",
  stageSequence: [],
  stagePointer: 0,
  stageTimer: null,
  stageVisibleSlot: 0,
  templateScrollTimer: null,
  templateAutoScrollFrame: null,
  templateScrollPausedUntil: 0,
  templateLastAutoScrollTime: 0
};

const elements = {
  startSynthesisBtn: document.getElementById("startSynthesisBtn"),
  workSynthesisBtn: document.getElementById("workSynthesisBtn"),
  uploadBtn: document.getElementById("uploadBtn"),
  recordBtn: document.getElementById("recordBtn"),
  audioFileInput: document.getElementById("audioFileInput"),
  accessTokenInput: document.getElementById("accessTokenInput"),
  selectedFileInfo: document.getElementById("selectedFileInfo"),
  progressFill: document.getElementById("progressFill"),
  progressPercent: document.getElementById("progressPercent"),
  stepNodes: document.querySelectorAll(".step"),
  resultAudio: document.getElementById("resultAudio"),
  playResultBtn: document.getElementById("playResultBtn"),
  seekBar: document.getElementById("seekBar"),
  currentTime: document.getElementById("currentTime"),
  duration: document.getElementById("duration"),
  volumeBtn: document.getElementById("volumeBtn"),
  fullscreenBtn: document.getElementById("fullscreenBtn"),
  preview: document.querySelector(".preview"),
  downloadBtn: document.getElementById("downloadBtn"),
  shareBtn: document.getElementById("shareBtn"),
  genderBtns: document.querySelectorAll(".gender-btn"),
  stageSlideA: document.getElementById("stageSlideA"),
  stageSlideB: document.getElementById("stageSlideB"),
  stagePreviewTitle: document.getElementById("stagePreviewTitle"),
  stagePreviewHint: document.getElementById("stagePreviewHint"),
  worksMeta: document.getElementById("worksMeta"),
  worksMusical: document.getElementById("worksMusical"),
  worksEnglish: document.getElementById("worksEnglish"),
  worksChinese: document.getElementById("worksChinese"),
  worksLive: document.getElementById("worksLive"),
  templateMusicalList: document.getElementById("templateMusicalList"),
  templateEnglishList: document.getElementById("templateEnglishList"),
  templateChineseList: document.getElementById("templateChineseList"),
  templateAiList: document.getElementById("templateAiList"),
  templateGrid: document.querySelector(".template-grid"),
  templatePanel: document.getElementById("templatePanel"),
  toggleTemplatesBtn: document.getElementById("toggleTemplatesBtn"),
  navItems: document.querySelectorAll(".nav-item"),
  bottomNav: document.querySelector(".bottom-nav")
};

const clipToneMap = {
  hamilton: 440,
  shape: 392,
  sea: 330,
  reason: 349,
  piano: 294,
  ai: 523
};

const ICONS = {
  play: "./assets/icons/icon-play.png",
  pause: "./assets/icons/icon-pause.png",
  mic: "./assets/icons/icon-mic.png"
};

const STAGE_SLIDES = {
  female: Array.from({ length: 9 }, (_, i) => `./assets/slides-optimized/female/female-${i + 1}.jpg`),
  male: Array.from({ length: 9 }, (_, i) => `./assets/slides-optimized/male/male-${i + 1}.jpg`)
};

const DISPLAY_NAME_BY_ID = {
  1: "Shape of You（J.Fla Cover）",
  2: "Shape of You（Ed Sheeran）",
  3: "Hamilton - Satisfied",
  4: "王俊余乐 - 千纸鹤",
  5: "王杰 - 回家",
  6: "王杰 - 是否我真的一无所有",
  7: "张学友 - 等你等到我心痛",
  8: "姜育恒 - 再回首",
  9: "张雨生 - 大海",
  10: "张学友 - 一千个伤心的理由",
  11: "车继铃 - 最远的你是我最近的爱",
  12: "费翔 - 冬天里的一把火",
  13: "林忆莲 - 爱上一个不回家的人",
  14: "陈慧娴 - 千千阙歌",
  15: "陈百强 - 一生何求",
  16: "Elvis Presley - Can't Help Falling In Love",
  17: "La Traviata - Libiamo ne' lieti calici",
  18: "Pavarotti - Nessun Dorma",
  19: "Cats - Memory",
  20: "Michael Jackson - Billie Jean",
  21: "Vitas - Opera #2",
  22: "Phantom of the Opera - Popular Songs",
  23: "The Righteous Brothers - Unchained Melody",
  24: "Celine Dion - My Heart Will Go On",
  25: "Whitney Houston - I Will Always Love You",
  26: "George Michael - Careless Whisper"
};

const URL_BY_ID = {
  1: "https://www.youtube.com/watch?v=MhQKe-aERsU",
  2: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
  3: "https://www.youtube.com/watch?v=InupuylYdcY",
  4: "https://www.youtube.com/watch?v=K2qNE4K_lyY",
  5: "https://www.youtube.com/watch?v=Bw7Fi7KSpBs",
  6: "https://www.youtube.com/watch?v=bDgWkgQ1oXA",
  7: "https://www.youtube.com/watch?v=6pm8BVi1z7k",
  8: "https://www.youtube.com/watch?v=t2B_SPk77M0",
  9: "https://www.youtube.com/watch?v=EXaLvBGqQww",
  10: "https://www.youtube.com/watch?v=OiMZnvOK0p4",
  11: "https://www.youtube.com/watch?v=LYvKEp8sv6Y",
  12: "https://www.youtube.com/watch?v=3xKLu0xbNYw",
  13: "https://www.youtube.com/watch?v=4UPKe2tKz54",
  14: "https://www.youtube.com/watch?v=UxmpcK1TRp0",
  15: "https://www.youtube.com/watch?v=jgECnV15V6M",
  16: "https://www.youtube.com/watch?v=vGJTaP6anOU",
  17: "https://www.youtube.com/watch?v=l7eHO_PEWLk",
  18: "https://www.youtube.com/watch?v=8uqPnY5hQDs",
  19: "https://www.youtube.com/watch?v=mdBVJbzkoqo",
  20: "https://www.youtube.com/watch?v=Zi_XLOBDo_Y",
  21: "https://www.youtube.com/watch?v=8-qZD6XHVCA",
  22: "https://www.youtube.com/watch?v=_IJ-Dqm9E-8",
  23: "https://www.youtube.com/watch?v=Zv8czIoAw5w",
  24: "https://www.youtube.com/watch?v=F2RnxZnubCM",
  25: "https://www.youtube.com/watch?v=3JWTaaS7LdU",
  26: "https://youtu.be/izGwDsrQ1eQ"
};

init();

function init() {
  bindEvents();
  setupResultPlayer();
  setupTemplateLoopScroll();
  setupBottomNavAutoHide();
  startStageSlideshow("female");
  loadWorksLibrary();
}

function bindEvents() {
  elements.uploadBtn?.addEventListener("click", () => elements.audioFileInput.click());

  elements.audioFileInput.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file, "已上传文件");
  });

  setupDropzone();

  elements.recordBtn.addEventListener("click", toggleRecording);
  elements.startSynthesisBtn?.addEventListener("click", startSynthesisFlow);
  elements.workSynthesisBtn?.addEventListener("click", startSynthesisFlow);
  elements.toggleTemplatesBtn?.addEventListener("click", toggleTemplatePanel);
  elements.playResultBtn.addEventListener("click", toggleResultPlayback);
  elements.seekBar.addEventListener("input", seekResultAudio);
  elements.volumeBtn?.addEventListener("click", toggleVolume);
  elements.fullscreenBtn?.addEventListener("click", toggleFullscreen);
  elements.shareBtn.addEventListener("click", shareResult);

  document.querySelectorAll(".play-clip-btn,.mini-play-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const clip = button.dataset.clip;
      state.selectedClip = clip;
      playClipTone(clip);
    });
  });

  elements.genderBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const gender = btn.dataset.gender;
      startStageSlideshow(gender);
    });
  });

  elements.navItems.forEach((button) => {
    button.addEventListener("click", () => {
      elements.navItems.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
    });
  });
}

function toggleTemplatePanel() {
  if (!elements.templatePanel || !elements.toggleTemplatesBtn) return;

  const expanded = elements.templatePanel.classList.toggle("is-expanded");
  elements.toggleTemplatesBtn.textContent = expanded ? "收起" : "查看更多";
  elements.toggleTemplatesBtn.setAttribute("aria-expanded", String(expanded));
}

function setupTemplateLoopScroll() {
  if (!elements.templateGrid) return;

  const pauseAutoScroll = (duration = 1800) => {
    state.templateScrollPausedUntil = performance.now() + duration;
  };

  elements.templateGrid.addEventListener("scroll", () => {
    if (elements.templatePanel?.classList.contains("is-expanded")) return;

    window.clearTimeout(state.templateScrollTimer);
    state.templateScrollTimer = window.setTimeout(() => {
      const maxScroll = elements.templateGrid.scrollWidth - elements.templateGrid.clientWidth;
      if (maxScroll < 24) return;

      if (elements.templateGrid.scrollLeft >= maxScroll - 2) {
        elements.templateGrid.scrollTo({ left: 0, behavior: "smooth" });
      }
    }, 260);
  }, { passive: true });

  ["pointerdown", "touchstart", "wheel"].forEach((eventName) => {
    elements.templateGrid.addEventListener(eventName, () => pauseAutoScroll(2400), { passive: true });
  });

  const tick = (now) => {
    const grid = elements.templateGrid;
    const maxScroll = grid.scrollWidth - grid.clientWidth;
    const expanded = elements.templatePanel?.classList.contains("is-expanded");

    if (!state.templateLastAutoScrollTime) state.templateLastAutoScrollTime = now;
    const elapsed = now - state.templateLastAutoScrollTime;
    state.templateLastAutoScrollTime = now;

    if (!expanded && maxScroll > 24 && now > state.templateScrollPausedUntil) {
      const speed = 0.028;
      const nextLeft = grid.scrollLeft + elapsed * speed;
      grid.scrollLeft = nextLeft >= maxScroll - 1 ? 0 : nextLeft;
    }

    state.templateAutoScrollFrame = window.requestAnimationFrame(tick);
  };

  state.templateAutoScrollFrame = window.requestAnimationFrame(tick);
}

function setupBottomNavAutoHide() {
  if (!elements.bottomNav) return;

  const bottomThreshold = 70;
  const isNearPageBottom = () => (
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - bottomThreshold
  );

  const updateBottomNav = () => {
    if (isNearPageBottom()) {
      elements.bottomNav.classList.remove("is-hidden");
      elements.bottomNav.classList.add("is-at-page-bottom");
      return;
    }

    elements.bottomNav.classList.remove("is-at-page-bottom");
    elements.bottomNav.classList.add("is-hidden");
  };

  window.setTimeout(updateBottomNav, 2000);
  window.addEventListener("scroll", updateBottomNav, { passive: true });
  window.addEventListener("resize", updateBottomNav);
}

function setupDropzone() {
  const dropzone = document.querySelector(".dropzone");

  dropzone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropzone.style.borderColor = "rgba(255, 212, 140, 0.95)";
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.style.borderColor = "rgba(217, 177, 255, 0.6)";
  });

  dropzone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropzone.style.borderColor = "rgba(217, 177, 255, 0.6)";
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;
    setSelectedFile(file, "已拖拽上传");
  });
}

function setSelectedFile(file, sourceText) {
  state.selectedFile = file;
  elements.selectedFileInfo.textContent = `${sourceText}: ${file.name}（${formatBytes(file.size)}）`;
}

async function toggleRecording() {
  if (state.mediaRecorder && state.mediaRecorder.state === "recording") {
    state.mediaRecorder.stop();
    return;
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    alert("当前浏览器不支持录音，请改为上传声音文件。");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    state.recordingChunks = [];
    state.mediaRecorder = new MediaRecorder(stream);

    state.mediaRecorder.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) state.recordingChunks.push(event.data);
    });

    state.mediaRecorder.addEventListener("stop", () => {
      const blob = new Blob(state.recordingChunks, { type: "audio/webm" });
      const file = new File([blob], `record-${Date.now()}.webm`, { type: "audio/webm" });
      setSelectedFile(file, "已完成录音");
      elements.recordBtn.innerHTML = `<img src="${ICONS.mic}" alt="">录音`;
      stream.getTracks().forEach((track) => track.stop());
    });

    state.mediaRecorder.start();
    elements.recordBtn.innerHTML = `<img src="${ICONS.pause}" alt="">停止录音`;
  } catch (error) {
    alert(`录音失败：${error.message}`);
  }
}

function playClipTone(clipName) {
  const freq = clipToneMap[clipName] || 440;
  if (!state.audioCtx) state.audioCtx = new AudioContext();

  const oscillator = state.audioCtx.createOscillator();
  const gainNode = state.audioCtx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = freq;
  gainNode.gain.value = 0.0001;

  oscillator.connect(gainNode);
  gainNode.connect(state.audioCtx.destination);

  const now = state.audioCtx.currentTime;
  gainNode.gain.exponentialRampToValueAtTime(0.14, now + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

  oscillator.start(now);
  oscillator.stop(now + 1.45);
}

async function startSynthesisFlow() {
  if (!state.selectedFile) {
    alert("请先上传声音文件或完成录音。");
    return;
  }

  if (elements.accessTokenInput.value.trim() !== "3VOCAL") {
    alert("请输入口令 3VOCAL 后再执行合成。");
    elements.accessTokenInput.focus();
    return;
  }

  clearProgressTimer();
  setProgress(0);
  document.body.classList.add("is-running");

  try {
    state.currentTaskId = `mock-${Date.now()}`;
    await runProgressSimulation();

    const resultAudioUrl = URL.createObjectURL(state.selectedFile);
    attachResult(resultAudioUrl);

    alert("合成完成，已生成可试听与下载的音频。");
  } catch (error) {
    alert(`合成失败：${error.message}`);
  } finally {
    document.body.classList.remove("is-running");
    clearProgressTimer();
  }
}

function runProgressSimulation() {
  return new Promise((resolve) => {
    let progress = 0;
    state.progressTimer = setInterval(() => {
      progress += Math.max(2, Math.floor(Math.random() * 8));
      if (progress >= 100) progress = 100;
      setProgress(progress);
      if (progress >= 100) {
        clearProgressTimer();
        resolve();
      }
    }, 360);
  });
}

function setProgress(percent) {
  elements.progressFill.style.width = `${percent}%`;
  elements.progressPercent.textContent = `${percent}%`;

  const activeStep = percent < 34 ? 1 : percent < 76 ? 2 : 3;
  elements.stepNodes.forEach((node) => {
    node.classList.toggle("active", Number(node.dataset.step) <= activeStep);
  });
}

function clearProgressTimer() {
  if (!state.progressTimer) return;
  clearInterval(state.progressTimer);
  state.progressTimer = null;
}

function attachResult(audioUrl) {
  if (state.resultUrl?.startsWith("blob:")) URL.revokeObjectURL(state.resultUrl);

  state.resultUrl = audioUrl;
  elements.resultAudio.src = audioUrl;
  elements.downloadBtn.href = audioUrl;
  elements.downloadBtn.setAttribute("download", `karaoke-${Date.now()}.mp3`);
}

function setupResultPlayer() {
  elements.resultAudio.addEventListener("loadedmetadata", () => {
    elements.duration.textContent = formatTime(elements.resultAudio.duration);
  });

  elements.resultAudio.addEventListener("timeupdate", () => {
    const { currentTime, duration } = elements.resultAudio;
    if (!duration || Number.isNaN(duration)) return;

    elements.currentTime.textContent = formatTime(currentTime);
    elements.seekBar.value = String((currentTime / duration) * 100);
  });

  elements.resultAudio.addEventListener("ended", () => {
    elements.playResultBtn.innerHTML = `<img src="${ICONS.play}" alt="">`;
    elements.seekBar.value = "0";
  });
}

function toggleResultPlayback() {
  if (!elements.resultAudio.src) {
    alert("还没有可播放结果，请先执行合成。");
    return;
  }

  if (elements.resultAudio.paused) {
    elements.resultAudio.play();
    elements.playResultBtn.innerHTML = `<img src="${ICONS.pause}" alt="">`;
  } else {
    elements.resultAudio.pause();
    elements.playResultBtn.innerHTML = `<img src="${ICONS.play}" alt="">`;
  }
}

function seekResultAudio() {
  const duration = elements.resultAudio.duration;
  if (!duration || Number.isNaN(duration)) return;

  elements.resultAudio.currentTime = (Number(elements.seekBar.value) / 100) * duration;
}

function toggleVolume() {
  elements.resultAudio.muted = !elements.resultAudio.muted;
  elements.volumeBtn.classList.toggle("is-muted", elements.resultAudio.muted);
  elements.volumeBtn.setAttribute("aria-label", elements.resultAudio.muted ? "取消静音" : "静音");
}

async function toggleFullscreen() {
  const target = elements.preview || document.documentElement;

  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    if (target.requestFullscreen) {
      await target.requestFullscreen();
      return;
    }

    if (target.webkitRequestFullscreen) {
      target.webkitRequestFullscreen();
      return;
    }

    alert("当前浏览器不支持网页全屏。");
  } catch (error) {
    alert("全屏启动失败，请再点一次或检查浏览器权限。");
  }
}

async function shareResult() {
  if (!state.resultUrl) {
    alert("请先完成合成，再分享作品。");
    return;
  }

  const shareData = {
    title: "一问三知 · AI卡拉OK作品",
    text: "我刚完成一段 AI 卡拉OK合成作品，来听听看。",
    url: location.href
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (error) {
      if (error.name !== "AbortError") {
        alert("分享未完成，请稍后再试。");
      }
      return;
    }
  }

  await navigator.clipboard.writeText(location.href);
  alert("已复制页面链接，可直接发送给观众。");
}

function startStageSlideshow(gender) {
  state.stageGender = gender;
  state.stageSequence = shuffleArray([...STAGE_SLIDES[gender]]);
  state.stagePointer = 0;
  state.stageVisibleSlot = 0;

  clearInterval(state.stageTimer);

  const first = state.stageSequence[state.stagePointer];
  const second = state.stageSequence[(state.stagePointer + 1) % state.stageSequence.length];

  elements.stageSlideA.src = first;
  elements.stageSlideB.src = second;
  elements.stageSlideA.classList.add("is-visible");
  elements.stageSlideB.classList.remove("is-visible");

  elements.genderBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.gender === gender);
  });

  if (elements.stagePreviewTitle) {
    elements.stagePreviewTitle.textContent = gender === "female" ? "女歌手舞台预览" : "男歌手舞台预览";
  }

  if (elements.stagePreviewHint) {
    elements.stagePreviewHint.textContent = "图片随机乱序轮播";
  }

  state.stageTimer = setInterval(nextStageSlide, 2800);
}

function nextStageSlide() {
  if (!state.stageSequence.length) return;

  state.stagePointer += 1;
  if (state.stagePointer >= state.stageSequence.length) {
    state.stageSequence = shuffleArray([...STAGE_SLIDES[state.stageGender]]);
    state.stagePointer = 0;
  }

  const nextSrc = state.stageSequence[state.stagePointer];
  const showA = state.stageVisibleSlot === 1;
  const showEl = showA ? elements.stageSlideA : elements.stageSlideB;
  const hideEl = showA ? elements.stageSlideB : elements.stageSlideA;

  showEl.src = nextSrc;
  showEl.classList.add("is-visible");
  hideEl.classList.remove("is-visible");
  state.stageVisibleSlot = showA ? 0 : 1;
}

async function loadWorksLibrary() {
  let works = [];
  let aiSongs = Array.isArray(window.AI_SONGS) ? window.AI_SONGS : [];

  try {
    const resp = await fetch("./assets/data/youtube_links_all_files.txt");
    const text = await resp.text();

    works = parseWorksText(text);
  } catch (error) {
    works = getFallbackWorks();
  }

  try {
    const resp = await fetch("./assets/data/ai_songs.json");
    const fetchedAiSongs = await resp.json();
    if (Array.isArray(fetchedAiSongs)) aiSongs = fetchedAiSongs;
  } catch (error) {
    // AI song data is optional so the page still works if the local list is absent.
  }

  works = works.concat(aiSongs);
  renderWorksLibrary(works);
}

function renderWorksLibrary(works) {
  const grouped = groupWorks(works);
  if (!grouped.ai.length && Array.isArray(window.AI_SONGS)) {
    grouped.ai = uniqueByUrl(window.AI_SONGS);
  }

  renderWorksList(elements.worksMusical, grouped.musical);
  renderWorksList(elements.worksEnglish, grouped.english);
  renderWorksList(elements.worksChinese, grouped.chinese);
  renderWorksList(elements.worksLive, grouped.ai);

  renderTemplateWorksList(elements.templateMusicalList, grouped.musical, "musical");
  renderTemplateWorksList(elements.templateEnglishList, grouped.english, "english");
  renderTemplateWorksList(elements.templateChineseList, grouped.chinese, "chinese");
  renderTemplateWorksList(elements.templateAiList, grouped.ai, "ai");

  elements.worksMeta.textContent = `共 ${works.length} 条作品链接`;
}

function getFallbackWorks() {
  return Object.entries(URL_BY_ID).map(([id, url]) => ({
    id: Number(id),
    file: DISPLAY_NAME_BY_ID[id],
    title: DISPLAY_NAME_BY_ID[id],
    display: DISPLAY_NAME_BY_ID[id],
    url,
    section: Number(id) >= 16 ? "mp4" : "mp3"
  }));
}

function parseWorksText(text) {
  const lines = text.split(/\r?\n/);
  const works = [];

  let current = null;
  let section = "";

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (/MP3/i.test(line)) section = "mp3";
    if (/MP4/i.test(line)) section = "mp4";

    const itemMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (itemMatch) {
      if (current?.url) works.push(current);
      current = {
        id: Number(itemMatch[1]),
        file: itemMatch[2],
        title: "",
        url: "",
        section
      };
      continue;
    }

    if (!current) continue;

    const yt = line.match(/YouTube:\s*(https?:\/\/\S+)/i);
    if (yt) {
      current.url = yt[1];
      continue;
    }

    const titleLine = line.match(/:\s*(.+)$/);
    if (titleLine && !current.title && !/https?:\/\//i.test(titleLine[1])) {
      current.title = titleLine[1].trim();
    }
  }

  if (current?.url) works.push(current);

  return works.map((work, index) => ({
    ...work,
    display: makeDisplayTitle(work, index + 1)
  }));
}

function makeDisplayTitle(work, index) {
  if (DISPLAY_NAME_BY_ID[work.id]) return DISPLAY_NAME_BY_ID[work.id];

  const candidate = normalizeTitle(work.title || work.file, index);
  if (looksGarbled(candidate)) {
    return `作品 ${String(work.id || index).padStart(2, "0")}`;
  }

  return candidate;
}

function normalizeTitle(raw, index) {
  const cleaned = raw
    .replace(/^文件名\s*/i, "")
    .replace(/\.(mp3|mp4)$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  return cleaned || `作品 ${index}`;
}

function looksGarbled(text) {
  if (!text) return true;

  const weirdPattern = /[荳蠑譁蜷莠鬮螟蟾霑豬剰隸逧髫蛻・]/g;
  const weirdCount = (text.match(weirdPattern) || []).length;

  return weirdCount >= 3;
}

function groupWorks(works) {
  const grouped = {
    musical: [],
    english: [],
    chinese: [],
    ai: []
  };

  for (const work of works) {
    const text = `${work.display} ${work.file}`.toLowerCase();

    if (work.section === "ai") {
      grouped.ai.push(work);
      continue;
    }

    if (/hamilton|musical|phantom|cats|traviata|memory|satisfied|libiamo|pavarot+i|vitas|opera|nessun/.test(text)) {
      grouped.musical.push(work);
      continue;
    }

    if (/ed sheeran|shape of you|elvis|michael jackson|unchained|j\.fla|billie|celine dion|titanic|heart will go on|whitney houston|always love you|george michael|careless whisper/.test(text)) {
      grouped.english.push(work);
      continue;
    }

    grouped.chinese.push(work);
  }

  grouped.musical = uniqueByUrl(grouped.musical);
  grouped.english = uniqueByUrl(grouped.english);
  grouped.chinese = uniqueByUrl(grouped.chinese);
  grouped.ai = uniqueByUrl(grouped.ai);

  return grouped;
}

function uniqueByUrl(list) {
  const seen = new Set();
  return list.filter((item) => {
    if (!item.url || seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

function renderWorksList(container, list) {
  container.innerHTML = "";

  list.forEach((work) => {
    const li = document.createElement("li");
    li.className = "work-item";

    const a = document.createElement("a");
    a.href = work.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = work.display;

    li.appendChild(a);
    container.appendChild(li);
  });

  if (!list.length) {
    const li = document.createElement("li");
    li.className = "work-item empty";
    li.textContent = "暂无作品";
    container.appendChild(li);
  }
}

function renderTemplateWorksList(container, list, groupName) {
  if (!container) return;

  container.innerHTML = "";

  const visibleList = list.filter((work) => !isTemplateDuplicateLead(work, groupName));

  visibleList.forEach((work) => {
    const displayTitle = getTemplateDisplayTitle(work, groupName);
    const li = document.createElement("li");
    li.className = "template-work-item";

    const a = document.createElement("a");
    a.href = work.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = displayTitle;
    a.title = displayTitle;

    li.appendChild(a);
    container.appendChild(li);
  });

  if (!visibleList.length) {
    const li = document.createElement("li");
    li.className = "template-work-item empty";
    li.textContent = "暂无作品";
    container.appendChild(li);
  }
}

function getTemplateDisplayTitle(work, groupName) {
  if (groupName !== "ai") return work.display;

  const title = cleanAiSongTitle(work);
  const pixabayId = work.pixabayId || extractPixabayId(work);

  return pixabayId ? `${title} #${pixabayId}` : title;
}

function cleanAiSongTitle(work) {
  if (work.title) return work.title.trim();

  const display = String(work.display || work.file || "")
    .replace(/\.(mp3|wav|m4a|aac|flac|ogg)$/i, "")
    .trim();

  const hashMatch = display.match(/#?\s*(\d{4,})\s*$/);
  const withoutId = hashMatch ? display.slice(0, hashMatch.index).trim() : display;
  const dashParts = withoutId.split(/\s+-\s+|-/).map((part) => part.trim()).filter(Boolean);

  return dashParts.length > 1 ? dashParts.slice(1).join(" - ") : withoutId;
}

function extractPixabayId(work) {
  const source = `${work.display || ""} ${work.file || ""} ${work.url || ""}`;
  const hashMatch = source.match(/#\s*(\d{4,})/);
  if (hashMatch) return hashMatch[1];

  const fileIdMatch = source.match(/(?:-|\/)(\d{4,})(?:\.(?:mp3|wav|m4a|aac|flac|ogg)|\b)/i);
  return fileIdMatch ? fileIdMatch[1] : "";
}

function isTemplateDuplicateLead(work, groupName) {
  const text = `${work.display || ""} ${work.file || ""}`.toLowerCase();

  const duplicateRules = {
    musical: /hamilton\s*-\s*satisfied|satisfied\s+from\s+hamilton/,
    english: /ed\s*sheeran\s*-\s*shape\s*of\s*you|shape\s*of\s*you\s*\(ed\s*sheeran\)/,
    chinese: /$a/,
    ai: /星光练习曲|原创伴奏/
  };

  return duplicateRules[groupName]?.test(text) ?? false;
}

function shuffleArray(list) {
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function formatTime(seconds) {
  const sec = Math.max(0, Math.floor(seconds));
  const minutes = String(Math.floor(sec / 60)).padStart(2, "0");
  const remain = String(sec % 60).padStart(2, "0");
  return `${minutes}:${remain}`;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
