/**
Cálculo da heurística
 */
function calculateConflicts(state) {
    const N = state.length;
    let conflicts = 0;
    
    for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
            if (state[i] === state[j]) {
                conflicts++;
            }
            if (Math.abs(state[i] - state[j]) === Math.abs(i - j)) {
                conflicts++;
            }
        }
    }
    return conflicts;
}

/*
 * Executa uma iteração do Hill Climbing (Subida de Encosta).
 */
function getNextHillClimbingState(currentState) {
    const N = currentState.length;
    const currentConflicts = calculateConflicts(currentState);
    
    let bestState = [...currentState];
    let bestConflicts = currentConflicts;
    let improvements = [];

    for (let col = 0; col < N; col++) {
        const originalRow = currentState[col];
        
        for (let row = 0; row < N; row++) {
            if (row === originalRow) continue;

            currentState[col] = row;
            const testConflicts = calculateConflicts(currentState);

            if (testConflicts < bestConflicts) {
                bestConflicts = testConflicts;
                improvements = [{ col, row, fromRow: originalRow }];
            } else if (testConflicts === bestConflicts && testConflicts < currentConflicts) {
                improvements.push({ col, row, fromRow: originalRow });
            }
        }
        currentState[col] = originalRow;
    }

    if (improvements.length > 0) {
        const choice = improvements[Math.floor(Math.random() * improvements.length)];
        bestState[choice.col] = choice.row;
        return { 
            state: bestState, 
            action: "move",
            details: `Moveu rainha da coluna ${choice.col} da linha ${choice.fromRow} para a linha ${choice.row} (Conflitos caíram para ${bestConflicts})`
        };
    } else {
        return { 
            state: null, 
            action: "restart",
            details: `Preso em Máximo Local com ${currentConflicts} conflitos. Nenhuma jogada melhora o tabuleiro.`
        };
    }
}
