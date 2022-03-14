class App {
    constructor() {
        this.element = document.querySelector('.app')
        this.elements = {
          wrapper: document.querySelector('.app__wrapper'),
          heroLines: document.querySelectorAll('.hero__line__wrapper'),
          heroDescription: document.querySelector('.hero__description')
        }
    }
}

new App()