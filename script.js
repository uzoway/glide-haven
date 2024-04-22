document.querySelector("body").addEventListener("click", () => {
    document.querySelector(".overlay").classList.toggle("active");
})


gsap.registerPlugin(CustomEase, Flip);

CustomEase.create("ease-out-quad", "0.25,0.46,0.45,0.94");
CustomEase.create("ease-out-quart", "0.165,0.84,0.44,1");
CustomEase.create("ease-out-cubic", "0.215,0.61,0.355,1");
CustomEase.create("ease-in-cubic", "0.55,0.055,0.675,0.19");


function initAnimation() {

}

window.addEventListener("DOMContentLoaded", initAnimation);