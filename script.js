const app = document.getElementById("app")
const menu = document.getElementById("menu")
const overlay = document.getElementById("overlay")
const menuIcon = document.getElementById("menuIcon")
const backIcon = document.getElementById("backIcon")
const settings = document.getElementById("settings")
const theme = document.getElementById("theme")

let state = { page: "home", s: 0, sub: 0 }

// ---------- HEADER ----------
function header() {
  menuIcon.style.display = state.page === "home" ? "inline" : "none"
  backIcon.style.display = state.page === "home" ? "none" : "inline"
}

// ---------- MENU ----------
function toggleMenu() {
  menu.style.left = menu.style.left === "0px" ? "-240px" : "0px"
  overlay.style.display = "block"
}

function toggleSettings() {
  settings.style.display = settings.style.display === "block" ? "none" : "block"
  overlay.style.display = "block"
}

function closeAll() {
  menu.style.left = "-240px"
  settings.style.display = "none"
  overlay.style.display = "none"
}

// ---------- RENDER (NO HISTORY) ----------
function renderHome() {
  state = { page: "home", s: 0, sub: 0 }
  header()
  app.innerHTML =
    `<h3>${DATA.title}</h3>` +
    DATA.semesters.map((s, i) =>
      `<div class="card" onclick="openSemester(${i})">${s.name}</div>`
    ).join("")
}

function renderSemester() {
  header()
  app.innerHTML =
    `<h3>${DATA.semesters[state.s].name}</h3>` +
    DATA.semesters[state.s].subjects.map((sub, j) =>
      `<div class="card" onclick="openSubject(${j})">${sub.name}</div>`
    ).join("")
}

function renderSubject() {
  header()
  app.innerHTML =
    `<h3>${DATA.semesters[state.s].subjects[state.sub].name}</h3>` +
    DATA.semesters[state.s].subjects[state.sub].units.map(u =>
      `<div class="card" onclick="${
        u.type === "video"
          ? `openVideo('${u.link}')`
          : `openPDF('${u.link}')`
      }">${u.name}</div>`
    ).join("")
}

// ---------- PDF ----------
function openPDF(url) {
  history.pushState(
    { page: "subject", s: state.s, sub: state.sub },
    "",
    "#pdf"
  )

  state.page = "pdf"
  header()

  app.innerHTML =
    `<iframe src="${url}" width="100%" height="100vh" style="border:none;"></iframe>`
}

// ---------- VIDEO ----------
function openVideo(url) {
  history.pushState(
    { page: "subject", s: state.s, sub: state.sub },
    "",
    "#video"
  )

  state.page = "video"
  header()

  app.innerHTML =
    `<video src="${url}" controls autoplay style="width:100%;height:100vh;background:black"></video>`
}

// ---------- THEME ----------
function applyTheme(dark) {
  if (dark) {
    document.documentElement.style.setProperty("--bg", "#121212")
    document.documentElement.style.setProperty("--text", "#fff")
    document.documentElement.style.setProperty("--header", "#1f1f1f")
    document.documentElement.style.setProperty("--menu", "#1a1a1a")
    document.documentElement.style.setProperty("--border", "#333")
    document.documentElement.style.setProperty("--card-hover", "#2a2a2a")
    document.documentElement.style.setProperty("--header-text", "#fff")
    localStorage.setItem("theme", "dark")
  } else {
    document.documentElement.style.setProperty("--bg", "#fff")
    document.documentElement.style.setProperty("--text", "#111")
    document.documentElement.style.setProperty("--header", "#f2f2f2")
    document.documentElement.style.setProperty("--menu", "#fff")
    document.documentElement.style.setProperty("--border", "#ddd")
    document.documentElement.style.setProperty("--card-hover", "#f0f0f0")
    document.documentElement.style.setProperty("--header-text", "#111")
    localStorage.setItem("theme", "light")
  }
}
theme.onchange = () => applyTheme(theme.checked)

// ---------- NAVIGATION ----------
function goHome() {
  history.pushState({ page: "home" }, "", "#home")
  renderHome()
  closeAll()
}

function openSemester(i) {
  history.pushState({ page: "semester", s: i }, "", "#sem")
  state = { page: "semester", s: i, sub: 0 }
  renderSemester()
}

function openSubject(j) {
  history.pushState({ page: "subject", s: state.s, sub: j }, "", "#sub")
  state.page = "subject"
  state.sub = j
  renderSubject()
}

function goBack() {
  history.back()
}

// ---------- POPSTATE (FINAL FIX) ----------
window.onpopstate = function (e) {
  if (!e.state) {
    renderHome()
    return
  }

  state.page = e.state.page
  state.s = e.state.s || 0
  state.sub = e.state.sub || 0

  if (state.page === "subject") renderSubject()
  else if (state.page === "semester") renderSemester()
  else renderHome()
}

// ---------- START ----------
applyTheme(localStorage.getItem("theme") === "dark")
theme.checked = localStorage.getItem("theme") === "dark"
history.replaceState({ page: "home" }, "", "#home")
renderHome()