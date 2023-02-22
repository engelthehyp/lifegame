let canvas = document.getElementById("game_canvas");
var ctx = canvas.getContext("2d");

function drawDivGrid() {
  let gridContainer = document.getElementById("grid");
  gridContainer.innerHTML = "";

  for (var r = 0; r < gridArray.length - 1; ++r) {
    let row = document.createElement("div");
    let gridRow = gridArray[r];
    for (var c = 0; c < gridRow.length - 1; ++c) {
      let span = document.createElement("span");
      if (gridRow[c] !== 0) {
        span.style.color = "red";
      }
      span.innerHTML += gridRow[c];
      row.appendChild(span);
    }
    gridContainer.appendChild(row);
  }
}

function drawGrid() {
  ctx.globalAlpha = 0.3;
  for (var i = 0; i < canvas.width / 10; ++i) {
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.moveTo(10 * i, 0);
    ctx.lineTo(10 * i, canvas.height);

    ctx.moveTo(0, 10 * i);
    ctx.lineTo(canvas.width, 10 * i);

    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function updateStatGui() {
  document.getElementById("lifeCount").innerHTML =
    "Total Life: " + lifeArray.length;
  document.getElementById("turnCount").innerHTML =
    "Every Hundred: " + turnCount;
  document.getElementById("totalTurnCount").innerHTML =
    "TotalTurnCount: " + totalTurnCount;
  document.getElementById("historicalCount").innerHTML =
    "TotalHistorical: " + allLifeAgeId;
}
