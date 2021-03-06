/*const toColor = num =>
  return `rgba(${[(num & 0xFF0000) >>> 16, (num & 0xFF00) >>> 8, num & 0xFF, 255 - ((num & 0xFF000000) >>> 24) / 255].join(", ")})`*/
window.onerror = function(e, u, l) {
  alert(`error: ${e}
URL: ${u}
line: ${l}`)
}

const JQ_MAX = 10

const nowize = (time) =>
  time / 1000 * (now - then)

const canvas = document.querySelector("#frame")
canvas.width = innerWidth
canvas.height = innerHeight

const ctx = canvas.getContext("2d")

const keysDown = {}
addEventListener("keydown", e => keysDown[e.keyCode] = true)
addEventListener("keyup", e => delete keysDown[e.keyCode])

const player = {
  x: 0,
  y: 0,
  w: 32,
  h: 32,
  color: "#000",
  speedx: 0,
  maxSpeedx: 512,
  speedy: 0,
  accelx: 48,
  accely: 4096,
  gravity: 128,
  boosted: false,
  inAir() {
    return this.y > 0
  },
  jump() {
    this.speedy = this.accely
    this.jremains = true
  },
  jumpWish() {
    return 32 in keysDown
  },
  jumped: false,
  jumpQueued: false,
  jremains: false
}

let update = (...o) => o.map(o => {
  if (o.inAir()) {
    o.jumpQueued = Math.max(o.jumpQueued - 1, 0)
    if (o.jumpWish()) {
      if (!o.jremains) o.jumpQueued = JQ_MAX
    } else {
      o.jremains = false
    }
    
    o.speedy -= o.gravity
  } else {
    o.speedy = 0
    o.boosted = o.jumped = false
    if (o.jumpQueued || 32 in keysDown && !o.jremains) {
      o.jump()
      o.jumped = true
      o.jremains = true
    } else {
      o.jremains = false
      o.speedx = Math.min(Math.max(o.speedx, -o.maxSpeedx), o.maxSpeedx)
    }
    if (37 in keysDown) {
      o.speedx -= o.accelx
    } else if (39 in keysDown) {
      o.speedx += o.accelx
    } else if (32 in keysDown) {
      
    } else {
      o.speedx *= 0.5
    }
    o.jumpQueued = 0
  }
  o.y += nowize(o.speedy)
  o.speedy /= 1.2
  o.x += nowize(o.speedx)
  o.y = Math.max(0, o.y)
  if (o.x < -o.w)
    o.x = canvas.width + o.w
  if (o.x > canvas.width + o.w)
    o.x = -o.w
  
  o.speedx = ~~o.speedx
  o.speedy = ~~o.speedy
})

const render = function(o, debug) {
  ctx.fillStyle = o.color
  ctx.fillRect(o.x, canvas.height - o.y - o.h, o.w, o.h)
  if (debug) {
    ctx.fillText(o.speedx, 5, 10)
    ctx.fillText(o.speedy, 5, 30)
  }
}

let then, now
now = then = Date.now()

const main = function() {
  requestAnimationFrame(main)
  
  now = Date.now()
  
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  update(player)
  render(player, true)
  
  then = now
}

main()
