// ==========================================
// LUDO TOURNAMENT - 4 PLAYER TEAM LOBBY
// ==========================================

const teamGame = {
  matchType: null,

  teams: {
    A: [null, null],
    B: [null, null]
  },

  myTeam: null,
  mySlot: null
};


// ==========================================
// START MATCH
// ==========================================

function startMatch(type) {

  teamGame.matchType = type;

  showTeamLobby(type);
}


// ==========================================
// TEAM LOBBY
// ==========================================

function showTeamLobby(type) {

  const oldBoard = document.getElementById("ludo-board");
  const oldDice = document.getElementById("dice-area");
  const oldLobby = document.getElementById("team-lobby");

  if (oldBoard) oldBoard.remove();
  if (oldDice) oldDice.remove();
  if (oldLobby) oldLobby.remove();


  const lobby = document.createElement("div");

  lobby.id = "team-lobby";

  lobby.style.cssText = `
    background:#101f4d;
    border:2px solid #ffc400;
    border-radius:22px;
    padding:22px;
    margin:25px auto;
    max-width:650px;
    color:white;
  `;


  lobby.innerHTML = `

    <div style="
      text-align:center;
      color:#ffc400;
      font-size:28px;
      font-weight:bold;
      margin-bottom:10px;
    ">
      🎲 ${type} Team Match
    </div>

    <div style="
      text-align:center;
      color:#d7def5;
      margin-bottom:20px;
      font-size:17px;
    ">
      4 Players • 2 vs 2
    </div>


    <!-- TEAM A -->

    <div style="
      background:#172b60;
      border:2px solid #ff4444;
      border-radius:18px;
      padding:18px;
      margin-bottom:18px;
    ">

      <h2 style="color:#ff5555;">
        🔴 TEAM A
      </h2>

      <div id="teamA"
        style="
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:10px;
          margin-top:12px;
        ">
      </div>

      <button
        onclick="joinTeam('A')"
        style="
          width:100%;
          margin-top:15px;
          padding:14px;
          border:0;
          border-radius:12px;
          background:#ff4444;
          color:white;
          font-size:18px;
          font-weight:bold;
        "
      >
        JOIN TEAM A
      </button>

    </div>


    <!-- TEAM B -->

    <div style="
      background:#172b60;
      border:2px solid #448aff;
      border-radius:18px;
      padding:18px;
      margin-bottom:18px;
    ">

      <h2 style="color:#448aff;">
        🔵 TEAM B
      </h2>

      <div id="teamB"
        style="
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:10px;
          margin-top:12px;
        ">
      </div>

      <button
        onclick="joinTeam('B')"
        style="
          width:100%;
          margin-top:15px;
          padding:14px;
          border:0;
          border-radius:12px;
          background:#448aff;
          color:white;
          font-size:18px;
          font-weight:bold;
        "
      >
        JOIN TEAM B
      </button>

    </div>


    <div id="team-status"
      style="
        text-align:center;
        padding:15px;
        background:#0b1738;
        border-radius:12px;
        color:#ffc400;
        font-weight:bold;
      "
    >
      Waiting for 4 players...
    </div>

  `;


  const container =
    document.querySelector(".container");

  const security =
    document.querySelector(".security");

  container.insertBefore(lobby, security);


  renderTeams();
}


// ==========================================
// JOIN TEAM
// ==========================================

function joinTeam(team) {

  // Check whether player already joined

  if (teamGame.myTeam) {

    alert(
      "You have already joined Team " +
      teamGame.myTeam
    );

    return;
  }


  const players =
    teamGame.teams[team];


  // Team full

  if (players[0] && players[1]) {

    alert("This team is full.");

    return;
  }


  const player = {
    id: Date.now(),
    name: "You",
    team: team
  };


  if (!players[0]) {

    players[0] = player;
    teamGame.mySlot = 0;

  } else {

    players[1] = player;
    teamGame.mySlot = 1;
  }


  teamGame.myTeam = team;


  renderTeams();

  checkPlayers();
}


// ==========================================
// SHOW TEAMS
// ==========================================

function renderTeams() {

  const teamA =
    document.getElementById("teamA");

  const teamB =
    document.getElementById("teamB");


  if (!teamA || !teamB) {
    return;
  }


  teamA.innerHTML =
    createPlayerSlots(
      teamGame.teams.A,
      "🔴"
    );


  teamB.innerHTML =
    createPlayerSlots(
      teamGame.teams.B,
      "🔵"
    );
}


// ==========================================
// PLAYER SLOTS
// ==========================================

function createPlayerSlots(players, icon) {

  let html = "";


  for (let i = 0; i < 2; i++) {

    if (players[i]) {

      html += `
        <div style="
          background:#24386f;
          padding:14px;
          border-radius:12px;
          text-align:center;
          font-weight:bold;
        ">
          ${icon} ${players[i].name}
          <br>
          <small style="color:#20e060;">
            READY
          </small>
        </div>
      `;

    } else {

      html += `
        <div style="
          background:#0b1738;
          padding:14px;
          border-radius:12px;
          text-align:center;
          color:#9caad0;
        ">
          👤 Empty Slot
        </div>
      `;
    }
  }


  return html;
}


// ==========================================
// CHECK 4 PLAYERS
// ==========================================

function checkPlayers() {

  const A =
    teamGame.teams.A;

  const B =
    teamGame.teams.B;


  const total =
    A.filter(Boolean).length +
    B.filter(Boolean).length;


  const status =
    document.getElementById("team-status");


  if (!status) {
    return;
  }


  if (total < 4) {

    status.innerText =
      `Waiting for players... ${total}/4`;

    return;
  }


  status.innerHTML = `
    <span style="color:#20e060;">
      ✅ 4 Players Ready!
    </span>
    <br><br>

    <button
      onclick="startTeamGame()"
      style="
        background:#0bc83b;
        color:white;
        border:0;
        padding:14px 35px;
        border-radius:12px;
        font-size:18px;
        font-weight:bold;
      "
    >
      🎲 START TEAM GAME
    </button>
  `;
}


// ==========================================
// START TEAM GAME
// ==========================================

function startTeamGame() {

  alert(
    "4 Player Team Game Ready!\n\n" +
    "🔴 Team A vs 🔵 Team B"
  );


  // Actual multiplayer board
  // will be added in the next stage.

  createFourPlayerBoard();
}


// ==========================================
// BASIC 4 PLAYER BOARD
// ==========================================

function createFourPlayerBoard() {

  const lobby =
    document.getElementById("team-lobby");

  if (lobby) {
    lobby.remove();
  }


  const board =
    document.createElement("div");

  board.id = "ludo-board";


  board.style.cssText = `
    width:330px;
    height:330px;
    margin:25px auto;
    background:white;
    border:5px solid #ffc400;
    border-radius:15px;
    display:grid;
    grid-template-columns:repeat(5,1fr);
    grid-template-rows:repeat(5,1fr);
    gap:2px;
    padding:5px;
  `;


  for (let i = 0; i < 25; i++) {

    const cell =
      document.createElement("div");

    cell.style.cssText = `
      background:#e9edf5;
      border:1px solid #777;
      display:flex;
      align-items:center;
      justify-content:center;
      font-weight:bold;
      color:#222;
    `;

    cell.innerText = i + 1;

    board.appendChild(cell);
  }


  const container =
    document.querySelector(".container");

  const security =
    document.querySelector(".security");


  container.insertBefore(
    board,
    security
  );


  const info =
    document.createElement("div");

  info.style.cssText = `
    text-align:center;
    color:#ffc400;
    font-size:20px;
    font-weight:bold;
    margin:15px;
  `;

  info.innerHTML =
    "🔴 Team A vs 🔵 Team B<br>" +
    "👥 4 Player Match";


  board.after(info);
}
