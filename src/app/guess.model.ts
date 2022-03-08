export enum GuessType {
    CORRECT = "CORRECT",
    WRONG_POSITION = "WRONG_POSITION",
    INCORRECT = "INCORRECT",
    UNKNOWN = "UNKNOWN"
  }

export class Guess {

    private word: string
    private guessTypes: Map<number, GuessType>

    constructor(word: string, guessTypes: Map<number, GuessType>) {
        this.word = word
        this.guessTypes = guessTypes
    }

    getWord() {
        return this.word
    }

    getGuessTypes() {
        return this.guessTypes
    }

}
