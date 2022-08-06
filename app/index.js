import SmoothScroll from './components/smoothScroll'
import Show from './animations/animations'
import Canvas from './components/Canvas/index'
import Clipboard from './utils/clipboard'

import { split } from './utils/text'

class App {
    constructor() {
        this.element = document.querySelector('.app')
        this.elements = {
          wrapper: document.querySelector('.app__wrapper'),
          heroLines: document.querySelectorAll('.hero__line__wrapper'),
          heroDescription: document.querySelector('.hero__description')
        }
        
        this.init()

        // play animation only on larger viewports
        // this is not perfect solution. Make a resize function
        // because this fucks up when larger window is resized
        if(window.innerWidth > 600) {
            this.elements.heroDescriptionSpans = split({
                element: this.elements.heroDescription,
                expression: '<br>'
            })
            this.show()
        }
        // fix the bug that hero title disappears on window < 600
    }

    init() {
        new SmoothScroll(this.element, this.elements)
        new Canvas()
        new Clipboard()
    }

    show() {
        new Show(this.elements)
    }
}

new App()