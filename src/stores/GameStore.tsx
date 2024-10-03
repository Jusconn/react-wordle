import { makeAutoObservable } from 'mobx';
import words from '../words.json';

class GameStore {
    word = '';
    guesses = [] as string[];
    currGuess = 0;

    constructor() {
        makeAutoObservable(this);
    }

    get win() {
        return this.word === this.guesses[this.currGuess - 1];
    }

    get lost() {
        return this.currGuess === 6;
    }
    get allGuesses() {
        return this.guesses.slice(0, this.currGuess).join('').split('')
      }

    get exactGuesses() {
        return (
          this.word
            .split('')
            .filter((letter, i) => {
              return this.guesses
                .slice(0, this.currGuess)
                .map((word) => word[i])
                .includes(letter)
            })
        )
      }
      
      get inexactGuesses() {
        return this.word
          .split('')
          .filter((letter) => this.allGuesses.includes(letter))
      }

    init() {
        this.word = words[Math.floor(Math.random() * words.length)];
        this.guesses = new Array(6).fill('');
        this.currGuess = 0;
    }

    submitGuess() {
        if (words.includes(this.guesses[this.currGuess])) {
            this.currGuess += 1;
        }
    }

    handleKeyUp = (e: KeyboardEvent) => {
        if (this.win || this.lost) {
            return;
        }
        if (e.key === 'Enter') {
            return this.submitGuess();
        }
        if (e.key === 'Backspace') {
            this.guesses[this.currGuess] = this.guesses[this.currGuess].slice(0, this.guesses[this.currGuess].length - 1);
            return;
        }
        if (this.guesses[this.currGuess].length < 5 && e.key.match(/[A-z]/)) {
            this.guesses[this.currGuess] = this.guesses[this.currGuess] + e.key.toLowerCase();
            console.log(this.guesses);
        }
    }
}

export default new GameStore();