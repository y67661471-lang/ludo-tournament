// ==========================================
// LUDO TOURNAMENT
// SUPABASE REALTIME - 4 PLAYER TEAM LOBBY
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


// Save player ID

localStorage.setItem(
  "ludo_player_id",
  teamGame.myPlayerId
);


// ==========================================
// START MATCH
// ==========================================

async function startMatch(type) {

  teamGame.matchType = type;

  await showTeamLobby(type);
}


// ==========================================
// TEAM LOBBY
// ==========================================

async function showTeamLobby(type) {

  const oldBoard =
    document.getElementById("ludo-board");

  const oldLobby =
    document.getElementById("team-lobby");

  const oldDice =
    document.getElementById("dice-area");

  if (oldBoard) oldBoard.remove();

  if (oldLobby) oldLobby.remove();

  if (oldDice) oldDice.remove();


  const lobby =
    document.createElement("div");

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
    margin-bottom:8px;
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
        font-weight:bold;
        font-size:18px;
      ">
        4
      </div>

      <small>
        Players
      </small>
    </div>


    <div style="
      background:#172b60;
      border:1px solid #ff4444;
      border-radius:14px;
      padding:14px 5px;
      text-align:center;
    ">
      <div style="font-size:25px;">
        🔴
      </div>

      <div style="
        color:#ff5555;
        font-weight:bold;
        font-size:18px;
      ">
        2
      </div>

      <small>
        Team A
      </small>
    </div>


    <div style="
      background:#172b60;
      border:1px solid #448aff;
      border-radius:14px;
      padding:14px 5px;
      text-align:center;
    ">
      <div style="font-size:25px;">
        🔵
      </div>

      <div style="
        color:#448aff;
        font-weight:bold;
        font-size:18px;
      ">
        2
      </div>

      <small>
        Team B
      </small>
    </div>

  </div>


  <!-- ROOM -->

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
      font-size:18px;
      font-weight:bold;
      margin-bottom:10px;
    ">
      🔑 TEAM ROOM
    </div>


    <button
      onclick="createRoom()"
      style="
        width:100%;
        padding:14px;
        border:0;
        border-radius:12px;
        background:#ffc400;
        color:#111;
        font-size:17px;
        font-weight:bold;
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
        placeholder="Enter Room Code"
        maxlength="6"
        style="
          flex:1;
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
        onclick="joinRoom()"
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
      margin-bottom:10px;
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

    <h2 style="
      color:#448aff;
      margin-bottom:5px;
    ">
      🔵 TEAM B
    </h2>

    <div style="
      color:#cbd5f5;
      font-size:14px;
      margin-bottom:10px;
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
      display:flex;
      gap:10px;
      margin-bottom:20px;
    ">

      <button
        onclick="createRoom()"
        style="
          flex:1;
          padding:14px;
          border:0;
          border-radius:12px;
          background:#ffc400;
          color:#111;
          font-weight:bold;
          font-size:16px;
        "
      >
        🏠 CREATE ROOM
      </button>

    </div>


    <div style="
      background:#0b1738;
      padding:15px;
      border-radius:15px;
      margin-bottom:20px;
    ">

      <div style="
        color:#ffc400;
        font-weight:bold;
        margin-bottom:8px;
      ">
        🔑 Join Existing Room
      </div>

      <div style="
        display:flex;
        gap:8px;
      ">

        <input
          id="room-code-input"
          placeholder="Enter Room Code"
          maxlength="8"
          style="
            flex:1;
            padding:13px;
            border-radius:10px;
            border:1px solid #40558e;
            background:#172b60;
            color:white;
            outline:none;
          "
        >

        <button
          onclick="joinRoom()"
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
      No room selected
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
      Create or join a room
    </div>

  `;


  const container =
    document.querySelector(".container");

  const security =
    document.querySelector(".security");

  container.insertBefore(
    lobby,
    security
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
    alert("Please select a match first.");
    return;
  }


  const roomCode =
    generateRoomCode();


  const { data, error } =
    await supabaseClient
      .from("match_rooms")
      .insert({

        room_code: roomCode,

        match_type:
          teamGame.matchType,

        status: "waiting"

      })
      .select()
      .single();


  if (error) {

    console.error(error);

    alert(
      "Room creation failed."
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
    "Room created. Choose your team."
  );
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
      Share this code with your teammates
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


  const { data, error } =
    await supabaseClient
      .from("match_rooms")
      .select("*")
      .eq("room_code", code)
      .eq("status", "waiting")
      .single();


  if (error || !data) {

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
    "Room joined. Choose your team."
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
      "You have already joined Team " +
      teamGame.myTeam
    );

    return;
  }


  const { data: existing } =
    await supabaseClient
      .from("match_players")
      .select("*")
      .eq(
        "room_id",
        teamGame.roomId
      );


  if (existing) {

    const alreadyJoined =
      existing.find(
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
        "You already joined Team " +
        alreadyJoined.team
      );

      return;
    }


    const teamPlayers =
      existing.filter(
        p => p.team === team
      );


    if (teamPlayers.length >= 2) {

      alert(
        "Team " + team + " is full."
      );

      return;
    }
  }


  const playersInTeam =
    (existing || [])
      .filter(
        p => p.team === team
      );


  const slot =
    playersInTeam.some(
      p => p.slot === 1
    )
      ? 2
      : 1;


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
          false

      });


  if (error) {

    console.error(error);

    alert(
      "Unable to join team."
    );

    return;
  }


  teamGame.myTeam = team;

  teamGame.mySlot = slot;


  await loadPlayers();

  updateStatus(
    "Joined Team " +
    team +
    ". Waiting for other players..."
  );
}


// ==========================================
// LOAD PLAYERS
// ==========================================

async function loadPlayers() {

  if (!teamGame.roomId) return;


  const { data, error } =
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


// ==========================================
// REALTIME SUBSCRIPTION
// ==========================================

function subscribeToRoom() {

  if (!teamGame.roomId) {
    return;
  }


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
    teamGame.players
      .filter(
        p => p.team === "A"
      );


  const B =
    teamGame.players
      .filter(
        p => p.team === "B"
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


// ==========================================
// PLAYER SLOTS
// ==========================================

function createPlayerSlots(
  players,
  icon
) {

  let html = "";


  for (let i = 1; i <= 2; i++) {

    const player =
      players.find(
        p => p.slot === i
      );


    if (player) {

      const isMe =
        player.player_id ===
        teamGame.myPlayerId;


      html += `

        <div style="
          background:#24386f;
          padding:14px;
          border-radius:12px;
          text-align:center;
          font-weight:bold;
        ">

          ${icon}
          ${isMe ? "You" : player.player_name}

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
// CHECK PLAYERS
// ==========================================

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

    <span style="
      color:#20e060;
    ">
      ✅ 4 PLAYERS READY
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
// STATUS
// ==========================================

function updateStatus(message) {

  const status =
    document.getElementById(
      "team-status"
    );

  if (status) {

    status.innerText =
      message;
  }
}


// ==========================================
// START GAME
// ==========================================

function startTeamGame() {

  if (
    teamGame.players.length !== 4
  ) {

    alert(
      "Four players are required."
    );

    return;
  }


  alert(
    "🔴 Team A vs 🔵 Team B\n\n" +
    "4 Player Match Starting!"
  );


  createFourPlayerBoard();
}


// ==========================================
// BASIC BOARD
// ==========================================

function createFourPlayerBoard() {

  const lobby =
    document.getElementById(
      "team-lobby"
    );

  if (lobby) {
    lobby.remove();
  }


  const board =
    document.createElement("div");

  board.id =
    "ludo-board";


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
    `;


    cell.innerText =
      i + 1;


    board.appendChild(cell);
  }


  const container =
    document.querySelector(
      ".container"
    );


  const security =
    document.querySelector(
      ".security"
    );


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


// ==========================================
// SUPABASE CONNECTION TEST
// ==========================================

async function testSupabase() {

  try {

    const { error } =
      await supabaseClient
        .from("match_rooms")
        .select("id")
        .limit(1);


    if (error) {

      console.error(
        "Supabase Error:",
        error
      );

      return;
    }


    console.log(
      "🟢 Supabase Connected"
    );

  }

  catch (error) {

    console.error(
      "Supabase Connection Error:",
      error
    );
  }
}


testSupabase();
