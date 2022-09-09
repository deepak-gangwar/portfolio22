import gsap from "gsap"
import Transition from "./transition"

export default class Preloader {
    constructor() {
        this.bind()
        
        this.element = document.querySelector('.preloader')
        this.elements = {
            title: this.element.querySelector('.preloader__text-inner'),
            number: this.element.querySelector('.preloader__number-inner'),
        }
        
        this.transition = new Transition()
		this.tl = new gsap.timeline({ 
            duration: 1.5, 
            defaults: {
                ease: 'power3.in'
            } 
        })

        this.init()
    }

    bind() {
        ['onLoad'].forEach(fn => this[fn] =  this[fn].bind(this))
    }

    onLoad() {
        this.tl.to(this.elements.title, { transform: 'translate3d(0, 100%, 0) skewY(0deg)' }, 1.4)
        this.tl.to(this.elements.number, { transform: 'translate3d(0, 100%, 0) skewY(0deg)' }, 1.2)
        this.tl.add(() => document.body.classList.remove('is-loading'))
        this.tl.set(document.body, { overflow: 'visible' })
        this.tl.set(this.element, { display: 'none' })
        this.tl.add(() => this.transition.in(), 2.3)

        // window.setTimeout(() => {
            // document.body.classList.remove('is-loading')
            // document.body.style.overflow = 'visible'
            // this.element.style.display = 'none'
            // this.transition.in()
        // }, 2000)
    }

    addEventListeners() {
        window.addEventListener('load', this.onLoad)
    }

    init() {
        this.addEventListeners()
    }
}