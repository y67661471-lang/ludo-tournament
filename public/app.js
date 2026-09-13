// =====================================================
// LUDO TOURNAMENT - 4 PLAYER TEAM GAME
// SUPABASE REALTIME + DICE + TURN SYSTEM
// =====================================================

const SUPABASE_URL =
  "https://ohrbvijivfwvmlgnhzmp.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_ywFDW9RIMqXOkBXky1p7vA_3KnoqJev";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


// =====================================================
// PLAYER
// =====================================================

const teamGame = {

  matchType: null,
  roomId: null,
  roomCode: null,

  myPlayerId:
    localStorage.getItem("ludo_player_id") ||
    crypto.randomUUID(),

  myTeam: null,
  mySlot: null,

  players: [],
  channel: null,

  currentTurn: null,
  dice: null,

  gameStarted: false

};

localStorage.setItem(
  "ludo_player_id",
  teamGame.myPlayerId
);


// =====================================================
// START MATCH
// =====================================================

async function startMatch(type) {

  teamGame.matchType = type;

  showTeamLobby(type);

}


// =====================================================
// LOBBY
// =====================================================

function showTeamLobby(type) {

  const old =
    document.getElementById("team-lobby");

  if (old) old.remove();

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
      margin-bottom:20px;
    ">

      <div style="
        background:#172b60;
        padding:14px 5px;
        border-radius:14px;
        text-align:center;
      ">
        👥<br>
        <b style="color:#ffc400;">4</b><br>
        Players
      </div>

      <div style="
        background:#172b60;
        border:1px solid #ff4444;
        padding:14px 5px;
        border-radius:14px;
        text-align:center;
      ">
        🔴<br>
        <b style="color:#ff5555;">2</b><br>
        Team A
      </div>

      <div style="
        background:#172b60;
        border:1px solid #448aff;
        padding:14px 5px;
        border-radius:14px;
        text-align:center;
      ">
        🔵<br>
        <b style="color:#448aff;">2</b><br>
        Team B
      </div>

    </div>


    <div style="
      background:#0b1738;
      padding:15px;
      border-radius:15px;
      margin-bottom:18px;
    ">

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
        gap:8px;
      ">

        <input
          id="room-code-input"
          maxlength="6"
          placeholder="ROOM CODE"
          style="
            flex:1;
            padding:13px;
            border-radius:10px;
            border:1px solid #40558e;
            background:#172b60;
            color:white;
            text-transform:uppercase;
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
      padding:18px;
      margin-bottom:18px;
    ">

      <h2 style="color:#ff5555;">
        🔴 TEAM A
      </h2>

      <div id="teamA" style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:8px;
        margin-top:12px;
      "></div>

      <button
        id="join-team-a"
        style="
          width:100%;
          margin-top:15px;
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
      padding:18px;
      margin-bottom:18px;
    ">

      <h2 style="color:#448aff;">
        🔵 TEAM B
      </h2>

      <div id="teamB" style="
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:8px;
        margin-top:12px;
      "></div>

      <button
        id="join-team-b"
        style="
          width:100%;
          margin-top:15px;
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
    .onclick = createRoom;

  document
    .getElementById("join-room-btn")
    .onclick = joinRoom;

  document
    .getElementById("join-team-a")
    .onclick = () => joinTeam("A");

  document
    .getElementById("join-team-b")
    .onclick = () => joinTeam("B");


  renderTeams();

}


// =====================================================
// ROOM CODE
// =====================================================

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


// =====================================================
// CREATE ROOM
// =====================================================

async function createRoom() {

  if (!teamGame.matchType) {

    alert("Select a match first.");

    return;
  }


  const code =
    generateRoomCode();


  const {
    data,
    error
  } =
    await supabaseClient
      .from("match_rooms")
      .insert({

        room_code: code,
        match_type: teamGame.matchType,
        status: "waiting"

      })
      .select()
      .single();


  if (error) {

    console.error(error);

    alert(
      "Room creation failed:\n" +
      error.message
    );

    return;
  }


  teamGame.roomId =
    data.id;

  teamGame.roomCode =
    data.room_code;


  showRoomInfo();

  subscribeToRoom();

  updateStatus(
    "✅ Room created. Choose your team."
  );

}


// =====================================================
// ROOM INFO
// =====================================================

function showRoomInfo() {

  const info =
    document.getElementById("room-info");

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


// =====================================================
// JOIN ROOM
// =====================================================

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

    alert("Enter room code.");

    return;
  }


  const {
    data,
    error
  } =
    await supabaseClient
      .from("match_rooms")
      .select("*")
      .eq("room_code", code)
      .eq("status", "waiting")
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
      "Room not found."
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


// =====================================================
// JOIN TEAM
// =====================================================

async function joinTeam(team) {

  if (!teamGame.roomId) {

    alert(
      "Create or join a room first."
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
    data,
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

    alert(error.message);

    return;
  }


  const players =
    data || [];


  if (players.length >= 4) {

    alert(
      "Room already has 4 players."
    );

    return;
  }


  const sameTeam =
    players.filter(
      p => p.team === team
    );


  if (sameTeam.length >= 2) {

    alert(
      "Team " +
      team +
      " is full."
    );

    return;
  }


  const oldPlayer =
    players.find(
      p =>
        p.player_id ===
        teamGame.myPlayerId
    );


  if (oldPlayer) {

    teamGame.myTeam =
      oldPlayer.team;

    teamGame.mySlot =
      oldPlayer.slot;

    return;
  }


  const slot =
    sameTeam.some(
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

    console.error(insertError);

    alert(
      "Unable to join:\n" +
      insertError.message
    );

    return;
  }


  teamGame.myTeam = team;

  teamGame.mySlot = slot;


  await loadPlayers();

}


// =====================================================
// LOAD PLAYERS
// =====================================================

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
      .order("team")
      .order("slot");


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


// =====================================================
// REALTIME
// =====================================================

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
        teamGame.roomId
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "match_players",
          filter:
            "room_id=eq." +
            teamGame.roomId
        },
        () => {

          loadPlayers();

        }
      )
      .subscribe();

}


// =====================================================
// RENDER TEAMS
// =====================================================

function renderTeams() {

  const A =
    document.getElementById("teamA");

  const B =
    document.getElementById("teamB");


  if (!A || !B) return;


  const teamA =
    teamGame.players.filter(
      p => p.team === "A"
    );

  const teamB =
    teamGame.players.filter(
      p => p.team === "B"
    );


  A.innerHTML =
    playerSlots(teamA, "🔴");

  B.innerHTML =
    playerSlots(teamB, "🔵");

}


// =====================================================
// PLAYER SLOTS
// =====================================================

function playerSlots(players, icon) {

  let html = "";


  for (let i = 1; i <= 2; i++) {

    const p =
      players.find(
        x => x.slot === i
      );


    if (p) {

      html += `

        <div style="
          background:#24386f;
          padding:14px 5px;
          border-radius:12px;
          text-align:center;
        ">

          ${icon}
          ${p.player_id === teamGame.myPlayerId
            ? "You"
            : "Player"}

          <br>

          <small style="
            color:#20e060;
          ">
            ${p.ready ? "READY" : "JOINED"}
          </small>

        </div>

      `;

    } else {

      html += `

        <div style="
          background:#0b1738;
          padding:14px 5px;
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


// =====================================================
// CHECK PLAYERS
// =====================================================

function checkPlayers() {

  const status =
    document.getElementById(
      "team-status"
    );


  if (!status) return;


  const total =
    teamGame.players.length;


  if (total < 4) {

    status.innerHTML =
      `⏳ Waiting for players... ${total}/4`;

    return;
  }


  const A =
    teamGame.players.filter(
      p => p.team === "A"
    );

  const B =
    teamGame.players.filter(
      p => p.team === "B"
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
      🎲 START GAME
    </button>

  `;


  document
    .getElementById(
      "start-team-game"
    )
    .onclick =
    startTeamGame;

}


// =====================================================
// START GAME
// =====================================================

async function startTeamGame() {

  if (teamGame.players.length !== 4) {

    alert(
      "Four players are required."
    );

    return;
  }


  const A =
    teamGame.players.filter(
      p => p.team === "A"
    );

  const B =
    teamGame.players.filter(
      p => p.team === "B"
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


  // First player = first turn

  const firstPlayer =
    teamGame.players[0].player_id;


  teamGame.currentTurn =
    firstPlayer;

  teamGame.gameStarted =
    true;


  await createGameState();


  createPlayableBoard();

}


// =====================================================
// CREATE GAME STATE
// =====================================================

async function createGameState() {

  try {

    const {
      error
    } =
      await supabaseClient
        .from("match_rooms")
        .update({

          status:
            "playing"

        })
        .eq(
          "id",
          teamGame.roomId
        );


    if (error) {

      console.error(
        "Game state error:",
        error
      );

    }

  }

  catch (e) {

    console.error(e);

  }

}


// =====================================================
// PLAYABLE BOARD
// =====================================================

function createPlayableBoard() {

  const oldLobby =
    document.getElementById(
      "team-lobby"
    );

  if (oldLobby) {
    oldLobby.remove();
  }


  const oldBoard =
    document.getElementById(
      "ludo-game"
    );

  if (oldBoard) {
    oldBoard.remove();
  }


  const game =
    document.createElement("div");

  game.id =
    "ludo-game";


  game.style.cssText = `
    max-width:650px;
    margin:20px auto 120px;
    background:#101f4d;
    border:2px solid #ffc400;
    border-radius:20px;
    padding:18px;
    color:white;
  `;


  game.innerHTML = `

    <h2 style="
      text-align:center;
      color:#ffc400;
      margin-bottom:10px;
    ">
      🎲 ${teamGame.matchType} Ludo
    </h2>


    <div id="turn-info" style="
      text-align:center;
      background:#172b60;
      padding:12px;
      border-radius:12px;
      margin-bottom:15px;
      font-weight:bold;
    ">
      Loading turn...
    </div>


    <div id="ludo-board-grid" style="
      width:min(92vw,420px);
      aspect-ratio:1;
      margin:auto;
      display:grid;
      grid-template-columns:repeat(11,1fr);
      grid-template-rows:repeat(11,1fr);
      gap:2px;
      background:#222;
      border:5px solid #ffc400;
      border-radius:15px;
      overflow:hidden;
    ">
    </div>


    <div style="
      display:flex;
      justify-content:center;
      align-items:center;
      gap:15px;
      margin-top:20px;
    ">

      <div id="dice-value" style="
        width:65px;
        height:65px;
        border-radius:15px;
        background:white;
        color:#111;
        display:flex;
        justify-content:center;
        align-items:center;
        font-size:30px;
        font-weight:bold;
      ">
        🎲
      </div>


      <button
        id="roll-dice-btn"
        style="
          padding:15px 25px;
          background:#0bc83b;
          color:white;
          border:0;
          border-radius:12px;
          font-size:18px;
          font-weight:bold;
        "
      >
        🎲 ROLL DICE
      </button>

    </div>


    <div id="game-message" style="
      text-align:center;
      margin-top:15px;
      color:#cbd5f5;
    ">
      Waiting for game...
    </div>

  `;


  const container =
    document.querySelector(".container");

  const security =
    document.querySelector(".security");


  if (container) {

    container.insertBefore(
      game,
      security
    );

  }


  drawBoard();


  document
    .getElementById(
      "roll-dice-btn"
    )
    .onclick =
    rollDice;


  updateTurnDisplay();

}


// =====================================================
// DRAW BOARD
// =====================================================

function drawBoard() {

  const board =
    document.getElementById(
      "ludo-board-grid"
    );

  if (!board) return;


  board.innerHTML = "";


  for (let r = 0; r < 11; r++) {

    for (let c = 0; c < 11; c++) {

      const cell =
        document.createElement("div");


      let bg =
        "#e9edf5";


      // Red home

      if (
        r <= 3 &&
        c <= 3
      ) {
        bg = "#ff5555";
      }


      // Blue home

      if (
        r <= 3 &&
        c >= 7
      ) {
        bg = "#448aff";
      }


      // Green home

      if (
        r >= 7 &&
        c <= 3
      ) {
        bg = "#20c86b";
      }


      // Yellow home

      if (
        r >= 7 &&
        c >= 7
      ) {
        bg = "#ffc400";
      }


      // Center

      if (
        r >= 4 &&
        r <= 6 &&
        c >= 4 &&
        c <= 6
      ) {
        bg = "#172b60";
      }


      cell.style.cssText = `
        background:${bg};
        display:flex;
        justify-content:center;
        align-items:center;
        font-size:13px;
        font-weight:bold;
      `;


      board.appendChild(cell);

    }

  }

}


// =====================================================
// TURN DISPLAY
// =====================================================

function updateTurnDisplay() {

  const info =
    document.getElementById(
      "turn-info"
    );

  const button =
    document.getElementById(
      "roll-dice-btn"
    );


  if (!info) return;


  const me =
    teamGame.currentTurn ===
    teamGame.myPlayerId;


  if (me) {

    info.innerHTML =
      "🟢 YOUR TURN";

    info.style.color =
      "#20e060";

  } else {

    const p =
      teamGame.players.find(
        x =>
          x.player_id ===
          teamGame.currentTurn
      );

    info.innerHTML =
      "⏳ " +
      (p ? "Opponent" : "Player") +
      "'s Turn";

    info.style.color =
      "#ffc400";

  }


  if (button) {

    button.disabled =
      !me;

    button.style.opacity =
      me ? "1" : "0.5";

  }

}


// =====================================================
// DICE
// =====================================================

async function rollDice() {

  if (
    teamGame.currentTurn !==
    teamGame.myPlayerId
  ) {

    alert(
      "Wait for your turn."
    );

    return;
  }


  const dice =
    Math.floor(
      Math.random() * 6
    ) + 1;


  teamGame.dice =
    dice;


  const display =
    document.getElementById(
      "dice-value"
    );


  if (display) {

    display.innerText =
      dice;

  }


  const message =
    document.getElementById(
      "game-message"
    );


  if (message) {

    message.innerHTML =
      "🎲 You rolled <b>" +
      dice +
      "</b>";

  }


  nextTurn();

}


// =====================================================
// NEXT TURN
// =====================================================

function nextTurn() {

  const index =
    teamGame.players.findIndex(
      p =>
        p.player_id ===
        teamGame.currentTurn
    );


  if (index === -1) return;


  const next =
    teamGame.players[
      (index + 1) %
      teamGame.players.length
    ];


  teamGame.currentTurn =
    next.player_id;


  updateTurnDisplay();

}


// =====================================================
// RESET GAME
// =====================================================

function resetLudoGame() {

  if (teamGame.channel) {

    supabaseClient.removeChannel(
      teamGame.channel
    );

  }


  teamGame.roomId = null;
  teamGame.roomCode = null;
  teamGame.myTeam = null;
  teamGame.mySlot = null;
  teamGame.players = [];
  teamGame.currentTurn = null;
  teamGame.dice = null;
  teamGame.gameStarted = false;


  const game =
    document.getElementById(
      "ludo-game"
    );

  if (game) {
    game.remove();
  }

}


// =====================================================
// SUPABASE TEST
// =====================================================

async function testLudoSupabase() {

  try {

    const {
      error
    } =
      await supabaseClient
        .from("match_rooms")
        .select("id")
        .limit(1);


    const status =
      document.getElementById(
        "connection-status"
      );


    if (error) {

      console.error(
        "Supabase Error:",
        error
      );

      if (status) {

        status.innerText =
          "⚠️ Database needs checking";

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

  }

}


testLudoSupabase();


console.log(
  "🎲 Ludo Tournament 4 Player System Loaded"
);
