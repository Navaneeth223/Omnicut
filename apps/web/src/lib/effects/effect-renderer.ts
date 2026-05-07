/**
 * WebGL Effect Renderer
 * Applies GLSL shaders to video frames
 */

import { getShaderForEffect, type ShaderProgram } from './shaders';

export interface EffectParameters {
  [key: string]: number;
}

export class EffectRenderer {
  private gl: WebGLRenderingContext;
  private canvas: HTMLCanvasElement;
  private program: WebGLProgram | null = null;
  private positionBuffer: WebGLBuffer | null = null;
  private texCoordBuffer: WebGLBuffer | null = null;
  private texture: WebGLTexture | null = null;
  private currentShader: string = '';

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext('webgl', {
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
    });

    if (!gl) {
      throw new Error('WebGL not supported');
    }

    this.gl = gl;
    this.initBuffers();
  }

  /**
   * Initialize vertex and texture coordinate buffers
   */
  private initBuffers(): void {
    const gl = this.gl;

    // Position buffer (full screen quad)
    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    // Texture coordinate buffer
    this.texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]),
      gl.STATIC_DRAW
    );

    // Create texture
    this.texture = gl.createTexture();
  }

  /**
   * Compile shader
   */
  private compileShader(source: string, type: number): WebGLShader | null {
    const gl = this.gl;
    const shader = gl.createShader(type);

    if (!shader) return null;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  /**
   * Create shader program
   */
  private createProgram(shaderProgram: ShaderProgram): WebGLProgram | null {
    const gl = this.gl;

    const vertexShader = this.compileShader(shaderProgram.vertex, gl.VERTEX_SHADER);
    const fragmentShader = this.compileShader(shaderProgram.fragment, gl.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return null;

    const program = gl.createProgram();
    if (!program) return null;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return null;
    }

    return program;
  }

  /**
   * Load shader for effect
   */
  loadEffect(effectType: string): boolean {
    if (this.currentShader === effectType && this.program) {
      return true;
    }

    const shaderProgram = getShaderForEffect(effectType);
    const program = this.createProgram(shaderProgram);

    if (!program) return false;

    // Clean up old program
    if (this.program) {
      this.gl.deleteProgram(this.program);
    }

    this.program = program;
    this.currentShader = effectType;
    return true;
  }

  /**
   * Render effect
   */
  render(
    source: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
    effectType: string,
    parameters: EffectParameters = {}
  ): void {
    const gl = this.gl;

    // Load shader if needed
    if (!this.loadEffect(effectType)) {
      console.error('Failed to load effect:', effectType);
      return;
    }

    if (!this.program) return;

    // Set viewport
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    // Clear canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Use program
    gl.useProgram(this.program);

    // Upload texture
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);

    // Set up attributes
    const positionLocation = gl.getAttribLocation(this.program, 'a_position');
    const texCoordLocation = gl.getAttribLocation(this.program, 'a_texCoord');

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.enableVertexAttribArray(texCoordLocation);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    // Set uniforms
    const imageLocation = gl.getUniformLocation(this.program, 'u_image');
    gl.uniform1i(imageLocation, 0);

    const resolutionLocation = gl.getUniformLocation(this.program, 'u_resolution');
    if (resolutionLocation) {
      gl.uniform2f(resolutionLocation, this.canvas.width, this.canvas.height);
    }

    // Set effect-specific parameters
    for (const [key, value] of Object.entries(parameters)) {
      const location = gl.getUniformLocation(this.program, `u_${key}`);
      if (location) {
        gl.uniform1f(location, value);
      }
    }

    // Draw
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  /**
   * Resize canvas
   */
  resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    const gl = this.gl;

    if (this.program) {
      gl.deleteProgram(this.program);
      this.program = null;
    }

    if (this.positionBuffer) {
      gl.deleteBuffer(this.positionBuffer);
      this.positionBuffer = null;
    }

    if (this.texCoordBuffer) {
      gl.deleteBuffer(this.texCoordBuffer);
      this.texCoordBuffer = null;
    }

    if (this.texture) {
      gl.deleteTexture(this.texture);
      this.texture = null;
    }
  }
}
