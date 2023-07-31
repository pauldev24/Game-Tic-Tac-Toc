import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'
import './App.css'
import { Square } from './components/Square'
import { TURNS, WINNER_COMBOS } from './constants.js'
import { checkWinner, checkEndGame } from './logic/board.js'
import { WinnerModal } from './components/WinnerModal'
import Board from './components/Board'
import { saveGameToStorage, resetGameToStorage } from './storage'

function App () {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage
      ? JSON.parse(boardFromStorage)
      : Array(9).fill(null)
  })
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? TURNS.x
  })
  // null es que no hay ganador, false que hay un empate
  const [winner, setWinner] = useState(null)

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.x)
    setWinner(null)

    resetGameToStorage()
  }

  const updateBoard = (index) => {
    // Validacion para ver si hay algo ya escrito
    if (board[index] || winner) return
    // Lineas para actualizar la casilla
    const newBoard = [...board]
    // Se saca una copia board[index] = turn esta mal porque es una mala practica modificar directamente el estado
    newBoard[index] = turn
    setBoard(newBoard)
    // Cambiar el turno
    const newturn = turn === TURNS.x ? TURNS.o : TURNS.x
    setTurn(newturn)
    // Revisar si hay ganador
    const newWinner = checkWinner(newBoard)
    // Es mejor enviar el newBoard porque utilizar el estado como es asyn puede generar que se envie el anterior
    //

    if (newWinner) {
      setWinner(newWinner)
      confetti() // La actualizacion de estados es asincrono no bloquea el renderizado
    } else if (checkEndGame(newBoard)) {
      setWinner(false)
    }
  } // Check si el game acabo
  // updateBoard() - es pasar la ejecucion
  // updateBoard - es pasar la funcion

  useEffect(() => {
    // Guardar partida
    saveGameToStorage({
      board,
      turn
    })
  }, [turn, board])
  /* el segundo parametro es la dependencia si lo dejamos vacio se ejecuta solo una vez, sino le podemos poner cada que cambia algo ejecutate, como un observador
   */
  return (
    <main className='board'>
      <h1>Tic Tac Toc</h1>
      <button onClick={resetGame}>Reset del juego</button>

      <Board board={board} updateBoard={updateBoard} />

      <section className='turn'>
        <Square isSelected={turn == TURNS.x}>{TURNS.x}</Square>
        <Square isSelected={turn == TURNS.o}>{TURNS.o}</Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  )
}

export default App
