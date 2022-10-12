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

    isAvifSupported() {
        new Promise(() => {
            const image = new Image();
            image.onerror = () => /* do something */
            image.onload = () => /* do something */
            image.src =
                "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A="
        }).catch(() => false)
    }
}

export const check = new Check()