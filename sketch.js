let body = []
let dx = 0
let dy = 0
let ax = 0
let ay = 0
let pending = 0
let ongoing = true

let w = 25

function setup() {
  // Setup the canvas
  let canvw = min(windowWidth, windowHeight)
  createCanvas(canvw, canvw)

  // Run with a ridiculously low framerate...
  frameRate(10)

  // Initialize the game
  initialize_game()
}

function draw() {
  // Setup viewport
  background(0)
  scale()
  scale(width / 400)

  if (ongoing)
    gameloop()
  else
    gameover()
}

function windowResized() {
  // Remake a canvas
  let canvw = min(windowWidth, windowHeight)
  createCanvas(canvw, canvw)
}

function initialize_game() {
  dx = 0
  dy = -1
  pending = 2
  ongoing = true

  c = floor(w / 2)
  body = [[c, c]]
  
  randomize_apple()
}

function randomize_apple() {
  ax = floor(random(w))
  ay = floor(random(w))
  
  let len = body.length
  for (let i = 0; i < len; ++i) {
    let pt = body[i]
    let change_x = ax === pt[0]
    let change_y = ay === pt[1]
    if (change_x)
      ax = floor(random(w))
    if (change_y)
      ay = floor(random(w))
    if (change_x || change_y)
      i = 0
  }
}

function draw_and_update_apple() {
  let pt = body[0]
  if (ax === pt[0] && ay === pt[1]) {
    pending += 2
    randomize_apple()
  }
  
  let v = 400 / w
  fill('green')
  rect(ax * v, ay * v, v, v)
}

function edge_fixup(v) {
  return v < 0 ? w - 1 : (v >= w ? 0 : v);
}

function check_collision_snake() {
  let head = body[0]
  let len = body.length
  for (let i = 1; i < len; ++i) {
    let pt = body[i]
    if (head[0] === pt[0] && head[1] === pt[1])
      return true
  }
  return false
}

function draw_and_update_snake() {
  let head = [...body[0]]
  let hx = edge_fixup(head[0] + dx)
  let hy = edge_fixup(head[1] + dy)
  head[0] = hx
  head[1] = hy

  fill('white')
  let v = 400 / w
  let len = body.length
  for (let i = 0; i < len; ++i) {
    let pt = body[i]
    body[i] = head
    let px = pt[0]
    let py = pt[1]
    rect(px * v, py * v, v, v)
    head = pt
  }
  
  if (pending > 0) {
    --pending
    body.push(head)
  }
}

function gameloop() {
  if (check_collision_snake()) {
    ongoing = false
    return
  }
  draw_and_update_apple()
  draw_and_update_snake()
}
  
function gameover() {
  fill('green')
  let v = 400 / w
  rect(ax * v, ay * v, v, v)
  
  fill('white')
  let len = body.length
  for (let i = 1; i < len; ++i) {
    let pt = body[i]
    rect(pt[0] * v, pt[1] * v, v, v)
  }

  fill('red')
  let pt = body[0]
  rect(pt[0] * v, pt[1] * v, v, v)
}

function keyPressed() {
  if (!ongoing)
    return

  switch (keyCode) {
  case RIGHT_ARROW:
    if (dx === 0) {
      dx = 1
      dy = 0
    }
    break
  case LEFT_ARROW:
    if (dx === 0) {
      dx = -1
      dy = 0
    }
    break
  case DOWN_ARROW:
    if (dy === 0) {
      dx = 0
      dy = 1
    }
    break
  case UP_ARROW:
    if (dy === 0) {
      dx = 0
      dy = -1
    }
    break
  }
}