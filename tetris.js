// HTML-Elemente abrufen
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const startButton = document.getElementById('start-btn');
const scoreElement = document.getElementById('score');

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
    const randomPieceType = pieceTypes[Math.floor(Math.random() * pieceTypes.length)];
    player.matrix = pieces[randomPieceType];
    player.pos.y = 0;
    player.pos.x = Math.floor(COLS / 2) - Math.floor(player.matrix[0].length / 2);
    if (collide(arena, player)) {
        gameOver();
    }
}

// Zeichne das Spielfeld
function draw() {
    // Hintergrund zeichnen
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Spieler-Teil zeichnen
    drawMatrix(player.matrix, player.pos, '#FFD700');
}

// Spielfeld zeichnen
function drawMatrix(matrix, offset, color) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = color;
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
            }
        });
    });
}

// Überprüfen, ob Spieler mit Arena kollidiert
function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

// Spiel beenden
function gameOver() {
   alert('Game Over!');
}

// Spielerbewegung
function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir;
    }
}

// Spielerrotation
function playerRotate(dir) {
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

// Tetris-Form drehen
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

// Spielschleife
let lastTime = 0;
function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

   function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        addPiece();
        updateScore();
        if (collide(arena, player)) {
            gameOver();
        }
    }
    dropCounter = 0;
}

    draw(); // Spielfeld neu zeichnen

    requestAnimationFrame(update); // Nächste Aktualisierung anfordern
}

// Spielschleife starten
addPiece(); // Erstes Stück hinzufügen
update(); // Spiel aktualisieren

// Start-Button Eventlistener
startButton.addEventListener('click', () => {
    addPiece();
    update();
// Start-Button Eventlistener
startButton.addEventListener('click', () => {
    addPiece();
    update();
});
});

// Tastatureingabe-Eventlistener
document.addEventListener('keydown', event => {
    if (event.keyCode === 37) { // Left arrow key
        playerMove(-1);
    } else if (event.keyCode === 39) { // Right arrow key
        playerMove(1);
    } else if (event.keyCode === 40) { // Down arrow key
        playerDrop();
    } else if (event.keyCode === 81) { // Q key
        playerRotate(-1);
    } else if (event.keyCode === 87) { // W key
        playerRotate(1);
    }
});
