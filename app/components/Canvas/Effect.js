// import * as THREE from 'three'
// import { Vector2, Vector3, PlaneGeometry, ShaderMaterial, Mesh } from 'three'
import { Vector2 } from 'three/src/math/Vector2'
import { Vector3 } from 'three/src/math/Vector3'
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry'
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial'
import { Mesh } from 'three/src/objects/Mesh'

import EffectShell from './EffectShell'

import vertex from './shaders/vert.glsl'
import fragment from './shaders/frag.glsl'

export default class Effect extends EffectShell {
    constructor(container = document.querySelector('#work'), itemsWrapper = null, options = {}) {
        super(container, itemsWrapper)
        if(!this.container || !this.itemsWrapper) return
        
        options.strength = options.strength || 0.25
        this.options = options

        this.init()
    } 

    init() {
        this.position = new Vector3(0, 0, 0)
        this.scale = new Vector3(1, 1, 1)
        this.geometry = new PlaneGeometry(1, 1, 32, 32)
        this.uniforms = {
            uTexture: { value: null },
            uOffset: { value: new Vector2(0.0, 0.0) },
            uAlpha: { value: 0 }
        }
        this.material = new ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: vertex,
            fragmentShader: fragment,
            transparent: true
        })
        this.plane = new Mesh(this.geometry, this.material)
        this.scene.add(this.plane)
    }

    onPositionUpdate() {
        // compute offset
        let offset = this.plane.position
            .clone()
            .sub(this.position) // velocity
            .multiplyScalar(-this.options.strength)
        this.uniforms.uOffset.value = offset
    }
}