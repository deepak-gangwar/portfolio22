import gsap from "gsap"

export default class Show {
    constructor(elements) {
        this.tl = gsap.timeline()

        this.items = {}
        this.items.heroTitle = elements.heroLines
        this.items.heroDescriptionSpans = elements.heroDescriptionSpans

        this.init()
    }

    animateHeroTitle (el) {
        this.tl.to(el, {
            duration: 1.2, 
            delay: 0.6, 
            ease: 'power3.out', 
            stagger: 0.1,
            transform: 'translate3d(0, 0, 0) skewY(0)', 
            transformOrigin: 'top left', 
        })
    }

    animateHeroDescription (el) {
        this.tl.from(el, {
            autoAlpha: 0,
            y: '200%',
            duration: 1,
            stagger: 0.1,
            ease: 'power3.out',
        }, '-=0.8')
    }

    init () {
        this.animateHeroTitle(this.items.heroTitle)
        this.animateHeroDescription(this.items.heroDescriptionSpans)
    }
      
}