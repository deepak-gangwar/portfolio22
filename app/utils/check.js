class Check {
    isMobile() {
        if (!(/iPhone|iPad|iPod|Android|webOS|BlackBerry|Opera Mini|IEMobile/i.test(navigator.userAgent))) {
            return false
        } else {
            return true
        }
    }
    
    isWebPSupported() {
        if (!this.isWebPChecked) {
            this.isWebPChecked = true
            const canvas = document.createElement("canvas")
            if(canvas.getContext && canvas.getContext('2d')) {
                this.isWebPCheck = 0 === canvas.toDataURL("image/webp").indexOf("data:image/webp")
            }
        }
        return this.isWebPCheck
    }
}

export const check = new Check()