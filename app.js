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
  templateLastAutoScrollTime: 0,
  templateAutoDistance: 0,
  templateAutoTravelled: 0,
  templateAutoStopped: false,
  aiPlaylist: [],
  aiPlaylistIndex: -1,
  aiPlayMode: "sequence",
  activeStreamWork: null
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
  resultActions: document.querySelector(".result-actions"),
  genderBtns: document.querySelectorAll(".gender-btn"),
  playModeBtns: document.querySelectorAll(".play-mode-btn"),
  stageSlideA: document.getElementById("stageSlideA"),
  stageSlideB: document.getElementById("stageSlideB"),
  stagePreviewTitle: document.getElementById("stagePreviewTitle"),
  stagePreviewHint: document.getElementById("stagePreviewHint"),
  worksMeta: document.getElementById("worksMeta"),
  worksPanel: document.querySelector(".works-panel"),
  worksGrid: document.querySelector(".works-grid"),
  toggleWorksBtn: document.getElementById("toggleWorksBtn"),
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
  bottomNav: document.querySelector(".bottom-nav"),
  nowPlayingCaption: document.getElementById("nowPlayingCaption")
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

const AI_STREAM_BASE_URL = window.AI_STREAM_BASE_URL || "";

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

const CURATED_MUSICAL_WORKS = [
  {
    id: "musical-satisfied",
    display: "Satisfied 《汉密尔顿》",
    title: "Satisfied 《汉密尔顿》",
    file: "Satisfied Hamilton",
    url: "https://www.youtube.com/watch?v=InupuylYdcY",
    section: "musical"
  },
  {
    id: "musical-opera-2",
    display: "Opera #2 维塔斯",
    title: "Opera #2 维塔斯",
    file: "Opera #2 Vitas",
    url: "https://www.youtube.com/watch?v=8-qZD6XHVCA",
    section: "musical"
  },
  {
    id: "musical-queen-night",
    display: "Queen of the Night Aria 夜后咏叹调 莫扎特《魔笛》",
    title: "Queen of the Night Aria 夜后咏叹调 莫扎特《魔笛》",
    file: "Queen of the Night Aria",
    url: "https://youtu.be/YuBeBjqKSGQ",
    section: "musical"
  },
  {
    id: "musical-phantom",
    display: "The Phantom of the Opera 《歌剧魅影》",
    title: "The Phantom of the Opera 《歌剧魅影》",
    file: "The Phantom of the Opera",
    url: "https://www.youtube.com/watch?v=_IJ-Dqm9E-8",
    section: "musical"
  },
  {
    id: "musical-libiamo",
    display: "Libiamo ne' lieti calici 饮酒歌 威尔第《茶花女》",
    title: "Libiamo ne' lieti calici 饮酒歌 威尔第《茶花女》",
    file: "Libiamo ne lieti calici",
    url: "https://www.youtube.com/watch?v=l7eHO_PEWLk",
    section: "musical"
  },
  {
    id: "musical-nessun-dorma",
    display: "Nessun dorma 今夜无人入睡 普契尼《图兰朵》",
    title: "Nessun dorma 今夜无人入睡 普契尼《图兰朵》",
    file: "Nessun dorma",
    url: "https://www.youtube.com/watch?v=8uqPnY5hQDs",
    section: "musical"
  },
  {
    id: "musical-sempre-libera",
    display: "Sempre libera 永远自由 威尔第《茶花女》",
    title: "Sempre libera 永远自由 威尔第《茶花女》",
    file: "Sempre libera",
    url: "https://www.youtube.com/watch?v=IGlugsYQZgg",
    section: "musical"
  },
  {
    id: "musical-let-it-go",
    display: "Let It Go 《冰雪奇缘》",
    title: "Let It Go 《冰雪奇缘》",
    file: "Let It Go Frozen",
    url: "https://www.youtube.com/watch?v=L0MK7qz13bU",
    section: "musical"
  },
  {
    id: "musical-memory",
    display: "Memory 《猫》",
    title: "Memory 《猫》",
    file: "Memory Cats",
    url: "https://www.youtube.com/watch?v=mdBVJbzkoqo",
    section: "musical"
  },
  {
    id: "musical-toreador",
    display: "Toreador Song 斗牛士之歌 比才《卡门》",
    title: "Toreador Song 斗牛士之歌 比才《卡门》",
    file: "Toreador Song",
    url: "https://www.youtube.com/watch?v=e5qmSEvDEGs",
    section: "musical"
  }
];

const CURATED_ENGLISH_WORKS = [
  {
    id: "english-billie-jean",
    display: "Billie Jean（迈克尔・杰克逊）",
    title: "Billie Jean（迈克尔・杰克逊）",
    file: "Billie Jean Michael Jackson",
    url: "https://www.youtube.com/watch?v=Zi_XLOBDo_Y",
    section: "english"
  },
  {
    id: "english-shape-jfla",
    display: "Shape of You (J.Fla翻唱)",
    title: "Shape of You (J.Fla翻唱)",
    file: "Shape of You J.Fla Cover",
    url: "https://www.youtube.com/watch?v=MhQKe-aERsU",
    section: "english"
  },
  {
    id: "english-shape-ed",
    display: "Shape of You（艾德・西兰 红发艾德）",
    title: "Shape of You（艾德・西兰 红发艾德）",
    file: "Shape of You Ed Sheeran",
    url: "https://www.youtube.com/watch?v=JGwWNGJdvx8",
    section: "english"
  },
  {
    id: "english-cant-help",
    display: "Can't Help Falling In Love（埃尔维斯・普雷斯利 猫王）",
    title: "Can't Help Falling In Love（埃尔维斯・普雷斯利 猫王）",
    file: "Can't Help Falling In Love Elvis Presley",
    url: "https://www.youtube.com/watch?v=vGJTaP6anOU",
    section: "english"
  },
  {
    id: "english-unchained-melody",
    display: "Unchained Melody Remastered（正义兄弟）",
    title: "Unchained Melody Remastered（正义兄弟）",
    file: "Unchained Melody Remastered The Righteous Brothers",
    url: "https://www.youtube.com/watch?v=Zv8czIoAw5w",
    section: "english"
  },
  {
    id: "english-heart-will-go-on",
    display: "My Heart Will Go On（席琳・迪翁）",
    title: "My Heart Will Go On（席琳・迪翁）",
    file: "My Heart Will Go On Celine Dion",
    url: "https://www.youtube.com/watch?v=F2RnxZnubCM",
    section: "english"
  },
  {
    id: "english-careless-whisper",
    display: "Careless Whisper（乔治・迈克尔）",
    title: "Careless Whisper（乔治・迈克尔）",
    file: "Careless Whisper George Michael",
    url: "https://youtu.be/izGwDsrQ1eQ",
    section: "english"
  },
  {
    id: "english-always-love-you",
    display: "I Will Always Love You（惠特尼・休斯顿）",
    title: "I Will Always Love You（惠特尼・休斯顿）",
    file: "I Will Always Love You Whitney Houston",
    url: "https://www.youtube.com/watch?v=3JWTaaS7LdU",
    section: "english"
  }
];

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
  elements.toggleWorksBtn?.addEventListener("click", toggleWorksPanel);
  elements.templateGrid?.addEventListener("click", handleTemplateGridClick);
  elements.playResultBtn.addEventListener("click", toggleResultPlayback);
  elements.seekBar.addEventListener("input", seekResultAudio);
  elements.volumeBtn?.addEventListener("click", toggleVolume);
  elements.fullscreenBtn?.addEventListener("click", toggleFullscreen);
  elements.shareBtn.addEventListener("click", shareResult);
  elements.downloadBtn.addEventListener("click", blockUnavailableAction);

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

  elements.playModeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      setAiPlayMode(btn.dataset.mode);
    });
  });

  elements.navItems.forEach((button) => {
    button.addEventListener("click", () => {
      elements.navItems.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
    });
  });

  window.addEventListener("resize", updateTemplateAutoMetrics);
}

function toggleTemplatePanel() {
  if (!elements.templatePanel || !elements.toggleTemplatesBtn) return;

  const expanded = elements.templatePanel.classList.toggle("is-expanded");
  elements.toggleTemplatesBtn.textContent = expanded ? "收起" : "查看更多";
  elements.toggleTemplatesBtn.setAttribute("aria-expanded", String(expanded));
  if (!expanded) updateTemplateAutoMetrics();
}

function toggleWorksPanel() {
  if (!elements.worksPanel || !elements.toggleWorksBtn) return;

  const expanded = elements.worksPanel.classList.toggle("is-expanded");
  elements.toggleWorksBtn.textContent = expanded ? "收起" : "查看更多";
  elements.toggleWorksBtn.setAttribute("aria-expanded", String(expanded));
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

      if (elements.templateGrid.scrollLeft >= maxScroll - 2) elements.templateGrid.scrollLeft = maxScroll;
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

    if (!expanded && !state.templateAutoStopped && maxScroll > 24 && now > state.templateScrollPausedUntil) {
      const speed = 0.034;
      const distance = elapsed * speed;
      state.templateAutoTravelled += distance;

      if (state.templateAutoTravelled >= state.templateAutoDistance) {
        grid.scrollLeft = maxScroll;
        state.templateAutoStopped = true;
      } else {
        grid.scrollLeft += distance;
        if (grid.scrollLeft >= maxScroll) grid.scrollLeft = 0;
      }
    }

    state.templateAutoScrollFrame = window.requestAnimationFrame(tick);
  };

  state.templateAutoScrollFrame = window.requestAnimationFrame(tick);
}

function updateTemplateAutoMetrics() {
  if (!elements.templateGrid) return;

  const maxScroll = elements.templateGrid.scrollWidth - elements.templateGrid.clientWidth;
  state.templateAutoDistance = Math.max(0, maxScroll * 2);
  state.templateAutoTravelled = 0;
  state.templateAutoStopped = false;
  elements.templateGrid.scrollLeft = 0;
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
  setPlayModeButtonsEnabled(false);

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
    setPlayModeButtonsEnabled(true);
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

  state.activeStreamWork = null;
  setNowPlayingCaption("");
  state.resultUrl = audioUrl;
  elements.resultAudio.src = audioUrl;
  setDownloadEnabled(audioUrl);
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
    if (state.activeStreamWork && state.aiPlaylist.length) {
      playNextAiTrack();
      return;
    }

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

function setDownloadEnabled(audioUrl) {
  elements.resultActions?.classList.remove("is-streaming");
  elements.downloadBtn.classList.remove("is-unavailable");
  elements.shareBtn.classList.remove("is-unavailable");
  elements.shareBtn.disabled = false;
  elements.downloadBtn.href = audioUrl;
  elements.downloadBtn.setAttribute("download", `karaoke-${Date.now()}.mp3`);
  elements.downloadBtn.removeAttribute("aria-disabled");
}

function setDownloadDisabled() {
  elements.resultActions?.classList.add("is-streaming");
  elements.downloadBtn.classList.add("is-unavailable");
  elements.shareBtn.classList.add("is-unavailable");
  elements.shareBtn.disabled = true;
  elements.downloadBtn.removeAttribute("href");
  elements.downloadBtn.removeAttribute("download");
  elements.downloadBtn.setAttribute("aria-disabled", "true");
}

function blockUnavailableAction(event) {
  if (!event.currentTarget.classList.contains("is-unavailable")) return;

  event.preventDefault();
}

function setPlayModeButtonsEnabled(enabled) {
  elements.playModeBtns.forEach((btn) => {
    btn.disabled = !enabled;
    btn.classList.toggle("is-unavailable", !enabled);
  });
}

function setAiPlayMode(mode) {
  state.aiPlayMode = mode === "shuffle" ? "shuffle" : "sequence";
  elements.playModeBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === state.aiPlayMode);
  });
}

function getAiTrackKey(work) {
  return String(work.id || work.file || work.url || work.localUrl || work.display || "");
}

function findAiPlaylistIndex(work) {
  const key = getAiTrackKey(work);
  return state.aiPlaylist.findIndex((item) => getAiTrackKey(item) === key);
}

function getAiStreamUrl(work) {
  if (AI_STREAM_BASE_URL && work.file) {
    const base = AI_STREAM_BASE_URL.replace(/\/+$/, "");
    const path = String(work.file).split(/[\\/]+/).map(encodeURIComponent).join("/");
    return `${base}/${path}`;
  }

  return work.streamUrl || work.localUrl || work.url || "";
}

async function playAiTrack(work, options = {}) {
  const streamUrl = getAiStreamUrl(work);
  if (!streamUrl) {
    alert("这首 AI 新曲还没有配置可播放的 MP3 流地址。");
    return;
  }

  const playlistIndex = findAiPlaylistIndex(work);
  if (playlistIndex >= 0) state.aiPlaylistIndex = playlistIndex;

  if (state.resultUrl?.startsWith("blob:")) URL.revokeObjectURL(state.resultUrl);
  state.activeStreamWork = work;
  state.resultUrl = streamUrl;
  elements.resultAudio.src = streamUrl;
  elements.resultAudio.load();
  setNowPlayingCaption(getTemplateDisplayTitle(work, "ai"));
  setDownloadDisabled();

  if (options.scroll !== false) {
    document.getElementById("stagePlayer")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  try {
    await elements.resultAudio.play();
    elements.playResultBtn.innerHTML = `<img src="${ICONS.pause}" alt="">`;
  } catch (error) {
    elements.playResultBtn.innerHTML = `<img src="${ICONS.play}" alt="">`;
  }
}

function setNowPlayingCaption(text) {
  if (!elements.nowPlayingCaption) return;

  elements.nowPlayingCaption.textContent = text ? `正在播放：${text}` : "";
  elements.nowPlayingCaption.classList.toggle("is-visible", Boolean(text));
}

function playNextAiTrack() {
  if (!state.aiPlaylist.length) return;

  let nextIndex = state.aiPlaylistIndex;

  if (state.aiPlayMode === "shuffle") {
    if (state.aiPlaylist.length === 1) {
      nextIndex = 0;
    } else {
      while (nextIndex === state.aiPlaylistIndex) {
        nextIndex = Math.floor(Math.random() * state.aiPlaylist.length);
      }
    }
  } else {
    nextIndex = (state.aiPlaylistIndex + 1) % state.aiPlaylist.length;
  }

  playAiTrack(state.aiPlaylist[nextIndex], { scroll: false });
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
  grouped.musical = CURATED_MUSICAL_WORKS;
  grouped.english = CURATED_ENGLISH_WORKS;
  if (!grouped.ai.length && Array.isArray(window.AI_SONGS)) {
    grouped.ai = uniqueByUrl(window.AI_SONGS);
  }

  state.aiPlaylist = grouped.ai;
  state.aiPlaylistIndex = grouped.ai.length ? 0 : -1;

  renderWorksList(elements.worksMusical, grouped.musical);
  renderWorksList(elements.worksEnglish, grouped.english);
  renderWorksList(elements.worksChinese, grouped.chinese);
  renderWorksList(elements.worksLive, grouped.ai, "ai");

  renderTemplateWorksList(elements.templateMusicalList, grouped.musical, "musical");
  renderTemplateWorksList(elements.templateEnglishList, grouped.english, "english");
  renderTemplateWorksList(elements.templateChineseList, grouped.chinese, "chinese");
  renderTemplateWorksList(elements.templateAiList, grouped.ai, "ai");
  updateTemplateAutoMetrics();

  elements.worksMeta.textContent = `共 ${works.length} 条作品`;
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

    if (/hamilton|musical|phantom|cats|traviata|memory|satisfied|libiamo|pavarot+i|vitas|opera|nessun|mozart|queen of the night|magic flute|frozen|let it go|sempre libera|魔笛|茶花女|图兰朵|歌剧魅影|夜后|饮酒歌/.test(text)) {
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

function renderWorksList(container, list, groupName = "") {
  container.innerHTML = "";

  list.forEach((work) => {
    const li = document.createElement("li");
    li.className = "work-item";

    const a = document.createElement("a");
    a.href = work.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.textContent = work.display;
    a.classList.toggle("latin-title", isLatinSongTitle(work.display));

    if (groupName === "ai" || work.section === "ai") {
      setupAiTrackLink(a, work);
    }

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
    a.classList.toggle("latin-title", isLatinSongTitle(displayTitle));

    if (groupName === "ai" || work.section === "ai") {
      setupAiTrackLink(a, work);
    }

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

function setupAiTrackLink(anchor, work) {
  const title = getTemplateDisplayTitle(work, "ai");
  anchor.href = "#stagePlayer";
  anchor.target = "";
  anchor.rel = "";
  anchor.dataset.aiTrack = getAiTrackKey(work);
  anchor.title = `${title}（点击本页播放）`;
  anchor.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    playAiTrack(work);
  });
}

function handleTemplateGridClick(event) {
  const anchor = event.target.closest("a[data-ai-track]");
  if (!anchor) return;

  const work = state.aiPlaylist.find((item) => getAiTrackKey(item) === anchor.dataset.aiTrack);
  if (!work) return;

  event.preventDefault();
  playAiTrack(work);
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
    musical: /$a/,
    english: /ed\s*sheeran\s*-\s*shape\s*of\s*you|shape\s*of\s*you\s*\(ed\s*sheeran\)/,
    chinese: /$a/,
    ai: /星光练习曲|原创伴奏/
  };

  return duplicateRules[groupName]?.test(text) ?? false;
}

function isLatinSongTitle(text) {
  const value = String(text || "");
  const latinCount = (value.match(/[A-Za-z]/g) || []).length;
  const cjkCount = (value.match(/[\u3400-\u9fff]/g) || []).length;

  return latinCount > 0 && latinCount >= cjkCount;
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
