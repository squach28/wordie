import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Guess, GuessType } from '../guess.model';
import { WordieService } from '../wordie.service';


export interface DialogData {
  guesses: Guess[],
  solved: boolean,
  word: string,
  id: number
}

@Component({
  selector: 'app-result-dialog',
  templateUrl: './result-dialog.component.html',
  styleUrls: ['./result-dialog.component.css']
})
export class ResultDialogComponent implements OnInit {


  constructor(private wordieService: WordieService, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  result = ''
  solved = false
  todaysWord = ''
  
  ngOnInit(): void {
    this.wordieService.getTodaysWord().subscribe((value)=> {
      const todaysWord = value["word"]
      this.todaysWord = todaysWord
      this.solved = this.data.solved
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
