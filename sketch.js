let body = []
let dx = 0
let dy = 0
let ax = 0
let ay = 0
let pending = 0
let state = -1

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

  switch (state) {
  case -1:  return startmenu()
  case 0:   return gameloop()
  case 1:   return gameover()
  }
}

function keyPressed() {
  switch (state) {
  case -1:  return startmenuKeyHnd()
  case 0:   return gameloopKeyHnd()
  case 1:   return gameoverKeyHnd()
  }
}

function windowResized() {
  // Remake a canvas
  let canvw = min(windowWidth, windowHeight)
  createCanvas(canvw, canvw)
}

function initialize_game() {
  dx = 0
  dy = 0
  pending = 2
  state = -1

  c = floor(w / 2)
  body = [[c, c]]

  randomize_apple()
}

function startmenu() {
  fill('green')
  let v = 400 / w
  rect(ax * v, ay * v, v, v)

  fill('white')
  let pt = body[0]
  rect(pt[0] * v, pt[1] * v, v, v)
}

function startmenuKeyHnd() {
  switch (keyCode) {
  case RIGHT_ARROW:
    dx = 1
    dy = 0
    state = 0
    break
  case LEFT_ARROW:
    dx = -1
    dy = 0
    state = 0
    break
  case DOWN_ARROW:
    dx = 0
    dy = 1
    state = 0
    break
  case UP_ARROW:
    dx = 0
    dy = -1
    state = 0
    break
  }
}

function randomize_apple() {
  // fill up occupied cells
  let map = new Map()
  for (let [px, py] of body)
    map.set(px + py * w, true)

  // make initial guess
  ax = floor(random(w))
  ay = floor(random(w))

  // search for first empty cell at or after the initial guess
  for (;;) {
    if (!map.get(ax + ay * w))
      return
    if (++ax >= w) {
      ax = 0
      if (++ay >= w)
        ay = 0
    }
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
    state = 1
    return
  }
  draw_and_update_apple()
  draw_and_update_snake()
}

function gameloopKeyHnd() {
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
  case ENTER:
    return initialize_game()
  }
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

function gameoverKeyHnd() {
  if (keyCode === ENTER)
    return initialize_game()
}