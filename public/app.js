// ==========================================
// LUDO TOURNAMENT
// 4 PLAYER TEAM LOBBY
// SUPABASE REALTIME
// ==========================================

const SUPABASE_URL =
  "https://ohrbvijivfwvmlgnhzmp.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_ywFDW9RIMqXOkBXky1p7vA_3KnoqJev";

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


// ==========================================
// GAME STATE
// ==========================================

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
  channel: null
};

localStorage.setItem(
  "ludo_player_id",
  teamGame.myPlayerId
);


// ==========================================
// START MATCH
// ==========================================

window.startMatch = function(type) {

  teamGame.matchType = type;

  showTeamLobby(type);

};


// ==========================================
// SHOW TEAM LOBBY
// ==========================================

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
      font-size:17px;
      margin-bottom:20px;
    ">
      4 Players • 2 vs 2
    </div>


    <!-- PLAYER INFO -->

    <div style="
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:8px;
      margin-bottom:20px;
    ">

      <div style="
        background:#172b60;
        border-radius:14px;
        padding:14px 5px;
        text-align:center;
      ">
        👥
        <br>
        <b style="color:#ffc400;font-size:18px;">
          4
        </b>
        <br>
        <small>Players</small>
      </div>

      <div style="
        background:#172b60;
        border:1px solid #ff4444;
        border-radius:14px;
        padding:14px 5px;
        text-align:center;
      ">
        🔴
        <br>
        <b style="color:#ff5555;font-size:18px;">
          2
        </b>
        <br>
        <small>Team A</small>
      </div>

      <div style="
        background:#172b60;
        border:1px solid #448aff;
        border-radius:14px;
        padding:14px 5px;
        text-align:center;
      ">
        🔵
        <br>
        <b style="color:#448aff;font-size:18px;">
          2
        </b>
        <br>
        <small>Team B</small>
      </div>

    </div>


    <!-- ROOM -->

    <div style="
      background:#0b1738;
      border:2px solid #ffc400;
      border-radius:16px;
      padding:16px;
      margin-bottom:18px;
    ">

      <div style="
        text-align:center;
        color:#ffc400;
        font-size:18px;
        font-weight:bold;
        margin-bottom:12px;
      ">
        🔑 TEAM ROOM
      </div>


      <button
        id="create-room-btn"
        style="
          width:100%;
          padding:15px;
          border:0;
          border-radius:12px;
          background:#ffc400;
          color:#111;
          font-size:17px;
          font-weight:bold;
          cursor:pointer;
          margin-bottom:12px;
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
            min-width:0;
            padding:14px;
            border-radius:10px;
            border:1px solid #40558e;
            background:#172b60;
            color:white;
            outline:none;
            text-transform:uppercase;
          "
        >

        <button
          id="join-room-btn"
          style="
            padding:14px 18px;
            border:0;
            border-radius:10px;
            background:#0bc83b;
            color:white;
            font-weight:bold;
            cursor:pointer;
          "
        >
          JOIN
        </button>

      </div>

    </div>


    <!-- ROOM INFO -->

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

      <h2 style="
        color:#ff5555;
        margin-bottom:5px;
      ">
        🔴 TEAM A
      </h2>

      <div style="
        color:#cbd5f5;
        font-size:14px;
      ">
        2 Players
      </div>

      <div
        id="teamA"
        style="
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:10px;
          margin-top:12px;
        "
      ></div>

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
          cursor:pointer;
        "
      >
        🔴 JOIN TEAM A
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

      <h2 style="
        color:#448aff;
        margin-bottom:5px;
      ">
        🔵 TEAM B
      </h2>

      <div style="
        color:#cbd5f5;
        font-size:14px;
      ">
        2 Players
      </div>

      <div
        id="teamB"
        style="
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:10px;
          margin-top:12px;
        "
      ></div>

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
          cursor:pointer;
        "
      >
        🔵 JOIN TEAM B
      </button>

    </div>


    <!-- STATUS -->

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
      👥 Waiting for 4 Players...
    </div>

  `;


  const container =
    document.querySelector(".container");

  const security =
    document.querySelector(".security");


  if (!container) {
    console.error("Container not found");
    return;
  }


  if (security) {

    container.insertBefore(
      lobby,
      security
    );

  } else {

    container.appendChild(lobby);

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


// ==========================================
// ROOM CODE
// ==========================================

function generateRoomCode() {

  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let code = "";

  for (let i = 0; i < 6; i++) {

    code +=
      chars[
        Math.floor(
          Math.random() *
          chars.length
        )
      ];

  }

  return code;

}


// ==========================================
// CREATE ROOM
// ==========================================

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
      "⏳ CREATING ROOM...";

  }


  try {

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

      return;
    }


    teamGame.roomId =
      data.id;

    teamGame.roomCode =
      data.room_code;


    showRoomInfo();

    await loadPlayers();

    subscribeToRoom();


    updateStatus(
      "✅ Room created. Join a team."
    );


  } finally {

    if (button) {

      button.disabled = false;
      button.innerText =
        "🏠 CREATE NEW ROOM";

    }

  }

}


// ==========================================
// SHOW ROOM INFO
// ==========================================

function showRoomInfo() {

  const info =
    document.getElementById(
      "room-info"
    );

  if (!info) return;


  info.innerHTML = `

    <div style="
      color:#9caad0;
      font-size:14px;
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
      font-size:14px;
    ">
      Share this code with teammates
    </div>

  `;

}


// ==========================================
// JOIN ROOM
// ==========================================

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
      "Room not found or game already started."
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

  await loadPlayers();

  subscribeToRoom();


  updateStatus(
    "✅ Room joined. Choose your team."
  );

}


// ==========================================
// JOIN TEAM
// ==========================================

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

    console.error(error);

    alert(
      "Unable to load players:\n" +
      error.message
    );

    return;
  }


  const players =
    data || [];


  // Already joined?

  const already =
    players.find(
      p =>
        p.player_id ===
        teamGame.myPlayerId
    );


  if (already) {

    teamGame.myTeam =
      already.team;

    teamGame.mySlot =
      already.slot;

    await loadPlayers();

    return;

  }


  // Maximum 4 players

  if (players.length >= 4) {

    alert(
      "This room already has 4 players."
    );

    return;
  }


  // Check team

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


  // Find free slot

  let slot = 1;

  if (
    teamPlayers.some(
      p => p.slot === 1
    )
  ) {

    slot = 2;

  }


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
    ". Waiting for other players..."
  );

}


// ==========================================
// LOAD PLAYERS
// ==========================================

async function loadPlayers() {

  if (!teamGame.roomId) {

    teamGame.players = [];

    renderTeams();

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
      )
      .order(
        "team",
        {
          ascending:true
        }
      )
      .order(
        "slot",
        {
          ascending:true
        }
      );


  if (error) {

    console.error(
      "Load players error:",
      error
    );

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


// ==========================================
// REALTIME
// ==========================================

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
          event:"*",

          schema:"public",

          table:"match_players",

          filter:
            "room_id=eq." +
            teamGame.roomId

        },

        function() {

          loadPlayers();

        }

      )
      .subscribe(
        function(status) {

          console.log(
            "Realtime:",
            status
          );

        }
      );

}


// ==========================================
// RENDER TEAMS
// ==========================================

function renderTeams() {

  const A =
    document.getElementById(
      "teamA"
    );

  const B =
    document.getElementById(
      "teamB"
    );


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
    createPlayerSlots(
      teamA,
      "🔴"
    );


  B.innerHTML =
    createPlayerSlots(
      teamB,
      "🔵"
    );

}


// ==========================================
// PLAYER SLOTS
// ==========================================

function createPlayerSlots(
  players,
  icon
) {

  let html = "";


  for (let slot = 1; slot <= 2; slot++) {

    const player =
      players.find(
        p =>
          Number(p.slot) === slot
      );


    if (player) {

      const isMe =
        player.player_id ===
        teamGame.myPlayerId;


      html += `

        <div style="
          background:#24386f;
          padding:14px 8px;
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
          padding:14px 8px;
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
// CHECK PLAYERS
// ==========================================

function checkPlayers() {

  const status =
    document.getElementById(
      "team-status"
    );


  if (!status) return;


  const total =
    teamGame.players.length;


  const A =
    teamGame.players.filter(
      p => p.team === "A"
    );


  const B =
    teamGame.players.filter(
      p => p.team === "B"
    );


  if (total < 4) {

    status.innerHTML =
      `⏳ Waiting for players... ${total}/4`;

    return;
  }


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
        cursor:pointer;
      "
    >
      🎲 START TEAM GAME
    </button>

  `;


  document
    .getElementById(
      "start-team-game"
    )
    .onclick =
      startTeamGame;

}


// ==========================================
// STATUS
// ==========================================

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


// ==========================================
// START GAME
// ==========================================

function startTeamGame() {

  const total =
    teamGame.players.length;


  if (total !== 4) {

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


  createFourPlayerBoard();

}


// ==========================================
// 4 PLAYER BOARD
// ==========================================

function createFourPlayerBoard() {

  const lobby =
    document.getElementById(
      "team-lobby"
    );


  if (lobby) lobby.remove();


  const oldBoard =
    document.getElementById(
      "ludo-board"
    );


  if (oldBoard) oldBoard.remove();


  const board =
    document.createElement("div");


  board.id =
    "ludo-board";


  board.style.cssText = `
    width:min(92vw,420px);
    height:min(92vw,420px);
    margin:25px auto 20px;
    background:#ffffff;
    border:5px solid #ffc400;
    border-radius:18px;
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
      border-radius:2px;
    `;


    cell.innerText =
      i + 1;


    board.appendChild(cell);

  }


  const container =
    document.querySelector(
      ".container"
    );


  if (container) {

    container.appendChild(
      board
    );

  }


  const info =
    document.createElement("div");


  info.style.cssText = `
    text-align:center;
    color:#ffc400;
    font-size:20px;
    font-weight:bold;
    margin:15px 0 120px;
  `;


  info.innerHTML =
    "🔴 Team A vs 🔵 Team B<br>" +
    "👥 4 Player Match";


  board.after(info);

}


// ==========================================
// SUPABASE TEST
// ==========================================

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
        "Supabase Error:",
        error
      );


      if (status) {

        status.innerHTML =
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

      status.innerHTML =
        "🟢 Secure Server Connected";

      status.style.color =
        "#20e060";

    }


  } catch(error) {

    console.error(error);

    if (status) {

      status.innerHTML =
        "🔴 Server connection failed";

      status.style.color =
        "#ff5555";

    }

  }

}


testLudoSupabase();


console.log(
  "🎲 Ludo Tournament app.js loaded"
);
