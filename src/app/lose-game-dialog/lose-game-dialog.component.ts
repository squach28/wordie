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
  selector: 'app-lose-game-dialog',
  templateUrl: './lose-game-dialog.component.html',
  styleUrls: ['./lose-game-dialog.component.css']
})
export class LoseGameDialogComponent implements OnInit {

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
        var row = ''
        for(let guessTypeEntry of guess.getGuessTypes().entries()) {
          const guessType = guessTypeEntry[1]
          if(guessType == GuessType.CORRECT) {
            row += '🟩 '
          } else if(guessType == GuessType.WRONG_POSITION) {
            row += '🟨 ' 
          } else if(guessType == GuessType.INCORRECT) {
            row += '⬛ '
          } else {
  
          }
        }
        
        this.result += row + "\n"
  
      }
      console.log(this.result)
  
    })

  }

  copy(element: any) {
    const copied = 'Copied!'
    console.log(typeof(element))
    element.textContent = copied

    setTimeout(() => {
      element.textContent = 'Copy'
    }, 2000)
  }

}
