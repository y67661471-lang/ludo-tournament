// ==========================================
// LUDO TOURNAMENT
// SUPABASE REALTIME - 4 PLAYER TEAM LOBBY
// ==========================================

// ==========================================
// SUPABASE
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

window.startMatch = async function(type) {

  console.log("Starting match:", type);

  teamGame.matchType = type;

  await showTeamLobby(type);

};


// ==========================================
// SHOW TEAM LOBBY
// ==========================================

async function showTeamLobby(type) {

  // Remove old game elements

  const oldBoard =
    document.getElementById("ludo-board");

  const oldInfo =
    document.getElementById("ludo-game-info");

  const oldLobby =
    document.getElementById("team-lobby");

  if (oldBoard) {
    oldBoard.remove();
  }

  if (oldInfo) {
    oldInfo.remove();
  }

  if (oldLobby) {
    oldLobby.remove();
  }


  // Create lobby

  const lobby =
    document.createElement("div");

  lobby.id = "team-lobby";


  lobby.style.cssText = `
    background:#101f4d;
    border:2px solid #ffc400;
    border-radius:22px;
    padding:20px;
    margin:25px auto;
    max-width:650px;
    color:white;
    box-shadow:0 10px 30px rgba(0,0,0,.25);
  `;


  // IMPORTANT:
  // Only ONE innerHTML template is used.

  lobby.innerHTML = `

    <!-- TITLE -->

    <div style="
      text-align:center;
      margin-bottom:20px;
    ">

      <div style="
        color:#ffc400;
        font-size:28px;
        font-weight:bold;
      ">
        🎲 ${type} Team Match
      </div>

      <div style="
        color:#d7def5;
        margin-top:7px;
        font-size:17px;
      ">
        👥 4 Players • 2 vs 2
      </div>

    </div>


    <!-- MATCH INFORMATION -->

    <div style="
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:10px;
      margin-bottom:20px;
    ">

      <div style="
        background:#172b60;
        border:1px solid #40558e;
        border-radius:14px;
        padding:14px 5px;
        text-align:center;
      ">

        <div style="font-size:25px;">
          👥
        </div>

        <div style="
          color:#ffc400;
          font-size:20px;
          font-weight:bold;
        ">
          4
        </div>

        <div style="color:#d7def5;">
          Players
        </div>

      </div>


      <div style="
        background:#172b60;
        border:2px solid #ff4444;
        border-radius:14px;
        padding:14px 5px;
        text-align:center;
      ">

        <div style="font-size:25px;">
          🔴
        </div>

        <div style="
          color:#ff5555;
          font-size:20px;
          font-weight:bold;
        ">
          2
        </div>

        <div style="color:#d7def5;">
          Team A
        </div>

      </div>


      <div style="
        background:#172b60;
        border:2px solid #448aff;
        border-radius:14px;
        padding:14px 5px;
        text-align:center;
      ">

        <div style="font-size:25px;">
          🔵
        </div>

        <div style="
          color:#448aff;
          font-size:20px;
          font-weight:bold;
        ">
          2
        </div>

        <div style="color:#d7def5;">
          Team B
        </div>

      </div>

    </div>


    <!-- ROOM BOX -->

    <div style="
      background:#0b1738;
      border:2px solid #ffc400;
      border-radius:16px;
      padding:16px;
      margin-bottom:20px;
    ">

      <div style="
        text-align:center;
        color:#ffc400;
        font-size:19px;
        font-weight:bold;
        margin-bottom:12px;
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
          font-size:17px;
          font-weight:bold;
          cursor:pointer;
        "
      >
        🏠 CREATE NEW ROOM
      </button>


      <div style="
        display:flex;
        gap:8px;
        margin-top:12px;
      ">

        <input
          id="room-code-input"
          type="text"
          placeholder="Enter Room Code"
          maxlength="6"
          autocomplete="off"
          style="
            flex:1;
            min-width:0;
            padding:13px;
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
            padding:13px 18px;
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
        margin-bottom:12px;
      ">
        👥 2 Players
      </div>


      <div
        id="teamA"
        style="
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:10px;
        "
      >
      </div>


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
          font-size:18px;
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
        margin-bottom:12px;
      ">
        👥 2 Players
      </div>


      <div
        id="teamB"
        style="
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:10px;
        "
      >
      </div>


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
          font-size:18px;
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
        padding:16px;
        background:#0b1738;
        border-radius:12px;
        color:#ffc400;
        font-weight:bold;
        font-size:16px;
      "
    >
      👥 Waiting for 4 Players... 0/4
    </div>

  `;


  // ==========================================
  // INSERT LOBBY INTO PAGE
  // ==========================================

  const container =
    document.querySelector(".container");

  const security =
    document.querySelector(".security");


  if (!container) {

    console.error(
      "ERROR: .container not found"
    );

    alert(
      "Page container not found."
    );

    return;
  }


  if (security) {

    container.insertBefore(
      lobby,
      security
    );

  } else {

    container.appendChild(
      lobby
    );

  }


  // ==========================================
  // BUTTON EVENTS
  // ==========================================

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
      function() {
        joinTeam("A");
      }
    );


  document
    .getElementById("join-team-b")
    .addEventListener(
      "click",
      function() {
        joinTeam("B");
      }
    );


  renderTeams();

}


// ==========================================
// GENERATE ROOM CODE
// ==========================================

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

    // Generate room code

    let roomCode =
      generateRoomCode();


    // Check duplicate room code

    let attempts = 0;


    while (attempts < 5) {

      const { data } =
        await supabaseClient
          .from("match_rooms")
          .select("id")
          .eq(
            "room_code",
            roomCode
          )
          .maybeSingle();


      if (!data) {
        break;
      }


      roomCode =
        generateRoomCode();

      attempts++;

    }


    // Insert room

    const { data, error } =
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

      console.error(
        "Create room error:",
        error
      );

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
      "🏠 Room created. Choose your team."
    );


  } catch (error) {

    console.error(
      "Create room exception:",
      error
    );

    alert(
      "Room creation failed."
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


  if (!info) {
    return;
  }


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
      margin:6px 0;
    ">
      ${teamGame.roomCode}
    </div>

    <div style="
      color:#20e060;
      font-size:13px;
    ">
      Share this code with other players
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


  if (!input) {
    return;
  }


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


  try {

    const { data, error } =
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

      console.error(
        "Join room error:",
        error
      );

      alert(
        "Unable to check room:\n" +
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

    await loadPlayers();

    subscribeToRoom();


    updateStatus(
      "🏠 Room joined. Choose your team."
    );


  } catch (error) {

    console.error(
      "Join room exception:",
      error
    );

    alert(
      "Unable to join room."
    );

  }

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


  if (
    team !== "A" &&
    team !== "B"
  ) {

    return;
  }


  // Check if current player already joined

  const { data: existing, error: loadError } =
    await supabaseClient
      .from("match_players")
      .select("*")
      .eq(
        "room_id",
        teamGame.roomId
      );


  if (loadError) {

    console.error(
      "Load players error:",
      loadError
    );

    alert(
      "Unable to load players:\n" +
      loadError.message
    );

    return;
  }


  const currentPlayers =
    existing || [];


  const alreadyJoined =
    currentPlayers.find(
      p =>
        p.player_id ===
        teamGame.myPlayerId
    );


  if (alreadyJoined) {

    teamGame.myTeam =
      alreadyJoined.team;

    teamGame.mySlot =
      alreadyJoined.slot;


    alert(
      "You are already in Team " +
      alreadyJoined.team
    );


    await loadPlayers();

    return;
  }


  // Maximum 4 players

  if (currentPlayers.length >= 4) {

    alert(
      "This match already has 4 players."
    );

    return;
  }


  // Check selected team

  const teamPlayers =
    currentPlayers.filter(
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


  // Select slot 1 or 2

  const slot =
    teamPlayers.some(
      p =>
        Number(p.slot) === 1
    )
      ? 2
      : 1;


  // Insert player

  const { error } =
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


  if (error) {

    console.error(
      "Join team error:",
      error
    );

    alert(
      "Unable to join team:\n" +
      error.message
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

    checkPlayers();

    return;
  }


  const { data, error } =
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

  if (!teamGame.roomId) {
    return;
  }


  // Remove old channel

  if (teamGame.channel) {

    supabaseClient.removeChannel(
      teamGame.channel
    );

    teamGame.channel =
      null;
  }


  teamGame.channel =
    supabaseClient
      .channel(
        "ludo-room-" +
        teamGame.roomId +
        "-" +
        Date.now()
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
            "Realtime status:",
            status
          );

        }
      );

}


// ==========================================
// RENDER TEAMS
// ==========================================

function renderTeams() {

  const teamA =
    document.getElementById(
      "teamA"
    );

  const teamB =
    document.getElementById(
      "teamB"
    );


  if (!teamA || !teamB) {
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


  // Disable full teams

  const buttonA =
    document.getElementById(
      "join-team-a"
    );

  const buttonB =
    document.getElementById(
      "join-team-b"
    );


  if (buttonA) {

    buttonA.disabled =
      A.length >= 2 ||
      !!teamGame.myTeam;

    buttonA.style.opacity =
      buttonA.disabled
        ? "0.5"
        : "1";

  }


  if (buttonB) {

    buttonB.disabled =
      B.length >= 2 ||
      !!teamGame.myTeam;

    buttonB.style.opacity =
      buttonB.disabled
        ? "0.5"
        : "1";

  }

}


// ==========================================
// PLAYER SLOTS
// ==========================================

function createPlayerSlots(
  players,
  icon
) {

  let html = "";


  for (
    let slot = 1;
    slot <= 2;
    slot++
  ) {

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
          border:1px solid #40558e;
          padding:14px 8px;
          border-radius:12px;
          text-align:center;
          font-weight:bold;
          min-height:70px;
          display:flex;
          flex-direction:column;
          justify-content:center;
        ">

          <div style="
            font-size:17px;
          ">
            ${icon}
            ${isMe ? "You" : escapeHtml(
              player.player_name || "Player"
            )}
          </div>

          <small style="
            color:#20e060;
            margin-top:5px;
          ">
            ${player.ready ? "READY" : "JOINED"}
          </small>

        </div>

      `;

    } else {

      html += `

        <div style="
          background:#0b1738;
          border:1px dashed #40558e;
          padding:14px 8px;
          border-radius:12px;
          text-align:center;
          color:#9caad0;
          min-height:70px;
          display:flex;
          align-items:center;
          justify-content:center;
        ">

          👤 Empty Slot

        </div>

      `;

    }

  }


  return html;

}


// ==========================================
// SAFE TEXT
// ==========================================

function escapeHtml(text) {

  return String(text)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );

}


// ==========================================
// CHECK PLAYERS
// ==========================================

function checkPlayers() {

  const total =
    teamGame.players.length;


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


  const status =
    document.getElementById(
      "team-status"
    );


  if (!status) {
    return;
  }


  if (
    total < 4
  ) {

    status.innerHTML =
      `
      ⏳ Waiting for players...
      <br>
      <span style="
        color:#ffc400;
        font-size:20px;
      ">
        ${total}/4
      </span>
      `;

    return;
  }


  if (
    A.length !== 2 ||
    B.length !== 2
  ) {

    status.innerHTML =
      `
      ⚠️
      Need exactly
      <b>2 players in Team A</b>
      and
      <b>2 players in Team B</b>.
      `;

    return;
  }


  status.innerHTML = `

    <div style="
      color:#20e060;
      font-size:19px;
      font-weight:bold;
    ">
      ✅ 4 PLAYERS READY
    </div>

    <div style="
      color:#cbd5f5;
      margin:8px 0;
    ">
      🔴 Team A (2)
      &nbsp; VS &nbsp;
      🔵 Team B (2)
    </div>

    <button
      id="start-team-game-btn"
      style="
        background:#0bc83b;
        color:white;
        border:0;
        padding:14px 30px;
        border-radius:12px;
        font-size:18px;
        font-weight:bold;
        cursor:pointer;
        margin-top:5px;
      "
    >
      🎲 START TEAM GAME
    </button>

  `;


  const startButton =
    document.getElementById(
      "start-team-game-btn"
    );


  if (startButton) {

    startButton.addEventListener(
      "click",
      startTeamGame
    );

  }

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
// START TEAM GAME
// ==========================================

async function startTeamGame() {

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
      "Team A and Team B must have 2 players each."
    );

    return;
  }


  // Update room status

  if (teamGame.roomId) {

    const { error } =
      await supabaseClient
        .from("match_rooms")
        .update({
          status:"playing"
        })
        .eq(
          "id",
          teamGame.roomId
        );


    if (error) {

      console.error(
        "Room status update error:",
        error
      );

    }

  }


  alert(
    "🔴 Team A vs 🔵 Team B\n\n" +
    "👥 4 Player Match Starting!"
  );


  createFourPlayerBoard();

}


// ==========================================
// BASIC GAME BOARD
// ==========================================

function createFourPlayerBoard() {

  const lobby =
    document.getElementById(
      "team-lobby"
    );


  if (lobby) {
    lobby.remove();
  }


  const oldBoard =
    document.getElementById(
      "ludo-board"
    );


  if (oldBoard) {
    oldBoard.remove();
  }


  const oldInfo =
    document.getElementById(
      "ludo-game-info"
    );


  if (oldInfo) {
    oldInfo.remove();
  }


  const board =
    document.createElement("div");


  board.id =
    "ludo-board";


  board.style.cssText = `
    width:min(92vw,360px);
    height:min(92vw,360px);
    margin:25px auto 15px;
    background:white;
    border:5px solid #ffc400;
    border-radius:15px;
    display:grid;
    grid-template-columns:repeat(5,1fr);
    grid-template-rows:repeat(5,1fr);
    gap:2px;
    padding:5px;
  `;


  for (
    let i = 0;
    i < 25;
    i++
  ) {

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
      font-size:13px;
    `;


    cell.innerText =
      i + 1;


    board.appendChild(
      cell
    );

  }


  const container =
    document.querySelector(
      ".container"
    );


  const security =
    document.querySelector(
      ".security"
    );


  if (security) {

    container.insertBefore(
      board,
      security
    );

  } else {

    container.appendChild(
      board
    );

  }


  const info =
    document.createElement("div");


  info.id =
    "ludo-game-info";


  info.style.cssText = `
    text-align:center;
    background:#101f4d;
    border:2px solid #ffc400;
    border-radius:15px;
    color:#ffc400;
    font-size:19px;
    font-weight:bold;
    padding:15px;
    margin:10px auto 25px;
    max-width:360px;
  `;


  info.innerHTML =
    `
      🔴 Team A
      <span style="color:white;">
        VS
      </span>
      🔵 Team B
      <br>
      <span style="
        color:#cbd5f5;
        font-size:15px;
      ">
        👥 4 Player Match
      </span>
    `;


  board.after(
    info
  );

}


// ==========================================
// SUPABASE TEST
// ==========================================

async function testSupabase() {

  try {

    const { error } =
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

        status.innerHTML =
          "⚠️ Database connection needs checking";

        status.style.color =
          "#ffc400";

      }

      return;
    }


    console.log(
      "🟢 Supabase Connected"
    );


    if (status) {

      status.innerHTML =
        "🟢 Secure Server Connected";

      status.style.color =
        "#20e060";

    }

  }
  catch (error) {

    console.error(
      "Supabase connection error:",
      error
    );

  }

}


// ==========================================
// INITIALIZE
// ==========================================

testSupabase();

console.log(
  "🎲 Ludo Tournament app.js loaded successfully"
);
