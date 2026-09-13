// ============================================================
// LUDO TOURNAMENT
// 4 PLAYER TEAM LUDO
// SUPABASE REALTIME
// ROOM + TEAM + DICE + TURN + TOKENS
// ============================================================

const SUPABASE_URL =
  "https://ohrbvijivfwvmlgnhzmp.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_ywFDW9RIMqXOkBXky1p7vA_3KnoqJev";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


// ============================================================
// PLAYER ID
// ============================================================

let savedPlayerId =
  localStorage.getItem("ludo_player_id");

if (!savedPlayerId) {
  savedPlayerId = crypto.randomUUID();
  localStorage.setItem(
    "ludo_player_id",
    savedPlayerId
  );
}


// ============================================================
// GAME STATE
// ============================================================

const teamGame = {

  matchType: null,

  roomId: null,

  roomCode: null,

  myPlayerId: savedPlayerId,

  myTeam: null,

  mySlot: null,

  players: [],

  channel: null,

  currentTurn: 1,

  diceValue: 0,

  diceRolled: false,

  gameStarted: false,

  tokens: {

    A1: 0,
    A2: 0,

    B1: 0,
    B2: 0

  }

};


// ============================================================
// START MATCH
// ============================================================

async function startMatch(type) {

  teamGame.matchType = type;

  showTeamLobby(type);

}


// ============================================================
// SHOW TEAM LOBBY
// ============================================================

function showTeamLobby(type) {

  const oldLobby =
    document.getElementById("team-lobby");

  if (oldLobby) {
    oldLobby.remove();
  }


  const oldBoard =
    document.getElementById("ludo-game-area");

  if (oldBoard) {
    oldBoard.remove();
  }


  const lobby =
    document.createElement("div");

  lobby.id = "team-lobby";


  lobby.style.cssText = `
    background:#101f4d;
    border:2px solid #ffc400;
    border-radius:22px;
    padding:20px;
    margin:25px auto 120px;
    max-width:650px;
    color:white;
    box-shadow:0 10px 30px rgba(0,0,0,.35);
  `;


  lobby.innerHTML = `

    <div style="
      text-align:center;
      color:#ffc400;
      font-size:28px;
      font-weight:bold;
      margin-bottom:8px;
    ">
      🎲 ${type} Team Match
    </div>

    <div style="
      text-align:center;
      color:#d7def5;
      margin-bottom:20px;
    ">
      4 Players • 2 vs 2
    </div>


    <div style="
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:8px;
      margin-bottom:18px;
    ">

      <div style="
        background:#172b60;
        border-radius:14px;
        padding:12px 5px;
        text-align:center;
      ">
        👥
        <br>
        <b style="color:#ffc400">4</b>
        <br>
        <small>Players</small>
      </div>


      <div style="
        background:#172b60;
        border:1px solid #ff4444;
        border-radius:14px;
        padding:12px 5px;
        text-align:center;
      ">
        🔴
        <br>
        <b style="color:#ff5555">2</b>
        <br>
        <small>Team A</small>
      </div>


      <div style="
        background:#172b60;
        border:1px solid #448aff;
        border-radius:14px;
        padding:12px 5px;
        text-align:center;
      ">
        🔵
        <br>
        <b style="color:#448aff">2</b>
        <br>
        <small>Team B</small>
      </div>

    </div>


    <!-- ROOM -->

    <div style="
      background:#0b1738;
      border:2px solid #ffc400;
      border-radius:16px;
      padding:15px;
      margin-bottom:18px;
    ">

      <div style="
        color:#ffc400;
        text-align:center;
        font-weight:bold;
        margin-bottom:10px;
      ">
        🔑 TEAM ROOM
      </div>


      <button
        id="create-room-btn"
        style="
          width:100%;
          padding:14px;
          border:0;
          border-radius:12px;
          background:#ffc400;
          color:#111;
          font-weight:bold;
          font-size:17px;
          margin-bottom:10px;
        "
      >
        🏠 CREATE NEW ROOM
      </button>


      <div style="
        display:flex;
        gap:7px;
      ">

        <input
          id="room-code-input"
          maxlength="6"
          placeholder="ENTER ROOM CODE"
          style="
            flex:1;
            min-width:0;
            padding:13px;
            border-radius:10px;
            border:1px solid #40558e;
            background:#172b60;
            color:white;
            text-transform:uppercase;
            outline:none;
          "
        >

        <button
          id="join-room-btn"
          style="
            padding:13px 18px;
            border:0;
            border-radius:10px;
            background:#0bc83b;
            color:white;
            font-weight:bold;
          "
        >
          JOIN
        </button>

      </div>

    </div>


    <div
      id="room-info"
      style="
        text-align:center;
        background:#172b60;
        padding:15px;
        border-radius:15px;
        margin-bottom:18px;
      "
    >
      🔑 Create or join a room
    </div>


    <!-- TEAM A -->

    <div style="
      background:#172b60;
      border:2px solid #ff4444;
      border-radius:18px;
      padding:16px;
      margin-bottom:16px;
    ">

      <h2 style="
        color:#ff5555;
        margin-bottom:5px;
      ">
        🔴 TEAM A
      </h2>

      <small style="color:#cbd5f5">
        2 Players
      </small>

      <div
        id="teamA"
        style="
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:8px;
          margin-top:12px;
        "
      ></div>


      <button
        id="join-team-a"
        style="
          width:100%;
          margin-top:12px;
          padding:14px;
          border:0;
          border-radius:12px;
          background:#ff4444;
          color:white;
          font-size:17px;
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
      padding:16px;
      margin-bottom:16px;
    ">

      <h2 style="
        color:#448aff;
        margin-bottom:5px;
      ">
        🔵 TEAM B
      </h2>

      <small style="color:#cbd5f5">
        2 Players
      </small>

      <div
        id="teamB"
        style="
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:8px;
          margin-top:12px;
        "
      ></div>


      <button
        id="join-team-b"
        style="
          width:100%;
          margin-top:12px;
          padding:14px;
          border:0;
          border-radius:12px;
          background:#448aff;
          color:white;
          font-size:17px;
          font-weight:bold;
        "
      >
        JOIN TEAM B
      </button>

    </div>


    <div
      id="team-status"
      style="
        text-align:center;
        padding:15px;
        background:#0b1738;
        border-radius:12px;
        color:#ffc400;
        font-weight:bold;
      "
    >
      👥 Waiting for 4 Players... 0/4
    </div>

  `;


  const container =
    document.querySelector(".container");

  const security =
    document.querySelector(".security");


  if (container) {

    container.insertBefore(
      lobby,
      security
    );

  }


  document
    .getElementById("create-room-btn")
    .addEventListener(
      "click",
      createRoom
    );


  document
    .getElementById("join-room-btn")
    .addEventListener(
      "click",
      joinRoom
    );


  document
    .getElementById("join-team-a")
    .addEventListener(
      "click",
      () => joinTeam("A")
    );


  document
    .getElementById("join-team-b")
    .addEventListener(
      "click",
      () => joinTeam("B")
    );


  renderTeams();

}


// ============================================================
// ROOM CODE
// ============================================================

function generateRoomCode() {

  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let code = "";

  for (let i = 0; i < 6; i++) {

    code +=
      chars[
        Math.floor(
          Math.random() * chars.length
        )
      ];

  }

  return code;

}


// ============================================================
// CREATE ROOM
// ============================================================

async function createRoom() {

  if (!teamGame.matchType) {

    alert(
      "Please select a match first."
    );

    return;

  }


  const button =
    document.getElementById(
      "create-room-btn"
    );


  if (button) {

    button.disabled = true;
    button.innerText =
      "Creating Room...";

  }


  const roomCode =
    generateRoomCode();


  const {
    data,
    error
  } =
    await supabaseClient
      .from("match_rooms")
      .insert({

        room_code:
          roomCode,

        match_type:
          teamGame.matchType,

        status:
          "waiting"

      })
      .select()
      .single();


  if (error) {

    console.error(error);

    alert(
      "Room creation failed:\n" +
      error.message
    );

    if (button) {

      button.disabled = false;
      button.innerText =
        "🏠 CREATE NEW ROOM";

    }

    return;

  }


  teamGame.roomId =
    data.id;

  teamGame.roomCode =
    data.room_code;


  showRoomInfo();

  subscribeToRoom();

  await loadPlayers();

  updateStatus(
    "✅ Room created. Choose your team."
  );


  if (button) {

    button.disabled = false;
    button.innerText =
      "🏠 CREATE NEW ROOM";

  }

}


// ============================================================
// ROOM INFO
// ============================================================

function showRoomInfo() {

  const info =
    document.getElementById(
      "room-info"
    );

  if (!info) return;


  info.innerHTML = `

    <div style="
      color:#9caad0;
      font-size:13px;
    ">
      ROOM CODE
    </div>

    <div style="
      color:#ffc400;
      font-size:30px;
      font-weight:bold;
      letter-spacing:5px;
      margin:6px;
    ">
      ${teamGame.roomCode}
    </div>

    <div style="
      color:#20e060;
      font-size:13px;
    ">
      Share this code with teammates
    </div>

  `;

}


// ============================================================
// JOIN ROOM
// ============================================================

async function joinRoom() {

  const input =
    document.getElementById(
      "room-code-input"
    );

  if (!input) return;


  const code =
    input.value
      .trim()
      .toUpperCase();


  if (!code) {

    alert(
      "Enter a room code."
    );

    return;

  }


  const {
    data,
    error
  } =
    await supabaseClient
      .from("match_rooms")
      .select("*")
      .eq(
        "room_code",
        code
      )
      .eq(
        "status",
        "waiting"
      )
      .maybeSingle();


  if (error) {

    console.error(error);

    alert(
      "Database error:\n" +
      error.message
    );

    return;

  }


  if (!data) {

    alert(
      "Room not found or match already started."
    );

    return;

  }


  teamGame.roomId =
    data.id;

  teamGame.roomCode =
    data.room_code;

  teamGame.matchType =
    data.match_type;


  showRoomInfo();

  subscribeToRoom();

  await loadPlayers();

  updateStatus(
    "✅ Room joined. Choose your team."
  );

}


// ============================================================
// JOIN TEAM
// ============================================================

async function joinTeam(team) {

  if (!teamGame.roomId) {

    alert(
      "First create or join a room."
    );

    return;

  }


  if (teamGame.myTeam) {

    alert(
      "You already joined Team " +
      teamGame.myTeam
    );

    return;

  }


  const {
    data: existing,
    error
  } =
    await supabaseClient
      .from("match_players")
      .select("*")
      .eq(
        "room_id",
        teamGame.roomId
      );


  if (error) {

    console.error(error);

    alert(
      "Unable to load players:\n" +
      error.message
    );

    return;

  }


  const players =
    existing || [];


  const alreadyJoined =
    players.find(
      p =>
        p.player_id ===
        teamGame.myPlayerId
    );


  if (alreadyJoined) {

    teamGame.myTeam =
      alreadyJoined.team;

    teamGame.mySlot =
      alreadyJoined.slot;

    await loadPlayers();

    return;

  }


  if (players.length >= 4) {

    alert(
      "Room already has 4 players."
    );

    return;

  }


  const teamPlayers =
    players.filter(
      p =>
        p.team === team
    );


  if (teamPlayers.length >= 2) {

    alert(
      "Team " +
      team +
      " is full."
    );

    return;

  }


  const slot =
    teamPlayers.some(
      p => p.slot === 1
    )
      ? 2
      : 1;


  const {
    error: insertError
  } =
    await supabaseClient
      .from("match_players")
      .insert({

        room_id:
          teamGame.roomId,

        player_id:
          teamGame.myPlayerId,

        player_name:
          "Player",

        team:
          team,

        slot:
          slot,

        ready:
          true

      });


  if (insertError) {

    console.error(
      insertError
    );

    alert(
      "Unable to join team:\n" +
      insertError.message
    );

    return;

  }


  teamGame.myTeam =
    team;

  teamGame.mySlot =
    slot;


  await loadPlayers();


  updateStatus(
    "✅ Joined Team " +
    team +
    ". Waiting for players..."
  );

}


// ============================================================
// LOAD PLAYERS
// ============================================================

async function loadPlayers() {

  if (!teamGame.roomId) return;


  const {
    data,
    error
  } =
    await supabaseClient
      .from("match_players")
      .select("*")
      .eq(
        "room_id",
        teamGame.roomId
      )
      .order(
        "team"
      )
      .order(
        "slot"
      );


  if (error) {

    console.error(error);

    return;

  }


  teamGame.players =
    data || [];


  const me =
    teamGame.players.find(
      p =>
        p.player_id ===
        teamGame.myPlayerId
    );


  if (me) {

    teamGame.myTeam =
      me.team;

    teamGame.mySlot =
      me.slot;

  }


  renderTeams();

  checkPlayers();

}


// ============================================================
// REALTIME
// ============================================================

function subscribeToRoom() {

  if (!teamGame.roomId) return;


  if (teamGame.channel) {

    supabaseClient.removeChannel(
      teamGame.channel
    );

  }


  teamGame.channel =
    supabaseClient
      .channel(
        "ludo-room-" +
        teamGame.roomId +
        "-" +
        teamGame.myPlayerId
      )
      .on(

        "postgres_changes",

        {
          event:
            "*",

          schema:
            "public",

          table:
            "match_players",

          filter:
            "room_id=eq." +
            teamGame.roomId

        },

        async function () {

          await loadPlayers();

        }

      )
      .subscribe(

        status => {

          console.log(
            "Realtime:",
            status
          );

        }

      );

}


// ============================================================
// RENDER TEAMS
// ============================================================

function renderTeams() {

  const teamA =
    document.getElementById(
      "teamA"
    );

  const teamB =
    document.getElementById(
      "teamB"
    );


  if (!teamA || !teamB) return;


  const A =
    teamGame.players.filter(
      p =>
        p.team === "A"
    );


  const B =
    teamGame.players.filter(
      p =>
        p.team === "B"
    );


  teamA.innerHTML =
    createPlayerSlots(
      A,
      "🔴"
    );


  teamB.innerHTML =
    createPlayerSlots(
      B,
      "🔵"
    );

}


// ============================================================
// PLAYER SLOTS
// ============================================================

function createPlayerSlots(
  players,
  icon
) {

  let html = "";


  for (
    let i = 1;
    i <= 2;
    i++
  ) {

    const player =
      players.find(
        p =>
          p.slot === i
      );


    if (player) {

      const isMe =
        player.player_id ===
        teamGame.myPlayerId;


      html += `

        <div style="
          background:#24386f;
          padding:13px 5px;
          border-radius:12px;
          text-align:center;
          font-weight:bold;
        ">

          ${icon}
          ${isMe ? "You" : "Player"}

          <br>

          <small style="
            color:#20e060;
          ">
            ${player.ready ? "READY" : "JOINED"}
          </small>

        </div>

      `;

    } else {

      html += `

        <div style="
          background:#0b1738;
          padding:13px 5px;
          border-radius:12px;
          text-align:center;
          color:#9caad0;
        ">

          👤 Empty

        </div>

      `;

    }

  }


  return html;

}


// ============================================================
// CHECK PLAYERS
// ============================================================

function checkPlayers() {

  const total =
    teamGame.players.length;


  const status =
    document.getElementById(
      "team-status"
    );


  if (!status) return;


  if (total < 4) {

    status.innerHTML =
      `⏳ Waiting for players... ${total}/4`;

    return;

  }


  const A =
    teamGame.players.filter(
      p =>
        p.team === "A"
    );


  const B =
    teamGame.players.filter(
      p =>
        p.team === "B"
    );


  if (
    A.length !== 2 ||
    B.length !== 2
  ) {

    status.innerHTML =
      "⚠️ Need 2 players in each team.";

    return;

  }


  status.innerHTML = `

    <div style="
      color:#20e060;
      font-size:18px;
      margin-bottom:12px;
    ">
      ✅ 4 PLAYERS READY
    </div>

    <button
      id="start-team-game"
      style="
        background:#0bc83b;
        color:white;
        border:0;
        padding:14px 30px;
        border-radius:12px;
        font-size:18px;
        font-weight:bold;
      "
    >
      🎲 START TEAM GAME
    </button>

  `;


  document
    .getElementById(
      "start-team-game"
    )
    .addEventListener(
      "click",
      startTeamGame
    );

}


// ============================================================
// STATUS
// ============================================================

function updateStatus(message) {

  const status =
    document.getElementById(
      "team-status"
    );


  if (status) {

    status.innerHTML =
      message;

  }

}


// ============================================================
// START TEAM GAME
// ============================================================

function startTeamGame() {

  if (
    teamGame.players.length !== 4
  ) {

    alert(
      "Four players are required."
    );

    return;

  }


  const A =
    teamGame.players.filter(
      p =>
        p.team === "A"
    );


  const B =
    teamGame.players.filter(
      p =>
        p.team === "B"
    );


  if (
    A.length !== 2 ||
    B.length !== 2
  ) {

    alert(
      "Each team needs 2 players."
    );

    return;

  }


  teamGame.gameStarted =
    true;

  teamGame.currentTurn =
    1;

  teamGame.diceValue =
    0;

  teamGame.diceRolled =
    false;


  createFourPlayerBoard();

}


// ============================================================
// CREATE LUDO GAME
// ============================================================

function createFourPlayerBoard() {

  const oldLobby =
    document.getElementById(
      "team-lobby"
    );

  if (oldLobby) {
    oldLobby.remove();
  }


  const oldGame =
    document.getElementById(
      "ludo-game-area"
    );

  if (oldGame) {
    oldGame.remove();
  }


  const game =
    document.createElement("div");

  game.id =
    "ludo-game-area";


  game.style.cssText = `
    max-width:650px;
    margin:20px auto 120px;
    color:white;
  `;


  game.innerHTML = `

    <div style="
      text-align:center;
      color:#ffc400;
      font-size:25px;
      font-weight:bold;
      margin-bottom:10px;
    ">
      🎲 ${teamGame.matchType} Ludo
    </div>


    <div id="turn-display"
      style="
        text-align:center;
        background:#101f4d;
        border:2px solid #ffc400;
        border-radius:15px;
        padding:12px;
        margin-bottom:15px;
        font-weight:bold;
      "
    >
      🔴 Team A Turn
    </div>


    <!-- BOARD -->

    <div
      id="ludo-board"
      style="
        width:min(94vw,430px);
        aspect-ratio:1;
        margin:auto;
        display:grid;
        grid-template-columns:repeat(11,1fr);
        grid-template-rows:repeat(11,1fr);
        gap:2px;
        padding:5px;
        background:#202020;
        border:5px solid #ffc400;
        border-radius:18px;
        overflow:hidden;
      "
    >

      ${createLudoBoardHTML()}

    </div>


    <!-- DICE -->

    <div style="
      background:#101f4d;
      border:2px solid #40558e;
      border-radius:18px;
      padding:18px;
      margin-top:18px;
      text-align:center;
    ">

      <div
        id="dice-result"
        style="
          font-size:55px;
          margin-bottom:8px;
        "
      >
        🎲
      </div>


      <button
        id="roll-dice-btn"
        style="
          width:100%;
          max-width:300px;
          padding:15px;
          border:0;
          border-radius:14px;
          background:#ffc400;
          color:#111;
          font-size:19px;
          font-weight:bold;
        "
      >
        🎲 ROLL DICE
      </button>


      <div
        id="move-message"
        style="
          margin-top:12px;
          color:#cbd5f5;
        "
      >
        Roll the dice to play.
      </div>

    </div>


    <!-- PLAYERS -->

    <div style="
      margin-top:18px;
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:10px;
    ">

      <div style="
        background:#172b60;
        border:2px solid #ff4444;
        border-radius:15px;
        padding:12px;
        text-align:center;
      ">
        🔴 TEAM A
        <br>
        <span id="team-a-count">
          2 Players
        </span>
      </div>


      <div style="
        background:#172b60;
        border:2px solid #448aff;
        border-radius:15px;
        padding:12px;
        text-align:center;
      ">
        🔵 TEAM B
        <br>
        <span id="team-b-count">
          2 Players
        </span>
      </div>

    </div>

  `;


  const container =
    document.querySelector(
      ".container"
    );


  const security =
    document.querySelector(
      ".security"
    );


  if (container) {

    container.insertBefore(
      game,
      security
    );

  }


  document
    .getElementById(
      "roll-dice-btn"
    )
    .addEventListener(
      "click",
      rollDice
    );


  renderGameState();

}


// ============================================================
// BOARD HTML
// ============================================================

function createLudoBoardHTML() {

  let html = "";


  for (
    let row = 0;
    row < 11;
    row++
  ) {

    for (
      let col = 0;
      col < 11;
      col++
    ) {

      let background =
        "#eeeeee";


      let content = "";


      // RED HOME

      if (
        row < 4 &&
        col < 4
      ) {

        background =
          "#ff4444";

        content =
          "🔴";

      }


      // BLUE HOME

      else if (
        row < 4 &&
        col > 6
      ) {

        background =
          "#448aff";

        content =
          "🔵";

      }


      // GREEN / TEAM A SIDE

      else if (
        row > 6 &&
        col < 4
      ) {

        background =
          "#ff4444";

      }


      // BLUE SIDE

      else if (
        row > 6 &&
        col > 6
      ) {

        background =
          "#448aff";

      }


      // CENTER

      else if (
        row >= 4 &&
        row <= 6 &&
        col >= 4 &&
        col <= 6
      ) {

        background =
          "#ffc400";

        content =
          "🏆";

      }


      // SAFE PATH

      else {

        background =
          "#f4f4f4";

      }


      html += `

        <div
          data-row="${row}"
          data-col="${col}"
          style="
            background:${background};
            border:1px solid #555;
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:15px;
            min-width:0;
          "
        >
          ${content}
        </div>

      `;

    }

  }


  return html;

}


// ============================================================
// ROLL DICE
// ============================================================

function rollDice() {

  if (!teamGame.gameStarted) {

    return;

  }


  const myTurn =
    isMyTurn();


  if (!myTurn) {

    showMoveMessage(
      "⏳ Please wait for your turn."
    );

    return;

  }


  if (teamGame.diceRolled) {

    showMoveMessage(
      "Move your token first."
    );

    return;

  }


  const dice =
    Math.floor(
      Math.random() * 6
    ) + 1;


  teamGame.diceValue =
    dice;

  teamGame.diceRolled =
    true;


  const result =
    document.getElementById(
      "dice-result"
    );


  if (result) {

    result.innerText =
      getDiceFace(dice);

  }


  showMoveMessage(
    "🎲 You rolled " +
    dice +
    ". Choose a token."
  );


  highlightMovableTokens();

}


// ============================================================
// DICE FACE
// ============================================================

function getDiceFace(number) {

  const faces = {

    1: "⚀",
    2: "⚁",
    3: "⚂",
    4: "⚃",
    5: "⚄",
    6: "⚅"

  };


  return faces[number] || "🎲";

}


// ============================================================
// TURN CHECK
// ============================================================

function isMyTurn() {

  if (!teamGame.myTeam) {

    return false;

  }


  const currentTeam =
    teamGame.currentTurn <= 2
      ? "A"
      : "B";


  return (
    teamGame.myTeam ===
    currentTeam
  );

}


// ============================================================
// TOKEN HIGHLIGHT
// ============================================================

function highlightMovableTokens() {

  const board =
    document.getElementById(
      "ludo-board"
    );


  if (!board) return;


  const cells =
    board.children;


  for (
    let i = 0;
    i < cells.length;
    i++
  ) {

    cells[i].style.cursor =
      "default";

  }


  showMoveMessage(
    "♟️ Select your token to move."
  );

}


// ============================================================
// MOVE TOKEN
// ============================================================

function moveToken(tokenName) {

  if (!isMyTurn()) {

    showMoveMessage(
      "⏳ Not your turn."
    );

    return;

  }


  if (!teamGame.diceRolled) {

    showMoveMessage(
      "🎲 Roll the dice first."
    );

    return;

  }


  const oldPosition =
    teamGame.tokens[tokenName] || 0;


  const newPosition =
    oldPosition +
    teamGame.diceValue;


  teamGame.tokens[tokenName] =
    newPosition;


  teamGame.diceRolled =
    false;


  showMoveMessage(
    "♟️ " +
    tokenName +
    " moved " +
    teamGame.diceValue +
    " steps."
  );


  if (
    newPosition >= 20
  ) {

    showMoveMessage(
      "🏆 " +
      tokenName +
      " reached the finish!"
    );

  }


  nextTurn();

}


// ============================================================
// NEXT TURN
// ============================================================

function nextTurn() {

  teamGame.diceValue =
    0;

  teamGame.diceRolled =
    false;


  teamGame.currentTurn++;


  if (
    teamGame.currentTurn > 4
  ) {

    teamGame.currentTurn =
      1;

  }


  renderGameState();

}


// ============================================================
// GAME STATE UI
// ============================================================

function renderGameState() {

  const display =
    document.getElementById(
      "turn-display"
    );


  if (!display) return;


  const currentTeam =
    teamGame.currentTurn <= 2
      ? "A"
      : "B";


  const color =
    currentTeam === "A"
      ? "#ff5555"
      : "#448aff";


  display.innerHTML = `

    <span style="color:${color}">
      ${currentTeam === "A" ? "🔴" : "🔵"}
      Team ${currentTeam} Turn
    </span>

  `;


  const dice =
    document.getElementById(
      "dice-result"
    );


  if (dice &&
      !teamGame.diceRolled) {

    dice.innerText =
      "🎲";

  }


  const button =
    document.getElementById(
      "roll-dice-btn"
    );


  if (button) {

    if (isMyTurn()) {

      button.disabled =
        false;

      button.style.opacity =
        "1";

      button.innerText =
        "🎲 ROLL DICE";

    } else {

      button.disabled =
        true;

      button.style.opacity =
        ".5";

      button.innerText =
        "⏳ WAIT TURN";

    }

  }

}


// ============================================================
// MOVE MESSAGE
// ============================================================

function showMoveMessage(message) {

  const box =
    document.getElementById(
      "move-message"
    );


  if (box) {

    box.innerText =
      message;

  }

}


// ============================================================
// TEST SUPABASE
// ============================================================

async function testLudoSupabase() {

  const status =
    document.getElementById(
      "connection-status"
    );


  try {

    const {
      error
    } =
      await supabaseClient
        .from("match_rooms")
        .select("id")
        .limit(1);


    if (error) {

      console.error(
        "Supabase error:",
        error
      );


      if (status) {

        status.innerText =
          "⚠️ Database connection needs checking";

        status.style.color =
          "#ffc400";

      }

      return;

    }


    console.log(
      "🟢 Ludo Supabase Connected"
    );


    if (status) {

      status.innerText =
        "🟢 Secure Server Connected";

      status.style.color =
        "#20e060";

    }

  }

  catch (error) {

    console.error(error);


    if (status) {

      status.innerText =
        "🔴 Server connection failed";

      status.style.color =
        "#ff5555";

    }

  }

}


// ============================================================
// APP START
// ============================================================

testLudoSupabase();


console.log(
  "🎲 Ludo Tournament 4 Player System Loaded"
);
