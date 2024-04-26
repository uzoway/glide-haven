// document.querySelector("body").addEventListener("click", () => {
//     document.querySelector(".overlay").classList.toggle("active");
// })


gsap.registerPlugin(CustomEase, Flip);

CustomEase.create("ease-out-quad", "0.25,0.46,0.45,0.94");
CustomEase.create("ease-out-quart", "0.165,0.84,0.44,1");
CustomEase.create("ease-out-cubic", "0.215,0.61,0.355,1");
CustomEase.create("ease-in-cubic", "0.55,0.055,0.675,0.19");
CustomEase.create("ease-in-quart", "0.895,0.03,0.685,0.22");


function initAnimation() {

    // Vertical scrolling of the project title
    let currentStep = 0;
    let lastScrollY = 0;
    
    const projectTitlesContainer = document.querySelector(".project__titles");
    
    window.addEventListener("wheel", (e) => {
        lastScrollY += e.deltaY;
        const maxScroll = projectTitlesContainer.scrollHeight - window.innerHeight;
        lastScrollY = Math.min(Math.max(lastScrollY, 0), maxScroll);
        
        // Check for enough scroll to trigger a step
        if (Math.abs(lastScrollY - currentStep * 3.5) >= 3.5) {
            currentStep += Math.sign(lastScrollY - currentStep * 3.5); // Update step based on scroll direction
        }
    });


    // Get the centered project title and update the color
    let lastActiveProjectTitle = null;
    let currentCenteredProjectTitle = null;

    function checkAndUpdateCenteredProjectTitle() {
        let allTitles = document.querySelectorAll(".project__titles--item span");

        for (let item of allTitles) {
            const rect = item.getBoundingClientRect();
            
            if (rect.top >= window.innerHeight / 2.1) {
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
        projectTitlesContainer.style.transform = `translateY(-${currentStep * 3.5}px)`;
        checkAndUpdateCenteredProjectTitle();
        requestAnimationFrame(animate);
    }
    
    animate();
}

window.addEventListener("DOMContentLoaded", initAnimation);


// Play Video button on hover interaction
const videoItemsContainer = document.querySelector(".video__container--items");

const playVideoButtonTl = gsap.timeline({paused: true});

playVideoButtonTl.set(".video__container .video__container--items .video__container--toolkit", { yPercent: -50, xPercent: -50 })
                .to(".video__container .video__container--items .video__container--toolkit", { 
                    scale: 1, 
                    transformOrigin: "center center", 
                    duration: 1.7, 
                    ease: "expo.inOut"
                })
                .to(".video__container--toolkit .toolkit__content span", {
                    y: 0,
                    stagger: 0.1,
                    duration: 0.5,
                    ease: "expo.out"
                })


videoItemsContainer.addEventListener("mouseenter", () => playVideoButtonTl.play())


const videosContainer = document.querySelector(".videos");

document.querySelector(".scroll__text").addEventListener("click", () => {
    let activeVideoContainer = document.querySelector(".video__wrapper:last-child");
    
    activeVideoContainer.style.animation = "slide-up 1s cubic-bezier(0.165,0.84,0.44,1) forwards";

    setTimeout(() => {
        activeVideoContainer.style.animation = "";

        videosContainer.prepend(activeVideoContainer);
    }, 1000);
});


document.querySelector(".move").addEventListener("click", () => {
    let lastActiveVideoContainer = document.querySelector(".video__wrapper:first-child");

    gsap.timeline()
    .set(lastActiveVideoContainer, {
        yPercent: -100,
        onComplete: () => {
            videosContainer.append(lastActiveVideoContainer);
        }
    })
    .to(lastActiveVideoContainer, {
        yPercent: 0,
        duration: 1,
        ease: "ease-out-quart"
    })
});