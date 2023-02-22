let lifeCount = 20;
let lifeArray = [];
let resourceArray = [];
let gridArray = [];
let foodCount = 1;
let showFOV = false;
let showGrid = false;
let turnCount = 0;
let totalTurnCount = 0;
let allLifeAgeId = 1;
let totalResourceCount = 0;

for (var r = 0; r <= canvas.width / 10; ++r) {
  let row = [];
  for (var c = 0; c <= canvas.height / 10; ++c) {
    row.push(0);
  }
  gridArray.push(row);
}

//create life
function init() {
  createIntialLife(lifeCount);
  createFood(foodCount);

  if (showFOV) {
    for (var l in lifeArray) {
      lifeArray[l].drawFOV();
    }
  }
  for (var r in resourceArray) {
    resourceArray[r].draw();
  }
  if (showGrid) {
    drawGrid();
    drawDivGrid();
  }
  for (var l in lifeArray) {
    lifeArray[l].draw();
  }
}

window.addEventListener("keydown", handler);
window.addEventListener("mousedown", getInfo);

function changeFOV() {
  showFOV = !showFOV;
}

function changeGrid() {
  showGrid = !showGrid;
}

function handler(e) {
  if (e.key === "f") {
    changeFOV();
  } else if (e.key === "g") {
    changeGrid();
  }
}

setInterval(() => {
  update();
}, 100);

function getInfo(e) {
  console.log(e);
  var rect = e.target.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  x = Math.floor(x / 10);
  y = Math.floor(y / 10);
  console.log(x, y);

  for (var l = 0; l < lifeArray.length; ++l) {
    let lf = lifeArray[l];
    if (lf.x === x && lf.y === y) {
      lf.selected = true;
    } else {
      lf.selected = false;
    }
  }
}

function update(e) {
  // console.log(lifeArray.length);
  //console.log(e);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (var l in lifeArray) {
    let lf = lifeArray[l];

    lifeArray[l].move();

    if (lifeArray[l].stats.health <= 0) {
      let dead = lifeArray[l];
      gridArray[dead.y][dead.x] = 0;
      lifeArray.splice(l, 1);
    }
  }
  if (showFOV) {
    for (var l in lifeArray) {
      lifeArray[l].drawFOV();
    }
  }
  for (var r in resourceArray) {
    resourceArray[r].draw();
  }

  if (showGrid) {
    drawGrid();
    //drawDivGrid();
  }
  for (var l in lifeArray) {
    lifeArray[l].draw();
  }

  updateStatGui();
  turnCount++;
  totalTurnCount++;
  if (turnCount >= 50) {
    createFood(50);
    turnCount = 0;
  }
}

function createIntialLife(number, x, y) {
  if (number >= 3) {
    for (var i = 0; i < number; ++i) {
      // let team = i < number / 2 ? "red" : "blue";

      let team =
        "rgb(" +
        Math.floor(Math.random() * 255) +
        "," +
        Math.floor(Math.random() * 255) +
        "," +
        Math.floor(Math.random() * 255) +
        ")";

      let l = new Life(i, i, allLifeAgeId, team);
      lifeArray.push(l);
      try {
        gridArray[l.x][l.y] = l.id;
      } catch (e) {
        console.log(e);
        console.log(gridArray, l);
      }
      allLifeAgeId++;
    }
  } else {
    let l = new Life(10, 10, 1, "blue");
    lifeArray.push(l);
    gridArray[l.x][l.y] = l.id;
  }
}

function createFood(number) {
  let count = 0;
  while (count <= number) {
    let x = Math.floor((Math.random() * canvas.width) / 10);
    let y = Math.floor((Math.random() * canvas.height) / 10);
    //let x = 11;
    //let y = 8;

    let gridSpot = gridArray[y][x];
    if (gridSpot === 0) {
      let food = new Resource(x, y, "food", totalResourceCount);
      //console.log(food.id);
      resourceArray.push(food);
      gridArray[y][x] = food.id;
      totalResourceCount++;
    }

    count++;
  }
}

init();
