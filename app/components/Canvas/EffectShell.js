// import * as THREE from 'three'
// import { WebGLRenderer, Scene, PerspectiveCamera, Vector2, Vector3, TextureLoader } from 'three'
import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer'
import { Scene } from 'three/src/scenes/Scene'
import { PerspectiveCamera } from 'three/src/cameras/PerspectiveCamera'
import { Vector2 } from 'three/src/math/Vector2'
import { Vector3 } from 'three/src/math/Vector3'
import { TextureLoader } from 'three/src/loaders/TextureLoader'

import gsap from 'gsap'
import { check } from '../../utils/check'

export default class EffectShell {
    constructor(container = document.querySelector('#work'), itemsWrapper = null) {
        this.bind()

        this.main = document.querySelector('main')
        this.container = container
        this.itemsWrapper = itemsWrapper
        if (!this.container || !this.itemsWrapper) return

        // mouse
        this.mouse = new Vector2()

        this.setup()
        this.initEffectShell()
        this.addEventListeners()
    }

    bind() {
        ['render', 'onResize', 'onMouseMove', 'onMouseLeave', 'onPositionUpdate'].forEach(fn => this[fn] = this[fn].bind(this))
    }

    createRenderer() {
        this.renderer = new WebGLRenderer({ antialias: true, alpha: true })
        this.renderer.setSize(this.viewport.width, this.viewport.height)
        this.renderer.setPixelRatio = window.devicePixelRatio
        this.renderer.domElement.classList.add('gl-project-hover')
        // this.container.appendChild(this.renderer.domElement)
        this.main.insertAdjacentElement('afterend', this.renderer.domElement)
    }

    createScene() {
        this.scene = new Scene()
    }

    createCamera() {
        this.camera = new PerspectiveCamera(
            40,
            this.viewport.aspectRatio,
            0.1,
            100
        )
        let posX = window.innerWidth < 480 ? 0 : 1.5
        this.camera.position.set(posX, 0, 4.2)
    }

    setup() {
        this.createRenderer()
        this.createScene()
        this.createCamera()

        // animation loop
        this.renderer.setAnimationLoop(this.render)
    }

    render() {
        // called every frame
        this.renderer.render(this.scene, this.camera)
    }

    initEffectShell() {
        this.items = this.itemsElements

        let textureCount = 0
        const preloaderNum = document.querySelector('.preloader__number-inner').children[0]

        const textureLoader = new TextureLoader()
        this.items.forEach((item, index) => {
            textureLoader.load(item.src, (texture) => {
                this.items[index].texture = texture
                this.isLoaded = true

                textureCount++
                preloaderNum.textContent = `${Math.round((textureCount / this.items.length) * 100)}%`
            })
        })
    }

    addEventListeners() {
        window.addEventListener('resize', this.onResize, false)

        this.items.forEach((item, index) => {
            item.element.addEventListener('mouseover', this._onMouseOver.bind(this, index), false)
        })

        this.container.addEventListener('mousemove', this.onMouseMove, false)
        this.itemsWrapper.addEventListener('mouseleave', this.onMouseLeave, false)
    }

    _onMouseOver(index, event) {
        this.onMouseOver(index, event)
    }

    onResize() {
        // this bit was added later on
        // on mobile you dont see this effect, but on small width desktop screens 
        // the effect will come to center and not get cropped on left side
        this.camera.position.x = window.innerWidth < 480 ? 0 : 1.5

        this.camera.aspect = this.viewport.aspectRatio
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(this.viewport.width, this.viewport.height)
    }

    onUpdate() { }

    onMouseEnter() {
        if (!this.currentItem || !this.isMouseOver) {
            this.isMouseOver = true
            // show plane
            gsap.to(this.uniforms.uAlpha, {
                value: 1,
                ease: 'Power4.easeOut',
                duration: 0.5
            })
        }
    }

    onMouseLeave(event) {
        this.isMouseOver = false
        gsap.to(this.uniforms.uAlpha, {
            value: 0,
            ease: 'Power4.easeOut',
            duration: 0.5
        })
    }

    onMouseMove(event) {
        // get normalized mouse position on viewport
        this.mouse.x = (event.clientX / this.viewport.width) * 2 - 1
        this.mouse.y = -(event.clientY / this.viewport.height) * 2 + 1

        // project mouse position to world coordinates
        let x = this.mouse.x.map(-1, 1, -this.viewSize.width / 2, this.viewSize.width / 2)
        let y = this.mouse.y.map(-1, 1, -this.viewSize.height / 2, this.viewSize.height / 2)

        // update the plane position
        this.position = new Vector3(x, y, 0)
        gsap.to(this.plane.position, {
            x: x,
            y: y,
            duration: 1,
            ease: 'Power4.easeOut',
            onUpdate: this.onPositionUpdate
        })
    }

    onMouseOver(index, e) {
        if (!this.isLoaded) return
        this.onMouseEnter()
        if (this.currentItem && this.currentItem.index === index) return
        this.onTargetChange(index)
    }

    onTargetChange(index) {
        // item target changed
        this.currentItem = this.items[index]
        if (!this.currentItem.texture) return

        // update texture
        this.uniforms.uTexture.value = this.currentItem.texture

        // compute imaege ratio
        let imageRatio = this.currentItem.texture.image.naturalWidth / this.currentItem.texture.image.naturalHeight

        // scale plane to fit image dimensions
        this.scale = new Vector3(imageRatio, 1, 1)
        this.plane.scale.copy(this.scale)
    }

    get viewport() {
        // This bit was updated in order to make a full screen canvas
        // otherwise we were getting a wierd crop at the bottom
        let width = window.innerWidth
        let height = window.innerHeight
        // let width = this.container.clientWidth
        // let height = this.container.clientHeight
        let aspectRatio = width / height
        return {
            width,
            height,
            aspectRatio
        }
    }

    get viewSize() {
        // fit plane to screen
        // https://gist.github.com/ayamflow/96a1f554c3f88eef2f9d0024fc42940f

        let distance = this.camera.position.z
        let vFov = (this.camera.fov * Math.PI) / 180
        let height = 2 * Math.tan(vFov / 2) * distance
        let width = height * this.viewport.aspectRatio
        return { width, height, vFov }
    }
    
    get itemsElements() {
        // convert NodeList to Array
        const items = [...this.itemsWrapper.querySelectorAll('.project__link')]
        // const src = check.isWebPSupported() ? ['images/webp/1.webp', 'images/webp/2.webp', 'images/webp/3.webp', 'images/webp/4.webp'] : ['images/jpg/1.png', 'images/jpg/2.png', 'images/jpg/3.jpg', 'images/jpg/4.jpg']

        let src = []
        if(check.isAvifSupported) {
            src = ['images/avif/1.avif', 'images/avif/2.png', 'images/avif/3.png', 'images/avif/4.avif', 'images/avif/5.avif', 'images/avif/6.avif']
        } else if(check.isWebPSupported) {
            src = ['images/webp/1.webp', 'images/webp/2.png', 'images/webp/3.png', 'images/webp/4.webp', 'images/webp/5.webp', 'images/webp/6.webp']
        } else {
            src = ['images/jpg/1.png', 'images/jpg/2.png', 'images/jpg/3.png', 'images/jpg/4.jpg', 'images/jpg/5.jpg', 'images/jpg/6.jpg']
        }

        // create Array of items including element, image src and index
        return items.map((item, index) => ({
            element: item,
            src: src[index],
            index: index
        }))
    }
}