import Effect from './Effect'

export default class Canvas {
    constructor() {
        const container = document.querySelector('#works')
        const itemsWrapper = document.querySelector('.project__list')

        new Effect(container, itemsWrapper, { strength: 0.25})
    }
}