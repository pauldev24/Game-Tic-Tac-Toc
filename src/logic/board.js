import { WINNER_COMBOS } from '../constants.js'

export const checkWinner = (boardToCheck) => {
  // Revisamos todas la combinaciones ganadoras
  // Para ver si x u o gano
  for (const combo of WINNER_COMBOS) {
    const [a, b, c] = combo
    if (
    // Verifica que el mismo simbolo este presente en las otras posiciones ganadoras
      boardToCheck[a] && // 0 -> x u o
        boardToCheck[a] === boardToCheck[b] && // 0 y
        boardToCheck[a] === boardToCheck[c]
    ) {
      return boardToCheck[a]
    }
  }
  // Si no hay ganador
  return null
}

export const checkEndGame = (newBoard) => {
  // Resisamos si hay empate
  return newBoard.every((square) => square != null)
}
