// ======================================================
// LUDO TOURNAMENT
// 4 PLAYER TEAM MATCH
// SUPABASE REALTIME
// ======================================================


// ======================================================
// SUPABASE CONFIG
// ======================================================

const SUPABASE_URL =
  "https://ohrbvijivfwvmlgnhzmp.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_ywFDW9RIMqXOkBXky1p7vA_3KnoqJev";


// Check Supabase library

if (!window.supabase) {

  console.error(
    "Supabase library is not loaded."
  );

} else {

  window.ludoSupabase =
    window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_KEY
    );

}


// ======================================================
// GAME STATE
// ======================================================

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


// ======================================================
// START MATCH
// ======================================================

async function startMatch(type) {

  console.log(
    "Starting match:",
    type
  );

  teamGame.matchType = type;

  teamGame.roomId = null;
  teamGame.roomCode = null;
  teamGame.myTeam = null;
  teamGame.mySlot = null;
  teamGame.players = [];

  await showTeamLobby(type);

}


// ======================================================
// SHOW TEAM LOBBY
// ======================================================

async function showTeamLobby(type) {

  // Remove old lobby

  const oldLobby =
    document.getElementById(
      "team-lobby"
    );

  if (oldLobby) {
    oldLobby.remove();
  }


  // Remove old board

  const oldBoard =
    document.getElementById(
      "ludo-board"
    );

  if (oldBoard) {
    oldBoard.remove();
  }


  // Remove old dice

  const oldDice =
    document.getElementById(
      "dice-area"
    );

  if (oldDice) {
    oldDice.remove();
  }


  // Create lobby

  const lobby =
    document.createElement("div");

  lobby.id =
    "team-lobby";


  lobby.style.cssText = `
    width:100%;
    max-width:650px;
    margin:25px auto;
    padding:20px;
    box-sizing:border-box;

    background:#101f4d;

    border:2px solid #ffc400;
    border-radius:22px;

    color:white;

    box-shadow:
      0 10px 30px rgba(0,0,0,0.35);
  `;


  // ====================================================
  // LOBBY HTML
  // ====================================================

  lobby.innerHTML = `

    <!-- HEADER -->

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
        font-size:17px;
        margin-top:8px;
      ">
        👥 4 Players • 2 vs 2
      </div>

    </div>


    <!-- MATCH INFO -->

    <div style="
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:10px;
      margin-bottom:20px;
    ">


      <!-- PLAYERS -->

      <div style="
        background:#172b60;
        border:1px solid #40558e;
        border-radius:14px;
        padding:15px 5px;
        text-align:center;
      ">

        <div style="
          font-size:27px;
        ">
          👥
        </div>

        <div style="
          color:#ffc400;
          font-size:21px;
          font-weight:bold;
        ">
          4
        </div>

        <div style="
          color:#d7def5;
          font-size:13px;
        ">
          Players
        </div>

      </div>


      <!-- TEAM A -->

      <div style="
        background:#172b60;
        border:2px solid #ff4444;
        border-radius:14px;
        padding:15px 5px;
        text-align:center;
      ">

        <div style="
          font-size:27px;
        ">
          🔴
        </div>

        <div style="
          color:#ff5555;
          font-size:21px;
          font-weight:bold;
        ">
          2
        </div>

        <div style="
          color:#d7def5;
          font-size:13px;
        ">
          Team A
        </div>

      </div>


      <!-- TEAM B -->

      <div style="
        background:#172b60;
        border:2px solid #448aff;
        border-radius:14px;
        padding:15px 5px;
        text-align:center;
      ">

        <div style="
          font-size:27px;
        ">
          🔵
        </div>

        <div style="
          color:#448aff;
          font-size:21px;
          font-weight:bold;
        ">
          2
        </div>

        <div style="
          color:#d7def5;
          font-size:13px;
        ">
          Team B
        </div>

      </div>

    </div>


    <!-- =================================================
         ROOM SECTION
         ================================================= -->

    <div style="
      background:#0b1738;
      border:2px solid #ffc400;
      border-radius:16px;
      padding:16px;
      margin-bottom:20px;
      box-sizing:border-box;
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


      <!-- CREATE ROOM -->

      <button
        id="create-room-btn"
        onclick="createRoom()"
        style="
          width:100%;
          padding:15px;

          border:none;
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


      <!-- JOIN ROOM -->

      <div style="
        display:flex;
        gap:8px;
        width:100%;
      ">

        <input
          id="room-code-input"
          type="text"
          maxlength="6"
          placeholder="Enter Room Code"
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

            font-size:15px;

            text-transform:uppercase;

            box-sizing:border-box;
          "
        >

        <button
          onclick="joinRoom()"
          style="
            padding:13px 18px;

            border:none;
            border-radius:10px;

            background:#0bc83b;
            color:white;

            font-weight:bold;
            font-size:15px;

            cursor:pointer;
          "
        >
          JOIN
        </button>

      </div>

    </div>


    <!-- =================================================
         ROOM INFO
         ================================================= -->

    <div
      id="room-info"
      style="
        text-align:center;

        background:#172b60;

        padding:16px;

        border-radius:15px;

        margin-bottom:20px;

        color:#d7def5;
      "
    >

      🔑 Create or join a room

    </div>


    <!-- =================================================
         TEAM A
         ================================================= -->

    <div style="
      background:#172b60;

      border:2px solid #ff4444;

      border-radius:18px;

      padding:18px;

      margin-bottom:18px;

      box-sizing:border-box;
    ">


      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;

        margin-bottom:5px;
      ">

        <h2 style="
          color:#ff5555;
          margin:0;
          font-size:24px;
        ">
          🔴 TEAM A
        </h2>

        <span style="
          color:#ff9999;
          font-size:14px;
        ">
          0/2
        </span>

      </div>


      <div style="
        color:#cbd5f5;
        font-size:14px;
        margin-bottom:12px;
      ">
        2 Players
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
        onclick="joinTeam('A')"
        style="
          width:100%;

          margin-top:15px;

          padding:14px;

          border:none;
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


    <!-- =================================================
         TEAM B
         ================================================= -->

    <div style="
      background:#172b60;

      border:2px solid #448aff;

      border-radius:18px;

      padding:18px;

      margin-bottom:18px;

      box-sizing:border-box;
    ">


      <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;

        margin-bottom:5px;
      ">

        <h2 style="
          color:#448aff;
          margin:0;
          font-size:24px;
        ">
          🔵 TEAM B
        </h2>

        <span style="
          color:#9fc0ff;
          font-size:14px;
        ">
          0/2
        </span>

      </div>


      <div style="
        color:#cbd5f5;
        font-size:14px;
        margin-bottom:12px;
      ">
        2 Players
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
        onclick="joinTeam('B')"
        style="
          width:100%;

          margin-top:15px;

          padding:14px;

          border:none;
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


    <!-- =================================================
         STATUS
         ================================================= -->

    <div
      id="team-status"
      style="
        text-align:center;

        padding:16px;

        background:#0b1738;

        border-radius:12px;

        color:#ffc400;

        font-size:16px;

        font-weight:bold;
      "
    >
      👥 Waiting for 4 Players... 0/4
    </div>

  `;


  // ====================================================
  // INSERT INTO PAGE
  // ====================================================

  const container =
    document.querySelector(
      ".container"
    );


  if (!container) {

    console.error(
      "Ludo error: .container not found."
    );

    alert(
      "Game container was not found."
    );

    return;
  }


  const security =
    document.querySelector(
      ".security"
    );


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


  // Initial render

  renderTeams();

  checkPlayers();

}


// ======================================================
// GENERATE ROOM CODE
// ======================================================

function generateRoomCode() {

  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let code = "";

  for (
    let i = 0;
    i < 6;
    i++
  ) {

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


// ======================================================
// CREATE ROOM
// ======================================================

async function createRoom() {

  if (!window.ludoSupabase) {

    alert(
      "Supabase is not connected."
    );

    return;
  }


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
      "⏳ Creating Room...";

  }


  try {

    let roomCreated = false;

    let data = null;

    let error = null;


    // Try several codes if duplicate

    for (
      let attempt = 0;
      attempt < 5;
      attempt++
    ) {

      const roomCode =
        generateRoomCode();


      const result =
        await window.ludoSupabase
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


      data =
        result.data;

      error =
        result.error;


      if (!error) {

        roomCreated = true;

        break;

      }

    }


    if (!roomCreated || !data) {

      console.error(
        "Room creation error:",
        error
      );

      alert(
        "Room creation failed. Check Supabase table/RLS."
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
      "🏠 Room created. Choose Team A or Team B."
    );


    console.log(
      "Room created:",
      data
    );

  }

  catch (err) {

    console.error(
      "Create room error:",
      err
    );

    alert(
      "Something went wrong while creating the room."
    );

  }

  finally {

    if (button) {

      button.disabled = false;

      button.innerText =
        "🏠 CREATE NEW ROOM";

    }

  }

}


// ======================================================
// SHOW ROOM INFORMATION
// ======================================================

function showRoomInfo() {

  const info =
    document.getElementById(
      "room-info"
    );


  if (!info) {
    return;
  }


  if (!teamGame.roomCode) {

    info.innerHTML =
      "🔑 Create or join a room";

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

      margin:7px 0;
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


// ======================================================
// JOIN ROOM
// ======================================================

async function joinRoom() {

  if (!window.ludoSupabase) {

    alert(
      "Supabase is not connected."
    );

    return;
  }


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
      await window.ludoSupabase
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
        "Unable to find room. Check Supabase/RLS."
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
      "🔑 Room joined. Choose Team A or Team B."
    );


    input.value = "";


  }

  catch (err) {

    console.error(
      "Join room error:",
      err
    );

    alert(
      "Something went wrong while joining the room."
    );

  }

}


// ======================================================
// JOIN TEAM
// ======================================================

async function joinTeam(team) {

  if (!window.ludoSupabase) {

    alert(
      "Supabase is not connected."
    );

    return;
  }


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


  // Already joined

  if (teamGame.myTeam) {

    alert(
      "You already joined Team " +
      teamGame.myTeam +
      "."
    );

    return;
  }


  try {

    // Load latest players

    const { data: existing, error } =
      await window.ludoSupabase
        .from("match_players")
        .select("*")
        .eq(
          "room_id",
          teamGame.roomId
        );


    if (error) {

      console.error(
        "Load team error:",
        error
      );

      alert(
        "Unable to load players."
      );

      return;
    }


    const players =
      existing || [];


    // Already joined?

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


    // Total 4 players

    if (players.length >= 4) {

      alert(
        "This room already has 4 players."
      );

      return;
    }


    // Team players

    const teamPlayers =
      players.filter(
        p =>
          p.team === team
      );


    // Team full

    if (teamPlayers.length >= 2) {

      alert(
        "Team " +
        team +
        " is full."
      );

      return;
    }


    // Determine slot

    let slot = 1;


    const slotOneTaken =
      teamPlayers.some(
        p =>
          Number(p.slot) === 1
      );


    if (slotOneTaken) {
      slot = 2;
    }


    // Insert player

    const { data: inserted, error: insertError } =
      await window.ludoSupabase
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

        })
        .select()
        .single();


    if (insertError) {

      console.error(
        "Join team error:",
        insertError
      );

      alert(
        "Unable to join Team " +
        team +
        "."
      );

      return;
    }


    // Save local state

    teamGame.myTeam =
      inserted.team;

    teamGame.mySlot =
      inserted.slot;


    // Reload

    await loadPlayers();


    updateStatus(
      "✅ Joined Team " +
      team +
      ". Waiting for other players..."
    );


    console.log(
      "Player joined:",
      inserted
    );

  }

  catch (err) {

    console.error(
      "Team join error:",
      err
    );

    alert(
      "Something went wrong."
    );

  }

}


// ======================================================
// LOAD PLAYERS
// ======================================================

async function loadPlayers() {

  if (!window.ludoSupabase) {
    return;
  }


  if (!teamGame.roomId) {

    teamGame.players = [];

    renderTeams();

    checkPlayers();

    return;
  }


  try {

    const { data, error } =
      await window.ludoSupabase
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


    // Find me

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

  catch (err) {

    console.error(
      "loadPlayers error:",
      err
    );

  }

}


// ======================================================
// REALTIME SUBSCRIPTION
// ======================================================

function subscribeToRoom() {

  if (!window.ludoSupabase) {
    return;
  }


  if (!teamGame.roomId) {
    return;
  }


  // Remove previous channel

  if (teamGame.channel) {

    window.ludoSupabase
      .removeChannel(
        teamGame.channel
      );

    teamGame.channel = null;

  }


  const channelName =
    "ludo-room-" +
    String(teamGame.roomId);


  teamGame.channel =
    window.ludoSupabase
      .channel(channelName)
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

        function(payload) {

          console.log(
            "Realtime update:",
            payload
          );

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


// ======================================================
// RENDER TEAMS
// ======================================================

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


  // Update count

  const teamABox =
    teamA.parentElement;


  const teamBBox =
    teamB.parentElement;


  if (teamABox) {

    const count =
      teamABox.querySelector(
        "span"
      );

    if (count) {

      count.innerText =
        A.length +
        "/2";

    }

  }


  if (teamBBox) {

    const count =
      teamBBox.querySelector(
        "span"
      );

    if (count) {

      count.innerText =
        B.length +
        "/2";

    }

  }


  // Update buttons

  updateTeamButtons(
    A.length,
    B.length
  );

}


// ======================================================
// UPDATE TEAM BUTTONS
// ======================================================

function updateTeamButtons(
  aCount,
  bCount
) {

  const buttonA =
    document.getElementById(
      "join-team-a"
    );


  const buttonB =
    document.getElementById(
      "join-team-b"
    );


  if (buttonA) {

    if (
      aCount >= 2 ||
      teamGame.myTeam
    ) {

      buttonA.disabled = true;

      buttonA.style.opacity =
        "0.5";

      buttonA.innerText =
        aCount >= 2
          ? "🔴 TEAM A FULL"
          : "ALREADY JOINED";

    } else {

      buttonA.disabled = false;

      buttonA.style.opacity =
        "1";

      buttonA.innerText =
        "🔴 JOIN TEAM A";

    }

  }


  if (buttonB) {

    if (
      bCount >= 2 ||
      teamGame.myTeam
    ) {

      buttonB.disabled = true;

      buttonB.style.opacity =
        "0.5";

      buttonB.innerText =
        bCount >= 2
          ? "🔵 TEAM B FULL"
          : "ALREADY JOINED";

    } else {

      buttonB.disabled = false;

      buttonB.style.opacity =
        "1";

      buttonB.innerText =
        "🔵 JOIN TEAM B";

    }

  }

}


// ======================================================
// CREATE PLAYER SLOTS
// ======================================================

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
          Number(p.slot) ===
          slot
      );


    if (player) {

      const isMe =
        player.player_id ===
        teamGame.myPlayerId;


      const playerName =
        isMe
          ? "You"
          : (
              player.player_name ||
              "Player"
            );


      html += `

        <div style="
          background:#24386f;

          border:1px solid #40558e;

          padding:14px 8px;

          border-radius:12px;

          text-align:center;

          font-weight:bold;

          min-height:55px;

          display:flex;

          flex-direction:column;

          justify-content:center;

          box-sizing:border-box;
        ">

          <div style="
            font-size:16px;
          ">
            ${icon} ${playerName}
          </div>


          <small style="
            color:#20e060;

            margin-top:5px;

            font-size:12px;
          ">
            ${player.ready ? "● READY" : "● JOINED"}
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

          min-height:55px;

          display:flex;

          align-items:center;

          justify-content:center;

          box-sizing:border-box;

        ">

          👤 Empty Slot

        </div>

      `;

    }

  }


  return html;

}


// ======================================================
// CHECK PLAYERS
// ======================================================

function checkPlayers() {

  const status =
    document.getElementById(
      "team-status"
    );


  if (!status) {
    return;
  }


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


  // Less than 4

  if (total < 4) {

    status.innerHTML = `

      <div style="
        color:#ffc400;
      ">
        ⏳ Waiting for players...
      </div>

      <div style="
        color:white;
        font-size:18px;
        margin-top:6px;
      ">
        ${total}/4 Players
      </div>

      <div style="
        color:#9caad0;
        font-size:13px;
        margin-top:5px;
      ">
        🔴 Team A: ${A.length}/2
        &nbsp;&nbsp;
        🔵 Team B: ${B.length}/2
      </div>

    `;

    return;
  }


  // Exactly 4 but wrong teams

  if (
    A.length !== 2 ||
    B.length !== 2
  ) {

    status.innerHTML = `

      <div style="
        color:#ffcc00;
      ">
        ⚠️ Team setup incomplete
      </div>

      <div style="
        color:#d7def5;
        font-size:14px;
        margin-top:6px;
      ">
        Team A must have 2 players
        and Team B must have 2 players.
      </div>

    `;

    return;
  }


  // 4 players ready

  status.innerHTML = `

    <div style="
      color:#20e060;
      font-size:20px;
      font-weight:bold;
    ">
      ✅ 4 PLAYERS READY
    </div>

    <div style="
      color:#d7def5;
      margin-top:6px;
      font-size:14px;
    ">
      🔴 Team A 2
      &nbsp; VS &nbsp;
      🔵 Team B 2
    </div>

    <button
      onclick="startTeamGame()"
      style="
        width:100%;

        margin-top:15px;

        padding:15px;

        border:none;

        border-radius:12px;

        background:#0bc83b;

        color:white;

        font-size:18px;

        font-weight:bold;

        cursor:pointer;
      "
    >
      🎲 START TEAM GAME
    </button>

  `;

}


// ======================================================
// STATUS MESSAGE
// ======================================================

function updateStatus(
  message
) {

  const status =
    document.getElementById(
      "team-status"
    );


  if (status) {

    status.innerText =
      message;

  }

}


// ======================================================
// START TEAM GAME
// ======================================================

async function startTeamGame() {

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


  if (total !== 4) {

    alert(
      "4 players are required."
    );

    return;
  }


  if (
    A.length !== 2 ||
    B.length !== 2
  ) {

    alert(
      "Team A needs 2 players and Team B needs 2 players."
    );

    return;
  }


  // Update room status

  if (
    window.ludoSupabase &&
    teamGame.roomId
  ) {

    const { error } =
      await window.ludoSupabase
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


// ======================================================
// BASIC 4 PLAYER BOARD
// ======================================================

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


  const board =
    document.createElement("div");


  board.id =
    "ludo-board";


  board.style.cssText = `

    width:min(92vw,430px);

    aspect-ratio:1 / 1;

    margin:25px auto;

    background:#ffffff;

    border:5px solid #ffc400;

    border-radius:18px;

    display:grid;

    grid-template-columns:repeat(5,1fr);

    grid-template-rows:repeat(5,1fr);

    gap:2px;

    padding:5px;

    box-sizing:border-box;

  `;


  // Create 25 cells

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

      font-size:14px;

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


  if (!container) {
    return;
  }


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


  // Game info

  const info =
    document.createElement("div");


  info.id =
    "team-game-info";


  info.style.cssText = `

    text-align:center;

    color:#ffc400;

    font-size:20px;

    font-weight:bold;

    margin:15px auto;

    line-height:1.6;

  `;


  info.innerHTML = `

    🔴 Team A
    <span style="color:white;">
      VS
    </span>
    🔵 Team B

    <br>

    👥 4 Player Match

  `;


  board.after(info);

}


// ======================================================
// SUPABASE CONNECTION TEST
// ======================================================

async function testSupabase() {

  if (!window.ludoSupabase) {

    console.error(
      "❌ Supabase library missing."
    );

    return false;
  }


  try {

    const { error } =
      await window.ludoSupabase
        .from("match_rooms")
        .select("id")
        .limit(1);


    if (error) {

      console.error(
        "❌ Supabase Error:",
        error
      );

      return false;
    }


    console.log(
      "🟢 Supabase Connected"
    );

    return true;

  }

  catch (error) {

    console.error(
      "❌ Supabase Connection Error:",
      error
    );

    return false;

  }

}


// ======================================================
// PAGE LOAD
// ======================================================

document.addEventListener(
  "DOMContentLoaded",
  function() {

    console.log(
      "🎲 Ludo Team System Loaded"
    );

    testSupabase();

  }
);
