function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function randomColor() {
  return (
    "rgb(" +
    Math.floor(Math.random() * 255) +
    "," +
    Math.floor(Math.random() * 255) +
    "," +
    Math.floor(Math.random() * 255) +
    ")"
  );
}

class Resource {
  constructor(x, y, type, id) {
    this.type = type;
    this.id;
    this.x = x;
    this.y = y;
    this.color = "";
    this.width = 10;
    this.height = 10;

    switch (this.type) {
      case "food":
        this.color = "lime";
        this.id = "F" + id;
        break;
    }
  }
  draw() {
    // console.log(this.color, this.x, this.y, this.width, this.height);
    ctx.beginPath();
    ctx.fillStyle = this.color;

    ctx.rect(
      this.x * this.width,
      this.y * this.height,
      this.width,
      this.height
    );

    ctx.fill();
  }
}

class Life {
  constructor(x, y, id, team, innerMarkings) {
    this.id = id;
    this.team = team;
    this.selected;
    this.attitude = Math.random() > 0.5 ? "aggressive" : "hungry";
    //if aggressive they attack/seek the weak ones
    this.x = x;
    this.y = y;
    this.stats = { health: randomRange(50, 110) };
    this.newx = this.x;
    this.newy = this.y;
    this.width = 10;
    this.height = 10;
    this.player = false;
    this.numberOfMarkings = 1; //randomRange(0, 3);
    this.innerMarkings = [];

    if (innerMarkings === undefined) {
      let count = 0;
      while (count <= this.numberOfMarkings) {
        let newMarking = {
          x: randomRange(1, 5),
          y: randomRange(1, 5),
          color: randomColor(),
        };
        this.innerMarkings.push(newMarking);

        count++;
      }
    } else {
      this.innerMarkings = innerMarkings;
    }

    //this.color = this.team === "red" ? "red" : "blue";
    this.color = team;
    if (id === 2) {
      this.color = "purple";
      this.player = true;
      this.moveleft = false;
      this.moveright = false;
      this.moveup = false;
      this.movedown = false;
    }
    this.cr = 2;
    this.ir = 1;
    this.checkExternalArray = [
      [this.y - this.cr, this.x - this.cr], //top left
      [this.y - this.cr, this.x], // top middle
      [this.y - this.cr, this.x + this.cr], //top right
      [this.y, this.x + this.cr], //mid right
      [this.y, this.x - this.cr], //mid left
      [this.y + this.cr, this.x - this.cr], //bottom left
      [this.y + this.cr, this.x], // bottom middle
      [this.y + this.cr, this.x + this.cr], //bottom right
    ];
    this.checkInternalArray = [
      [this.y - this.ir, this.x - this.ir], //top left
      [this.y - this.ir, this.x], //top middle
      [this.y - this.ir, this.x + this.ir], //top right
      [this.y, this.x - this.ir], //middle left
      [this.y, this.x + this.ir], //middle right
      [this.y + this.ir, this.x - this.ir], //bottom left
      [this.y + this.ir, this.x], //bottom middle
      [this.y + this.ir, this.x + this.ir], //bottom right
    ];
    /* this.color =
        "rgb(" +
        Math.floor(Math.random() * 255) +
        "," +
        Math.floor(Math.random() * 255) +
        "," +
        Math.floor(Math.random() * 255) +
        ")"; */
    // console.log(this.color);
  }

  updateCheckRange() {
    this.checkExternalArray = [
      [this.y - this.cr, this.x - this.cr], //top left
      [this.y - this.cr, this.x], // top middle
      [this.y - this.cr, this.x + this.cr], //top right
      [this.y, this.x + this.cr], //mid right
      [this.y, this.x - this.cr], //mid left
      [this.y + this.cr, this.x - this.cr], //bottom left
      [this.y + this.cr, this.x], // bottom middle
      [this.y + this.cr, this.x + this.cr], //bottom right
    ];
    this.checkInternalArray = [
      [this.y - this.ir, this.x - this.ir], //top left
      [this.y - this.ir, this.x], //top middle
      [this.y - this.ir, this.x + this.ir], //top right
      [this.y, this.x - this.ir], //middle left
      [this.y, this.x + this.ir], //middle right
      [this.y + this.ir, this.x - this.ir], //bottom left
      [this.y + this.ir, this.x], //bottom middle
      [this.y + this.ir, this.x + this.ir], //bottom right
    ];
  }
  drawFOV() {
    this.updateCheckRange();
    for (var ch in this.checkInternalArray) {
      let y = [this.checkInternalArray[ch][0]] * 1;
      let x = [this.checkInternalArray[ch][1]] * 1;

      y = y < 0 ? 0 : y;
      x = x < 0 ? 0 : x;

      ctx.beginPath();
      if (this.attitude === "hungry") {
        ctx.fillStyle = "green";
      } else {
        ctx.fillStyle = "aqua";
      }
      ctx.rect(x * 10, y * 10, 10, 10);

      ctx.fill();
    }

    for (var ch in this.checkExternalArray) {
      let y = [this.checkExternalArray[ch][0]] * 1;
      let x = [this.checkExternalArray[ch][1]] * 1;

      y = y < 0 ? 0 : y;
      x = x < 0 ? 0 : x;

      ctx.beginPath();
      ctx.fillStyle = "pink";
      ctx.rect(x * 10, y * 10, 10, 10);

      ctx.fill();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.rect(
      this.x * this.width,
      this.y * this.height,
      this.width,
      this.height
    );

    ctx.fill();
    if (this.selected) {
      ctx.strokeStyle = "yellow";

      ctx.rect(
        this.x * this.width,
        this.y * this.height,
        this.width,
        this.height
      );
      ctx.stroke();
    }
    ctx.beginPath();
    let innerMarkings = this.innerMarkings;

    for (var i in innerMarkings) {
      let marking = innerMarkings[i];
      ctx.fillStyle = marking.color;

      ctx.arc(
        this.x * this.width + this.width / 2,
        this.y * this.height + this.height / 2 - 2,
        3,
        0,
        2 * Math.PI
      );
      /*  ctx.rect(
        this.x * this.width + marking.x,
        this.y * this.height + marking.y,
        3,
        3
      ); */
      ctx.fill();
    }

    //console.log("we here");
  }

  move(key) {
    let diry = Math.random();
    let dirx = Math.random();
    this.moveUpDown = false;
    this.moveleftRight = false;
    // console.log(this.x, this.y);
    if (this.player) {
      switch (key) {
        case "ArrowRight":
          this.newx++;
          break;
        case "ArrowLeft":
          this.newx--;
          break;
        case "ArrowUp":
          this.newy--;
          break;
        case "ArrowDown":
          this.newy++;
          break;
      }
    } else {
      let dy = Math.floor(Math.random() * 2) - 1;
      let dx = Math.floor(Math.random() * 2) - 1;

      if (diry < 0.5) {
        dy *= -1;
      }

      if (dirx < 0.5) {
        dx *= -1;
      }

      this.dy = dy;
      this.dx = dx;
      let moveXorY = Math.random();
      if (moveXorY > 0.5) {
        this.newx += dx;
        this.moveleftRight = true;
      } else {
        this.newy += dy;
        this.moveUpDown = true;
      }
    }
    this.newx = this.newx <= 0 ? 0 : this.newx;
    this.newy = this.newy <= 0 ? 0 : this.newy;
    this.newy =
      this.newy >= canvas.height / this.height - 1
        ? canvas.height / this.height - 1
        : this.newy;
    this.newx =
      this.newx >= canvas.width / this.width - 1
        ? canvas.width / this.width - 1
        : this.newx;

    //check to see if food is near
    let externalCheck = false;
    let foodNear = false;

    //check exteronal
    this.updateCheckRange();

    for (var ch in this.checkExternalArray) {
      let y = [this.checkExternalArray[ch][0]] * 1;
      let x = [this.checkExternalArray[ch][1]] * 1;

      y = y < 0 ? 0 : y;
      x = x < 0 ? 0 : x;
      y = y > canvas.height / 10 ? canvas.height / 10 : y;
      x = x > canvas.width / 10 ? canvas.width / 10 : x;

      let gridValue = gridArray[y][x];
      if (
        gridValue.toString().indexOf("F") > -1 &&
        this.attitude === "hungry"
      ) {
        // console.log(x, y);
        foodNear = true;

        if (this.x === x) {
          this.newx = this.x;
        } else if (this.x > x) {
          // console.log("over");
          this.newx = this.x - 1;
        } else if (this.x < x) {
          //  console.log("second over");
          this.newx = this.x + 1;
        }
        if (this.y === y) {
          this.newy = this.y;
        } else if (this.y > y) {
          //  console.log("over");
          this.newy = this.y - 1;
        } else if (this.y < y) {
          //  console.log("second over");
          this.newy = this.y + 1;
        }

        externalCheck = true;
        break;
      }
    }
    //check internal

    if (!externalCheck) {
      for (var ch in this.checkInternalArray) {
        let y = [this.checkInternalArray[ch][0]] * 1;
        let x = [this.checkInternalArray[ch][1]] * 1;

        y = y < 0 ? 0 : y;
        x = x < 0 ? 0 : x;
        y = y > canvas.height / 10 ? canvas.height / 10 : y;
        x = x > canvas.width / 10 ? canvas.width / 10 : x;

        let gridValue = gridArray[y][x];
        if (gridValue.toString().indexOf("F") > -1) {
          foodNear = true;
          this.newx = x;
          this.newy = y;
          break;
        }
      }
    }

    if (
      gridArray[this.newy][this.newx] === 0 ||
      gridArray[this.newy][this.newx].toString().indexOf("F") > -1
    ) {
      let originalValue = gridArray[this.newy][this.newx].toString();
      gridArray[this.y][this.x] = 0;
      gridArray[this.newy][this.newx] = this.id;
      this.x = this.newx;
      this.y = this.newy;
      this.newx = this.x;
      this.newy = this.y;

      if (originalValue.indexOf("F") > -1) {
        this.stats.health += 100;
        //console.log(resourceArray.length, resourceArray);

        for (var r = 0; r <= resourceArray.length; ++r) {
          let res = resourceArray[r];
          if (res.id === originalValue) {
            resourceArray.splice(r, 1);
            let count = 0;
            while (count <= 2) {
              try {
                let gridPos = gridArray[count + this.newy][count + this.newx];

                let color = this.color;
                //possible mutation
                let innerMarkings = this.innerMarkings;

                let randomMutation = Math.floor(Math.random() * 30);

                if (randomMutation === 3) {
                  console.log("mutation alert");
                  let bodyOrMarkings = randomRange(0, 1);

                  if (bodyOrMarkings === 1) {
                    color =
                      "rgb(" +
                      Math.floor(Math.random() * 255) +
                      "," +
                      Math.floor(Math.random() * 255) +
                      "," +
                      Math.floor(Math.random() * 255) +
                      ")";
                  } else {
                    innerMarkings = [];
                    let count = 0;
                    while (count <= this.numberOfMarkings) {
                      let newMarking = {
                        x: randomRange(1, 3),
                        y: randomRange(1, 3),
                        color: randomColor(),
                      };
                      innerMarkings.push(newMarking);

                      count++;
                    }
                  }
                }
                if (gridPos === 0) {
                  let lf = new Life(
                    count + this.newx,
                    count + this.newy,
                    allLifeAgeId,
                    color,
                    innerMarkings
                  );

                  lf.attitude = this.attitude;
                  lifeArray.push(lf);
                  gridArray[count + this.newy][count + this.newx] = lf.id;

                  allLifeAgeId++;
                }
              } catch (e) {
                console.log(e);
              }
              count++;
            }

            // console.log(lifeArray);
            break;
          }
        }
        /*  let dead = lifeArray[l];
  
          lifeArray.splice(l, 1); */
      } else {
        this.stats.health--;
      }
    } else {
      if (gridArray[this.newy][this.newx] > 0) {
        let originalValue = gridArray[this.newy][this.newx];
        let other;
        for (var l = 0; l < lifeArray.length; ++l) {
          let lf = lifeArray[l];
          if (lf.id === originalValue) {
            other = lf;
            break;
          }
        }

        //console.log(other.stats, this.stats);
        if (
          other.stats.health > this.stats.health &&
          other.color !== this.color
        ) {
          //console.log(this.stats);
          this.color = "black";
          other.stats.health += this.stats.health;
          this.stats.health = 0;
        } else {
        }
      }
    }
    if (this.stats.health < 40) {
      // this.color = "gray";
    }
  }
}
