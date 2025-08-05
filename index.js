const vasuk_carousel = document.getElementById("vasuk_carousel");
const vasuk_slides = document.querySelectorAll(".vasuk-slide");
const vasukArrowLeft = document.getElementById("vasuk-arrow-left");
const vasukArrowRight = document.getElementById("vasuk-arrow-right");
const vasukDotContainer = document.getElementById("vasuk-dot-container");

function createCarousel(
  elem,
  slides,
  slidesToShow,
  leftArrow,
  rightArrow,
  dotContainer
) {
  if (window.innerWidth >= 300) {
    slidesToShow = 1;
  }
  if (window.innerWidth >= 768) {
    slidesToShow = 2;
  }

  if (window.innerWidth >= 1024) {
    slidesToShow = 3;
  }

  let current = 0;
  let length = slides.length;
  let slideWidth = 100 / slidesToShow;
  let dotsLengths = length - slidesToShow + 1;
  let dotsArr = [];

  //   zeroing on resize
  leftArrow.disabled = true;
  leftArrow.className += " disabled-arrow";
  rightArrow.disabled = false;
  rightArrow.className = rightArrow.className.replace(" disabled-arrow", "");
  elem.style.transform = `translateX(0%)`;

  if (dotContainer) {
    dotContainer.innerHTML = "";
    for (let i = 0; i < dotsLengths; i++) {
      if (i == 0) {
        let div = document.createElement("i");
        div.addEventListener("click", () => goToSlide(i));
        div.className = "dot active-dot";
        dotsArr.push(div);
        continue;
      }
      let div = document.createElement("i");
      div.addEventListener("click", () => goToSlide(i));
      div.className = "dot";
      dotsArr.push(div);
    }

    dotsArr.forEach((item) => dotContainer.append(item));
  }

  slides.forEach((slide) => {
    slide.style.minWidth = `${slideWidth}%`;
  });

  let dots = document.querySelectorAll(".dot");

  function next() {
    if (!rightArrow.disabled) {
      if (current < dotsLengths - 1 || (!dotContainer && current < length)) {
        leftArrow.className = leftArrow.className.replace(
          " disabled-arrow",
          ""
        );
        leftArrow.disabled = false;
        if (dotContainer) {
          dots[current].className = dots[current].className.replace(
            " active-dot",
            ""
          );
        }

        elem.style.transform = `translateX(${(current + 1) * -slideWidth}%)`;
        current++;
        if (dotContainer) dots[current].className += " active-dot";
      }
      if (
        (dotContainer && current + 1 == dotsLengths) ||
        (!dotContainer && current + slidesToShow == length)
      ) {
        rightArrow.className += " disabled-arrow";
        rightArrow.disabled = true;
      }
    }
  }

  function prev() {
    if (!leftArrow.disabled) {
      if (current <= dotsLengths && current > 0) {
        rightArrow.className = rightArrow.className.replace(
          " disabled-arrow",
          ""
        );
        rightArrow.disabled = false;

        if (dotContainer)
          dots[current].className = dots[current].className.replace(
            " active-dot",
            ""
          );
        current--;
        elem.style.transform = `translateX(${current * -slideWidth}%)`;
        if (dotContainer) dots[current].className += " active-dot";
      }

      if (current == 0) {
        leftArrow.className += " disabled-arrow";
        leftArrow.disabled = true;
      }
    }
  }

  function goToSlide(index) {
    if (index > current) {
      let temp = index - current;
      for (let i = 0; i < temp; i++) next();
    } else if (index < current) {
      let temp = current - index;
      for (let i = 0; i < temp; i++) prev();
    }
  }

  function getCurrent() {
    return current + slidesToShow;
  }

  function setCurrentZero() {
    current = 0;
  }

  return {
    prev,
    next,
    getCurrent,
    goToSlide,
    setCurrentZero,
  };
}

let carousel1 = createCarousel(
  vasuk_carousel,
  vasuk_slides,
  1,
  vasukArrowLeft,
  vasukArrowRight,
  vasukDotContainer
);

let { next: vNext, prev: vPrev } = carousel1;
vasukArrowLeft.addEventListener("click", vPrev);
vasukArrowRight.addEventListener("click", vNext);

window.addEventListener("resize", () => {
  carousel1.setCurrentZero();
  carousel1 = createCarousel(
    vasuk_carousel,
    vasuk_slides,
    1,
    vasukArrowLeft,
    vasukArrowRight,
    vasukDotContainer
  );
});

const membersSlider = document.getElementById("members-slider");
const membSlides = document.querySelectorAll(".slide-members");
const membersArrowLeft = document.getElementById("members-arrow-left");
const membersArrowRight = document.getElementById("members-arrow-right");
const membersStatus = document.getElementById("members-status");

let carousel2 = createCarousel(
  membersSlider,
  membSlides,
  1,
  membersArrowLeft,
  membersArrowRight,
  null
);

let { next: mNext, prev: mPrev, getCurrent: mGetCurrent } = carousel2;
membersStatus.innerHTML = `
        <span class="slider-status__current">${mGetCurrent()}</span> / ${
    membSlides.length
  }
    `;

function membersNext() {
  mNext();
  membersStatus.innerHTML = `
        <span class="slider-status__current">${mGetCurrent()}</span> / ${
    membSlides.length
  }
    `;
}

function membersPrev() {
  mPrev();
  membersStatus.innerHTML = `
        <span class="slider-status__current">${mGetCurrent()}</span> / ${
    membSlides.length
  }
    `;
}

membersArrowLeft.addEventListener("click", membersPrev);
membersArrowRight.addEventListener("click", membersNext);

window.addEventListener("resize", () => {
  carousel2.setCurrentZero();
  carousel2 = createCarousel(
    membersSlider,
    membSlides,
    1,
    membersArrowLeft,
    membersArrowRight,
    null
  );
});
