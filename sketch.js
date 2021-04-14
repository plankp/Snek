var body = []
var savedX = null
var savedY = null
var dx = 0
var dy = 0
var ax = 0
var ay = 0
var pending = 0
var state = -1

var w = 25

function setup() {
  // Setup the canvas
  var canvw = min(windowWidth, windowHeight)
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

function mousePressed() {
  savedX = mouseX
  savedY = mouseY

  return false
}

function mouseMoved() {
  if (savedX === null || savedY === null)
    return

  var dragX = mouseX - savedX
  var dragY = mouseY - savedY
  if (dragX === 0 || dragY === 0)
    return

  savedX = null
  savedY = null

  if (state === 1)
    initialize_game()
  state = 0

  if (Math.abs(dragX) > Math.abs(dragY)) {
    if (dx !== 0)
      return false
    dx = dragX > 0 ? 1 : -1
    dy = 0
  } else {
    if (dy !== 0)
      return false
    dx = 0
    dy = dragY > 0 ? 1 : -1
  }

  return false
}

function windowResized() {
  // Remake a canvas
  var canvw = min(windowWidth, windowHeight)
  createCanvas(canvw, canvw)
}

function initialize_game() {
  savedX = null
  savedY = null
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
  var v = 400 / w
  rect(ax * v, ay * v, v, v)

  fill('white')
  var pt = body[0]
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
  var map = new Map()
  var len = body.length
  var i = 0
  for ( ; i < len; ++i) {
    var pt = body[i]
    map.set(pt[0] + pt[1] * w, true)
  }

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
  var pt = body[0]
  if (ax === pt[0] && ay === pt[1]) {
    pending += 2
    randomize_apple()
  }

  var v = 400 / w
  fill('green')
  rect(ax * v, ay * v, v, v)
}

function edge_fixup(v) {
  return v < 0 ? w - 1 : (v >= w ? 0 : v);
}

function check_collision_snake() {
  var head = body[0]
  var len = body.length
  var i = 1
  for ( ; i < len; ++i) {
    var pt = body[i]
    if (head[0] === pt[0] && head[1] === pt[1])
      return true
  }
  return false
}

function draw_and_update_snake() {
  var head = body[0]
  var hx = edge_fixup(head[0] + dx)
  var hy = edge_fixup(head[1] + dy)
  head = [hx, hy]

  fill('white')
  var v = 400 / w
  var len = body.length
  var i = 0
  for ( ; i < len; ++i) {
    var pt = body[i]
    body[i] = head
    rect(pt[0] * v, pt[1] * v, v, v)
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
  var v = 400 / w
  rect(ax * v, ay * v, v, v)

  fill('white')
  var len = body.length
  var i = 1
  for ( ; i < len; ++i) {
    var pt = body[i]
    rect(pt[0] * v, pt[1] * v, v, v)
  }

  fill('red')
  var pt = body[0]
  rect(pt[0] * v, pt[1] * v, v, v)
}

function gameoverKeyHnd() {
  if (keyCode === ENTER)
    return initialize_game()
}