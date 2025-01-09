const blendModeFunctions = `
vec3 blendNormal(vec3 base, vec3 blend) {
    return blend;
}

vec3 blendMultiply(vec3 base, vec3 blend) {
    return base * blend;
}

vec3 blendScreen(vec3 base, vec3 blend) {
    return 1.0 - (1.0 - base) * (1.0 - blend);
}

vec3 blendOverlay(vec3 base, vec3 blend) {
    return mix(
        2.0 * base * blend,
        1.0 - 2.0 * (1.0 - base) * (1.0 - blend),
        step(0.5, base)
    );
}

vec3 blendDarken(vec3 base, vec3 blend) {
    return min(base, blend);
}

vec3 blendLighten(vec3 base, vec3 blend) {
    return max(base, blend);
}

vec3 applyBlendMode(vec3 base, vec3 blend, int mode) {
    if (mode == 0) return blendNormal(base, blend);
    if (mode == 1) return blendMultiply(base, blend);
    if (mode == 2) return blendScreen(base, blend);
    if (mode == 3) return blendOverlay(base, blend);
    if (mode == 4) return blendDarken(base, blend);
    if (mode == 5) return blendLighten(base, blend);
    return blend;
}
`;

export const defaultVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const defaultFragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float brightness;
  uniform float contrast;
  uniform float saturation;
  uniform float hue;
  uniform int blendMode;
  varying vec2 vUv;

  ${blendModeFunctions}

  vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
  }

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    vec4 texel = texture2D(tDiffuse, vUv);
    vec3 color = texel.rgb;
    
    // Apply brightness
    color *= brightness;
    
    // Apply contrast
    color = (color - 0.5) * contrast + 0.5;
    
    // Apply saturation and hue
    vec3 hsv = rgb2hsv(color);
    hsv.x = mod(hsv.x + hue / 360.0, 1.0); // Hue rotation
    hsv.y *= saturation; // Saturation
    color = hsv2rgb(hsv);

    // Apply blend mode with previous pass
    if (blendMode > 0) {
      vec4 baseTexel = texture2D(tDiffuse, vUv);
      color = applyBlendMode(baseTexel.rgb, color, blendMode);
    }
    
    gl_FragColor = vec4(color, texel.a);
  }
`;

export const pixelateFragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float pixelate;
  uniform vec2 resolution;
  uniform int blendMode;
  varying vec2 vUv;

  ${blendModeFunctions}

  void main() {
    vec2 texelSize = 1.0 / resolution;
    vec2 pixelatedUv = floor(vUv / (texelSize * pixelate)) * (texelSize * pixelate);
    vec4 texel = texture2D(tDiffuse, pixelatedUv);
    vec3 color = texel.rgb;

    if (blendMode > 0) {
      vec4 baseTexel = texture2D(tDiffuse, vUv);
      color = applyBlendMode(baseTexel.rgb, color, blendMode);
    }

    gl_FragColor = vec4(color, texel.a);
  }
`;

export const waveFragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float time;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float wave = sin(uv.y * 10.0 + time) * 0.01;
    uv.x += wave;
    gl_FragColor = texture2D(tDiffuse, uv);
  }
`;

export const rgbShiftFragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float amount;
  varying vec2 vUv;

  void main() {
    float r = texture2D(tDiffuse, vUv + vec2(amount, 0.0)).r;
    float g = texture2D(tDiffuse, vUv).g;
    float b = texture2D(tDiffuse, vUv - vec2(amount, 0.0)).b;
    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

export const kaleidoscopeFragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float segments;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float angle = atan(uv.y, uv.x);
    float radius = length(uv);
    
    float segmentAngle = (2.0 * 3.14159) / segments;
    angle = mod(angle, segmentAngle);
    if (mod(floor(angle / segmentAngle), 2.0) == 1.0) {
      angle = segmentAngle - angle;
    }
    
    vec2 newUv = vec2(cos(angle), sin(angle)) * radius;
    newUv = newUv * 0.5 + 0.5;
    
    gl_FragColor = texture2D(tDiffuse, newUv);
  }
`;

export const vignetteFragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float intensity;
  uniform float roundness;
  varying vec2 vUv;

  void main() {
    vec4 texel = texture2D(tDiffuse, vUv);
    vec2 center = vec2(0.5);
    vec2 uv = vUv - center;
    float dist = length(uv * vec2(roundness, 1.0));
    float vignette = smoothstep(0.8, 0.2 * intensity, dist);
    gl_FragColor = vec4(texel.rgb * vignette, texel.a);
  }
`;

export const blurFragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float radius;
  uniform vec2 resolution;
  varying vec2 vUv;

  void main() {
    vec4 color = vec4(0.0);
    float total = 0.0;
    vec2 texelSize = 1.0 / resolution;
    
    for(float x = -radius; x <= radius; x++) {
      for(float y = -radius; y <= radius; y++) {
        vec2 offset = vec2(x, y) * texelSize;
        float weight = 1.0 - length(offset) / radius;
        if(weight < 0.0) continue;
        color += texture2D(tDiffuse, vUv + offset) * weight;
        total += weight;
      }
    }
    
    gl_FragColor = color / total;
  }
`;

export const glitchFragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float time;
  uniform float intensity;
  varying vec2 vUv;

  float random(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    float noise = random(vec2(time * 0.1, uv.y * 100.0));
    
    // Horizontal glitch
    if(noise > 0.98) {
      uv.x += (random(vec2(time)) * 2.0 - 1.0) * intensity;
    }
    
    // Color channel split
    float r = texture2D(tDiffuse, uv + vec2(intensity * 0.1, 0.0)).r;
    float g = texture2D(tDiffuse, uv).g;
    float b = texture2D(tDiffuse, uv - vec2(intensity * 0.1, 0.0)).b;
    
    gl_FragColor = vec4(r, g, b, 1.0);
  }
`;

export const noiseFragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float amount;
  uniform float time;
  varying vec2 vUv;

  float random(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
  }

  void main() {
    vec4 texel = texture2D(tDiffuse, vUv);
    float noise = random(vUv + time) * amount;
    gl_FragColor = vec4(texel.rgb + vec3(noise), texel.a);
  }
`;

export const mirrorFragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float offset;
  uniform int axis; // 0 for horizontal, 1 for vertical
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    if(axis == 0) {
      if(uv.x > 0.5 + offset) {
        uv.x = 1.0 - uv.x;
      }
    } else {
      if(uv.y > 0.5 + offset) {
        uv.y = 1.0 - uv.y;
      }
    }
    gl_FragColor = texture2D(tDiffuse, uv);
  }
`;
