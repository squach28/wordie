import { Component, HostListener, ElementRef, ViewChild} from '@angular/core';
import { WordieService } from './wordie.service';
import { Guess, GuessType } from './guess.model';
import { MatDialog } from '@angular/material/dialog'
import { PopUpComponent } from './pop-up/pop-up.component';
import { HelpDialogComponent } from './help-dialog/help-dialog.component';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';

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
      transition('true => false',
      animate('5s', keyframes([
        style({ border: "1px solid black", offset: 0 }),
        style({ border: "2px solid black", offset: 0 }),
        style({ border: "3px solid black", offset: 0 }),
        style({ border: "1px solid black", offset: 0 }),

      ])))
    ])

  ]
})


export class AppComponent {
  currentGuess = '' // keeps track of the current guess
  guesses: Guess[] = []
  dialogRef?: MatDialog

  constructor(private wordieService: WordieService, public dialog: MatDialog) {

  }

  // listens for keyboard strokes if user is on computer
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if(event.key == 'Backspace') {
      this.deleteLetter()
      return 
    } else if(event.key == 'Enter') {
      this.guess()
    } else if(event.key.length == 1 && event.key >= 'a' && event.key <= 'z') {
      this.onKeyPress(event.key)
      return 
    } else if(event.key.length == 1 && event.key >= 'A' && event.key <= 'Z') {
      this.onKeyPress(event.key)
    }
  }

  // handles when the user inputs a key
  onKeyPress(char: String) {
    if(this.currentGuess.length < 0 || this.currentGuess.length + 1 > 6) { // check that length will fit
      return 
    } else {
      this.currentGuess += char.toLowerCase()
      console.log(this.guesses)
    }

  }

  // removes a letter from the current guess
  deleteLetter() {
    if(this.currentGuess.length > 0) { // check that the length is at least 1 letter long
      this.currentGuess = this.currentGuess.substring(0, this.currentGuess.length - 1)
    }
  }

  // takes the guess and checks how accurate the guess is 
  calculateGuessResult(word: string, guess: string): Map<number, GuessType> {
    let guessTypeMapping = new Map<number, GuessType>()
    let charTracker = new Map<string, number>() // keeps track of the number of letters in the case of letter repeats
    for(let i = 0; i < word.length; i++) {
      let letter = word.charAt(i)
      if(charTracker.get(letter) == undefined) {
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
      } else if(word.includes(letter) && charTracker.get(letter)! > 0) {
        guessTypeMapping.set(i, GuessType.WRONG_POSITION)
        charTracker.set(letter, charTracker.get(letter)! - 1)
      } else {
        guessTypeMapping.set(i, GuessType.INCORRECT)
      }
    }
    return guessTypeMapping
  }

  openDialog(message: string): void {
    const timeout = 2000
    if(this.dialog.openDialogs.length == 0) {
      const dialogRef = this.dialog.open(PopUpComponent, {
        data: {
          message: message
        },
        width: "150px",
        height: "150px"
      })
      
      
      
      dialogRef.afterOpened().subscribe(_ => {
        setTimeout(() => {
          dialogRef.close()
        }, timeout)
      })
    }

  }

  guess() {
    if(this.currentGuess.length < 6) {
      const message = 'Guess must be 6 letters long'
      this.openDialog(message)
    } else { // check with dictionary api if word exists 
      this.wordieService.verifyWord(this.currentGuess).subscribe((result) => {
        let isValidWord = result["valid"]
        if(isValidWord) {
          this.wordieService.getTodaysWord().subscribe((value) => {
            if(this.currentGuess != value) {
              let correctWord = value["word"]
              var mapping = this.calculateGuessResult(correctWord, this.currentGuess)
              var guess = new Guess(this.currentGuess, mapping)
              this.guesses.push(guess)
              for(let guess of this.guesses) {
                let guessTypes = guess.getGuessTypes()
                let word = guess.getWord()
                guessTypes.forEach((value: GuessType, key: number) => {
                  let button = document.getElementById(word.charAt(key))
                  if(value == GuessType.CORRECT) {
                    button!.style.background = 'rgb(117, 187, 117)'
                  } else if(value == GuessType.WRONG_POSITION) {
                    button!.style.background = 'rgb(196, 196, 118)'
                  } else if(value == GuessType.INCORRECT) {
                    button!.style.background = 'gray'
                    
                  }
                })
              }
              this.currentGuess = ''
            }
          })
        } else {
          const message = `${this.currentGuess} is not a valid word`
          this.openDialog(message)
        }
      })


    }
  }

  presentHelpDialog() {
    if(this.dialog.openDialogs.length == 0) {
       const dialogRef = this.dialog.open(HelpDialogComponent, {
         maxWidth: "100%"
       })
    }
  }
}
