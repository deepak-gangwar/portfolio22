import SmoothScroll from './components/smoothScroll'
import Show from './animations/animations'
import Canvas from './components/Canvas/index'

import { split } from './utils/text'

class App {
    constructor() {
        this.element = document.querySelector('.app')
        this.elements = {
          wrapper: document.querySelector('.app__wrapper'),
          heroLines: document.querySelectorAll('.hero__line__wrapper'),
          heroDescription: document.querySelector('.hero__description')
        }

        this.elements.heroDescriptionSpans = split({
            element: this.elements.heroDescription,
            expression: '<br>'
        })
        
        this.init()
        this.show()
    }

    init() {
        new SmoothScroll(this.element, this.elements)
        new Canvas()
    }

    show() {
        new Show(this.elements)
    }
}

new App()