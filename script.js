// document.querySelector("body").addEventListener("click", () => {
//     document.querySelector(".overlay").classList.toggle("active");
// })


gsap.registerPlugin(CustomEase, Flip);

CustomEase.create("ease-out-quad", "0.25,0.46,0.45,0.94");
CustomEase.create("ease-out-quart", "0.165,0.84,0.44,1");
CustomEase.create("ease-out-cubic", "0.215,0.61,0.355,1");
CustomEase.create("ease-in-cubic", "0.55,0.055,0.675,0.19");
CustomEase.create("ease-in-quart", "0.895,0.03,0.685,0.22");


CustomEase.create("ease-in-out-quad", "0.455,0.03,0.515,0.955");
CustomEase.create("ease-in-out-cubic", "0.645,0.045,0.355,1");
CustomEase.create("ease-in-out-quart", "0.77,0,0.175,1");
CustomEase.create("ease-in-out-quint", "0.86,0,0.07,1");
CustomEase.create("ease-in-out-expo", "1,0,0,1");
CustomEase.create("ease-in-out-circ", "0.785,0.135,0.15,0.86");



function initAnimation() {

    // Vertical scrolling of the project title
    let currentStep = 0;
    let lastScrollY = 0;

    // const scrollTrigger = 10;
    
    const projectTitlesContainer = document.querySelector(".project__titles");
    
    window.addEventListener("wheel", (e) => {
        lastScrollY += e.deltaY;
        const maxScroll = projectTitlesContainer.scrollHeight - window.innerHeight;
        lastScrollY = Math.min(Math.max(lastScrollY, 0), maxScroll);
        
        // Check for enough scroll to trigger a step
        if (Math.abs(lastScrollY - currentStep * 10) >= 10) {
            currentStep += Math.sign(lastScrollY - currentStep * 10); // Update step based on scroll direction
        }
    });


    // Get the centered project title and update the color
    let lastActiveProjectTitle = null;
    let currentCenteredProjectTitle = null;

    function checkAndUpdateCenteredProjectTitle() {
        let allTitles = document.querySelectorAll(".project__titles--item span");

        for (let item of allTitles) {
            const rect = item.getBoundingClientRect();
            
            if (rect.top >= window.innerHeight / 2.1 && rect.top >= window.innerHeight / 2.15) {
                if (currentCenteredProjectTitle !== item ) {
                    if (lastActiveProjectTitle) {
                        lastActiveProjectTitle.classList.remove("active");
                    }
                    item.classList.add("active");

                    lastActiveProjectTitle = item;
                    currentCenteredProjectTitle = item;
                }
                break;
            }
        }
    }
    
    function animate() {
        projectTitlesContainer.style.transform = `translateY(-${currentStep * 5}px)`;
        checkAndUpdateCenteredProjectTitle();
        requestAnimationFrame(animate);
    }
    
    animate();
}

window.addEventListener("DOMContentLoaded", initAnimation);


// Play Video button on hover interaction
const videoItemsContainer = document.querySelector(".video__container .video__container--items");

const playVideoButtonTl = gsap.timeline({paused: true});

playVideoButtonTl.set(".video__container .video__container--items .video__container--toolkit", { yPercent: -50, xPercent: -50 })
.to(".video__container .video__container--items .video__container--toolkit", { 
    scale: 1, 
    transformOrigin: "center center", 
    duration: 0.7, 
    ease: "ease--in-out-quad",
    delay: 0.1
})
.to(".video__container--toolkit .toolkit__content span", {
    y: 0,
    stagger: 0.2,
    ease: "ease-out-quad"
})

videoItemsContainer.addEventListener("mouseenter", () => playVideoButtonTl.play())


const videosContainer = document.querySelector(".videos");

document.querySelector(".scroll__text").addEventListener("click", () => {
    let activeVideoContainer = document.querySelector(".video__wrapper:last-child");
    
    activeVideoContainer.style.animation = "slide-up 1s cubic-bezier(0.455,0.03,0.515,0.955) forwards";

    setTimeout(() => {
        activeVideoContainer.style.animation = "";

        videosContainer.prepend(activeVideoContainer);
    }, 1000);
});


document.querySelector(".move").addEventListener("click", () => {
    const lastActiveVideoContainer = document.querySelector(".video__wrapper:first-child");

    gsap.to(lastActiveVideoContainer, {
        y: "-100%",
        onComplete: () => {
            videosContainer.appendChild(lastActiveVideoContainer);
            gsap.to(lastActiveVideoContainer, {
                duration: 0.8,
                ease: "ease-in-out-quad", 
                y: 0, 
            });
        }
    });
});


// Use Flip to animate the change in size of the current video and close video button

function enlargeAndPlayCurrentVideo() {

    // Fades out all elements outside the video container except for the header
    const fadeOutAllExternalElementTl = gsap.timeline();

    fadeOutAllExternalElementTl.to([".video__container--toolkit", ".project__titles", ".scroll__text"], { autoAlpha: 0, duration: 0.1 })

    // Use of flip to enlarge the current video container and animate in the "close video" button
    const currentVideoState = Flip.getState(videoItemsContainer);

    videoItemsContainer.classList.toggle("active");

    const closeVideoButtonTl = gsap.timeline({paused: true});

    closeVideoButtonTl
    .to(".video__container .video__container--items .video__container--closeBtn", { 
        scale: 1, 
        transformOrigin: "center center", 
        duration: 0.7, 
        ease: "ease-in-out-quad"
    })
    .to(".video__container--closeBtn .closeBtn__content span", {
        y: 0,
        stagger: 0.2,
        ease: "ease-out-quad"
    });

    Flip.from(currentVideoState, {
        duration: 1.2,
        ease: "ease-in-out-quart",
        absolute: true,
        onComplete: () => {
            closeVideoButtonTl.play();

            // Get the current video element visible to the user and play or continue playing it
            const currentVideoWrapper = document.querySelector(".video__wrapper:last-child");
            const currentVideo = currentVideoWrapper.querySelector("video");

            currentVideo.play();
        }
    });
}

videoItemsContainer.addEventListener("click", enlargeAndPlayCurrentVideo);

    
// Revert the size of the current video container to default and fade in all previously faded out elements. 

const closeVideoBtn = document.querySelector(".video__container--closeBtn");

function revertCurrentVideoSize(event) {
    if(videoItemsContainer.classList.contains("active")) {
        const revertCloseVideoTextsTl = gsap.timeline();
        revertCloseVideoTextsTl.to(closeVideoBtn, { scale: 0 })
        .to(".video__container--closeBtn .closeBtn__content span", {
            y: "100%",
        });

        const fadeInAllExternalElementTl = gsap.timeline();
        fadeInAllExternalElementTl.to([".video__container--toolkit", ".project__titles", ".scroll__text"], { autoAlpha: 1, duration: 0.3, delay: 0.5 })

        const newVideoState = Flip.getState(videoItemsContainer);

        videoItemsContainer.classList.toggle("active");

        Flip.from(newVideoState, {
            duration: 1.2,
            ease: "ease-in-out-quart",
            absolute: true,
            onComplete: () => {
                fadeInAllExternalElementTl.play();

                // Get the current video element visible to the user and pause it
                const currentVideoWrapper = document.querySelector(".video__wrapper:last-child");
                const currentVideo = currentVideoWrapper.querySelector("video");

                currentVideo.pause();
            }
        });

        event.stopPropagation();
    }
}

closeVideoBtn.addEventListener("click", revertCurrentVideoSize);