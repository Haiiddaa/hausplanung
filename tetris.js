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

// Spielschleife
let lastTime = 0;
function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    // Logik zum Bewegen des Spielers und Aktualisieren des Spielfelds

    draw(); // Spielfeld neu zeichnen

    requestAnimationFrame(update); // Nächste Aktualisierung anfordern
}

// Spielschleife starten
addPiece(); // Erstes Stück hinzufügen
update(); // Spiel aktualisieren
