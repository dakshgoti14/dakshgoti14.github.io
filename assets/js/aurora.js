// WebGL aurora for the hero background: layered simplex noise in the site palette.
// Progressive enhancement — the CSS aurora stays underneath if WebGL is unavailable.
// Renders at reduced resolution, pauses off-screen / in hidden tabs, and draws a single
// static frame when the user prefers reduced motion.
(function () {
  'use strict';
  var canvas = document.querySelector('[data-aurora]');
  if (!canvas) return;
  var gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false, powerPreference: 'low-power', premultipliedAlpha: true });
  if (!gl) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  var vert = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';
  var frag = [
    'precision mediump float;',
    'uniform vec2 u_res; uniform float u_time; uniform vec2 u_mouse;',
    // 2D simplex noise — Ashima Arts / Stefan Gustavson (MIT).
    'vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x, 289.0); }',
    'float snoise(vec2 v){',
    '  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);',
    '  vec2 i = floor(v + dot(v, C.yy)); vec2 x0 = v - i + dot(i, C.xx);',
    '  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);',
    '  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1; i = mod(i, 289.0);',
    '  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));',
    '  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0); m = m*m; m = m*m;',
    '  vec3 x = 2.0 * fract(p * C.www) - 1.0; vec3 h = abs(x) - 0.5; vec3 ox = floor(x + 0.5); vec3 a0 = x - ox;',
    '  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);',
    '  vec3 g; g.x = a0.x * x0.x + h.x * x0.y; g.yz = a0.yz * x12.xz + h.yz * x12.yw;',
    '  return 130.0 * dot(m, g);',
    '}',
    'void main(){',
    '  vec2 uv = gl_FragCoord.xy / u_res;',
    '  vec2 p = uv * vec2(u_res.x / u_res.y, 1.0);',
    '  float t = u_time * 0.035;',
    '  float n1 = snoise(p * 1.1 + vec2(t, -t * 0.6));',
    '  float n2 = snoise(p * 1.9 - vec2(t * 0.7, t * 0.3) + n1 * 0.35);',
    '  float n3 = snoise(p * 0.8 + vec2(-t * 0.4, t * 0.5) - n2 * 0.25);',
    '  vec3 blue = vec3(0.17, 0.45, 1.0); vec3 teal = vec3(0.16, 0.78, 0.74); vec3 green = vec3(0.2, 0.83, 0.6);',
    '  float a = smoothstep(-0.25, 0.95, n1) * smoothstep(1.15, 0.05, distance(uv, vec2(0.22, 0.92)));',
    '  float b = smoothstep(-0.1, 1.0, n2) * smoothstep(1.0, 0.1, distance(uv, vec2(0.82, 0.72)));',
    '  float c = smoothstep(0.1, 1.0, n3) * smoothstep(0.95, 0.1, distance(uv, vec2(0.92, 0.28)));',
    '  float m = smoothstep(0.45, 0.0, distance(uv, u_mouse));',
    '  vec3 col = blue * a * 0.42 + teal * b * 0.26 + green * c * 0.2 + blue * m * 0.07;',
    '  float alpha = clamp(max(max(a * 0.42, b * 0.3), c * 0.24) + m * 0.07, 0.0, 1.0);',
    '  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;',
    '  gl_FragColor = vec4(col + grain * 0.012, alpha);',
    '}',
  ].join('\n');

  function shader(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  }
  var vs = shader(gl.VERTEX_SHADER, vert);
  var fs = shader(gl.FRAGMENT_SHADER, frag);
  if (!vs || !fs) return;
  var prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  var uRes = gl.getUniformLocation(prog, 'u_res');
  var uTime = gl.getUniformLocation(prog, 'u_time');
  var uMouse = gl.getUniformLocation(prog, 'u_mouse');

  // The gradient is soft, so render at half resolution and let CSS scale it up.
  var SCALE = 0.5;
  function resize() {
    var w = Math.max(1, Math.round(canvas.clientWidth * SCALE));
    var h = Math.max(1, Math.round(canvas.clientHeight * SCALE));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
    gl.uniform2f(uRes, w, h);
  }

  var mouse = { x: 0.5, y: 0.6, tx: 0.5, ty: 0.6 };
  if (finePointer && !reduced) {
    window.addEventListener('pointermove', function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width;
      mouse.ty = 1 - (e.clientY - r.top) / r.height;
    }, { passive: true });
  }

  var start = performance.now();
  var raf = null;
  var visible = true;
  function draw(now) {
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    gl.uniform1f(uTime, reduced ? 12.0 : (now - start) / 1000 + 12.0);
    gl.uniform2f(uMouse, mouse.x, mouse.y);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  function loop(now) {
    draw(now);
    raf = requestAnimationFrame(loop);
  }
  function play() {
    if (reduced || raf || !visible || document.hidden) return;
    raf = requestAnimationFrame(loop);
  }
  function pause() {
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  resize();
  draw(performance.now());
  canvas.classList.add('is-ready');

  window.addEventListener('resize', function () { resize(); if (!raf) draw(performance.now()); }, { passive: true });
  document.addEventListener('visibilitychange', function () { document.hidden ? pause() : play(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      visible ? play() : pause();
    }).observe(canvas);
  }
  play();
})();
