// HTML-Elemente abrufen
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const startButton = document.getElementById('start-btn');

// Größe des Spielfelds festlegen
const ROWS = 20;
const COLS = 12;
const BLOCK_SIZE = 20;

// Spielfeld initialisieren
let arena = [];
for (let row = 0; row < ROWS; row++) {
    arena.push(new Array(COLS).fill(0));
}

// Spielerobjekt erstellen
const player = {
    matrix: null,
    pos: { x: 0, y: 0 },
    score: 0,
};

// Verschiedene Tetris-Formen
const pieces = {
    'T': [[0,0,0],
          [1,1,1],
          [0,1,0]],
    'O': [[2,2],
          [2,2]],
    'L': [[0,3,0],
          [0,3,0],
          [0,3,3]],
    'J': [[0,4,0],
          [0,4,0],
          [4,4,0]],
    'I': [[0,0,0,0],
          [5,5,5,5],
          [0,0,0,0],
          [0,0,0,0]],
    'S': [[0,6,6],
          [6,6,0],
          [0,0,0]],
    'Z': [[7,7,0],
          [0,7,7],
          [0,0,0]],
};

// Füge eine neue Tetris-Form zum Spielfeld hinzu
function addPiece() {
    const pieceTypes = Object.keys(pieces);
    const pieceType = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
    player.matrix = pieces[pieceType];
    player.pos.y = 0;
    player.pos.x = Math.floor(COLS / 2) - Math.floor(player.matrix[0].length / 2);
}

// Kollisionsnachweis
function collide(arena, player) {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
                (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

// Tetris-Teil drehen
function rotate(matrix, dir) {
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x],
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }
    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

// Tetris-Teil bewegen
function movePiece(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir;
    }
}

// Tetris-Teil herunterfallen lassen
function dropPiece() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        resetPlayer();
    }
}

// Tetris-Teil mit dem Spielfeld verschmelzen
function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

// Reihe löschen, wenn voll
function sweepArena() {
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
    }
}

// Spiel starten
function startGame() {
    resetArena();
    resetPlayer();
    update
    Score();
addPiece();
update();
}

// Spieler zurücksetzen
function resetPlayer() {
addPiece();
player.score = 0;
updateScore();
}

// Spielfeld zurücksetzen
function resetArena() {
arena = [];
for (let row = 0; row < ROWS; row++) {
arena.push(new Array(COLS).fill(0));
}
}

// Zeichne das Spielfeld
function draw() {
// Hintergrund zeichnen
context.fillStyle = '#000';
context.fillRect(0, 0, canvas.width, canvas.height);

// Spielfeld zeichnen
drawMatrix(arena, {x: 0, y: 0});
drawMatrix(player.matrix, player.pos);

}

// Spielfeld zeichnen
function drawMatrix(matrix, offset) {
matrix.forEach((row, y) => {
row.forEach((value, x) => {
if (value !== 0) {
context.fillStyle = colors[value];
context.fillRect(x + offset.x, y + offset.y, 1, 1);
}
});
});
}

// Tetris-Teil drehen
function rotatePiece(dir) {
const pos = player.pos.x;
let offset = 1;
rotate(player.matrix, dir);
while (collide(arena, player)) {
player.pos.x += offset;
offset = -(offset + (offset > 0 ? 1 : -1));
if (offset > player.matrix[0].length) {
rotate(player.matrix, -dir);
player.pos.x = pos;
return;
}
}
}

// Punkte aktualisieren
function updateScore() {
scoreElement.innerText = player.score;
}

// Spiel-Update
function update(time = 0) {
const deltaTime = time - lastTime;
lastTime = time;

dropCounter += deltaTime;
if (dropCounter > dropInterval) {
    dropPiece();
}

draw();
requestAnimationFrame(update);

}

// Tastensteuerung
document.addEventListener('keydown', event => {
if (event.keyCode === 37) { // Left arrow
movePiece(-1);
} else if (event.keyCode === 39) { // Right arrow
movePiece(1);
} else if (event.keyCode === 40) { // Down arrow
dropPiece();
} else if (event.keyCode === 81) { // Q
rotatePiece(-1);
} else if (event.keyCode === 87) { // W
rotatePiece(1);
}
});

// Spiel starten, wenn der Start-Button geklickt wird
startButton.addEventListener('click', startGame);

// Spiel starten
startGame();
