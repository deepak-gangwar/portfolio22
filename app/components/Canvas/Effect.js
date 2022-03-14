import * as THREE from 'three'
import EffectShell from './EffectShell'

export default class Effect extends EffectShell {
    constructor(container = document.querySelector('#work'), itemsWrapper = null, options = {}) {
        super(container, itemsWrapper)
        if(!this.container || !this.itemsWrapper) return
        
        options.strength = options.strength || 0.25
        this.options = options

        this.init()
    } 

    init() {
        this.position = new THREE.Vector3(0, 0, 0)
        this.scale = new THREE.Vector3(1, 1, 1)
        this.geometry = new THREE.PlaneBufferGeometry(1, 1, 32, 32)
        this.uniforms = {
            uTexture: { value: null },
            uOffset: { value: new THREE.Vector2(0.0, 0.0) },
            uAlpha: { value: 0 }
        }
        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: `
                uniform vec2 uOffset;
                varying vec2 vUv;

                #define PI 3.1415926535897932384626433832795

                vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
                    position.x = position.x + (sin(uv.y * PI) * offset.x);
                    position.y = position.y + (sin(uv.x * PI) * offset.y);
                    return position;
                }
                    
                void main() {
                  vUv = uv;
                  vec3 newPosition = deformationCurve(position, uv, uOffset);
                  gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
                }
            `,
            fragmentShader: `
                uniform sampler2D uTexture;
                uniform float uAlpha;
                varying vec2 vUv;
                    
                void main() {
                  vec3 color = texture2D(uTexture,vUv).rgb;
                  gl_FragColor = vec4(color,uAlpha);
                }
            `,
            transparent: true
        })
        this.plane = new THREE.Mesh(this.geometry, this.material)
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