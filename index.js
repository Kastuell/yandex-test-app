const sliderWrapper1 = document.querySelector(".vasuk-transformation__slider");
const sliderContainer1 = sliderWrapper1.querySelector(".slider");
const sliderThumbsWrapper1 = sliderWrapper1.querySelector("div.thumbs");
const dotContainer1 = sliderThumbsWrapper1.querySelector("ul.dots-container");
const leftArrow1 = sliderThumbsWrapper1.querySelector(".left");
const rightArrow1 = sliderThumbsWrapper1.querySelector(".right");
const prefix1 = "vasuk-transformation-slider";

const sliderScreenSizes1 = {
  320: 1,
  768: 2,
  1024: 3,
};

class Slider {
  #current = 0;
  #slides;
  #lengthOfSlides;
  #slideWidth;
  #container;
  #slidesForView;
  #sliderScreenSizes;
  #leftArrow;
  #rightArrow;
  #currentWidth;
  #dotsLength;
  #prevDot;
  #dotContainer;
  #prefix;
  #statusContainer;
  #status;

  constructor(cfg) {
    this.#container = cfg.container;
    this.#sliderScreenSizes = cfg.sliderScreenSizes;
    this.#dotContainer = cfg.dotContainer;
    this.#leftArrow = cfg.leftArrow;
    this.#rightArrow = cfg.rightArrow;
    this.#prefix = cfg.prefix;
    this.#statusContainer = cfg.statusContainer;
  }

  move(orient, step) {
    switch (orient) {
      case "next":
        if (this.#allowedToMove(orient)) {
          this.#container.style.transform = `translateX(calc(${
            (step ? this.#current + step : this.#current + 1) *
            -this.#slideWidth
          }% - ${step ? 40 * step : 40 * (this.#current + 1)}px))`;
          if (step) this.#current += step;
          else this.#current++;
          this.#updateBtnState();
          this.#updateDots(this.#current);
          this.#createStatus();
        }
        break;

      case "prev":
        if (this.#allowedToMove(orient)) {
          this.#current--;
          this.#container.style.transform = `translateX(calc(${
            (step ? this.#current - step : this.#current) * -this.#slideWidth
          }% - ${step ? 40 * step : 40 * this.#current}px))`;
          this.#updateBtnState();
          this.#updateDots(this.#current);
          this.#createStatus();
        }
        break;
      default:
        throw new Error('Supposed to be "next" or "prev" only.');
    }
  }

  #allowedToMove(orient) {
    switch (orient) {
      case "next":
        return this.#current < this.#lengthOfSlides - this.#slidesForView;
      case "prev":
        return this.#current > 0;
      default:
        throw new Error('Supposed to be "next" or "prev" only.');
    }
  }

  initSlider() {
    this.#currentWidth = window.innerWidth;
    this.#slides = this.#container.children;
    this.#lengthOfSlides = this.#slides.length;

    this.#renewSlidesForView();
    this.#slideWidth = 100 / this.#slidesForView;
    this.#updateBtnState();
    this.#setSlidesSize();
    this.#createDots();
    this.#createStatus();
    this.#updateBtnState();
  }

  #setSlidesSize() {
    for (let i = 0; i < this.#lengthOfSlides; i++) {
      this.#slides.item(i).style.minWidth = `${this.#slideWidth}%`;
    }
  }

  #zeroing() {
    this.#current = 0;
    this.#container.style.transform = `translateX(0%)`;
  }

  #renewSlidesForView() {
    const tempObj = {};
    Object.keys(this.#sliderScreenSizes).forEach((item) => {
      tempObj[this.#currentWidth - item] = this.#sliderScreenSizes[item];
    });
    if (this.#slidesForView === Object.values(tempObj)[0]) return;

    this.#slidesForView = Object.values(tempObj)[0];
    this.#zeroing();
  }

  #updateBtnState() {
    if (this.#current === this.#lengthOfSlides - this.#slidesForView) {
      if (this.#rightArrow.length) {
        for (let i = 0; i < this.#rightArrow.length; i++) {
          this.#rightArrow[i].disabled = true;
          this.#leftArrow[i].disabled = false;
        }
      } else {
        this.#rightArrow.disabled = true;
        this.#leftArrow.disabled = false;
      }
    } else if (this.#current === 0) {
      if (this.#rightArrow.length) {
        for (let i = 0; i < this.#rightArrow.length; i++) {
          this.#rightArrow[i].disabled = false;
          this.#leftArrow[i].disabled = true;
        }
      } else {
        this.#rightArrow.disabled = false;
        this.#leftArrow.disabled = true;
      }
    } else {
      if (this.#rightArrow.length) {
        for (let i = 0; i < this.#rightArrow.length; i++) {
          this.#rightArrow[i].disabled = false;
          this.#leftArrow[i].disabled = false;
        }
      } else {
        this.#rightArrow.disabled = false;
        this.#leftArrow.disabled = false;
      }
    }
  }

  #createStatus() {
    if (this.#statusContainer) {
      for (let i = 0; i < this.#statusContainer.length; i++) {
        this.#statusContainer[i].innerHTML = "";
        this.#status = this.#current + this.#slidesForView;
        const status = document.createElement("p");
        status.innerHTML = `
            <span style="opacity: 100%;" class="current-status">${
              this.#status
            }</span>
            /
            <span style="opacity: 60%;">${this.#lengthOfSlides}</span>
            
        `;
        this.#statusContainer[i].append(status);
      }
    }
  }

  #clickOnDot(cur) {
    if (cur !== this.#prevDot) {
      const temp = cur - this.#prevDot;
      if (Math.abs(temp) === temp) {
        this.move("next", temp);
      } else {
        this.move("prev", Math.abs(temp) - 1);
      }
      this.#updateDots;
    }
  }

  #updateDots(cur) {
    if (this.#dotContainer) {
      this.#dotContainer.children[cur].ariaDisabled = true;
      this.#dotContainer.children[this.#prevDot].ariaDisabled = false;
      this.#prevDot = cur;
    }
  }

  #createDots() {
    if (this.#dotContainer) {
      if (this.#dotsLength === this.#lengthOfSlides + 1 - this.#slidesForView)
        return;
      this.#dotContainer.innerHTML = "";
      this.#prevDot = 0;
      this.#dotsLength = this.#lengthOfSlides + 1 - this.#slidesForView;
      for (let i = 0; i < this.#dotsLength; i++) {
        const dot = document.createElement("li");
        dot.className = `dot ${this.#prefix}__dot`;
        dot.ariaDisabled = false;
        dot.onclick = () => this.#clickOnDot(i);
        if (i === 0) dot.ariaDisabled = true;
        this.#dotContainer.append(dot);
      }
    }
  }
}

const slider1Cfg = {
  container: sliderContainer1,
  sliderScreenSizes: sliderScreenSizes1,
  dotContainer: dotContainer1,
  leftArrow: leftArrow1,
  rightArrow: rightArrow1,
  prefix: prefix1,
};

const slider1 = new Slider(slider1Cfg);
slider1.initSlider();

rightArrow1.addEventListener("click", () => slider1.move("next"));
leftArrow1.addEventListener("click", () => slider1.move("prev"));

window.addEventListener("resize", () => {
  slider1.initSlider();
});

const sliderWrapper2 = document.querySelector(".members__slider");
const sliderContainer2 = sliderWrapper2.querySelector(".slider");
const sliderThumbsWrapper2 = document
  .querySelector(".members")
  .querySelectorAll("div.thumbs");
const statusContainer2 = document
  .querySelector(".members")
  .querySelectorAll("div.status-container");
const leftArrow2 = document.querySelector(".members").querySelectorAll(".left");
const rightArrow2 = document
  .querySelector(".members")
  .querySelectorAll(".right");
const prefix2 = "members-slider";

const sliderScreenSizes2 = {
  320: 1,
  768: 2,
  1024: 3,
};

const slider2Cfg = {
  container: sliderContainer2,
  sliderScreenSizes: sliderScreenSizes2,
  dotContainer: null,
  leftArrow: leftArrow2,
  rightArrow: rightArrow2,
  prefix: prefix2,
  statusContainer: statusContainer2,
};

const slider2 = new Slider(slider2Cfg);
slider2.initSlider();

for (let i = 0; i < rightArrow2.length; i++) {
  rightArrow2[i].addEventListener("click", () => slider2.move("next"));
  leftArrow2[i].addEventListener("click", () => slider2.move("prev"));
}

window.addEventListener("resize", () => {
  slider2.initSlider();
});
