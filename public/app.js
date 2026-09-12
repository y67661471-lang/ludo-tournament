// ======================================
// LUDO TOURNAMENT - BASIC GAME SYSTEM
// ======================================

const game = {
  players: [
    {
      id: 1,
      name: "Player 1",
      position: -1,
      color: "red"
    },
    {
      id: 2,
      name: "Player 2",
      position: -1,
      color: "blue"
    }
  ],

  currentPlayer: 0,
  dice: 0,
  status: "waiting"
};


// ================================
// START MATCH
// ================================

function startMatch(type) {

  console.log("Starting:", type);

  game.status = "playing";
  game.currentPlayer = 0;
  game.dice = 0;

  alert(
    type +
    " Match Started!\n\n" +
    "Player 1 vs Player 2"
  );

  createGameBoard();
}


// ================================
// CREATE LUDO BOARD
// ================================

function createGameBoard() {

  const oldBoard = document.getElementById("ludo-board");

  if (oldBoard) {
    oldBoard.remove();
  }

  const board = document.createElement("div");

  board.id = "ludo-board";

  board.style.cssText = `
    width: 330px;
    height: 330px;
    margin: 25px auto;
    background: white;
    border: 5px solid #ffc400;
    border-radius: 15px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 1fr);
    gap: 2px;
    padding: 5px;
  `;


  // Create cells

  for (let i = 0; i < 25; i++) {

    const cell = document.createElement("div");

    cell.dataset.position = i;

    cell.style.cssText = `
      background: #e9edf5;
      border: 1px solid #777;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: #222;
    `;

    cell.innerText = i + 1;

    board.appendChild(cell);
  }


  // Add board after welcome section

  const container =
    document.querySelector(".container");

  const security =
    document.querySelector(".security");

  container.insertBefore(board, security);


  createDiceButton();
}


// ================================
// DICE BUTTON
// ================================

function createDiceButton() {

  const oldDice =
    document.getElementById("dice-area");

  if (oldDice) {
    oldDice.remove();
  }


  const area = document.createElement("div");

  area.id = "dice-area";

  area.style.cssText = `
    text-align: center;
    margin: 20px 0;
  `;


  area.innerHTML = `

    <div
      id="turn-player"
      style="
        font-size:20px;
        color:#ffc400;
        font-weight:bold;
        margin-bottom:10px;
      "
    >
      Player 1 Turn
    </div>

    <div
      id="dice-result"
      style="
        font-size:50px;
        margin:10px;
      "
    >
      🎲
    </div>

    <button
      onclick="rollDice()"
      style="
        background:#ffc400;
        border:none;
        padding:15px 45px;
        border-radius:12px;
        font-size:20px;
        font-weight:bold;
        cursor:pointer;
      "
    >
      🎲 ROLL DICE
    </button>

  `;


  const board =
    document.getElementById("ludo-board");

  board.after(area);
}


// ================================
// ROLL DICE
// ================================

function rollDice() {

  if (game.status !== "playing") {
    return;
  }


  // Temporary local dice.
  // Later this will be replaced
  // by secure server-side dice.

  game.dice =
    Math.floor(Math.random() * 6) + 1;


  const dice =
    document.getElementById("dice-result");

  dice.innerText =
    getDiceEmoji(game.dice);


  movePlayer(game.dice);
}


// ================================
// DICE EMOJI
// ================================

function getDiceEmoji(number) {

  const dice = [
    "🎲",
    "⚀",
    "⚁",
    "⚂",
    "⚃",
    "⚄",
    "⚅"
  ];

  return dice[number] || "🎲";
}


// ================================
// PLAYER MOVE
// ================================

function movePlayer(steps) {

  const player =
    game.players[game.currentPlayer];


  if (player.position === -1) {

    if (steps !== 6) {

      switchTurn();

      return;
    }

    player.position = 0;

  } else {

    player.position += steps;
  }


  // Simple demo board

  if (player.position >= 24) {

    player.position = 24;

    alert(
      player.name +
      " reached the finish!"
    );

    game.status = "finished";

    return;
  }


  renderPlayers();

  switchTurn();
}


// ================================
// RENDER PLAYERS
// ================================

function renderPlayers() {

  document
    .querySelectorAll("#ludo-board div")
    .forEach(cell => {

      const pos =
        Number(cell.dataset.position);

      cell.innerText = pos + 1;

      cell.style.background =
        "#e9edf5";
    });


  game.players.forEach(player => {

    if (player.position < 0) {
      return;
    }


    const cell =
      document.querySelector(
        `[data-position="${player.position}"]`
      );


    if (!cell) {
      return;
    }


    if (player.id === 1) {

      cell.style.background = "#ff4444";

      cell.innerText = "🔴";

    } else {

      cell.style.background = "#448aff";

      cell.innerText = "🔵";
    }

  });
}


// ================================
// SWITCH TURN
// ================================

function switchTurn() {

  game.currentPlayer =
    game.currentPlayer === 0
      ? 1
      : 0;


  const player =
    game.players[game.currentPlayer];


  const turn =
    document.getElementById("turn-player");


  if (turn) {

    turn.innerText =
      player.name + " Turn";
  }
}


// ================================
// API STATUS TEST
// ================================

async function checkServer() {

  try {

    const response =
      await fetch("/api/status");

    const data =
      await response.json();

    console.log(
      "Server:",
      data.message
    );

  } catch (error) {

    console.error(
      "Server connection failed:",
      error
    );

  }
}


// Start API test

checkServer();
