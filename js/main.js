let appState = {
    N: 8,
    queens: [],
    iterations: 0,
    lastMovedColumn: null,
    speed: 500,
    timeoutId: null,
    isPaused: false,
    isSearching: false
};

const dom = {
    board: document.getElementById('board'),
    nInput: document.getElementById('nValue'),
    speedInput: document.getElementById('speedValue'),
    txtSpeed: document.getElementById('txtSpeed'),
    btnGenerate: document.getElementById('btnGenerate'),
    btnSolve: document.getElementById('btnSolve'),
    btnPause: document.getElementById('btnPause'),
    txtConflicts: document.getElementById('txtConflicts'),
    txtIterations: document.getElementById('txtIterations'),
    txtStatus: document.getElementById('txtStatus'),
    decisionLog: document.getElementById('decisionLog')
};

function logDecision(message, type = '') {
    const entry = document.createElement('div');
    entry.classList.add('log-entry');
    if (type) entry.classList.add(type);
    entry.textContent = `[Passo ${appState.iterations}] ${message}`;
    dom.decisionLog.appendChild(entry);
    dom.decisionLog.scrollTop = dom.decisionLog.scrollHeight;
}

function drawAdvancedBoard(queensState, boardElem, highlightedColumn) {
    const N = queensState.length;
    boardElem.innerHTML = '';
    
    for (let row = 0; row < N; row++) {
        for (let col = 0; col < N; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            
            if ((row + col) % 2 === 0) {
                cell.classList.add('light');
            } else {
                cell.classList.add('dark');
            }

            if (queensState[col] === row && col === highlightedColumn) {
                cell.classList.add('moved-highlight');
            }

            if (queensState[col] === row) {
                const container = document.createElement('div');
                container.classList.add('queen-container');

               
                if (col === highlightedColumn) {
                    container.classList.add('queen-move-animation');
                }

                const icon = document.createElement('span');
                icon.classList.add('queen-icon');
                icon.textContent = '♛';
                icon.style.fontSize = `${parseFloat(boardElem.style.width) / (N * 1.3)}px`;

                const label = document.createElement('span');
                label.classList.add('queen-label');
                label.textContent = `R${col}`;

                container.appendChild(icon);
                container.appendChild(label);
                cell.appendChild(container);
            }

            boardElem.appendChild(cell);
        }
    }
}

function initializeApplication() {
    appState.N = parseInt(dom.nInput.value) || 8;
    if (appState.N < 4) { appState.N = 4; dom.nInput.value = 4; }
    if (appState.N > 16) { appState.N = 16; dom.nInput.value = 16; }

    clearTimeout(appState.timeoutId);
    appState.iterations = 0;
    appState.lastMovedColumn = null;
    appState.isPaused = false;
    appState.isSearching = false;
    
    dom.btnPause.textContent = "Pausar";
    dom.btnPause.disabled = true;
    
    dom.txtIterations.textContent = appState.iterations;
    dom.txtStatus.textContent = "Pronto";
    dom.txtStatus.style.color = "black";
    dom.decisionLog.innerHTML = '<div class="log-entry">Novo tabuleiro estilo xadrez gerado.</div>';


    // Configura a posição inicial, espalha uma rainha por coluna em uma linha aleatória
    appState.queens = [];
    for (let col = 0; col < appState.N; col++) {
        appState.queens.push(Math.floor(Math.random() * appState.N));
    }

    setupBoardDOM(appState.N, dom.board);
    syncUI();
    toggleControls(false);
}

function syncUI() {
    drawAdvancedBoard(appState.queens, dom.board, appState.lastMovedColumn);
    dom.txtConflicts.textContent = calculateConflicts(appState.queens);
}

function runSolverStep() {
    if (appState.isPaused) return;

    appState.iterations++;
    dom.txtIterations.textContent = appState.iterations;

    const currentConflicts = calculateConflicts(appState.queens);
    
// Condição de vitória: se o total de conflitos for zero, nenhuma rainha se ataca
    if (currentConflicts === 0) {
        clearTimeout(appState.timeoutId);
        dom.txtStatus.textContent = "Sucesso!";
        dom.txtStatus.style.color = "green";
        logDecision("Sucesso! Solução encontrada sem nenhum conflito no tabuleiro.", "success");
        dom.btnPause.disabled = true;
        toggleControls(false);
        return;
    }

    const result = getNextHillClimbingState(appState.queens);

    if (result.action === "move") {
        const match = result.details.match(/coluna (\d+)/);
        if (match) {
            appState.lastMovedColumn = parseInt(match[1]); 
        }
        
        appState.queens = result.state;
        const friendlyLog = result.details.replace("Moveu rainha da coluna", "A Rainha R");
        logDecision(friendlyLog);
        syncUI();
        
        appState.timeoutId = setTimeout(runSolverStep, appState.speed);
    } else if (result.action === "restart") {
        appState.lastMovedColumn = null; 
        // Máximo Local: o algoritmo travou porque qualquer movimento vai aumentar ou manter os conflitos.
        // Solução: ativa o 'Random Restart' para embaralhar o tabuleiro e tentar um novo caminho.
        logDecision("Preso em Máximo Local. Nenhuma jogada melhora a atual posição.", "warning");
        logDecision("Aplicando Random Restart (Embaralhando Rainhas)...", "warning");
        
        for (let col = 0; col < appState.N; col++) {
            appState.queens[col] = Math.floor(Math.random() * appState.N);
        }
        syncUI();
        
        appState.timeoutId = setTimeout(runSolverStep, appState.speed);
    }
}

function toggleControls(disabled) {
    dom.btnSolve.disabled = disabled;
    dom.btnGenerate.disabled = disabled;
    dom.nInput.disabled = disabled;
}

dom.speedInput.addEventListener('input', (e) => {
    appState.speed = parseInt(e.target.value);
    dom.txtSpeed.textContent = appState.speed;
});

dom.btnGenerate.addEventListener('click', initializeApplication);

dom.btnSolve.addEventListener('click', () => {
    if (calculateConflicts(appState.queens) === 0) {
        dom.txtStatus.textContent = "O tabuleiro já está resolvido!";
        return;
    }
    toggleControls(true);
    dom.btnPause.disabled = false;
    appState.isSearching = true;
    dom.txtStatus.textContent = "Buscando...";
    dom.txtStatus.style.color = "blue";
    logDecision("Iniciando busca heurística...");
    appState.timeoutId = setTimeout(runSolverStep, appState.speed);
});

dom.btnPause.addEventListener('click', () => {
    if (!appState.isSearching) return;

    if (!appState.isPaused) {
        appState.isPaused = true;
        clearTimeout(appState.timeoutId);
        dom.btnPause.textContent = "Continuar";
        dom.txtStatus.textContent = "Pausado";
        dom.txtStatus.style.color = "orange";
        logDecision("Algoritmo pausado pelo usuário.");
    } else {
        appState.isPaused = false;
        dom.btnPause.textContent = "Pausar";
        dom.txtStatus.textContent = "Buscando...";
        dom.txtStatus.style.color = "blue";
        logDecision("Retomando busca heurística...");
        appState.timeoutId = setTimeout(runSolverStep, appState.speed);
    }
});

window.onload = initializeApplication;
window.onresize = initializeApplication;
