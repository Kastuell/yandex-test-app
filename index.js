const vasuk_carousel = document.getElementById("vasuk_carousel")
const vasuk_slides = document.querySelectorAll('.vasuk-slide');
const vasukArrowLeft = document.getElementById("vasuk-arrow-left")
const vasukArrowRight = document.getElementById("vasuk-arrow-right")
const vasukDotContainer = document.getElementById("vasuk-dot-container")

function createCarousel(elem, slides, slidesToShow, leftArrow, rightArrow, dotContainer) {

    let current = 0;
    let length = slides.length;
    let slideWidth = 100 / slidesToShow;
    let dotsLengths = Math.ceil(length / slidesToShow) + 1

    let dotsArr = [];

    if (dotContainer) {
        dotContainer.innerHTML = "";
        // console.log(dotContainer)
        for (let i = 0; i < dotsLengths; i++) {
            if (i == 0) {
                let div = document.createElement('i');
                div.addEventListener("click", () => goToSlide(i))
                div.className = "vasuk-dot active-dot";
                dotsArr.push(div)
                continue;
            }
            let div = document.createElement('i');
            div.addEventListener("click", () => goToSlide(i))
            div.className = "vasuk-dot";
            dotsArr.push(div)
        }

        dotsArr.forEach(item =>
            dotContainer.append(item)
        )
    }



    slides.forEach(slide => {
        slide.style.minWidth = `${slideWidth}%`;
    });




    let next = () => {
        if (current < dotsLengths - 1) {
            leftArrow.className = leftArrow.className.replace(" disabled-arrow", "")
            leftArrow.setAttribute("disabled", false);
            if (dotContainer) dotsArr[current].className = dotsArr[current].className.replace(" active-dot", "");
            elem.style.transform = `translateX(${(current + 1) * -slideWidth}%)`;
            current++;
            if (dotContainer) dotsArr[current].className = `${dotsArr[current]?.className} active-dot`
        }

        if (current + 1 == dotsLengths) {
            rightArrow.className = `${rightArrow.className} disabled-arrow`
            leftArrow.setAttribute("disabled", true);
        }
    }

    function prev() {
        if (current <= dotsLengths && current > 0) {
            rightArrow.className = rightArrow.className.replace(" disabled-arrow", "")
            rightArrow.setAttribute("disabled", false);

            if (dotContainer) dotsArr[current].className = dotsArr[current].className.replace(" active-dot", "")
            current--;
            elem.style.transform = `translateX(${current * -slideWidth}%)`
            if (dotContainer) dotsArr[current].className = `${dotsArr[current].className} active-dot`
        }

        if (current == 0) {
            leftArrow.className = `${leftArrow.className} disabled-arrow`
            leftArrow.setAttribute("disabled", true);
        }
    }

    function goToSlide(index) {
        if (index > current) {
            let temp = index - current
            for (let i = 0; i < temp; i++) next()
        } else if (index < current) {
            let temp = current - index
            for (let i = 0; i < temp; i++) prev()
        }
    }

    function getCurrent() { return current; }

    return {
        prev, next, getCurrent, goToSlide
    }
}

function initCarousel(elem, slides, slidesToShow = 1, leftArrow, rightArrow, dotContainer) {
    if (window.innerWidth >= 768) {
        slidesToShow = 2;
    }

    if (window.innerWidth >= 1024) {
        slidesToShow = 3;
    }

    return createCarousel(
        elem, slides, slidesToShow, leftArrow, rightArrow, dotContainer
    );
}


let carousel1 = initCarousel(vasuk_carousel, vasuk_slides, 1, vasukArrowLeft, vasukArrowRight, vasukDotContainer)

let { next: vNext, prev: vPrev, getCurrent: vGetCurrent, goToSlide: vGoToSlide } = carousel1

vasukArrowLeft.addEventListener('click', vPrev)
vasukArrowRight.addEventListener('click', vNext)


// const membersSlider = document.getElementById("members-slider")
// const membSlides = document.querySelectorAll(".slide-members")
// const membersArrowLeft = document.getElementById("members-arrow-left")
// const membersArrowRight = document.getElementById("members-arrow-right")
// const membersStatus = document.getElementById("members-status")


// const { next: mNext, prev: mPrev, getCurrent: mGetCurrent } = createCarousel(membersSlider, membSlides, 1, membersArrowLeft, membersArrowRight, null)

// function membersNext() {
//     mNext()
//     membersStatus.innerHTML = `
//         <span class="slider-status__current">${mGetCurrent() + 1}</span> / ${membSlides.length}
//     `
// }

// function membersPrev() {
//     mPrev()
//     membersStatus.innerHTML = `
//         <span class="slider-status__current">${mGetCurrent() + 1}</span> / ${membSlides.length}
//     `
// }

// membersArrowLeft.addEventListener("click", membersPrev)
// membersArrowRight.addEventListener("click", membersNext)


window.addEventListener('resize', () => {
    carousel1 = initCarousel(vasuk_carousel, vasuk_slides, 1, vasukArrowLeft, vasukArrowRight, vasukDotContainer)
});