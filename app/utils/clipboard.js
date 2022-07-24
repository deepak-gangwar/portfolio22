export default class Clipboard {
    constructor() {
        this.email = "deepakgangwar4265@gmail.com"
        this.headerItems = document.querySelectorAll('.header__item')
        this.contactBtn = this.headerItems[2]

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
            console.log("Email address copied to clipboard");
        })
    }
}