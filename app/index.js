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
        this.styleConsoleForDevs()
        
        // play animation only on larger viewports
        // this is not perfect solution. Make a resize function
        // because this fucks up when larger window is resized
        if (window.innerWidth > 600) {
            this.elements.heroDescriptionSpans = split({
                element: this.elements.heroDescription,
                expression: '<br>'
            })
            this.show()
        }
    }

    // if it is not a mobile device then you run the code.
    isMobile() {
        if (!(/iPhone|iPad|iPod|Android|webOS|BlackBerry|Opera Mini|IEMobile/i.test(navigator.userAgent))) {
            return false
        } else {
            return true
        }
    }

    init() {
        if (!this.isMobile()) {
            new SmoothScroll(this.element, this.elements)
        }
        new Canvas()
        new Clipboard()
    }

    show() {
        new Show(this.elements)
    }

    styleConsoleForDevs() {
        // 1. Pass CSS styles in an array
        const style1 = [
            'font-family: Helvetica',
            'padding-top: 20px',
            'padding-bottom: 20px',
            'font-size: 1.2rem',
        ].join(';')// 2. Concatenate the individual array item and concatenate them into a string separated by a semi-colon (;)
    
        const style2 = [
            'color: red',
            'padding-top: 20px',
            'padding-bottom: 20px',
            'font-size: 1.2rem',
        ].join(';')
    
        const styleLink = [
            'font-size: .7rem',
            'padding-bottom: 20px',
            // 'font-family: Helvetica',
        ].join(';')
    
        // 3. Pass the styles variable
        console.log('%cMade with %c♥%c by Deepak Gangwar%c\n✌ https://deepakgangwar.me', style1, style2, style1, styleLink)
        // console.log('http://deepakgangwar.me');
    }
}

new App()