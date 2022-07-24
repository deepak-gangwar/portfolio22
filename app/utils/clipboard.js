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
                        
            const btn = this.contactBtn
            btn.innerHTML = "EMAIL COPIED!"
            
            setTimeout(() => {
                this.contactBtn.innerHTML = "CONTACT ME"
            }, 1500)

            console.log("Email address copied to clipboard");
        })
    }
}