const slides = [
  {
    title: "Data Portfolio",
    summary:
      "This portfolio highlights internal tools and data products I’ve designed for nonprofit and humanitarian organizations.\n\nMy work focuses on translating complex, ambiguous operational needs into usable systems that support judgment, accountability, and adoption by non-technical users.",
    screen: "./assets/screens/page-01.jpg",
    thumb: "./assets/thumbs/page-01.jpg",
    mediaScale: 1,
    mediaShiftX: "0",
    mediaShiftY: "-1.75%",
    disableInfo: true,
    overlayHtml:
      '<div class="cover-block"><div class="cover-title">Sunyoung Lie</div><div class="cover-copy">Data portfolio: products that advance nonprofit strategic goals through data collection, analysis, visualization,<br />and knowledge management</div></div>',
  },
  {
    title: "Placements vs. Actively Homeless Animation",
    summary: "Users often assume that the difference in a reduced Actively Homeless number equals the number of Housing Placements. The reality is there are actually many more Housing Placements occurring for each single point reduction in Actively Homeless.\n\nThis animation (shown with sample data) was created to accompany an article describing how much Placements work goes on behind the scenes of reducing Actively Homeless numbers.",
    screen: "./assets/animated/placement-ah.gif",
    thumb: "./assets/thumbs/page-02.jpg",
    mediaScale: 1,
    mediaShiftX: "0",
    mediaShiftY: "-1.75%",
  },
  {
    title: "Bulk Activity Data Entry",
    summary: "I created an app for entering quantitative data for an Activity in order to aggregate impact across our Programs. Some Program managers requested the ability to bulk upload spreadsheets, but conforming spreadsheet data to our location requirements would be difficult.\n\nThe solution was an app that had built in mapping so Program managers could insert latitude and longitude in each row through a Google maps interface. I also gave them the ability to group Activities with the same location.",
    screen: "https://han-lie.github.io/single_screen_public/",
    thumb: "./assets/thumbs/page-03.jpg",
    mediaType: "frame",
    mediaScale: 0.88,
    mediaShiftX: "0",
    mediaShiftY: "-0.8%",
    activateFrameOnClick: true,
  },
  {
    title: "Deduplication Worksheet",
    summary: "I was tasked with creating a system to estimate participants that benefited from multiple Activities, without having identifying information about each participant. I created an app that shows our Evaluation Director groups of Activities that are within a reasonable travel distance from each other and serve the same demographic.\n\nThe Director can use their qualitative knowledge to add or subtract to that group, and estimate a low, medium, or high probability of duplicate participants.\n\nI added a population density factor that reduces the probability of duplicate participants if the area is densely populated.",
    screen: "./embedded/dedup/index.html",
    thumb: "./assets/thumbs/page-04.jpg",
    mediaType: "frame",
    mediaScale: 0.88,
    mediaShiftX: "0",
    mediaShiftY: "-0.8%",
    activateFrameOnClick: true,
  },
  {
    title: "Community Placements One-Page Infographic",
    summary: "Our independently operating Communities often find that their external partners focus on rising numbers of homelessness, which creates a sense of hopelessness around the issue. We wanted communities (regardless of staff capacity) to have a simple way of communicating the work they are doing around housing placements.\n\nThis template (shown with sample data) can be updated by any Community through manual data entry into a Google or excel sheet, creating a simple PDF that can be sent to external partners in media and government, transforming the conversation to a person-centered approach around the individuals actually receiving assistance.",
    screen: "./assets/screens/page-05.jpg",
    thumb: "./assets/thumbs/page-05.jpg",
    mediaScale: 1,
    mediaShiftX: "0",
    mediaShiftY: "-1.75%",
  },
  {
    title: "North Star Dashboard",
    summary: "This nonprofit tracks progress towards several goals over the course of its strategic plan. Many of these goals are qualitative, creating challenges for leadership in assessing the organization’s progress across departments.\n\nThis dashboard displays both quantitative and qualitative goals in an interface that distills progress into three simple chart types, and employs a numerical phase approach in order to enable visual assessment of qualitative goals.",
    screen: "./assets/screens/page-06.jpg",
    thumb: "./assets/thumbs/page-06.jpg",
    mediaScale: 1,
    mediaShiftX: "0",
    mediaShiftY: "-1.75%",
  },
  {
    title: "Salesforce Dashboard for All Interventions",
    summary: "I’ve worked in four Salesforce instances in my data analytics career, during which time I’ve enjoyed taking advantage of customizations and formulas in order to provide intuitive data entry and visualization experiences for my staff.\n\nThis dashboard combines several separate programs or Interventions so impact can be compared across the entire work of the organization, for a leadership perspective. The focus is on two separate measures: number of Events per Intervention, and Data Reporting performance for each Intervention.",
    screen: "./assets/screens/page-07.jpg",
    thumb: "./assets/thumbs/page-07.jpg",
    mediaScale: 1,
    mediaShiftX: "0",
    mediaShiftY: "-1.75%",
  },
  {
    title: "Knowledge Management Wiki",
    summary: "This product was developed to house several years worth of iterations on trainings, definitions, tools, and data collection spreadsheets.\n\nProject management, cross-team collaboration, user experience, technology limitations, and clear branding principles were all important aspects of this product development.\n\nImprovement occurs monthly through feedback gathered in weekly office hours and feedback forms available within the site.",
    screen: "./assets/screens/page-08.jpg",
    thumb: "./assets/thumbs/page-08.jpg",
    mediaScale: 1,
    mediaShiftX: "0",
    mediaShiftY: "-1.75%",
  },
  {
    title: "Community Small Multiples",
    summary: "These charts are the first attempt to visualize our data across our independently operating Communities, instead of within a single Community.\n\nThis live Tableau dashboard (shown with sample data) utilizes a moving average and the color range within area maps to display several data points at once, as well as the difference between those data points. Previous versions required users to view these data points as separate elements and extrapolate these differences on their own.",
    screen: "./assets/screens/page-09.jpg",
    thumb: "./assets/thumbs/page-09.jpg",
    mediaScale: 1,
    mediaShiftX: "0",
    mediaShiftY: "-1.75%",
  },
  {
    title: "Aggregated Community Data",
    summary: "Our 105 Communities across the country have a monthly practice of submitting key metrics to us, which we store in our data warehouse. The Communities sometimes skip months, or submit the data for a particular month several months later. There are also issues with outliers and volatility.\n\nDue to these factors, we have only analyzed the data on an individual Community level for insight onto that particular Community.\n\nThis project was an attempt to aggregate the data across all Communities to see if we could gain any insight into national trends. By aligning the Community boundaries with County boundaries, weighting the data by the Census population of the Community, and excluding outliers, we were able to aggregate the various data submissions to create a compelling analysis of national homelessness trends.",
    screen: "./assets/screens/page-10.jpg",
    thumb: "./assets/thumbs/page-10.jpg",
    mediaScale: 1,
    mediaShiftX: "0",
    mediaShiftY: "-1.75%",
  },
  {
    title: "",
    summary:
      "Dataforprogress.org landing page.\n\nThe client needed a captivating home page that communicated the extent of corporate involvement in key legislative issues.",
    screen: "./assets/animated/cap-logos-type-locked.gif",
    poster: "./assets/screens/page-11-poster.png",
    thumb: "./assets/thumbs/page-11.jpg",
    mediaScale: 1.02,
    mediaShiftX: "0",
    mediaShiftY: "-1.75%",
  },
  {
    title: "Data for Progress Social Media visualization",
    summary: "Retweeted by Nate Silver",
    screen: "./assets/screens/page-12-reference.png",
    thumb: "./assets/thumbs/page-12.jpg",
    mediaScale: 1,
    mediaShiftX: "0",
    mediaShiftY: "-1.75%",
  },
  {
    title: "",
    summary:
      "Graduation invitation.\n\nAfter many years operating a beloved in person community space for NYC teens, exalt needed a compelling way to communicate the robust work it was continuing to do and celebrate during Covid remote restrictions.",
    screen: "./assets/animated/exalt-gala-flyer.gif",
    poster: "./assets/screens/page-13-poster.png",
    thumb: "./assets/thumbs/page-13.jpg",
    mediaScale: 1,
    mediaShiftX: "0",
    mediaShiftY: "-1.75%",
  },
  {
    title: "Income Inequality Publication",
    summary:
      "Question: how can we effectively communicate the extent of income inequality?\nCreated for New York State legislation amendment.",
    screen: "./assets/screens/page-14.jpg",
    thumb: "./assets/thumbs/page-14.jpg",
    mediaScale: 1,
    mediaShiftX: "0",
    mediaShiftY: "-1.75%",
  },
  {
    title: "NYC Branch Monitoring",
    summary:
      "Question: how can we prepare for possible branch closures by monitoring Covid rates and vaccinations near our branches?",
    screen: "./assets/screens/page-15-reference.png",
    thumb: "./assets/thumbs/page-15.jpg",
    mediaScale: 1,
    mediaShiftX: "0",
    mediaShiftY: "-1.75%",
  },
  {
    title: "Bail Project Engagement Giveaway",
    summary: "Data engagement giveaway.",
    screen: "./assets/animated/mug-2.gif",
    poster: "./assets/screens/page-16-poster.png",
    thumb: "./assets/thumbs/page-16.jpg",
    mediaScale: 1,
    mediaShiftX: "0",
    mediaShiftY: "-1.75%",
  },
  {
    title: "CV",
    summary: "Product resume.",
    mediaType: "scroll-image",
    screen: "./assets/screens/page-17-resume.png",
    thumb: "./assets/thumbs/page-17.jpg",
    mediaScale: 1,
    mediaShiftX: "0",
    mediaShiftY: "0",
    disableInfo: true,
  },
];

const stage = document.getElementById("stage");
const stageImage = document.getElementById("stage-image");
const stageFrame = document.getElementById("stage-frame");
const stageScroll = document.getElementById("stage-scroll");
const stageScrollImage = document.getElementById("stage-scroll-image");
const stageOverlay = document.getElementById("stage-overlay");
const infoTitle = document.getElementById("info-title");
const infoSummary = document.getElementById("info-summary");
const filmstrip = document.getElementById("filmstrip");
const infoCard = document.getElementById("info-card");
const globalCvLink = document.getElementById("global-cv-link");
const stageAppBack = document.getElementById("stage-app-back");

let activeIndex = 0;
let imageLoadToken = 0;
let embeddedAppIndex = null;

function resetInteractiveStageState() {
  stage.classList.remove("frame-interacting");
  stage.classList.remove("frame-preview");
}

function markFrameInteracting() {
  const slide = slides[activeIndex];
  if (!slide?.activateFrameOnClick) {
    return;
  }
  stage.classList.add("frame-interacting");
  stage.classList.remove("frame-preview");
}

function getInitialSlideIndex() {
  const params = new URLSearchParams(window.location.search);
  const slideParam = params.get("slide");
  if (slideParam) {
    const slideNumber = Number(slideParam);
    if (Number.isInteger(slideNumber) && slideNumber >= 1 && slideNumber <= slides.length) {
      return slideNumber - 1;
    }
  }

  const hash = window.location.hash.trim().toLowerCase();
  const hashMatch = hash.match(/^#(?:page-)?(\d{1,2})$/);
  if (hashMatch) {
    const slideNumber = Number(hashMatch[1]);
    if (Number.isInteger(slideNumber) && slideNumber >= 1 && slideNumber <= slides.length) {
      return slideNumber - 1;
    }
  }

  return 0;
}

function buildFilmstrip() {
  slides.forEach((slide, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "thumb-button";
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", "false");
    button.setAttribute("aria-label", `${slide.title}, page ${index + 1}`);
    button.dataset.index = String(index);

    button.innerHTML = `
      <img class="thumb-image" src="${slide.thumb}" alt="" />
      <span class="thumb-tooltip">${slide.title}</span>
    `;

    button.addEventListener("click", () => setActiveSlide(index));
    filmstrip.appendChild(button);
  });
}

function setActiveSlide(index) {
  activeIndex = (index + slides.length) % slides.length;
  embeddedAppIndex = null;
  resetInteractiveStageState();
  const slide = slides[activeIndex];
  document.body.dataset.activeSlide = String(activeIndex);
  const imageSource =
    typeof slide.screen === "string" && /\.gif($|\?)/i.test(slide.screen)
      ? `${slide.screen}${slide.screen.includes("?") ? "&" : "?"}refresh=${Date.now()}`
      : slide.screen;

  if (slide.mediaType === "frame") {
    stageScroll.style.display = "none";
    stageImage.style.display = "none";
    stageFrame.style.display = "block";
    stageFrame.src = slide.screen;
    stageFrame.title = slide.title;
    stage.classList.toggle("frame-preview", Boolean(slide.activateFrameOnClick));
  } else if (slide.mediaType === "scroll-image") {
    stageImage.style.display = "none";
    stageFrame.style.display = "none";
    stageFrame.src = "about:blank";
    stageScroll.style.display = "flex";
    stageScroll.classList.remove("zoomed");
    stageScroll.scrollTop = 0;
    stageScrollImage.src = slide.screen;
    stageScrollImage.alt = slide.title;
  } else {
    stageScroll.style.display = "none";
    stageFrame.style.display = "none";
    stageFrame.src = "about:blank";
    const nextToken = ++imageLoadToken;
    stageImage.style.display = "block";
    stageImage.classList.toggle("is-loading", !slide.poster);
    if (slide.poster) {
      stageImage.src = slide.poster;
    } else {
      stageImage.removeAttribute("src");
    }
    stageImage.alt = slide.title;
    if (slide.poster) {
      const loader = new Image();
      loader.onload = () => {
        if (nextToken !== imageLoadToken) {
          return;
        }
        stageImage.classList.remove("is-loading");
        stageImage.src = imageSource;
      };
      loader.src = imageSource;
    } else {
      stageImage.onload = () => {
        if (nextToken !== imageLoadToken) {
          return;
        }
        stageImage.classList.remove("is-loading");
      };
      stageImage.src = imageSource;
    }
  }

  infoTitle.classList.remove("cover-text", "cover-name");
  infoSummary.classList.remove("cover-summary");

  stageImage.style.setProperty("--media-scale", slide.mediaScale ?? 1);
  stageImage.style.setProperty("--media-shift-x", slide.mediaShiftX ?? "0");
  stageImage.style.setProperty("--media-shift-y", slide.mediaShiftY ?? "-1.75%");
  stageFrame.style.setProperty("--media-scale", slide.mediaScale ?? 1);
  stageFrame.style.setProperty("--media-shift-x", slide.mediaShiftX ?? "0");
  stageFrame.style.setProperty("--media-shift-y", slide.mediaShiftY ?? "-1.75%");

  stageOverlay.innerHTML = slide.overlayHtml ?? "";
  stageOverlay.classList.toggle("show", Boolean(slide.overlayHtml));
  stageOverlay.classList.toggle("hover-only", slide.overlayMode === "hover-only");
  stage.classList.toggle("no-info", Boolean(slide.disableInfo));
  stage.classList.toggle("cv-zoomed", false);
  stage.classList.toggle("app-embed-ready", Boolean(slide.embedUrl));
  stage.classList.remove("app-embed-open");
  stageAppBack.classList.remove("show");

  infoTitle.textContent = slide.title;
  infoTitle.hidden = slide.title.length === 0;
  infoSummary.textContent = slide.summary;

  if (activeIndex === 0) {
    infoTitle.classList.add("cover-text", "cover-name");
    infoSummary.classList.add("cover-summary");
  }

  document.querySelectorAll(".thumb-button").forEach((button, buttonIndex) => {
    const selected = buttonIndex === activeIndex;
    button.setAttribute("aria-selected", String(selected));
    if (selected) {
      button.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  });
}

function nudgeFilmstrip(direction) {
  filmstrip.scrollBy({
    left: direction * 320,
    behavior: "smooth",
  });
}

buildFilmstrip();
setActiveSlide(getInitialSlideIndex());

function positionInfoCard(event) {
  const stageRect = stage.getBoundingClientRect();
  const cardRect = infoCard.getBoundingClientRect();
  const offset = 18;
  const maxLeft = stageRect.width - cardRect.width - 12;
  const maxTop = stageRect.height - cardRect.height - 12;
  const nextLeft = Math.min(Math.max(event.clientX - stageRect.left + offset, 12), maxLeft);
  const nextTop = Math.min(Math.max(event.clientY - stageRect.top + offset, 12), maxTop);
  infoCard.style.setProperty("--card-x", `${nextLeft}px`);
  infoCard.style.setProperty("--card-y", `${nextTop}px`);
}

function positionStageOverlayCursor(event) {
  const stageRect = stage.getBoundingClientRect();
  const nextLeft = event.clientX - stageRect.left;
  const nextTop = event.clientY - stageRect.top;
  stageOverlay.style.setProperty("--overlay-cursor-x", `${nextLeft}px`);
  stageOverlay.style.setProperty("--overlay-cursor-y", `${nextTop}px`);

  const coverBlock = stageOverlay.querySelector(".cover-block");
  if (coverBlock) {
    const blockRect = coverBlock.getBoundingClientRect();
    const coverX = Math.min(Math.max(event.clientX - blockRect.left, 0), blockRect.width);
    const coverY = Math.min(Math.max(event.clientY - blockRect.top, 0), blockRect.height);
    coverBlock.style.setProperty("--cover-cursor-x", `${coverX}px`);
    coverBlock.style.setProperty("--cover-cursor-y", `${coverY}px`);
  }
}

document.getElementById("prev-slide").addEventListener("click", () => setActiveSlide(activeIndex - 1));
document.getElementById("next-slide").addEventListener("click", () => setActiveSlide(activeIndex + 1));
document.getElementById("thumbs-left").addEventListener("click", () => nudgeFilmstrip(-1));
document.getElementById("thumbs-right").addEventListener("click", () => nudgeFilmstrip(1));
globalCvLink.addEventListener("click", () => setActiveSlide(16));
stageAppBack.addEventListener("click", (event) => {
  event.stopPropagation();
  embeddedAppIndex = null;
  stageFrame.src = "about:blank";
  stageFrame.style.display = "none";
  stageImage.style.display = "block";
  stage.classList.remove("app-embed-open");
  stageAppBack.classList.remove("show");
});
stageImage.addEventListener("click", () => {
  const slide = slides[activeIndex];
  if (!slide?.embedUrl || slide.mediaType || stageImage.style.display === "none") {
    return;
  }
  embeddedAppIndex = activeIndex;
  stageImage.style.display = "none";
  stageFrame.style.display = "block";
  stageFrame.src = slide.embedUrl;
  stageFrame.title = slide.title;
  stage.classList.add("app-embed-open");
  stageAppBack.classList.add("show");
});
stageFrame.addEventListener("mouseenter", markFrameInteracting);
stageFrame.addEventListener("pointerdown", markFrameInteracting);
stageFrame.addEventListener("focus", markFrameInteracting);
stage.addEventListener("mousemove", positionInfoCard);
stage.addEventListener("mouseenter", positionInfoCard);
stage.addEventListener("mousemove", positionStageOverlayCursor);
stage.addEventListener("mouseenter", positionStageOverlayCursor);

stage.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    setActiveSlide(activeIndex - 1);
  }

  if (event.key === "ArrowRight") {
    event.preventDefault();
    setActiveSlide(activeIndex + 1);
  }
});

window.addEventListener("keydown", (event) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
    return;
  }

  if (event.key === "ArrowLeft") {
    setActiveSlide(activeIndex - 1);
  }

  if (event.key === "ArrowRight") {
    setActiveSlide(activeIndex + 1);
  }
});

stage.addEventListener("click", (event) => {
  const slide = slides[activeIndex];
  if (slide?.mediaType === "frame" && slide.activateFrameOnClick && !stage.classList.contains("frame-interacting")) {
    markFrameInteracting();
    return;
  }
  if (slide?.embedUrl && !stage.classList.contains("app-embed-open") && event.target === stageImage) {
    return;
  }
  if (window.innerWidth <= 920) {
    stage.classList.toggle("show-info");
  }
});

stageScroll.addEventListener("click", (event) => {
  if (slides[activeIndex]?.mediaType !== "scroll-image") {
    return;
  }

  event.stopPropagation();
  stageScroll.classList.toggle("zoomed");
  stage.classList.toggle("cv-zoomed", stageScroll.classList.contains("zoomed"));
  stageScroll.scrollTop = 0;
});

stageOverlay.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const slideTarget = target.dataset.slideTarget;
  if (slideTarget) {
    event.preventDefault();
    setActiveSlide(Number(slideTarget));
  }
});
