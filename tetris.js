// HTML-Elemente abrufen
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
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
    const pieceType = 'T'; // Hier kannst du den Starttyp des Tetris-Teils ändern
    player.matrix = pieces[pieceType];
    player.pos.y = 0;
    player.pos.x = Math.floor(COLS / 2) - Math.floor(player.matrix[0].length / 2);
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

// Punkteanzeige aktualisieren
function updateScore() {
    scoreElement.innerText = player.score;
}

// Punkteanzeige aktualisieren
function updateScore() {
    scoreElement.innerText = player.score;
}

// Punkteanzeige aktualisieren
function updateScore() {
    scoreElement.innerText = player.score;
}

// Kollisionserkennung
function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Spieler bewegen
function playerMove(dir) {
    player.pos.x += dir;
    if (collide(arena, player)) {
        player.pos.x -= dir;
    }
}

// Spieler drehen
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

// Matrix drehen
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

// Neues Tetris-Teil hinzufügen
function playerReset() {
    const pieces = 'ILJOTSZ';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (COLS / 2 | 0) - (player.matrix[0].length / 2 | 0);
    if (collide(arena, player)) {
        arena.forEach(row => row.fill(0));
        player.score = 0;
        updateScore();
    }
}

// Spiellogik aktualisieren
function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    if (deltaTime > 1000) {
        playerDrop();
    }

    draw(); // Spielfeld neu zeichnen

    requestAnimationFrame(update); // Nächste Aktualisierung anfordern
     return Promise.resolve(); // Versprechen zurückgeben
}

// Spielfeld initialisieren
addPiece(); // Erstes Stück hinzufügen
update(); // Spiel aktualisieren

