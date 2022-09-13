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
        this.container = container
        this.itemsWrapper = itemsWrapper
        if (!this.container || !this.itemsWrapper) return

        this.setup()
        this.initEffectShell()
        this.createEventListeners()
    }

    setup() {
        window.addEventListener('resize', this.onWindowResize.bind(this), false)

        // renderer
        this.renderer = new WebGLRenderer({ antialias: true, alpha: true })
        this.renderer.setSize(this.viewport.width, this.viewport.height)
        this.renderer.setPixelRatio = window.devicePixelRatio
        this.container.appendChild(this.renderer.domElement)

        // scene
        this.scene = new Scene()

        // camera
        this.camera = new PerspectiveCamera(
            40,
            this.viewport.aspectRatio,
            0.1,
            100
        )
        this.camera.position.set(1.5, 0.8, 5)

        // mouse
        this.mouse = new Vector2()

        // animation loop
        this.renderer.setAnimationLoop(this.render.bind(this))
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

    createEventListeners() {
        this.items.forEach((item, index) => {
            item.element.addEventListener('mouseover', this._onMouseOver.bind(this, index), false)
        })

        this.container.addEventListener('mousemove', this._onMouseMove.bind(this), false)
        this.itemsWrapper.addEventListener('mouseleave', this._onMouseLeave.bind(this), false)
    }

    _onMouseLeave(event) {
        this.isMouseOver = false
        this.onMouseLeave(event)
    }

    _onMouseMove(event) {
        // get normalized mouse position on viewport
        this.mouse.x = (event.clientX / this.viewport.width) * 2 - 1
        this.mouse.y = -(event.clientY / this.viewport.height) * 2 + 1

        this.onMouseMove(event)
    }

    _onMouseOver(index, event) {
        this.onMouseOver(index, event)
    }

    onWindowResize() {
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
        gsap.to(this.uniforms.uAlpha, {
            value: 0,
            ease: 'Power4.easeOut',
            duration: 0.5
        })
    }

    onMouseMove(event) {
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
            onUpdate: this.onPositionUpdate.bind(this)
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
        // let imageRatio = this.currentItem.img.naturalWidth / this.currentItem.img.naturalHeight
        let imageRatio = this.currentItem.texture.image.naturalWidth / this.currentItem.texture.image.naturalHeight

        // scale plane to fit image dimensions
        this.scale = new Vector3(imageRatio, 1, 1)
        this.plane.scale.copy(this.scale)
    }

    get viewport() {
        let width = this.container.clientWidth
        let height = this.container.clientHeight
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
        const src = check.isWebPSupported() ? ['images/webp/1.webp', 'images/webp/2.webp', 'images/webp/3.webp', 'images/webp/4.webp'] : ['images/jpg/1.png', 'images/jpg/2.png', 'images/jpg/3.jpg', 'images/jpg/4.jpg']
        // const src = ['1.png', '2.png', '3.jpg', '4.jpg']

        // create Array of items including element, image src and index
        return items.map((item, index) => ({
            element: item,
            src: src[index],
            index: index
        }))
    }
}