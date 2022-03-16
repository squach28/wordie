import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';
import { WordieService } from './wordie.service';
import { Guess, GuessType } from './guess.model';
import { MatDialog } from '@angular/material/dialog'
import { PopUpComponent } from './pop-up/pop-up.component';
import { HelpDialogComponent } from './help-dialog/help-dialog.component';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { GameState, GameStatus } from './game-state.model';
import { WinGameDialogComponent } from './win-game-dialog/win-game-dialog.component';
import { LoseGameDialogComponent } from './lose-game-dialog/lose-game-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('openClose', [
      state('true', style({ height: '*' })),
      state('false', style({ height: '0px' })),
      transition('false <=> true', animate(500))
    ]),
    trigger('expand', [
      state('true', style({

      })),

      state('false', style({
        border: '1px solid black'
      })),

      transition('false => true',
        animate('100ms', keyframes([
          style({ transform: "scale(1)", offset: 0 }),
          style({ transform: "scale(1.1)", offset: 0.3 }),
          style({ transform: "scale(1.2)", offset: 0.6 }),
          style({ transform: "scale(1)", offset: 1 }),

        ]))
      ),
    ]),

    trigger('flip', [
      state('true', style({})),
      state('false', style({})),
      transition('false => true',
        animate('500ms', keyframes([
          style({ transform: "rotateX(180deg)", offset: 0 }),
          style({ transform: "rotateX(0deg)", offset: 1 })


        ])))


    ])

  ]
})


export class AppComponent {
  currentGuess = '' // keeps track of the current guess
  guesses: Guess[] = [] // list of guesses the user has made 
  dialogRef?: MatDialog // allows dialogs to pop up 
  gameState: GameState = new GameState() // holds info about the current board and game state
  guessing: boolean = false 
  keyboardColors: any = {
    'a': null, 'b': null, 'c': null, 'd': null, 'e': null,
    'f': null, 'g': null, 'h': null, 'i': null, 'j': null,
    'k': null, 'l': null, 'm': null, 'n': null, 'o': null,
    'p': null, 'q': null, 'r': null, 's': null, 't': null,
    'u': null, 'v': null, 'w': null, 'x': null, 'y': null, 'z': null
  }

  constructor(private wordieService: WordieService, public dialog: MatDialog) {

  }

  ngOnInit(): void {
    let date = new Date()
    const today = `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`
    if (localStorage.getItem('gameState') != null) { // check if the user already started a game and local storage has info
      let previousState = JSON.parse(localStorage.getItem('gameState')!)
      if (previousState.date != today) { // check if the game state is outdated
        localStorage.removeItem('gameState')
      } else {
        // set the properties of game state
        this.gameState.setSolution(previousState.solution)
        this.gameState.setGameStatus(previousState.gameStatus)
        for (let i = 0; i < previousState.guesses.length; i++) {
          const guess = previousState.guesses[i]
          const guessTypes = previousState.gameGuessTypes[i]
          this.gameState.addGuess(guess)
          this.gameState.addGameGuessType(guessTypes)
        }
        // parse the guesses in localstorage and push it into app component's guesses
        for (let i = 0; i < this.gameState.getGuesses().length; i++) {
          const word = this.gameState.getGuesses()[i]
          const guessTypes = this.gameState.getGuessTypes()[i]
          const mapping = new Map<number, GuessType>()
          for (let i = 0; i < guessTypes.length; i++) {
            const index = guessTypes[i][0]
            const previousGuessType = guessTypes[i][1]
            var guessType = GuessType.UNKNOWN
            switch (previousGuessType) {
              case "CORRECT":
                guessType = GuessType.CORRECT
                break
              case "WRONG_POSITION":
                guessType = GuessType.WRONG_POSITION
                break
              case "INCORRECT":
                guessType = GuessType.INCORRECT
                break

            }
            mapping.set(index, guessType)
          }
          const guess = new Guess(word, mapping)
          this.guesses.push(guess)
        }
        // set keyboard colors 
        this.setKeyboardColors()
      }
    }
  }

  // listens for keyboard strokes if user is on computer
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(this.gameState.getGameStatus() == GameStatus.WIN || this.gameState.getGameStatus() == GameStatus.LOSE) {
      return
    } else if (event.key == 'Backspace') {
      this.deleteLetter()
      return
    } else if (event.key == 'Enter') {
      this.guess()
      return
    } else if (event.key.length == 1 && event.key >= 'a' && event.key <= 'z') {
      this.onKeyPress(event.key)
      return
    } else if (event.key.length == 1 && event.key >= 'A' && event.key <= 'Z') {
      this.onKeyPress(event.key)
      return
    } else {
      return
    }
  }

  // handles when the user inputs a key
  onKeyPress(char: String) {
    if (this.currentGuess.length < 0 || this.currentGuess.length + 1 > 6) { // check that length will fit
      return
    } else {
      this.currentGuess += char.toLowerCase()
    }

  }

  // removes a letter from the current guess
  deleteLetter() {
    if (this.currentGuess.length > 0) { // check that the length is at least 1 letter long
      this.currentGuess = this.currentGuess.substring(0, this.currentGuess.length - 1)
    }
  }

  // takes the guess and checks how accurate the guess is 
  calculateGuessResult(word: string, guess: string): Map<number, GuessType> {
    let guessTypeMapping = new Map<number, GuessType>()
    let charTracker = new Map<string, number>() // keeps track of the number of letters in the case of letter repeats
    for (let i = 0; i < word.length; i++) {
      let letter = word.charAt(i)
      if (charTracker.get(letter) == undefined) {
        charTracker.set(letter, 1)
      } else {
        charTracker.set(letter, charTracker.get(letter)! + 1)
      }
    }

    for(let i = 0; i < word.length; i++) {
      let letter = guess.charAt(i)
      if(word.charAt(i) == letter) {
        guessTypeMapping.set(i, GuessType.CORRECT)
        charTracker.set(letter, charTracker.get(letter)! - 1)
      }  
    }
    for (let i = 0; i < word.length; i++) {
      let letter = guess.charAt(i)
      if (word.includes(letter) && charTracker.get(letter)! > 0) {
        guessTypeMapping.set(i, GuessType.WRONG_POSITION)
        charTracker.set(letter, charTracker.get(letter)! - 1)
      } else if(guessTypeMapping.get(i) == GuessType.CORRECT) {
        
      } else {
        guessTypeMapping.set(i, GuessType.INCORRECT)
      }
    }
    return guessTypeMapping
  }

  // opens a dialog with a designated message
  openDialog(message: string): void {
    const timeout = 2000 // timeout for the dialog to disappear
    if (this.dialog.openDialogs.length == 0) {
      const dialogRef = this.dialog.open(PopUpComponent, {
        data: {
          message: message
        },
        width: "150px",
        height: "150px"
      })

      // make the dialog disappear automatically disappear after 2 seconds 
      dialogRef.afterOpened().subscribe(_ => {
        setTimeout(() => {
          dialogRef.close()
        }, timeout)
      })
    }

  }

  // sets the keyboard's colors 
  setKeyboardColors() {
    const guessTypeMapping = {
      'correct': 1,
      'wrongPosition': 0,
      'incorrect': -1
    }

    for (let guess of this.guesses) {
      let guessTypes = guess.getGuessTypes()
      let word = guess.getWord()
      guessTypes.forEach((value: GuessType, key: number) => {
        let button = document.getElementById(word.charAt(key))
        let letter = word.charAt(key)
        if(this.keyboardColors[letter] == null) {
          button!.style.background = this.getGuessTypeColor(value)
          switch(value) {
            case GuessType.CORRECT:
              this.keyboardColors[letter] = guessTypeMapping['correct']
              break
            case GuessType.WRONG_POSITION:
              this.keyboardColors[letter] = guessTypeMapping['wrongPosition']
              break
            case GuessType.INCORRECT:
              this.keyboardColors[letter] = guessTypeMapping['incorrect']
              break
            default:
              this.keyboardColors[letter] = null
              break
          }
        } else {
          var guessTypeValue: number = -5
          switch(value) {
            case GuessType.CORRECT:
              guessTypeValue = guessTypeMapping['correct']
              break
            case GuessType.WRONG_POSITION:
              guessTypeValue = guessTypeMapping['wrongPosition']
              break
            case GuessType.INCORRECT:
              guessTypeValue = guessTypeMapping['incorrect']
              break
          }
          if(this.keyboardColors[letter] < guessTypeValue) {
            button!.style.background = this.getGuessTypeColor(value)
            this.keyboardColors[letter] = guessTypeValue
          }
        }
      })
    }

  }

  // function that takes in a GuessType and returns the color that the keyboard should be set to
  getGuessTypeColor(guessType: GuessType): string {
    const defaultColor = ''
    const correctColor = 'rgb(117, 187, 117)'
    const wrongPositionColor = 'rgb(196, 196, 118)'
    const incorrectColor = 'gray'
    if(guessType == GuessType.CORRECT) {
      return correctColor
    } else if(guessType == GuessType.WRONG_POSITION) {
      return wrongPositionColor
    } else if(guessType == GuessType.INCORRECT) {
      return incorrectColor
    } else {
      return defaultColor
    }
  }


  guess() {
    if(this.guessing) {
      return 
    }
    else if (this.gameState.getGameStatus() == GameStatus.WIN) {
      this.presentResultDialog(true)
      this.guessing = false
    } else if (this.gameState.getGameStatus() == GameStatus.LOSE) {
      this.presentResultDialog(false)
      this.guessing = false
    } else if (this.currentGuess.length < 6) {
      const message = 'Guess must be 6 letters long'
      this.openDialog(message)
      this.guessing = false
    } else { // check with dictionary api if word exists 
      this.guessing = true 
      const gameState = localStorage.getItem('gameState')
      if (gameState == null) {
        this.wordieService.verifyWord(this.currentGuess).subscribe((result) => {
          let isValidWord = result["valid"]
          if (isValidWord) {
            this.wordieService.getTodaysWord().subscribe((value) => {
              let correctWord = value["word"]
              var mapping = this.calculateGuessResult(correctWord, this.currentGuess)
              var guess = new Guess(this.currentGuess, mapping)
              this.guesses.push(guess)

              if (this.currentGuess == correctWord) {
                this.setKeyboardColors()
                this.gameState.setGameStatus(GameStatus.WIN)
                this.gameState.addGuess(guess.getWord())
                this.gameState.addGameGuessType(Array.from(guess.getGuessTypes()))
                this.gameState.setSolution(value["word"])
                localStorage.setItem('gameState', JSON.stringify(this.gameState))
                this.currentGuess = ''
                this.presentResultDialog(true)
                this.guessing = false
                return
              }

              if (this.guesses.length == 6 && this.currentGuess != correctWord) {
                this.setKeyboardColors()
                this.gameState.setGameStatus(GameStatus.LOSE)
                this.gameState.addGuess(guess.getWord())
                this.gameState.addGameGuessType(Array.from(guess.getGuessTypes()))
                this.gameState.setSolution(value["word"])
                localStorage.setItem('gameState', JSON.stringify(this.gameState))
                this.currentGuess = ''
                this.presentResultDialog(false)
                this.guessing = false
                return 
              }

              this.setKeyboardColors()
              this.gameState.addGuess(guess.getWord())
              this.gameState.addGameGuessType(Array.from(guess.getGuessTypes()))
              this.gameState.setSolution(value["word"])
              localStorage.setItem('gameState', JSON.stringify(this.gameState))
              this.currentGuess = ''
              this.guessing = false
              return 
            })
          } else {
            const message = `${this.currentGuess} is not a valid word`
            this.openDialog(message)
            this.guessing = false
            return
          }
        })
      } else {
        const solution = this.gameState?.getSolution()
        this.wordieService.verifyWord(this.currentGuess).subscribe((result) => {
          let isValidWord = result["valid"]
          if (isValidWord) {
            var mapping = this.calculateGuessResult(solution!, this.currentGuess)
            var guess = new Guess(this.currentGuess, mapping)
            this.guesses.push(guess)

            if (this.currentGuess == solution!) {
              this.setKeyboardColors()
              this.gameState.setGameStatus(GameStatus.WIN)
              this.gameState.addGuess(guess.getWord())
              this.gameState.addGameGuessType(Array.from(guess.getGuessTypes()))
              localStorage.setItem('gameState', JSON.stringify(this.gameState))
              this.currentGuess = ''
              this.presentResultDialog(true)
              this.guessing = false
              return
            }

            if (this.guesses.length == 6 && this.currentGuess != solution!) {
              this.setKeyboardColors()
              this.gameState.setGameStatus(GameStatus.LOSE)
              this.gameState.addGuess(guess.getWord())
              this.gameState.addGameGuessType(Array.from(guess.getGuessTypes()))
              localStorage.setItem('gameState', JSON.stringify(this.gameState))
              this.currentGuess = ''
              this.presentResultDialog(false)
              this.guessing = false
              return
            }

            this.setKeyboardColors()
            this.gameState.addGuess(guess.getWord())
            this.gameState.addGameGuessType(Array.from(guess.getGuessTypes()))
            localStorage.setItem('gameState', JSON.stringify(this.gameState))
            this.currentGuess = ''
            this.guessing = false
            return
            
          } else {
            const message = `${this.currentGuess} is not a valid word`
            this.openDialog(message)
            this.guessing = false
            return 
          }
        })

      }



    }
  }

  presentHelpDialog() {
    if (this.dialog.openDialogs.length == 0) {
      const dialogRef = this.dialog.open(HelpDialogComponent, {
        maxWidth: "100%"
      })
    }
  }

  presentResultDialog(solved: boolean) {
    console.log(this.guesses)
    if (this.dialog.openDialogs.length == 0) {
      if(solved) {
        this.dialog.open(WinGameDialogComponent, {
          data: {
            guesses: this.guesses,
          }
        })
      } else {
        this.dialog.open(LoseGameDialogComponent, {
          data: {
            guesses: this.guesses,
          }
        })
      }
     
    }
  }
}
