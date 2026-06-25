const stage = document.querySelector(".phone-stage");
const hotspotButtons = document.querySelectorAll("[data-hotspot]");
const closeFocusButton = document.querySelector(".focus-close");
const fragmentCards = document.querySelectorAll(".fragment-card");
const lightBeams = document.querySelectorAll(".light-beam");
const transitionVideo = document.querySelector(".transition-video");
const primaryAction = document.querySelector(".primary-action");
const secondaryAction = document.querySelector(".secondary-action");
const bottomTitle = document.querySelector(".bottom-card h2");
const roundButton = document.querySelector(".round-button");

const fragments = [
  {
    title: "把自己的作品从脑子里拿出来",
    step: "用 30 分钟写出一个项目的一页说明。"
  },
  {
    title: "重新拿回一个不被打断的下午",
    step: "关掉非必要消息，完成一次完整思考。"
  }
];

let selectedFragmentIndex = 0;

function setMode(mode) {
  stage.dataset.mode = mode;
}

function enterLightFocus() {
  lightBeams.forEach((beam) => {
    beam.style.animation = "none";
    beam.offsetHeight;
    beam.style.animation = "";
  });

  setMode("light");
}

function openLightFocus() {
  if (!transitionVideo) {
    enterLightFocus();
    return;
  }

  setMode("transition");
  transitionVideo.currentTime = 0;

  const playback = transitionVideo.play();
  if (playback) {
    playback.catch(() => enterLightFocus());
  }
}

function closeFocus() {
  if (transitionVideo) {
    transitionVideo.pause();
  }
  setMode("default");
}

function selectFragment(index) {
  selectedFragmentIndex = index;
  fragmentCards.forEach((card, cardIndex) => {
    card.classList.toggle("is-selected", cardIndex === index);
  });
}

function anchorSelectedLight() {
  const fragment = fragments[selectedFragmentIndex];
  if (bottomTitle) {
    bottomTitle.textContent = fragment.step.replace("。", "，观察真实反馈");
  }
  if (roundButton) {
    roundButton.textContent = "选择本周现实回合";
  }
  closeFocus();
  stage.classList.add("has-anchored-light");
}

hotspotButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const hotspot = button.dataset.hotspot;

    if (hotspot === "light") {
      openLightFocus();
      return;
    }

    button.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.035)" },
        { transform: "scale(1)" }
      ],
      {
        duration: 360,
        easing: "ease-out"
      }
    );
  });
});

fragmentCards.forEach((card, index) => {
  card.addEventListener("click", () => selectFragment(index));
});

closeFocusButton.addEventListener("click", closeFocus);
primaryAction.addEventListener("click", anchorSelectedLight);

if (transitionVideo) {
  transitionVideo.addEventListener("ended", enterLightFocus);
  transitionVideo.addEventListener("error", enterLightFocus);
}

secondaryAction.addEventListener("click", () => {
  const fragment = fragments[selectedFragmentIndex];
  const editedTitle = window.prompt("编辑这束引光", fragment.title);

  if (!editedTitle || !editedTitle.trim()) {
    return;
  }

  fragment.title = editedTitle.trim();
  const selectedCard = fragmentCards[selectedFragmentIndex];
  selectedCard.querySelector("strong").textContent = fragment.title;
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeFocus();
  }
});
