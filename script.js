const finishPoints = [
  { finish: "1st Place", points: 9 },
  { finish: "2nd Place", points: 8 },
  { finish: "3rd Place", points: 7 },
  { finish: "4th Place", points: 6 },
  { finish: "5th Place", points: 5 },
  { finish: "6th Place", points: 4 },
  { finish: "7th Place", points: 3 },
  { finish: "8th Place", points: 2 },
  { finish: "9th Place", points: 1 }
];

const sports = [
  "NBA",
  "NFL",
  "MLB",
  "NHL",
  "NCAA Football",
  "NCAA Basketball",
  "UEFA Champions League",
  "NASCAR",
  "Masters Tournament"
];

const teamCatalog = [
  { id: "celtics", name: "Boston Celtics", sport: "NBA", record: "64-18", playoffStatus: "Conference Finals", ranking: "2nd", odds: "18%", points: 8, owner: "Alex Grant", progress: 82 },
  { id: "chiefs", name: "Kansas City Chiefs", sport: "NFL", record: "14-3", playoffStatus: "Champion", ranking: "1st", odds: "Won", points: 12, owner: "Alex Grant", progress: 100 },
  { id: "dodgers", name: "Los Angeles Dodgers", sport: "MLB", record: "100-62", playoffStatus: "Division Series", ranking: "5th", odds: "9%", points: 5, owner: "Alex Grant", progress: 56 },
  { id: "knicks", name: "New York Knicks", sport: "NBA", record: "50-32", playoffStatus: "Conference Finals", ranking: "3rd", odds: "11%", points: 7, owner: "Blair Lee", progress: 76 },
  { id: "bills", name: "Buffalo Bills", sport: "NFL", record: "12-5", playoffStatus: "Divisional Round", ranking: "6th", odds: "7%", points: 4, owner: "Blair Lee", progress: 45 },
  { id: "yankees", name: "New York Yankees", sport: "MLB", record: "94-68", playoffStatus: "Runner-Up", ranking: "2nd", odds: "Finalist", points: 9, owner: "Casey Morgan", progress: 92 },
  { id: "oilers", name: "Edmonton Oilers", sport: "NHL", record: "49-27-6", playoffStatus: "Stanley Cup Final", ranking: "2nd", odds: "Finalist", points: 9, owner: "Drew Park", progress: 90 },
  { id: "duke", name: "Duke Blue Devils", sport: "NCAA Basketball", record: "31-7", playoffStatus: "Final Four", ranking: "3rd", odds: "13%", points: 7, owner: "Emery Stone", progress: 78 },
  { id: "realmadrid", name: "Real Madrid", sport: "UEFA Champions League", record: "9-2-1", playoffStatus: "Champion", ranking: "1st", odds: "Won", points: 12, owner: "Harper Quinn", progress: 100 },
  { id: "scheffler", name: "Scottie Scheffler", sport: "Masters Tournament", record: "-11", playoffStatus: "Champion", ranking: "1st", odds: "Won", points: 12, owner: "Harper Quinn", progress: 100 }
];

const demoManagers = ["Blair Lee", "Casey Morgan", "Drew Park", "Emery Stone", "Harper Quinn", "Jordan Mills", "Taylor West", "Morgan Rivera", "Riley Chen", "Sam Patel", "Avery Brooks"];

const draftTeamSeeds = {
  NBA: ["Boston Celtics", "Denver Nuggets", "New York Knicks", "Dallas Mavericks", "Minnesota Timberwolves", "Oklahoma City Thunder", "Milwaukee Bucks", "Phoenix Suns", "Miami Heat", "Los Angeles Lakers", "Golden State Warriors", "Cleveland Cavaliers"],
  NFL: ["Kansas City Chiefs", "Buffalo Bills", "Baltimore Ravens", "Detroit Lions", "Philadelphia Eagles", "San Francisco 49ers", "Cincinnati Bengals", "Houston Texans", "Green Bay Packers", "Dallas Cowboys", "Miami Dolphins", "Los Angeles Chargers"],
  MLB: ["Los Angeles Dodgers", "New York Yankees", "Atlanta Braves", "Houston Astros", "Philadelphia Phillies", "Baltimore Orioles", "Texas Rangers", "Seattle Mariners", "San Diego Padres", "Boston Red Sox", "Chicago Cubs", "Arizona Diamondbacks"],
  NHL: ["Edmonton Oilers", "Florida Panthers", "New York Rangers", "Colorado Avalanche", "Dallas Stars", "Toronto Maple Leafs", "Vegas Golden Knights", "Carolina Hurricanes", "Boston Bruins", "Vancouver Canucks", "Tampa Bay Lightning", "Winnipeg Jets"],
  "NCAA Football": ["Georgia Bulldogs", "Ohio State Buckeyes", "Texas Longhorns", "Oregon Ducks", "Alabama Crimson Tide", "Michigan Wolverines", "Notre Dame Fighting Irish", "LSU Tigers", "Penn State Nittany Lions", "Tennessee Volunteers", "Clemson Tigers", "Florida State Seminoles"],
  "NCAA Basketball": ["Duke Blue Devils", "UConn Huskies", "Kansas Jayhawks", "North Carolina Tar Heels", "Houston Cougars", "Kentucky Wildcats", "Arizona Wildcats", "Purdue Boilermakers", "Gonzaga Bulldogs", "Baylor Bears", "Michigan State Spartans", "Villanova Wildcats"],
  "UEFA Champions League": ["Real Madrid", "Manchester City", "Bayern Munich", "Paris Saint-Germain", "Barcelona", "Liverpool", "Arsenal", "Inter Milan", "Atletico Madrid", "Borussia Dortmund", "Juventus", "Benfica"],
  NASCAR: ["Hendrick Motorsports", "Team Penske", "Joe Gibbs Racing", "Trackhouse Racing", "23XI Racing", "Richard Childress Racing", "RFK Racing", "Legacy Motor Club", "Front Row Motorsports", "Wood Brothers Racing", "Kaulig Racing", "Spire Motorsports"],
  "Masters Tournament": ["Scottie Scheffler", "Rory McIlroy", "Jon Rahm", "Xander Schauffele", "Collin Morikawa", "Ludvig Aberg", "Viktor Hovland", "Jordan Spieth", "Hideki Matsuyama", "Patrick Cantlay", "Max Homa", "Tommy Fleetwood"]
};

const draftPicks = [
  { pick: 1, round: 1, user: "Alex Grant", team: "Kansas City Chiefs", sport: "NFL" },
  { pick: 2, round: 1, user: "Blair Lee", team: "New York Knicks", sport: "NBA" },
  { pick: 3, round: 1, user: "Casey Morgan", team: "New York Yankees", sport: "MLB" },
  { pick: 4, round: 1, user: "Drew Park", team: "Edmonton Oilers", sport: "NHL" },
  { pick: 5, round: 1, user: "Emery Stone", team: "Duke Blue Devils", sport: "NCAA Basketball" },
  { pick: 6, round: 1, user: "Harper Quinn", team: "Real Madrid", sport: "UEFA Champions League" },
  { pick: 7, round: 2, user: "Harper Quinn", team: "Scottie Scheffler", sport: "Masters Tournament" },
  { pick: 8, round: 2, user: "Emery Stone", team: "Georgia Bulldogs", sport: "NCAA Football" },
  { pick: 9, round: 2, user: "Drew Park", team: "Los Angeles Dodgers", sport: "MLB" },
  { pick: 10, round: 2, user: "Casey Morgan", team: "Boston Celtics", sport: "NBA" },
  { pick: 11, round: 2, user: "Blair Lee", team: "Buffalo Bills", sport: "NFL" },
  { pick: 12, round: 2, user: "Alex Grant", team: "Hendrick Motorsports", sport: "NASCAR" }
];

const initialUsers = [
  {
    firstName: "Alex",
    lastName: "Grant",
    username: "alexgrant",
    email: "alex@loc.test",
    password: "Password1",
    timeZone: "America/New_York",
    verified: true
  }
];

const leagues = [
  {
    id: "founders",
    name: "Founders Cup",
    description: "Private multi-sport postseason championship league.",
    season: 2026,
    teams: 8,
    ranking: 1,
    draftStatus: "Draft Complete",
    pickTimerSeconds: 60,
    pickTimerLabel: "1 min",
    seasonStatus: "Season Live",
    commissioner: "Alex Grant",
    isCommissioner: true,
    sports: ["NBA", "NFL", "MLB", "NHL", "NCAA Basketball", "UEFA Champions League"],
    standings: [
      { rank: 1, user: "Alex Grant", points: 37, teams: 3 },
      { rank: 2, user: "Harper Quinn", points: 34, teams: 2 },
      { rank: 3, user: "Casey Morgan", points: 31, teams: 2 },
      { rank: 4, user: "Drew Park", points: 29, teams: 2 },
      { rank: 5, user: "Blair Lee", points: 27, teams: 2 },
      { rank: 6, user: "Emery Stone", points: 24, teams: 2 }
    ]
  },
  {
    id: "kings",
    name: "Postseason Kings",
    description: "Football, basketball, baseball, and hockey prediction league.",
    season: 2026,
    teams: 10,
    ranking: 4,
    draftStatus: "Draft Scheduled",
    pickTimerSeconds: 60,
    pickTimerLabel: "1 min",
    seasonStatus: "Preseason",
    commissioner: "Blair Lee",
    isCommissioner: false,
    sports: ["NFL", "NBA", "MLB", "NHL"],
    standings: [
      { rank: 1, user: "Blair Lee", points: 18, teams: 4 },
      { rank: 2, user: "Alex Grant", points: 16, teams: 4 },
      { rank: 3, user: "Drew Park", points: 15, teams: 4 }
    ]
  },
  {
    id: "global",
    name: "Global Trophy Room",
    description: "International and championship-event heavy league.",
    season: 2026,
    teams: 6,
    ranking: 2,
    draftStatus: "Draft Paused",
    pickTimerSeconds: 60,
    pickTimerLabel: "1 min",
    seasonStatus: "Preseason",
    commissioner: "Harper Quinn",
    isCommissioner: false,
    sports: ["UEFA Champions League", "NASCAR", "Masters Tournament", "NBA", "NHL"],
    standings: [
      { rank: 1, user: "Harper Quinn", points: 22, teams: 5 },
      { rank: 2, user: "Alex Grant", points: 20, teams: 5 },
      { rank: 3, user: "Emery Stone", points: 17, teams: 5 }
    ]
  }
];

let invitations = [
  { id: "invite-1", league: "March Madness Empire", commissioner: "Jordan Mills", season: 2026, teams: 8, sports: "NCAA Basketball, NBA, NHL" },
  { id: "invite-2", league: "Gridiron Grand Prix", commissioner: "Taylor West", season: 2026, teams: 12, sports: "NFL, NCAA Football, NASCAR" }
];

let activityLog = [
  { time: "Jun 4, 2026 9:15 AM", text: "Alex Grant recalculated league scores." },
  { time: "Jun 4, 2026 8:42 AM", text: "Kansas City Chiefs marked as champion. +3 bonus applied." },
  { time: "Jun 3, 2026 10:12 PM", text: "Harper Quinn drafted Real Madrid." },
  { time: "Jun 3, 2026 9:58 PM", text: "Blair Lee joined Founders Cup." },
  { time: "Jun 3, 2026 9:30 PM", text: "League draft order randomized." }
];

let auditLog = [
  { time: "Jun 4, 2026 9:15 AM", text: "Alex Grant ran Recalculate Scores." },
  { time: "Jun 3, 2026 9:28 PM", text: "Alex Grant changed draft status to Draft Complete." },
  { time: "Jun 3, 2026 9:20 PM", text: "Alex Grant invited blair@example.com." }
];

const draftRooms = {};
const draftStorageKey = "loc-draft-rooms";

const state = {
  users: loadUsers(),
  currentUser: null,
  pendingUserEmail: "",
  activeLeagueId: "founders",
  activeLeagueTab: "standings",
  draftRoomLeagueId: "",
  draftSportFilter: "all",
  selectedDraftTeamId: "",
  draggedQueueTeamId: ""
};

const els = {
  publicSite: document.querySelector("#publicSite"),
  verificationGate: document.querySelector("#verificationGate"),
  appShell: document.querySelector("#appShell"),
  publicNav: document.querySelector(".public-nav"),
  appNav: document.querySelector(".app-nav"),
  authModal: document.querySelector("#authModal"),
  closeAuth: document.querySelector("#closeAuth"),
  loginForm: document.querySelector("#loginForm"),
  signupForm: document.querySelector("#signupForm"),
  forgotForm: document.querySelector("#forgotForm"),
  loginMessage: document.querySelector("#loginMessage"),
  signupMessage: document.querySelector("#signupMessage"),
  resetMessage: document.querySelector("#resetMessage"),
  pendingEmail: document.querySelector("#pendingEmail"),
  verifyAccountButton: document.querySelector("#verifyAccountButton"),
  userInitials: document.querySelector("#userInitials"),
  userName: document.querySelector("#userName"),
  userHandle: document.querySelector("#userHandle"),
  publicScoreGrid: document.querySelector("#publicScoreGrid"),
  leagueScoreGrid: document.querySelector("#leagueScoreGrid"),
  dashboardLeagueCards: document.querySelector("#dashboardLeagueCards"),
  allLeagueCards: document.querySelector("#allLeagueCards"),
  dashboardInvites: document.querySelector("#dashboardInvites"),
  inviteCards: document.querySelector("#inviteCards"),
  inviteCount: document.querySelector("#inviteCount"),
  activeLeagueCount: document.querySelector("#activeLeagueCount"),
  wizardSports: document.querySelector("#wizardSports"),
  leagueWizard: document.querySelector("#leagueWizard"),
  profilePanel: document.querySelector("#profilePanel"),
  leagueTitle: document.querySelector("#leagueTitle"),
  leagueMeta: document.querySelector("#leagueMeta"),
  leagueDraftStatus: document.querySelector("#leagueDraftStatus"),
  leagueSeasonStatus: document.querySelector("#leagueSeasonStatus"),
  leagueStandings: document.querySelector("#leagueStandings"),
  rosterList: document.querySelector("#rosterList"),
  roundFilter: document.querySelector("#roundFilter"),
  sportFilter: document.querySelector("#sportFilter"),
  pickSearch: document.querySelector("#pickSearch"),
  draftResults: document.querySelector("#draftResults"),
  teamGrid: document.querySelector("#teamGrid"),
  activityList: document.querySelector("#activityList"),
  auditList: document.querySelector("#auditList"),
  draftRoom: document.querySelector("#draftRoom"),
  exitDraftRoom: document.querySelector("#exitDraftRoom"),
  draftRoomMeta: document.querySelector("#draftRoomMeta"),
  draftRoomTitle: document.querySelector("#draftRoomTitle"),
  draftRoundStatus: document.querySelector("#draftRoundStatus"),
  draftProgressBar: document.querySelector("#draftProgressBar"),
  draftProgressLabel: document.querySelector("#draftProgressLabel"),
  draftSportSelect: document.querySelector("#draftSportSelect"),
  draftOrderStrip: document.querySelector("#draftOrderStrip"),
  draftClockPanel: document.querySelector("#draftClockPanel"),
  draftQueuedTeam: document.querySelector("#draftQueuedTeam"),
  draftQueue: document.querySelector("#draftQueue"),
  draftSelectedTop: document.querySelector("#draftSelectedTop"),
  draftBoard: document.querySelector("#draftBoard"),
  draftChat: document.querySelector("#draftChat"),
  draftChatInput: document.querySelector("#draftChatInput"),
  sendDraftChat: document.querySelector("#sendDraftChat"),
  draftTeamSearch: document.querySelector("#draftTeamSearch"),
  draftAvailableTeams: document.querySelector("#draftAvailableTeams"),
  draftTeamDetail: document.querySelector("#draftTeamDetail"),
  draftSportSlots: document.querySelector("#draftSportSlots"),
  teamModal: document.querySelector("#teamModal"),
  teamModalBody: document.querySelector("#teamModalBody"),
  closeTeamModal: document.querySelector("#closeTeamModal"),
  toast: document.querySelector("#toast")
};

function loadUsers() {
  try {
    const saved = localStorage.getItem("loc-users");
    if (saved) {
      const parsed = JSON.parse(saved);
      const hasDemoUser = parsed.some((user) => user.email === initialUsers[0].email);
      return hasDemoUser ? parsed : [...initialUsers, ...parsed];
    }
  } catch (error) {
    console.warn("Unable to load saved LOC users", error);
  }
  return [...initialUsers];
}

function saveUsers() {
  localStorage.setItem("loc-users", JSON.stringify(state.users));
}

function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validPassword(password) {
  return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);
}

function fullName(user) {
  return `${user.firstName} ${user.lastName}`;
}

function initials(user) {
  return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase();
}

function setMessage(element, text, type = "") {
  element.textContent = text;
  element.className = `form-message ${type}`.trim();
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.remove("is-hidden");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.add("is-hidden"), 3200);
}

function loadAllDraftRoomState() {
  try {
    const saved = localStorage.getItem(draftStorageKey);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.warn("Unable to load saved LOC draft rooms", error);
    return {};
  }
}

function saveAllDraftRoomState(drafts) {
  localStorage.setItem(draftStorageKey, JSON.stringify(drafts));
}

function loadDraftRoomState(leagueId) {
  return loadAllDraftRoomState()[leagueId] || null;
}

function saveDraftRoomState(leagueId) {
  if (!draftRooms[leagueId]) return;
  const drafts = loadAllDraftRoomState();
  drafts[leagueId] = draftRooms[leagueId];
  saveAllDraftRoomState(drafts);
}

function clearDraftRoomState(leagueId) {
  const drafts = loadAllDraftRoomState();
  delete drafts[leagueId];
  saveAllDraftRoomState(drafts);
  delete draftRooms[leagueId];
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function currentUserName() {
  return state.currentUser ? fullName(state.currentUser) : "Alex Grant";
}

function sportCode(sport) {
  return sport.split(" ").map((word) => word[0]).join("").slice(0, 3).toUpperCase();
}

function buildDraftTeams(sportList) {
  return sportList.flatMap((sport) => {
    const teams = draftTeamSeeds[sport] || [];
    return teams.map((name, index) => ({
      id: `${slugify(sport)}-${slugify(name)}`,
      name,
      sport,
      abbr: name.split(" ").map((part) => part[0]).join("").slice(0, 4).toUpperCase(),
      region: sport,
      projected: Number((1 + index * 0.13).toFixed(2)),
      rank: index + 1,
      form: `${Math.max(42, 95 - index * 4)}%`,
      note: index < 3 ? "Title contender" : index < 7 ? "Strong playoff path" : "Upside pick"
    }));
  });
}

function draftManagers(league) {
  const userName = currentUserName();
  const names = league.standings.map((row) => row.user);
  if (!names.includes(userName)) names.unshift(userName);
  demoManagers.forEach((name) => {
    if (names.length < league.teams && !names.includes(name)) names.push(name);
  });
  return names.slice(0, league.teams);
}

function initialManagerQueues(managers, starterQueue = []) {
  return managers.reduce((queues, manager) => {
    queues[manager] = manager === currentUserName() ? [...starterQueue] : [];
    return queues;
  }, {});
}

function normalizeDraftRoomQueues(room) {
  const starterQueue = Array.isArray(room.userQueue) ? room.userQueue : [];
  const managerQueues = room.managerQueues && typeof room.managerQueues === "object" ? room.managerQueues : {};
  room.managerQueues = room.managers.reduce((queues, manager) => {
    const savedQueue = Array.isArray(managerQueues[manager]) ? managerQueues[manager] : [];
    const migratedQueue = manager === currentUserName() && !savedQueue.length ? starterQueue : savedQueue;
    queues[manager] = migratedQueue.filter((teamId) => room.availableTeams.some((team) => team.id === teamId));
    return queues;
  }, {});
  delete room.userQueue;
  return room;
}

function managerQueue(room, manager = currentUserName()) {
  normalizeDraftRoomQueues(room);
  if (!room.managerQueues[manager]) room.managerQueues[manager] = [];
  return room.managerQueues[manager];
}

function setManagerQueue(room, manager, queue) {
  normalizeDraftRoomQueues(room);
  room.managerQueues[manager] = queue.filter((teamId) => room.availableTeams.some((team) => team.id === teamId));
}

function removeTeamFromQueues(room, teamId) {
  normalizeDraftRoomQueues(room);
  Object.keys(room.managerQueues).forEach((manager) => {
    room.managerQueues[manager] = room.managerQueues[manager].filter((id) => id !== teamId);
  });
}

function getDraftRoom(league) {
  if (!draftRooms[league.id]) {
    const savedRoom = loadDraftRoomState(league.id);
    if (savedRoom) {
      draftRooms[league.id] = normalizeDraftRoomQueues(savedRoom);
      if (isDraftComplete(savedRoom)) league.draftStatus = "Draft Complete";
      return draftRooms[league.id];
    }
    const managers = draftManagers(league);
    const availableTeams = buildDraftTeams(league.sports);
    const starterQueue = availableTeams.slice(0, Math.min(5, availableTeams.length)).map((team) => team.id);
    draftRooms[league.id] = {
      leagueId: league.id,
      managers,
      rounds: league.sports.length,
      availableTeams,
      draftSelections: [],
      managerQueues: initialManagerQueues(managers, starterQueue),
      draftActivity: [`Draft room opened for ${league.name}.`],
      draftChatMessages: [
        { author: "Commissioner", text: "Board is live." },
        { author: "Champion Mode", text: "Queue is ready." },
        { author: "Net Results", text: "Watching the next run." }
      ],
      clockRemainingSeconds: league.pickTimerSeconds || 60,
      currentPickIndex: 0
    };
  }
  return draftRooms[league.id];
}

function draftTotalPicks(room) {
  return room.managers.length * room.rounds;
}

function draftPickContext(room, pickIndex = room.currentPickIndex) {
  const managerCount = room.managers.length;
  const round = Math.floor(pickIndex / managerCount) + 1;
  const slot = pickIndex % managerCount;
  const managerIndex = round % 2 === 1 ? slot : managerCount - 1 - slot;
  return {
    round,
    manager: room.managers[managerIndex],
    managerIndex,
    overallPick: pickIndex + 1
  };
}

function isDraftComplete(room) {
  return room.currentPickIndex >= draftTotalPicks(room);
}

function formatClock(seconds) {
  const safeSeconds = Math.max(0, seconds);
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function selectedDraftTeam(room) {
  return room.availableTeams.find((team) => team.id === state.selectedDraftTeamId) || room.availableTeams[0] || null;
}

function leagueDraftSelections(league = activeLeague()) {
  const room = draftRooms[league.id] || loadDraftRoomState(league.id);
  return room?.draftSelections || [];
}

function hasLeagueDraftSelections(league = activeLeague()) {
  return leagueDraftSelections(league).length > 0;
}

function draftSelectionRows(league = activeLeague()) {
  return leagueDraftSelections(league).map((pick) => ({
    pick: pick.overallPick,
    round: pick.round,
    user: pick.manager,
    team: pick.teamName,
    sport: pick.sport
  }));
}

function syncLeagueDraftStatus(league) {
  const room = draftRooms[league.id] || loadDraftRoomState(league.id);
  if (room && isDraftComplete(room)) league.draftStatus = "Draft Complete";
}

function renderScoreGrid(container) {
  container.innerHTML = finishPoints.map((item) => `
    <div class="score-tile">
      <span>${item.finish}</span>
      <strong>${item.points}</strong>
    </div>
  `).join("");
}

function renderWizardSports() {
  els.wizardSports.innerHTML = sports.map((sport, index) => `
    <label class="sport-toggle">
      <input type="checkbox" value="${sport}" ${index < 6 ? "checked" : ""}>
      <span>${sport}</span>
    </label>
  `).join("");
}

function populateTimeZones() {
  const zones = ["America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles", "America/Phoenix", "America/Anchorage", "Pacific/Honolulu", "UTC"];
  document.querySelector("#signupTimeZone").innerHTML = zones.map((zone) => `<option value="${zone}">${zone}</option>`).join("");
}

function stopDraftClock() {
  clearInterval(stopDraftClock.timer);
}

function startDraftClock() {
  stopDraftClock();
  const room = getDraftRoom(activeLeague());
  if (isDraftComplete(room)) return;
  stopDraftClock.timer = setInterval(() => {
    if (!state.draftRoomLeagueId) return;
    const currentRoom = getDraftRoom(activeLeague());
    if (isDraftComplete(currentRoom)) {
      stopDraftClock();
      return;
    }
    currentRoom.clockRemainingSeconds = Math.max(0, currentRoom.clockRemainingSeconds - 1);
    if (currentRoom.clockRemainingSeconds === 0) {
      autopickQueuedTeam(currentRoom, activeLeague());
      return;
    }
    saveDraftRoomState(currentRoom.leagueId);
    renderDraftClock(currentRoom, activeLeague());
  }, 1000);
}

function openAuth(mode = "login") {
  els.authModal.classList.remove("is-hidden");
  document.body.classList.add("modal-open");
  setAuthTab(mode);
}

function closeAuth() {
  els.authModal.classList.add("is-hidden");
  document.body.classList.remove("modal-open");
}

function setAuthTab(mode) {
  document.querySelectorAll("[data-auth-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.authTab === mode);
  });
  document.querySelectorAll(".auth-form").forEach((form) => form.classList.remove("active"));
  document.querySelector(`#${mode}Form`)?.classList.add("active");
  [els.loginMessage, els.signupMessage, els.resetMessage].forEach((element) => setMessage(element, ""));
}

function showVerification(email) {
  state.pendingUserEmail = email;
  els.pendingEmail.textContent = email;
  stopDraftClock();
  state.draftRoomLeagueId = "";
  els.draftRoom.classList.add("is-hidden");
  document.body.classList.remove("draft-room-open");
  els.publicSite.classList.add("is-hidden");
  els.appShell.classList.add("is-hidden");
  els.verificationGate.classList.remove("is-hidden");
  els.publicNav.classList.remove("is-hidden");
  els.appNav.classList.add("is-hidden");
}

function enterApp(user) {
  state.currentUser = user;
  stopDraftClock();
  state.draftRoomLeagueId = "";
  els.draftRoom.classList.add("is-hidden");
  document.body.classList.remove("draft-room-open");
  els.publicSite.classList.add("is-hidden");
  els.verificationGate.classList.add("is-hidden");
  els.appShell.classList.remove("is-hidden");
  els.publicNav.classList.add("is-hidden");
  els.appNav.classList.remove("is-hidden");
  closeAuth();
  renderUser();
  renderDashboard();
  renderLeagues();
  renderInvitations();
  renderProfile();
  renderLeague();
  showView("dashboard");
}

function logout() {
  stopDraftClock();
  state.draftRoomLeagueId = "";
  state.currentUser = null;
  els.draftRoom.classList.add("is-hidden");
  document.body.classList.remove("draft-room-open");
  els.appShell.classList.add("is-hidden");
  els.verificationGate.classList.add("is-hidden");
  els.publicSite.classList.remove("is-hidden");
  els.publicNav.classList.remove("is-hidden");
  els.appNav.classList.add("is-hidden");
  showToast("Logged out.");
}

function showView(view) {
  if (state.draftRoomLeagueId) {
    stopDraftClock();
    state.draftRoomLeagueId = "";
    els.draftRoom.classList.add("is-hidden");
    document.body.classList.remove("draft-room-open");
    els.appShell.classList.remove("is-hidden");
  }
  document.querySelectorAll(".app-view").forEach((section) => section.classList.remove("active"));
  document.querySelector(`#${view}View`)?.classList.add("active");
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  if (view === "dashboard") renderDashboard();
  if (view === "leagues") renderLeagues();
  if (view === "invitations") renderInvitations();
  if (view === "profile") renderProfile();
}

function renderUser() {
  els.userInitials.textContent = initials(state.currentUser);
  els.userName.textContent = fullName(state.currentUser);
  els.userHandle.textContent = `@${state.currentUser.username}`;
}

function leagueCard(league, compact = false) {
  const pickTimerLabel = league.pickTimerLabel || "1 min";
  return `
    <article class="panel league-card">
      <div>
        <p class="eyebrow">${league.season} season</p>
        <h3>${league.name}</h3>
        <p>${league.description}</p>
      </div>
      <div class="league-card-meta">
        <div><span>Teams</span><strong>${league.teams}</strong></div>
        <div><span>Your Rank</span><strong>#${league.ranking}</strong></div>
        <div><span>Draft</span><strong>${league.draftStatus}</strong></div>
        <div><span>Pick Timer</span><strong>${pickTimerLabel}</strong></div>
        <div><span>Season</span><strong>${league.seasonStatus}</strong></div>
      </div>
      <div class="card-actions">
        <button type="button" data-open-league="${league.id}">Open League</button>
        <button type="button" data-open-draft-room="${league.id}">Open Draft Room</button>
        <button type="button" data-open-draft="${league.id}">View Draft Results</button>
        ${compact ? "" : `<button class="danger" type="button" data-leave-league="${league.id}">Leave League</button>`}
      </div>
    </article>
  `;
}

function bindLeagueCardActions(scope = document) {
  scope.querySelectorAll("[data-open-league]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeLeagueId = button.dataset.openLeague;
      renderLeague();
      showView("league");
      setLeagueTab("standings");
    });
  });
  scope.querySelectorAll("[data-open-draft]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeLeagueId = button.dataset.openDraft;
      renderLeague();
      showView("league");
      setLeagueTab("draft");
    });
  });
  scope.querySelectorAll("[data-open-draft-room]").forEach((button) => {
    button.addEventListener("click", () => openDraftRoom(button.dataset.openDraftRoom));
  });
  scope.querySelectorAll("[data-leave-league]").forEach((button) => {
    button.addEventListener("click", () => showToast("Leave league requests are commissioner-policy controlled in this prototype."));
  });
}

function renderDashboard() {
  leagues.forEach(syncLeagueDraftStatus);
  els.activeLeagueCount.textContent = String(leagues.length);
  els.inviteCount.textContent = String(invitations.length);
  els.dashboardLeagueCards.innerHTML = leagues.slice(0, 2).map((league) => leagueCard(league, true)).join("");
  els.dashboardInvites.innerHTML = invitations.length
    ? invitations.slice(0, 2).map((invite) => inviteCard(invite, true)).join("")
    : `<p>No pending invitations.</p>`;
  bindLeagueCardActions(els.dashboardLeagueCards);
  bindInvitationActions(els.dashboardInvites);
}

function renderLeagues() {
  leagues.forEach(syncLeagueDraftStatus);
  els.allLeagueCards.innerHTML = leagues.map((league) => leagueCard(league)).join("");
  bindLeagueCardActions(els.allLeagueCards);
}

function inviteCard(invite, compact = false) {
  return `
    <article class="${compact ? "" : "panel "}invite-card">
      <div>
        <p class="eyebrow">${invite.season} season</p>
        <h3>${invite.league}</h3>
        <p>${invite.commissioner} invited you to a ${invite.teams}-manager league featuring ${invite.sports}.</p>
      </div>
      <div class="card-actions">
        <button type="button" data-accept-invite="${invite.id}">Accept Invitation</button>
        <button class="danger" type="button" data-decline-invite="${invite.id}">Decline Invitation</button>
      </div>
    </article>
  `;
}

function bindInvitationActions(scope = document) {
  scope.querySelectorAll("[data-accept-invite]").forEach((button) => {
    button.addEventListener("click", () => {
      const invite = invitations.find((item) => item.id === button.dataset.acceptInvite);
      if (!invite) return;
      leagues.push({
        id: `league-${Date.now()}`,
        name: invite.league,
        description: `Accepted invitation from ${invite.commissioner}.`,
        season: invite.season,
        teams: invite.teams,
        ranking: invite.teams,
        draftStatus: "Draft Scheduled",
        pickTimerSeconds: 60,
        pickTimerLabel: "1 min",
        seasonStatus: "Preseason",
        commissioner: invite.commissioner,
        isCommissioner: false,
        sports: invite.sports.split(", "),
        standings: [{ rank: invite.teams, user: fullName(state.currentUser), points: 0, teams: 0 }]
      });
      invitations = invitations.filter((item) => item.id !== invite.id);
      renderDashboard();
      renderInvitations();
      showToast(`Accepted invitation to ${invite.league}.`);
    });
  });
  scope.querySelectorAll("[data-decline-invite]").forEach((button) => {
    button.addEventListener("click", () => {
      const invite = invitations.find((item) => item.id === button.dataset.declineInvite);
      invitations = invitations.filter((item) => item.id !== button.dataset.declineInvite);
      renderDashboard();
      renderInvitations();
      showToast(`Declined ${invite?.league || "invitation"}.`);
    });
  });
}

function renderInvitations() {
  els.inviteCards.innerHTML = invitations.length
    ? invitations.map((invite) => inviteCard(invite)).join("")
    : `<article class="panel invite-card"><h3>No pending invitations</h3><p>New commissioner invites will appear here.</p></article>`;
  bindInvitationActions(els.inviteCards);
}

function renderProfile() {
  const user = state.currentUser;
  els.profilePanel.innerHTML = `
    <div>
      <p class="eyebrow">Account fields</p>
      <h3>${fullName(user)}</h3>
      <div class="profile-field-list">
        <div><span>Username</span><strong>${user.username}</strong></div>
        <div><span>Email Address</span><strong>${user.email}</strong></div>
        <div><span>Time Zone</span><strong>${user.timeZone}</strong></div>
        <div><span>Email Verification</span><strong>${user.verified ? "Verified" : "Pending"}</strong></div>
      </div>
    </div>
    <div>
      <p class="eyebrow">Security</p>
      <h3>Password policy</h3>
      <p>Minimum 8 characters with uppercase, lowercase, and a number. Forgot password and reset flows are included in the authentication modal.</p>
      <div class="notice-row success">
        <strong>Role-based permissions</strong>
        <span>League content requires a verified account. Commissioner tabs only appear for commissioner leagues.</span>
      </div>
    </div>
  `;
}

function activeLeague() {
  return leagues.find((league) => league.id === state.activeLeagueId) || leagues[0];
}

function renderLeague() {
  const league = activeLeague();
  syncLeagueDraftStatus(league);
  els.leagueTitle.textContent = league.name;
  els.leagueMeta.textContent = `${league.season} season - Commissioner ${league.commissioner}`;
  els.leagueDraftStatus.textContent = league.draftStatus;
  els.leagueSeasonStatus.textContent = league.seasonStatus;
  document.querySelectorAll(".commish-only").forEach((element) => {
    element.classList.toggle("is-hidden", !league.isCommissioner);
  });
  renderLeagueStandings(league);
  renderRosters();
  renderDraftFilters();
  renderDraftResults();
  renderTeams();
  renderActivity();
  renderAudit();
}

function renderLeagueStandings(league) {
  const selections = leagueDraftSelections(league);
  const draftedCounts = selections.reduce((counts, pick) => {
    counts[pick.manager] = (counts[pick.manager] || 0) + 1;
    return counts;
  }, {});
  els.leagueStandings.innerHTML = `
    <div class="table-row header"><span>Rank</span><span>User</span><span>Points</span><span>Teams Drafted</span></div>
    ${league.standings.map((row) => `
      <div class="table-row">
        <strong>#${row.rank}</strong>
        <span>${row.user}</span>
        <strong>${row.points}</strong>
        <span>${selections.length ? draftedCounts[row.user] || 0 : row.teams}</span>
      </div>
    `).join("")}
  `;
}

function renderRosters() {
  const league = activeLeague();
  const selections = leagueDraftSelections(league);
  if (selections.length) {
    const owners = [...new Set(selections.map((pick) => pick.manager))];
    els.rosterList.innerHTML = owners.map((owner, index) => {
      const teams = selections.filter((pick) => pick.manager === owner);
      return `
        <details class="roster-card" ${index === 0 ? "open" : ""}>
          <summary><strong>${owner}</strong><span>${teams.length} drafted teams</span></summary>
          <div class="roster-teams">
            ${teams.map((pick) => `
              <div class="team-chip">
                <strong>${pick.teamName}</strong>
                <span>${pick.sport} - Pick ${pick.overallPick}</span>
              </div>
            `).join("")}
          </div>
        </details>
      `;
    }).join("");
    return;
  }
  const owners = [...new Set(teamCatalog.map((team) => team.owner))];
  els.rosterList.innerHTML = owners.map((owner, index) => {
    const teams = teamCatalog.filter((team) => team.owner === owner);
    return `
      <details class="roster-card" ${index === 0 ? "open" : ""}>
        <summary><strong>${owner}</strong><span>${teams.length} drafted teams</span></summary>
        <div class="roster-teams">
          ${teams.map((team) => `
            <button class="team-chip" type="button" data-team-id="${team.id}">
              <strong>${team.name}</strong>
              <span>${team.sport} - ${team.points} pts</span>
            </button>
          `).join("")}
        </div>
      </details>
    `;
  }).join("");
  bindTeamButtons(els.rosterList);
}

function renderDraftFilters() {
  const league = activeLeague();
  const rows = hasLeagueDraftSelections(league) ? draftSelectionRows(league) : draftPicks;
  const rounds = [...new Set(rows.map((pick) => pick.round))];
  const selectedRound = els.roundFilter.value || "all";
  const selectedSport = els.sportFilter.value || "all";
  els.roundFilter.innerHTML = `<option value="all">All rounds</option>${rounds.map((round) => `<option value="${round}">Round ${round}</option>`).join("")}`;
  els.sportFilter.innerHTML = `<option value="all">All sports</option>${sports.map((sport) => `<option value="${sport}">${sport}</option>`).join("")}`;
  els.roundFilter.value = selectedRound;
  els.sportFilter.value = selectedSport;
}

function renderDraftResults() {
  const league = activeLeague();
  const rows = hasLeagueDraftSelections(league) ? draftSelectionRows(league) : draftPicks;
  const round = els.roundFilter.value || "all";
  const sport = els.sportFilter.value || "all";
  const search = (els.pickSearch.value || "").trim().toLowerCase();
  const filtered = rows.filter((pick) => {
    const roundMatch = round === "all" || String(pick.round) === round;
    const sportMatch = sport === "all" || pick.sport === sport;
    const searchMatch = !search || `${pick.user} ${pick.team} ${pick.sport}`.toLowerCase().includes(search);
    return roundMatch && sportMatch && searchMatch;
  });
  els.draftResults.innerHTML = `
    <div class="table-row header draft-row"><span>Pick</span><span>Round</span><span>User</span><span>Team</span><span>Sport</span></div>
    ${filtered.length ? filtered.map((pick) => `
      <div class="table-row draft-row">
        <strong>${pick.pick}</strong>
        <span>${pick.round}</span>
        <span>${pick.user}</span>
        <strong>${pick.team}</strong>
        <span>${pick.sport}</span>
      </div>
    `).join("") : `<div class="table-row draft-row"><span></span><span></span><span>No draft picks yet</span><strong>Open the Draft Room to begin.</strong><span></span></div>`}
  `;
}

function openDraftRoom(leagueId = state.activeLeagueId) {
  state.activeLeagueId = leagueId;
  state.draftRoomLeagueId = leagueId;
  state.draftSportFilter = "all";
  const room = getDraftRoom(activeLeague());
  state.selectedDraftTeamId = selectedDraftTeam(room)?.id || "";
  els.publicSite.classList.add("is-hidden");
  els.verificationGate.classList.add("is-hidden");
  els.appShell.classList.add("is-hidden");
  els.draftRoom.classList.remove("is-hidden");
  document.body.classList.add("draft-room-open");
  renderDraftRoom();
  startDraftClock();
}

function exitDraftRoom() {
  stopDraftClock();
  state.draftRoomLeagueId = "";
  els.draftRoom.classList.add("is-hidden");
  document.body.classList.remove("draft-room-open");
  els.appShell.classList.remove("is-hidden");
  renderLeague();
  showView("league");
}

function renderDraftRoom() {
  const league = activeLeague();
  const room = getDraftRoom(league);
  const totalPicks = draftTotalPicks(room);
  const completed = room.draftSelections.length;
  const progress = totalPicks ? Math.round((completed / totalPicks) * 100) : 0;
  const context = isDraftComplete(room) ? null : draftPickContext(room);

  els.draftRoomTitle.textContent = league.name;
  els.draftRoomMeta.textContent = `${room.managers.length} teams - Snake draft - ${league.pickTimerLabel || "1 min"} pick clock`;
  els.draftRoundStatus.textContent = context ? `Round ${context.round} of ${room.rounds}` : "Draft complete";
  els.draftProgressBar.style.width = `${progress}%`;
  els.draftProgressLabel.textContent = `${progress}% Complete`;
  els.draftSelectedTop.disabled = isDraftComplete(room) || !selectedDraftTeam(room);
  els.draftSelectedTop.textContent = isDraftComplete(room) ? "Draft Complete" : "Draft Team";

  renderDraftSportSelect(league);
  renderDraftOrderStrip(room);
  renderDraftClock(room, league);
  renderDraftQueue(room);
  renderDraftSportSlots(room, league);
  renderDraftBoard(room);
  renderDraftAvailable(room);
  renderDraftTeamDetail(room, league);
  renderDraftActivity(room);
}

function renderDraftSportSelect(league) {
  const filters = ["all", ...league.sports];
  if (!filters.includes(state.draftSportFilter)) {
    state.draftSportFilter = "all";
  }
  els.draftSportSelect.innerHTML = filters.map((sport) => `
    <option value="${sport}">${sport === "all" ? "All Sports" : sport}</option>
  `).join("");
  els.draftSportSelect.value = state.draftSportFilter;
}

function renderDraftClock(room, league) {
  const context = isDraftComplete(room) ? null : draftPickContext(room);
  const expired = !isDraftComplete(room) && room.clockRemainingSeconds === 0;
  els.draftClockPanel.innerHTML = context ? `
    <p class="eyebrow">${expired ? "Clock expired" : "On the clock"}</p>
    <div class="draft-current-manager">
      <span class="avatar">${context.manager.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>
      <div>
        <h3>${context.manager}${context.manager === currentUserName() ? " (You)" : ""}</h3>
        <p>Pick ${context.round}.${String(context.managerIndex + 1).padStart(2, "0")} - Overall ${context.overallPick}</p>
      </div>
    </div>
    <strong class="draft-clock ${expired ? "expired" : ""}">${formatClock(room.clockRemainingSeconds)}</strong>
    <p>${expired ? "The pick is still open. Select a team to keep the draft moving." : `${league.pickTimerLabel || "1 min"} per pick.`}</p>
  ` : `
    <p class="eyebrow">Draft complete</p>
    <h3>All teams selected</h3>
    <strong class="draft-clock">00:00</strong>
    <p>The board is complete for this session.</p>
  `;
}

function renderDraftOrderStrip(room) {
  const context = isDraftComplete(room) ? null : draftPickContext(room);
  const activeRound = context?.round || room.rounds;
  const roundStart = (activeRound - 1) * room.managers.length;
  const picks = room.managers.map((manager, managerIndex) => {
    const pickIndex = roundStart + (activeRound % 2 === 1 ? managerIndex : room.managers.length - 1 - managerIndex);
    const pick = draftPickContext(room, pickIndex);
    return { ...pick, managerIndex, pickIndex };
  });
  els.draftOrderStrip.innerHTML = `
    <div class="draft-order-heading">
      <p class="eyebrow">Draft order</p>
      <h3>${isDraftComplete(room) ? "Draft complete" : `Round ${activeRound}`}</h3>
    </div>
    <div class="draft-order-list">
      ${picks.map((pick) => {
        const selected = room.draftSelections.find((selection) => selection.overallPick === pick.overallPick);
        const isCurrent = pick.pickIndex === room.currentPickIndex && !isDraftComplete(room);
        const isUpcoming = pick.pickIndex > room.currentPickIndex && pick.pickIndex <= room.currentPickIndex + 3;
        return `
          <div class="draft-order-card ${isCurrent ? "current" : ""} ${isUpcoming ? "upcoming" : ""} ${selected ? "picked" : ""}">
            <span>${pick.overallPick}</span>
            <strong>${pick.manager}${pick.manager === currentUserName() ? " (You)" : ""}</strong>
            <em>${selected ? selected.teamName : isCurrent ? "On clock" : isUpcoming ? "Upcoming" : "Waiting"}</em>
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function renderDraftQueue(room) {
  const queuedTeams = managerQueue(room).map((id) => room.availableTeams.find((team) => team.id === id)).filter(Boolean);
  els.draftQueue.innerHTML = queuedTeams.length ? queuedTeams.map((team, index) => `
    <button class="draft-queue-item" type="button" draggable="true" data-queue-team="${team.id}" data-select-draft-team="${team.id}">
      <span>${index + 1}</span>
      <strong>${team.name}</strong>
      <em>${sportCode(team.sport)}</em>
      <span class="remove-queue" data-remove-queue="${team.id}">Remove</span>
    </button>
  `).join("") : `<p>No queued teams yet.</p>`;
}

function renderDraftSportSlots(room, league) {
  const userName = currentUserName();
  const roster = room.draftSelections.filter((pick) => pick.manager === userName);
  els.draftSportSlots.innerHTML = league.sports.map((sport) => {
    const picks = roster.filter((pick) => pick.sport === sport);
    const latest = picks[picks.length - 1];
    return `
      <div class="draft-sport-slot ${latest ? "filled" : ""}">
        <span>${sport}</span>
        <strong>${latest ? latest.teamName : "Open slot"}</strong>
        <em>${picks.length ? `${picks.length} team${picks.length === 1 ? "" : "s"}` : "Waiting for selection"}</em>
      </div>
    `;
  }).join("");
}

function renderDraftBoard(room) {
  els.draftBoard.style.setProperty("--manager-count", room.managers.length);
  const header = `
    <div class="draft-board-cell draft-board-head">Round</div>
    ${room.managers.map((manager) => `<div class="draft-board-cell draft-board-head">${manager === currentUserName() ? `${manager} (You)` : manager}</div>`).join("")}
  `;
  const rows = Array.from({ length: room.rounds }, (_, roundIndex) => {
    const round = roundIndex + 1;
    return `
      <div class="draft-board-cell draft-round-label">${round}</div>
      ${room.managers.map((manager, managerIndex) => {
        const pick = room.draftSelections.find((selection) => selection.round === round && selection.manager === manager);
        const pickIndex = (round - 1) * room.managers.length + (round % 2 === 1 ? managerIndex : room.managers.length - 1 - managerIndex);
        const active = pickIndex === room.currentPickIndex && !isDraftComplete(room);
        return `
          <div class="draft-board-cell draft-pick-cell ${active ? "active" : ""} ${pick ? "filled" : ""}">
            ${pick ? `<span>${sportCode(pick.sport)}</span><strong>${pick.teamName}</strong><em>${pick.sport}</em>` : `<span>${pickIndex + 1}</span><strong>${round}.${String(managerIndex + 1).padStart(2, "0")}</strong>`}
          </div>
        `;
      }).join("")}
    `;
  }).join("");
  els.draftBoard.innerHTML = header + rows;
}

function filteredDraftTeams(room) {
  const search = (els.draftTeamSearch.value || "").trim().toLowerCase();
  return room.availableTeams.filter((team) => {
    const sportMatch = state.draftSportFilter === "all" || team.sport === state.draftSportFilter;
    const searchMatch = !search || `${team.name} ${team.sport} ${team.region}`.toLowerCase().includes(search);
    return sportMatch && searchMatch;
  });
}

function renderDraftAvailable(room) {
  const teams = filteredDraftTeams(room);
  if (!state.selectedDraftTeamId || !room.availableTeams.some((team) => team.id === state.selectedDraftTeamId)) {
    state.selectedDraftTeamId = teams[0]?.id || room.availableTeams[0]?.id || "";
  }
  els.draftAvailableTeams.innerHTML = teams.length ? teams.map((team) => `
    <button class="draft-team-row ${team.id === state.selectedDraftTeamId ? "active" : ""}" type="button" data-select-draft-team="${team.id}">
      <span>${team.rank}</span>
      <strong>${team.name}</strong>
      <em>${sportCode(team.sport)}</em>
      <small>${team.projected}</small>
    </button>
  `).join("") : `<p>No eligible teams match this filter.</p>`;
}

function renderDraftTeamDetail(room, league) {
  const team = selectedDraftTeam(room);
  const complete = isDraftComplete(room);
  if (!team) {
    els.draftTeamDetail.innerHTML = `<p class="eyebrow">Select team</p><h3>No teams available</h3><p>The draft pool is empty for this filter.</p>`;
    return;
  }
  const queued = managerQueue(room).includes(team.id);
  const context = complete ? null : draftPickContext(room);
  els.draftTeamDetail.innerHTML = `
    <p class="eyebrow">Select team</p>
    <h3>${team.name}</h3>
    <span class="tag">${team.sport}</span>
    <div class="team-modal-stat-grid">
      <div><span>Projection</span><strong>${team.projected}</strong></div>
      <div><span>Rank</span><strong>#${team.rank}</strong></div>
      <div><span>Form</span><strong>${team.form}</strong></div>
    </div>
    <p>${team.note}. Eligible for ${league.name}'s ${team.sport} slot.</p>
    <div class="draft-detail-actions">
      <button class="button primary" type="button" data-draft-selected ${complete ? "disabled" : ""}>Draft for ${context?.manager || "Complete"}</button>
      <button class="button secondary" type="button" data-toggle-queue="${team.id}">${queued ? "Remove from Queue" : "Add to Queue"}</button>
    </div>
  `;
}

function renderDraftActivity(room) {
  const messages = room.draftChatMessages || [];
  els.draftChat.innerHTML = messages.length ? messages.slice(-8).reverse().map((message) => `
    <div>
      <strong>${message.author}</strong>
      <span>${message.text}</span>
    </div>
  `).join("") : `<p>No chatter yet.</p>`;
}

function sendDraftChatMessage() {
  const text = els.draftChatInput.value.trim();
  if (!text) return;
  const league = activeLeague();
  const room = getDraftRoom(league);
  if (!room.draftChatMessages) room.draftChatMessages = [];
  room.draftChatMessages.push({ author: currentUserName(), text });
  els.draftChatInput.value = "";
  saveDraftRoomState(league.id);
  renderDraftActivity(room);
}

function draftTeam(teamId) {
  const league = activeLeague();
  const room = getDraftRoom(league);
  if (isDraftComplete(room)) {
    showToast("Draft is already complete.");
    return;
  }
  const team = room.availableTeams.find((item) => item.id === teamId);
  if (!team) return;
  const context = draftPickContext(room);
  room.draftSelections.push({
    ...context,
    teamId: team.id,
    teamName: team.name,
    sport: team.sport
  });
  room.availableTeams = room.availableTeams.filter((item) => item.id !== team.id);
  removeTeamFromQueues(room, team.id);
  room.draftActivity.unshift(`${context.manager} selected ${team.name} (${team.sport}) at pick ${context.overallPick}.`);
  room.currentPickIndex += 1;
  room.clockRemainingSeconds = league.pickTimerSeconds || 60;
  state.selectedDraftTeamId = room.availableTeams[0]?.id || "";
  if (isDraftComplete(room)) {
    league.draftStatus = "Draft Complete";
    room.draftActivity.unshift(`${league.name} draft completed.`);
    stopDraftClock();
  } else {
    startDraftClock();
  }
  saveDraftRoomState(league.id);
  renderRosters();
  renderDraftFilters();
  renderDraftResults();
  renderActivity();
  renderDashboard();
  renderLeagues();
  renderDraftRoom();
}

function draftSelectedTeam() {
  const room = getDraftRoom(activeLeague());
  const team = selectedDraftTeam(room);
  if (team) draftTeam(team.id);
}

function toggleDraftQueue(teamId) {
  const league = activeLeague();
  const room = getDraftRoom(league);
  const queue = managerQueue(room);
  if (queue.includes(teamId)) {
    setManagerQueue(room, currentUserName(), queue.filter((id) => id !== teamId));
  } else {
    setManagerQueue(room, currentUserName(), [...queue, teamId]);
  }
  saveDraftRoomState(league.id);
  renderDraftRoom();
}

function reorderDraftQueue(draggedTeamId, targetTeamId) {
  if (!draggedTeamId || !targetTeamId || draggedTeamId === targetTeamId) return;
  const league = activeLeague();
  const room = getDraftRoom(league);
  const queue = managerQueue(room);
  const fromIndex = queue.indexOf(draggedTeamId);
  const toIndex = queue.indexOf(targetTeamId);
  if (fromIndex === -1 || toIndex === -1) return;
  const reordered = [...queue];
  const [movedTeam] = reordered.splice(fromIndex, 1);
  reordered.splice(toIndex, 0, movedTeam);
  setManagerQueue(room, currentUserName(), reordered);
  saveDraftRoomState(league.id);
  renderDraftRoom();
}

function autopickQueuedTeam(room, league) {
  const context = draftPickContext(room);
  const queue = managerQueue(room, context.manager);
  const teamId = queue.find((id) => room.availableTeams.some((team) => team.id === id));
  if (!teamId) {
    room.draftActivity.unshift(`${context.manager}'s clock expired. No queued team was available.`);
    saveDraftRoomState(league.id);
    stopDraftClock();
    renderDraftRoom();
    return;
  }
  const team = room.availableTeams.find((item) => item.id === teamId);
  room.draftActivity.unshift(`Autopick selected ${team.name} from ${context.manager}'s queue.`);
  draftTeam(teamId);
}

function draftQueuedTeam() {
  const room = getDraftRoom(activeLeague());
  const teamId = managerQueue(room).find((id) => room.availableTeams.some((team) => team.id === id));
  if (!teamId) {
    showToast("Add a team to your queue first.");
    return;
  }
  draftTeam(teamId);
}

function renderTeams() {
  els.teamGrid.innerHTML = teamCatalog.map((team) => `
    <button class="team-card" type="button" data-team-id="${team.id}">
      <span class="tag">${team.sport}</span>
      <h4>${team.name}</h4>
      <p>${team.playoffStatus} - ${team.points} points earned</p>
      <div class="progress-track"><span style="width:${team.progress}%"></span></div>
    </button>
  `).join("");
  bindTeamButtons(els.teamGrid);
}

function bindTeamButtons(scope) {
  scope.querySelectorAll("[data-team-id]").forEach((button) => {
    button.addEventListener("click", () => openTeamModal(button.dataset.teamId));
  });
}

function openTeamModal(teamId) {
  const team = teamCatalog.find((item) => item.id === teamId);
  if (!team) return;
  els.teamModalBody.innerHTML = `
    <p class="eyebrow">${team.sport}</p>
    <h2 id="teamModalTitle">${team.name}</h2>
    <p>Draft owner: <strong>${team.owner}</strong></p>
    <div class="team-modal-stat-grid">
      <div><span>Current Record</span><strong>${team.record}</strong></div>
      <div><span>Playoff Status</span><strong>${team.playoffStatus}</strong></div>
      <div><span>Current Ranking</span><strong>${team.ranking}</strong></div>
      <div><span>Championship Odds</span><strong>${team.odds}</strong></div>
      <div><span>Points Earned</span><strong>${team.points}</strong></div>
      <div><span>Draft Owner</span><strong>${team.owner}</strong></div>
    </div>
    <h3>Season progress</h3>
    <div class="progress-track"><span style="width:${team.progress}%"></span></div>
  `;
  els.teamModal.classList.remove("is-hidden");
  document.body.classList.add("modal-open");
}

function renderActivity() {
  const league = activeLeague();
  const room = draftRooms[league.id] || loadDraftRoomState(league.id);
  const draftItems = room?.draftActivity?.map((text, index) => ({
    time: index === 0 ? "Latest" : "Draft",
    text
  })) || [];
  const items = [...draftItems, ...activityLog];
  els.activityList.innerHTML = items.map((item) => `
    <div class="activity-item">
      <time>${item.time}</time>
      <p>${item.text}</p>
    </div>
  `).join("");
}

function renderAudit() {
  els.auditList.innerHTML = auditLog.map((item) => `
    <div class="activity-item">
      <time>${item.time}</time>
      <p>${item.text}</p>
    </div>
  `).join("");
}

function setLeagueTab(tab) {
  state.activeLeagueTab = tab;
  document.querySelectorAll("[data-league-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.leagueTab === tab);
  });
  document.querySelectorAll(".league-tab-content").forEach((section) => section.classList.remove("active"));
  document.querySelector(`#${tab}Tab`)?.classList.add("active");
}

function submitSignup(event) {
  event.preventDefault();
  const user = {
    firstName: document.querySelector("#signupFirst").value.trim(),
    lastName: document.querySelector("#signupLast").value.trim(),
    username: document.querySelector("#signupUsername").value.trim(),
    email: document.querySelector("#signupEmail").value.trim().toLowerCase(),
    password: document.querySelector("#signupPassword").value,
    timeZone: document.querySelector("#signupTimeZone").value,
    verified: false
  };

  if (!validEmail(user.email)) {
    setMessage(els.signupMessage, "Enter a valid email address.", "error");
    return;
  }
  if (!validPassword(user.password)) {
    setMessage(els.signupMessage, "Password does not meet the minimum security requirements.", "error");
    return;
  }
  if (state.users.some((existing) => existing.email === user.email)) {
    setMessage(els.signupMessage, "Email address is already in use.", "error");
    return;
  }
  if (state.users.some((existing) => existing.username.toLowerCase() === user.username.toLowerCase())) {
    setMessage(els.signupMessage, "Username is already taken.", "error");
    return;
  }

  state.users.push(user);
  saveUsers();
  closeAuth();
  showVerification(user.email);
}

function submitLogin(event) {
  event.preventDefault();
  const email = document.querySelector("#loginEmail").value.trim().toLowerCase();
  const password = document.querySelector("#loginPassword").value;
  const user = state.users.find((candidate) => candidate.email === email && candidate.password === password);
  if (!user) {
    setMessage(els.loginMessage, "Invalid email or password.", "error");
    return;
  }
  if (!user.verified) {
    closeAuth();
    showVerification(user.email);
    return;
  }
  enterApp(user);
}

function submitForgot(event) {
  event.preventDefault();
  const email = document.querySelector("#resetEmail").value.trim().toLowerCase();
  if (!validEmail(email)) {
    setMessage(els.resetMessage, "Enter a valid email address.", "error");
    return;
  }
  setMessage(els.resetMessage, "Password reset email queued. In production this would send a secure reset link.", "success");
}

function verifyPendingAccount() {
  const user = state.users.find((candidate) => candidate.email === state.pendingUserEmail);
  if (!user) return;
  user.verified = true;
  saveUsers();
  enterApp(user);
  showToast("Account verified. Welcome to LOC.");
}

function createLeague(event) {
  event.preventDefault();
  const selectedSports = Array.from(els.wizardSports.querySelectorAll("input:checked")).map((input) => input.value);
  if (!selectedSports.length) {
    showToast("Select at least one sport.");
    return;
  }
  const name = document.querySelector("#newLeagueName").value.trim();
  const year = Number(document.querySelector("#newLeagueYear").value);
  const participants = Number(document.querySelector("#newLeagueParticipants").value);
  const pickTimer = document.querySelector("#newPickTimer");
  const newLeague = {
    id: `league-${Date.now()}`,
    name,
    description: document.querySelector("#newLeagueDescription").value.trim(),
    season: year,
    teams: participants,
    ranking: 1,
    draftStatus: "Draft Scheduled",
    pickTimerSeconds: Number(pickTimer.value),
    pickTimerLabel: pickTimer.options[pickTimer.selectedIndex].textContent,
    seasonStatus: "Preseason",
    commissioner: fullName(state.currentUser),
    isCommissioner: true,
    sports: selectedSports,
    standings: [{ rank: 1, user: fullName(state.currentUser), points: 0, teams: 0 }]
  };
  leagues.unshift(newLeague);
  const inviteText = document.querySelector("#newLeagueInvites").value.trim();
  if (inviteText) {
    auditLog.unshift({ time: new Date().toLocaleString(), text: `${fullName(state.currentUser)} invited ${inviteText}.` });
  }
  activityLog.unshift({ time: new Date().toLocaleString(), text: `${fullName(state.currentUser)} created ${name}.` });
  state.activeLeagueId = newLeague.id;
  renderDashboard();
  renderLeagues();
  renderLeague();
  showView("league");
  setLeagueTab("commissioner");
  showToast(`${name} created.`);
}

function handleAdminAction(action) {
  const item = { time: new Date().toLocaleString(), text: `${fullName(state.currentUser)} performed ${action}.` };
  auditLog.unshift(item);
  activityLog.unshift(item);
  renderAudit();
  renderActivity();
  showToast(`${action} logged to audit history.`);
}

function bindEvents() {
  document.querySelectorAll("[data-auth-open]").forEach((button) => {
    button.addEventListener("click", () => openAuth(button.dataset.authOpen));
  });
  document.querySelectorAll("[data-auth-tab]").forEach((button) => {
    button.addEventListener("click", () => setAuthTab(button.dataset.authTab));
  });
  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!state.currentUser) return;
      showView(button.dataset.view);
    });
  });
  document.querySelectorAll("[data-league-tab]").forEach((button) => {
    button.addEventListener("click", () => setLeagueTab(button.dataset.leagueTab));
  });
  document.querySelectorAll("[data-admin-action]").forEach((button) => {
    button.addEventListener("click", () => handleAdminAction(button.dataset.adminAction));
  });
  document.querySelectorAll("[data-open-draft-room]").forEach((button) => {
    button.addEventListener("click", () => openDraftRoom(button.dataset.openDraftRoom || state.activeLeagueId));
  });
  els.closeAuth.addEventListener("click", closeAuth);
  els.authModal.addEventListener("click", (event) => {
    if (event.target === els.authModal) closeAuth();
  });
  els.closeTeamModal.addEventListener("click", () => {
    els.teamModal.classList.add("is-hidden");
    document.body.classList.remove("modal-open");
  });
  els.teamModal.addEventListener("click", (event) => {
    if (event.target === els.teamModal) {
      els.teamModal.classList.add("is-hidden");
      document.body.classList.remove("modal-open");
    }
  });
  els.loginForm.addEventListener("submit", submitLogin);
  els.signupForm.addEventListener("submit", submitSignup);
  els.forgotForm.addEventListener("submit", submitForgot);
  els.verifyAccountButton.addEventListener("click", verifyPendingAccount);
  document.querySelector("#logoutButton").addEventListener("click", logout);
  els.exitDraftRoom.addEventListener("click", exitDraftRoom);
  els.draftRoom.addEventListener("click", (event) => {
    const removeQueue = event.target.closest("[data-remove-queue]");
    if (removeQueue) {
      event.stopPropagation();
      toggleDraftQueue(removeQueue.dataset.removeQueue);
      return;
    }
    const selectTeam = event.target.closest("[data-select-draft-team]");
    if (selectTeam) {
      state.selectedDraftTeamId = selectTeam.dataset.selectDraftTeam;
      renderDraftRoom();
      return;
    }
    const queueToggle = event.target.closest("[data-toggle-queue]");
    if (queueToggle) {
      toggleDraftQueue(queueToggle.dataset.toggleQueue);
      return;
    }
    if (event.target.closest("[data-draft-selected]")) {
      draftSelectedTeam();
    }
  });
  els.draftRoom.addEventListener("dragstart", (event) => {
    const queueItem = event.target.closest("[data-queue-team]");
    if (!queueItem) return;
    state.draggedQueueTeamId = queueItem.dataset.queueTeam;
    queueItem.classList.add("dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", state.draggedQueueTeamId);
  });
  els.draftRoom.addEventListener("dragover", (event) => {
    const queueItem = event.target.closest("[data-queue-team]");
    if (!queueItem || !state.draggedQueueTeamId) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  });
  els.draftRoom.addEventListener("drop", (event) => {
    const queueItem = event.target.closest("[data-queue-team]");
    if (!queueItem || !state.draggedQueueTeamId) return;
    event.preventDefault();
    reorderDraftQueue(state.draggedQueueTeamId, queueItem.dataset.queueTeam);
    state.draggedQueueTeamId = "";
  });
  els.draftRoom.addEventListener("dragend", () => {
    state.draggedQueueTeamId = "";
    els.draftQueue.querySelectorAll(".dragging").forEach((item) => item.classList.remove("dragging"));
  });
  els.draftSportSelect.addEventListener("change", () => {
    state.draftSportFilter = els.draftSportSelect.value;
    renderDraftRoom();
  });
  els.draftTeamSearch.addEventListener("input", () => renderDraftRoom());
  els.draftSelectedTop.addEventListener("click", draftSelectedTeam);
  els.draftQueuedTeam.addEventListener("click", draftQueuedTeam);
  els.sendDraftChat.addEventListener("click", sendDraftChatMessage);
  els.draftChatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendDraftChatMessage();
    }
  });
  els.leagueWizard.addEventListener("submit", createLeague);
  [els.roundFilter, els.sportFilter, els.pickSearch].forEach((input) => {
    input.addEventListener("input", renderDraftResults);
    input.addEventListener("change", renderDraftResults);
  });
}

function init() {
  renderScoreGrid(els.publicScoreGrid);
  renderScoreGrid(els.leagueScoreGrid);
  renderWizardSports();
  populateTimeZones();
  bindEvents();
}

init();
