/**
 * GLSL Shader Definitions for Video Effects
 */

export interface ShaderProgram {
  vertex: string;
  fragment: string;
}

/**
 * Base vertex shader (used by all effects)
 */
export const BASE_VERTEX_SHADER = `
  attribute vec2 a_position;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
  }
`;

/**
 * Passthrough shader (no effect)
 */
export const PASSTHROUGH_SHADER: ShaderProgram = {
  vertex: BASE_VERTEX_SHADER,
  fragment: `
    precision mediump float;
    uniform sampler2D u_image;
    varying vec2 v_texCoord;
    
    void main() {
      gl_FragColor = texture2D(u_image, v_texCoord);
    }
  `,
};

/**
 * Brightness & Contrast
 */
export const BRIGHTNESS_CONTRAST_SHADER: ShaderProgram = {
  vertex: BASE_VERTEX_SHADER,
  fragment: `
    precision mediump float;
    uniform sampler2D u_image;
    uniform float u_brightness;
    uniform float u_contrast;
    varying vec2 v_texCoord;
    
    void main() {
      vec4 color = texture2D(u_image, v_texCoord);
      
      // Apply brightness
      color.rgb += u_brightness;
      
      // Apply contrast
      color.rgb = (color.rgb - 0.5) * u_contrast + 0.5;
      
      gl_FragColor = color;
    }
  `,
};

/**
 * Hue & Saturation
 */
export const HUE_SATURATION_SHADER: ShaderProgram = {
  vertex: BASE_VERTEX_SHADER,
  fragment: `
    precision mediump float;
    uniform sampler2D u_image;
    uniform float u_hue;
    uniform float u_saturation;
    varying vec2 v_texCoord;
    
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
      vec4 color = texture2D(u_image, v_texCoord);
      vec3 hsv = rgb2hsv(color.rgb);
      
      // Apply hue shift
      hsv.x = fract(hsv.x + u_hue);
      
      // Apply saturation
      hsv.y *= u_saturation;
      
      color.rgb = hsv2rgb(hsv);
      gl_FragColor = color;
    }
  `,
};

/**
 * Gaussian Blur
 */
export const GAUSSIAN_BLUR_SHADER: ShaderProgram = {
  vertex: BASE_VERTEX_SHADER,
  fragment: `
    precision mediump float;
    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    uniform float u_radius;
    varying vec2 v_texCoord;
    
    void main() {
      vec2 texelSize = 1.0 / u_resolution;
      vec4 color = vec4(0.0);
      float total = 0.0;
      
      // 9-tap blur
      for (float x = -2.0; x <= 2.0; x += 1.0) {
        for (float y = -2.0; y <= 2.0; y += 1.0) {
          vec2 offset = vec2(x, y) * texelSize * u_radius;
          float weight = 1.0 - (length(vec2(x, y)) / 2.828); // sqrt(8)
          color += texture2D(u_image, v_texCoord + offset) * weight;
          total += weight;
        }
      }
      
      gl_FragColor = color / total;
    }
  `,
};

/**
 * Sharpen
 */
export const SHARPEN_SHADER: ShaderProgram = {
  vertex: BASE_VERTEX_SHADER,
  fragment: `
    precision mediump float;
    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    uniform float u_amount;
    varying vec2 v_texCoord;
    
    void main() {
      vec2 texelSize = 1.0 / u_resolution;
      
      vec4 center = texture2D(u_image, v_texCoord);
      vec4 top = texture2D(u_image, v_texCoord + vec2(0.0, texelSize.y));
      vec4 bottom = texture2D(u_image, v_texCoord - vec2(0.0, texelSize.y));
      vec4 left = texture2D(u_image, v_texCoord - vec2(texelSize.x, 0.0));
      vec4 right = texture2D(u_image, v_texCoord + vec2(texelSize.x, 0.0));
      
      vec4 edges = (top + bottom + left + right) * 0.25;
      vec4 sharpened = center + (center - edges) * u_amount;
      
      gl_FragColor = sharpened;
    }
  `,
};

/**
 * Vignette
 */
export const VIGNETTE_SHADER: ShaderProgram = {
  vertex: BASE_VERTEX_SHADER,
  fragment: `
    precision mediump float;
    uniform sampler2D u_image;
    uniform float u_amount;
    uniform float u_radius;
    varying vec2 v_texCoord;
    
    void main() {
      vec4 color = texture2D(u_image, v_texCoord);
      
      // Calculate distance from center
      vec2 center = vec2(0.5, 0.5);
      float dist = distance(v_texCoord, center);
      
      // Create vignette
      float vignette = smoothstep(u_radius, u_radius - 0.5, dist);
      vignette = mix(1.0, vignette, u_amount);
      
      color.rgb *= vignette;
      gl_FragColor = color;
    }
  `,
};

/**
 * Film Grain
 */
export const FILM_GRAIN_SHADER: ShaderProgram = {
  vertex: BASE_VERTEX_SHADER,
  fragment: `
    precision mediump float;
    uniform sampler2D u_image;
    uniform float u_amount;
    uniform float u_time;
    varying vec2 v_texCoord;
    
    float random(vec2 co) {
      return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    void main() {
      vec4 color = texture2D(u_image, v_texCoord);
      
      // Generate noise
      float noise = random(v_texCoord + u_time) * 2.0 - 1.0;
      
      // Apply grain
      color.rgb += noise * u_amount;
      
      gl_FragColor = color;
    }
  `,
};

/**
 * Glow
 */
export const GLOW_SHADER: ShaderProgram = {
  vertex: BASE_VERTEX_SHADER,
  fragment: `
    precision mediump float;
    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    uniform float u_intensity;
    uniform float u_threshold;
    varying vec2 v_texCoord;
    
    void main() {
      vec4 color = texture2D(u_image, v_texCoord);
      
      // Extract bright areas
      float brightness = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      vec3 glow = color.rgb * smoothstep(u_threshold, 1.0, brightness);
      
      // Simple blur for glow
      vec2 texelSize = 1.0 / u_resolution;
      for (float x = -2.0; x <= 2.0; x += 1.0) {
        for (float y = -2.0; y <= 2.0; y += 1.0) {
          if (x != 0.0 || y != 0.0) {
            vec2 offset = vec2(x, y) * texelSize * 2.0;
            vec4 sample = texture2D(u_image, v_texCoord + offset);
            float sampleBrightness = dot(sample.rgb, vec3(0.299, 0.587, 0.114));
            glow += sample.rgb * smoothstep(u_threshold, 1.0, sampleBrightness) * 0.1;
          }
        }
      }
      
      color.rgb += glow * u_intensity;
      gl_FragColor = color;
    }
  `,
};

/**
 * Chromatic Aberration
 */
export const CHROMATIC_ABERRATION_SHADER: ShaderProgram = {
  vertex: BASE_VERTEX_SHADER,
  fragment: `
    precision mediump float;
    uniform sampler2D u_image;
    uniform float u_amount;
    varying vec2 v_texCoord;
    
    void main() {
      vec2 direction = v_texCoord - vec2(0.5);
      
      // Sample RGB channels with offset
      float r = texture2D(u_image, v_texCoord + direction * u_amount * 0.01).r;
      float g = texture2D(u_image, v_texCoord).g;
      float b = texture2D(u_image, v_texCoord - direction * u_amount * 0.01).b;
      
      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `,
};

/**
 * Pixelate
 */
export const PIXELATE_SHADER: ShaderProgram = {
  vertex: BASE_VERTEX_SHADER,
  fragment: `
    precision mediump float;
    uniform sampler2D u_image;
    uniform vec2 u_resolution;
    uniform float u_pixelSize;
    varying vec2 v_texCoord;
    
    void main() {
      vec2 pixelSize = vec2(u_pixelSize) / u_resolution;
      vec2 coord = floor(v_texCoord / pixelSize) * pixelSize;
      gl_FragColor = texture2D(u_image, coord);
    }
  `,
};

/**
 * Grayscale
 */
export const GRAYSCALE_SHADER: ShaderProgram = {
  vertex: BASE_VERTEX_SHADER,
  fragment: `
    precision mediump float;
    uniform sampler2D u_image;
    uniform float u_amount;
    varying vec2 v_texCoord;
    
    void main() {
      vec4 color = texture2D(u_image, v_texCoord);
      
      // Calculate luminance
      float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
      
      // Mix between color and grayscale
      color.rgb = mix(color.rgb, vec3(gray), u_amount);
      
      gl_FragColor = color;
    }
  `,
};

/**
 * Get shader by effect type
 */
export function getShaderForEffect(effectType: string): ShaderProgram {
  switch (effectType) {
    case 'brightness_contrast':
      return BRIGHTNESS_CONTRAST_SHADER;
    case 'hue_saturation':
      return HUE_SATURATION_SHADER;
    case 'gaussian_blur':
      return GAUSSIAN_BLUR_SHADER;
    case 'sharpen':
      return SHARPEN_SHADER;
    case 'vignette':
      return VIGNETTE_SHADER;
    case 'film_grain':
      return FILM_GRAIN_SHADER;
    case 'glow':
      return GLOW_SHADER;
    case 'chromatic_aberration':
      return CHROMATIC_ABERRATION_SHADER;
    case 'pixelate':
      return PIXELATE_SHADER;
    case 'grayscale':
      return GRAYSCALE_SHADER;
    default:
      return PASSTHROUGH_SHADER;
  }
}
