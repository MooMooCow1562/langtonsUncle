const ANT_INFO = {
    RIGHT: "#CCCCCC",
    LEFT: "#333333",
    ANT_RIGHT_UP: "#BB0000",
    ANT_RIGHT_RIGHT: "#BBBB00",
    ANT_RIGHT_DOWN: "#00bb88",
    ANT_RIGHT_LEFT: "#0022bb",
    ANT_LEFT_UP: "#BB6600",
    ANT_LEFT_RIGHT: "#00BB11",
    ANT_LEFT_DOWN: "#0088bb",
    ANT_LEFT_LEFT: "#4400bb",
}
Object.freeze(ANT_INFO)
const ANT_CANVAS = document.getElementById("ant")
const ANT_CONTEXT = ANT_CANVAS.getContext("2d")
const CELL_SIZE = 3
const ANT_GRID_HEIGHT = Math.floor(ANT_CANVAS.height / CELL_SIZE)
const ANT_GRID_LENGTH = Math.floor(ANT_CANVAS.width / CELL_SIZE)
const ANT_RIGHT = [ANT_INFO.ANT_RIGHT_DOWN, ANT_INFO.ANT_RIGHT_LEFT, ANT_INFO.ANT_RIGHT_RIGHT, ANT_INFO.ANT_RIGHT_UP]
const ANT_LEFT = [ANT_INFO.ANT_LEFT_DOWN, ANT_INFO.ANT_LEFT_LEFT, ANT_INFO.ANT_LEFT_RIGHT, ANT_INFO.ANT_LEFT_UP]
const speed = document.getElementById("speed")
let antTimeout
let antGrid = create2dArray(ANT_GRID_LENGTH, ANT_GRID_HEIGHT)
let nextAntGrid = create2dArray(ANT_GRID_LENGTH, ANT_GRID_HEIGHT)

function create2dArray(length, height) {
    let arr = new Array(height)
    for (let h = 0; h < height; h++) {
        arr[h] = new Array(length)
        for (let l = 0; l < length; l++) {
            arr[h][l] = ANT_INFO.RIGHT
            if ((l === Math.floor(length / 2) && h === Math.floor(height / 2))) {
                arr[h][l] = ANT_INFO.ANT_RIGHT_UP
            }
        }
    }
    return arr;
}

function wrap(value, dimension) {
    return (Number(value + dimension) % dimension);
}

function drawAntCell(y, x) {
    let normX = Math.floor(x);
    let normY = Math.floor(y);
    ANT_CONTEXT.fillStyle = antGrid[normY][normX]
    normX *= CELL_SIZE;
    normY *= CELL_SIZE;
    ANT_CONTEXT.fillRect(normX, normY, CELL_SIZE, CELL_SIZE);
}

function antStep() {
    for (let h = 0; h < ANT_GRID_HEIGHT; h++) {
        for (let l = 0; l < ANT_GRID_LENGTH; l++) {
            //if I am a cell that's turning right
            if (ANT_RIGHT.includes(antGrid[h][l])) {
                //draw the turning right cell.
                nextAntGrid[h][l] = ANT_INFO.LEFT
            } else //if I am a cell that's turning left,
            if (ANT_LEFT.includes(antGrid[h][l])) {
                //draw the turning left cell.
                nextAntGrid[h][l] = ANT_INFO.RIGHT
            } else //if I am not an ant
            {
                //check for an ant nearby.
                let above = antGrid[wrap(h + 1, ANT_GRID_HEIGHT)][l]
                let below = antGrid[wrap(h - 1, ANT_GRID_HEIGHT)][l]
                let left = antGrid[h][wrap(l - 1, ANT_GRID_LENGTH)]
                let right = antGrid[h][wrap(l + 1, ANT_GRID_LENGTH)]
                let me = antGrid[h][l]
                //if the square below me is an ant, that is coming up on me
                if (below === ANT_INFO.ANT_RIGHT_DOWN || below === ANT_INFO.ANT_LEFT_DOWN) {
                    //if left, turn right and store my leftness.
                    if (me === ANT_INFO.LEFT) {
                        nextAntGrid[h][l] = ANT_INFO.ANT_LEFT_RIGHT
                    }
                    //if right, turn right and store my rightness
                    else {
                        nextAntGrid[h][l] = ANT_INFO.ANT_RIGHT_LEFT
                    }
                    //if the square above me is an ant, that is coming down on me
                } else if (above === ANT_INFO.ANT_RIGHT_UP || above === ANT_INFO.ANT_LEFT_UP) {
                    //if left, turn right and store my leftness.
                    if (me === ANT_INFO.LEFT) {
                        nextAntGrid[h][l] = ANT_INFO.ANT_LEFT_LEFT
                    }
                    //if right, turn right and store my rightness
                    else {
                        nextAntGrid[h][l] = ANT_INFO.ANT_RIGHT_RIGHT
                    }
                    //if the square left of me is an ant, that is coming right on me
                } else if (left === ANT_INFO.ANT_RIGHT_LEFT || left === ANT_INFO.ANT_LEFT_LEFT) {
                    //if left, turn right and store my leftness.
                    if (me === ANT_INFO.LEFT) {
                        nextAntGrid[h][l] = ANT_INFO.ANT_LEFT_DOWN
                    }
                    //if right, turn right and store my rightness
                    else {
                        nextAntGrid[h][l] = ANT_INFO.ANT_RIGHT_UP
                    }
                    //if the square right of me is an ant, that is coming left on me
                } else if (right === ANT_INFO.ANT_RIGHT_RIGHT || right === ANT_INFO.ANT_LEFT_RIGHT) {
                    //if left, turn right and store my leftness.
                    if (me === ANT_INFO.LEFT) {
                        nextAntGrid[h][l] = ANT_INFO.ANT_LEFT_UP
                    }
                    //if right, turn right and store my rightness
                    else {
                        nextAntGrid[h][l] = ANT_INFO.ANT_RIGHT_DOWN
                    }
                } else {
                    nextAntGrid[h][l] = antGrid[h][l]
                }
            }
            //input the konomi code and earn nothing.
        }
    }
    cloneInto(antGrid, nextAntGrid)
}

function cloneInto(into, cloneMe) {
    //for every entry in into, clone the value in the corresponding array in cloneMe.
    for (let y = 0; y < ANT_GRID_HEIGHT; y++) {
        for (let x = 0; x < ANT_GRID_LENGTH; x++) {
            into[y][x] = cloneMe[y][x] + "";
        }
    }
}

function drawAntBoard() {
    for (let h = 0; h < ANT_GRID_HEIGHT; h++) {
        for (let l = 0; l < ANT_GRID_LENGTH; l++) {
            drawAntCell(h, l)
        }
    }
}

function antTimeoutHandler() {
    for (let i = 0; i < speed.value; i++) {
        antStep()
    }
    drawAntBoard()
    antTimeout = setTimeout(() => antTimeoutHandler(), 0)
}

function antStart() {
    if (antTimeout) {
        clearTimeout(antTimeout)
    }
    antTimeoutHandler()
}

function antStop() {
    clearTimeout(antTimeout)
    drawAntBoard()
}

function antReset() {
    if (antTimeout) {
        clearTimeout(antTimeout)
    }
    antGrid = create2dArray(ANT_GRID_LENGTH, ANT_GRID_HEIGHT)
    nextAntGrid = create2dArray(ANT_GRID_LENGTH, ANT_GRID_HEIGHT)
    drawAntBoard()
}

document.getElementById("aStep").addEventListener("click", () => {
    antStep();
    drawAntBoard()
})
document.getElementById("aStart").addEventListener("click", antStart)
document.getElementById("aStop").addEventListener("click", antStop)
document.getElementById("aReset").addEventListener("click", antReset)
drawAntBoard()
//allows you to actually toggle cells.
let currentDrawType = ANT_INFO.LEFT;

function cellToggle(e) {
    let bound = ANT_CANVAS.getBoundingClientRect();
    let y1 = Math.floor((e.clientY - bound.top) / CELL_SIZE);
    let x1 = Math.floor((e.clientX - bound.left) / CELL_SIZE);
    //and check to see where I must write to it.
    antGrid[wrap(y1, ANT_GRID_HEIGHT)][wrap(x1, ANT_GRID_LENGTH)] = currentDrawType;
    drawAntBoard();
}

ANT_CANVAS.addEventListener("click", cellToggle)
for (const cellType of document.getElementsByName("cellType")) {
    cellType.addEventListener("change", (e) => {
        if (e.currentTarget.checked) {
            switch (e.currentTarget.id) {
                case "RIGHT":
                    currentDrawType = ANT_INFO.RIGHT
                    break
                case "LEFT":
                    currentDrawType = ANT_INFO.LEFT
                    break
                case "ANT_RIGHT_UP":
                    currentDrawType = ANT_INFO.ANT_RIGHT_UP
                    break
                case "ANT_RIGHT_RIGHT":
                    currentDrawType = ANT_INFO.ANT_RIGHT_RIGHT
                    break
                case "ANT_RIGHT_DOWN":
                    currentDrawType = ANT_INFO.ANT_RIGHT_DOWN
                    break
                case "ANT_RIGHT_LEFT":
                    currentDrawType = ANT_INFO.ANT_RIGHT_LEFT
                    break
                case "ANT_LEFT_UP":
                    currentDrawType = ANT_INFO.ANT_LEFT_UP
                    break
                case "ANT_LEFT_RIGHT":
                    currentDrawType = ANT_INFO.ANT_LEFT_RIGHT
                    break
                case "ANT_LEFT_DOWN":
                    currentDrawType = ANT_INFO.ANT_LEFT_DOWN
                    break
                case "ANT_LEFT_LEFT":
                    currentDrawType = ANT_INFO.ANT_LEFT_LEFT
                    break
                default:
                //do nothing
            }
        }
    })
}

//highlights the board and what cell you're editing on the board.