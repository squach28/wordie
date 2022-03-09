import { GuessType } from "./guess.model"

export class GameState {

    private guesses: string[]
    private gameGuessTypes: [number, GuessType][][]

    constructor() {
        this.guesses = []
        this.gameGuessTypes = []
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

}