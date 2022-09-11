export default class Clipboard {
    constructor() {
        this.bind()

        this.email = "deepakgangwar4265@gmail.com"
        this.headerItems = document.querySelectorAll('.header__item')
        this.contactBtn = this.headerItems[2]
        this.texts = document.querySelectorAll('.contact')
        
        this.init()
    }

    bind() {
        ['on', 'off', 'handleClick'].forEach(fn => this[fn] = this[fn].bind(this))
    }

    copyToClipboardAsync(str) {
        if (navigator && navigator.clipboard && navigator.clipboard.writeText)
            return navigator.clipboard.writeText(str)
        return Promise.reject('The Clipboard API is not available.')
    }

    handleClick() {
        this.copyToClipboardAsync(this.email)
        this.texts.forEach(text => {
            text.style.transform = `translateY(-200%)`
        })
    }

    on() {
        this.texts.forEach(text => {
            text.style.transform = `translateY(-100%)`
        })
    }

    off() {
        this.texts.forEach(text => {
            text.style.transform = `translateY(0)`
        })
    }

    addEventListeners() {
        this.contactBtn.addEventListener('mouseenter', this.on)
        this.contactBtn.addEventListener('mouseleave', this.off)
        this.contactBtn.addEventListener('click', this.handleClick)
    }
    
    removeEventListeners() {
        this.contactBtn.removeEventListener('mouseenter', this.on)
        this.contactBtn.removeEventListener('mouseleave', this.off)
        this.contactBtn.removeEventListener('click', this.handleClick)
    }

    init() {
        this.addEventListeners()
    }
}