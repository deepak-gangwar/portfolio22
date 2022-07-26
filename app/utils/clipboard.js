export default class Clipboard {
    constructor() {
        this.email = "deepakgangwar4265@gmail.com"
        this.headerItems = document.querySelectorAll('.header__item')
        this.contactBtn = this.headerItems[2]

        this.text = document.querySelectorAll('.contact')
        this.t1 = this.text[0]
        this.t2 = this.text[1]
        
        this.handleClick()
    }

    copyToClipboardAsync(str) {
        if (navigator && navigator.clipboard && navigator.clipboard.writeText)
            return navigator.clipboard.writeText(str);
        return Promise.reject('The Clipboard API is not available.');
    };

    handleClick() {
        this.contactBtn.addEventListener('click', () => {
            this.copyToClipboardAsync(this.email)

            this.t1.style.transform = 'translateY(-100%)'
            this.t2.style.transform = 'translateY(-100%)'
        })

        this.contactBtn.addEventListener('mouseleave', () => {
            this.t1.style.transform = 'translateY(0)'
            this.t2.style.transform = 'translateY(0)'
        })
    }
}