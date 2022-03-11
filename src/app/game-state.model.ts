import { GuessType } from "./guess.model"

export enum GameStatus {
    WIN,
    IN_PROGRESS,
    LOSE
  }

export class GameState {

    private guesses: string[]
    private gameGuessTypes: [number, GuessType][][]
    private date: string
    private solution: string
    private gameStatus: GameStatus

    constructor() {
        this.guesses = []
        this.gameGuessTypes = []
        this.solution = ''
        this.date = (new Date().getUTCMonth() + 1) + '/' + new Date().getUTCDate() + '/' + new Date().getUTCFullYear()
        this.gameStatus = GameStatus.IN_PROGRESS
    }

    getGuesses() {
        return this.guesses
    }

    getGuessTypes() {
        return this.gameGuessTypes
    }

    addGuess(guess: string) {
        this.guesses.push(guess)
    }

    addGameGuessType(guessType: [number, GuessType][]) {
        this.gameGuessTypes.push(guessType)
    }

    getDate() {
        return this.date
    }

    setDate(date: string) {
        this.date = date
    }

    getSolution() {
        return this.solution
    }

    setSolution(solution: string) {
        this.solution = solution
    }

    getGameStatus(): GameStatus {
        return this.gameStatus
    }

    setGameStatus(gameStatus: GameStatus) {
        this.gameStatus = gameStatus
    }

}