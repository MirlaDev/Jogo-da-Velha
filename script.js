document.addEventListener("DOMContentLoaded", () => {
  const board = document.getElementById("board");
  const cells = document.querySelectorAll("[data-cell]");
  const restartButton = document.getElementById("restartButton");
  const undoButton = document.getElementById("undoButton");
  const playModeToggle = document.getElementById("playModeToggle");
  const themeToggle = document.getElementById("themeToggle");
  const playerDisplay = document.getElementById("playerDisplay");
  const message = document.getElementById("message");

  const xScore = document.getElementById("xScore");
  const oScore = document.getElementById("oScore");
  const drawScore = document.getElementById("drawScore");

  const clickSound = document.getElementById("clickSound");
  const winSound = document.getElementById("winSound");
  const drawSound = document.getElementById("drawSound");

  const winningCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  let currentPlayer = "X";
  let gameActive = true;
  let history = [];
  let mode = "pvp"; // "pvp" ou "pvc"
  let scores = { X: 0, O: 0, D: 0 };

  function startGame() {
    cells.forEach(cell => {
      cell.className = "cell"; // remove x, o, winning-cell
      cell.addEventListener("click", handleClick, { once: true });
    });
    currentPlayer = "X";
    gameActive = true;
    history = [];
    playerDisplay.textContent = currentPlayer;
    message.textContent = "";

    if (mode === "pvc" && currentPlayer === "O") {
      setTimeout(cpuPlay, 500);
    }
  }

  function handleClick(e) {
    if (!gameActive) return;
    const cell = e.target;
    makeMove(cell);
  }

  function makeMove(cell) {
    if (!gameActive || cell.classList.contains("x") || cell.classList.contains("o")) return;

    cell.classList.add(currentPlayer.toLowerCase());
    clickSound.play();
    history.push({ cell, player: currentPlayer });

    if (checkWin(currentPlayer)) {
      endGame(false);
    } else if (isDraw()) {
      endGame(true);
    } else {
      switchPlayer();
    }
  }

  function checkWin(player) {
    return winningCombos.some(comb => {
      const win = comb.every(i => cells[i].classList.contains(player.toLowerCase()));
      if (win) comb.forEach(i => cells[i].classList.add("winning-cell"));
      return win;
    });
  }

  function isDraw() {
    return [...cells].every(cell =>
      cell.classList.contains("x") || cell.classList.contains("o")
    );
  }

  function switchPlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    playerDisplay.textContent = currentPlayer;

    if (mode === "pvc" && currentPlayer === "O") {
      setTimeout(cpuPlay, 500);
    }
  }

  function cpuPlay() {
    const empty = [...cells].filter(c =>
      !c.classList.contains("x") && !c.classList.contains("o")
    );
    if (empty.length > 0) {
      const randCell = empty[Math.floor(Math.random() * empty.length)];
      makeMove(randCell);
    }
  }

  function endGame(draw) {
    gameActive = false;
    if (draw) {
      scores.D++;
      drawScore.textContent = scores.D;
      message.textContent = "Empate!";
      drawSound.play();
    } else {
      scores[currentPlayer]++;
      if (currentPlayer === "X") xScore.textContent = scores.X;
      else oScore.textContent = scores.O;
      message.textContent = `Jogador ${currentPlayer} venceu!`;
      winSound.play();
    }
  }

  function undoMove() {
    if (history.length === 0 || !gameActive) return;

    const last = history.pop();
    last.cell.classList.remove(last.player.toLowerCase(), "winning-cell");
    last.cell.addEventListener("click", handleClick, { once: true });
    currentPlayer = last.player;
    playerDisplay.textContent = currentPlayer;

    if (mode === "pvc" && currentPlayer === "X" && history.length > 0) {
      const cpu = history.pop();
      cpu.cell.classList.remove(cpu.player.toLowerCase(), "winning-cell");
      cpu.cell.addEventListener("click", handleClick, { once: true });
    }
  }

  function toggleMode() {
    mode = mode === "pvp" ? "pvc" : "pvp";
    playModeToggle.textContent = mode === "pvp"
      ? "🔀 Modo: Player vs Player"
      : "🤖 Modo: Player vs CPU";
    startGame();
  }

  function toggleTheme() {
    document.body.classList.toggle("dark");
    themeToggle.textContent = document.body.classList.contains("dark")
      ? "☀️ Modo Claro"
      : "🌙 Modo Escuro";
  }

  // Eventos
  restartButton.addEventListener("click", startGame);
  undoButton.addEventListener("click", undoMove);
  playModeToggle.addEventListener("click", toggleMode);
  themeToggle.addEventListener("click", toggleTheme);

  startGame();
});
