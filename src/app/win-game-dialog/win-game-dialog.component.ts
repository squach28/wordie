import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Guess, GuessType } from '../guess.model';
import { WordieService } from '../wordie.service';

export interface DialogData {
  guesses: Guess[],
  word: string,
  id: number
}

@Component({
  selector: 'app-win-game-dialog',
  templateUrl: './win-game-dialog.component.html',
  styleUrls: ['./win-game-dialog.component.css']
})
export class WinGameDialogComponent implements OnInit {

  result = ''
  todaysWord = ''

  constructor(private wordieService: WordieService, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  

  ngOnInit(): void {
    this.wordieService.getTodaysWord().subscribe((value)=> {
      const todaysWord = value["word"]
      this.todaysWord = todaysWord
      const numberOfGuesses = this.data.guesses.length == 6 ? 'x' : this.data.guesses.length
      this.result = `Wordie ${numberOfGuesses}/6` + "\n\n"
      for(let guess of this.data.guesses) {
        var emojiArr: string[] = ['', '', '', '', '', ''] // stores the result emojis of the guesss
        for(let guessTypeEntry of guess.getGuessTypes().entries()) {
          const index = guessTypeEntry[0]
          const guessType = guessTypeEntry[1]
          if(guessType == GuessType.CORRECT) {
            emojiArr[index] = '🟩 '
          } else if(guessType == GuessType.WRONG_POSITION) {
            emojiArr[index] = '🟨 '
          } else if(guessType == GuessType.INCORRECT) {
            emojiArr[index] = '⬛ '
          } else {
  
          }
        }

        this.result += emojiArr.join('') + "\n"
  
      }
  
    })

  }

  copy(element: any) {
    const copied = 'Copied!'
    element.textContent = copied

    setTimeout(() => {
      element.textContent = 'Copy'
    }, 2000)
  }

}
