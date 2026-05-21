/**
 * Inicializa a estrutura visual e tamanho da grade do CSS Grid
 */
function setupBoardDOM(N, boardElem) {
    const boardSize = Math.min(window.innerWidth - 60, 500);
    boardElem.style.width = `${boardSize}px`;
    boardElem.style.height = `${boardSize}px`;
    boardElem.style.gridTemplateColumns = `repeat(${N}, 1fr)`;
    boardElem.style.gridTemplateRows = `repeat(${N}, 1fr)`;
}

/**
 * Desenha as células e posiciona os emojis de coroa conforme as posições das rainhas
 */
function drawBoard(queensState, boardElem) {
    const N = queensState.length;
    boardElem.innerHTML = '';
    
    for (let row = 0; row < N; row++) {
        for (let col = 0; col < N; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            
            // Alterna cores das casas (padrão xadrez)
            if ((row + col) % 2 === 0) {
                cell.classList.add('light');
            } else {
                cell.classList.add('dark');
            }

            // Verifica se existe uma rainha gravada para aquela linha/coluna
            if (queensState[col] === row) {
                const queen = document.createElement('span');
                queen.classList.add('queen');
                queen.textContent = '👑';
                queen.style.fontSize = `${parseFloat(boardElem.style.width) / (N * 1.5)}px`;
                cell.appendChild(queen);
            }

            boardElem.appendChild(cell);
        }
    }
}