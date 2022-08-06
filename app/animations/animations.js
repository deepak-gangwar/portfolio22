import gsap from "gsap"

export default class Show {
    constructor(elements) {
        this.tl = gsap.timeline()

        this.items = {}
        this.items.heroTitle = elements.heroLines
        this.items.heroDescriptionSpans = elements.heroDescriptionSpans

        this.init()
    }

    animationTimeline(heroLines, heroDescriptionSpans) {
        this.tl.from(heroLines, {
            duration: 1.2, 
            delay: 0.6, 
            ease: 'power3.out', 
            stagger: 0.1,
            transform: 'translate3d(0, 150%, 0) skewY(4deg)', 
            transformOrigin: 'top left', 
        })

        this.tl.to(heroDescriptionSpans, {
            autoAlpha: 1,
            y: '0',
            duration: 1,
            stagger: 0.1,
            ease: 'power3.out',
        }, '-=0.8')
    }

    init() {
        this.animationTimeline(
            this.items.heroTitle,
            this.items.heroDescriptionSpans
        )
    }
      
}