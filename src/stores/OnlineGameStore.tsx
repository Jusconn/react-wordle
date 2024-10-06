import { makeAutoObservable, action, runInAction } from 'mobx';
import socket from '../socket-client'
import words from '../words.json';

class OnlineGameStore {
    word = '';
    nextWord = '';
    oppWord = '';
    oppNextWord = '';
    roomCode = '';
    name = '';
    oppName = 'Waiting...';
    guesses = [] as string[];
    oppGuesses = [] as string[];
    currGuess = 0;
    oppCurrGuess = 0;
    playAgain = -1;
    oppPlayAgain = -1;
    constructor() {
        makeAutoObservable(this,{
            init: action,
            handleKeyUp: action,
            submitGuess: action
        });
    }

    get winner() {
        if(this.currGuess > this.oppCurrGuess) {
            return `${this.oppName} Wins!`;
        }
        else if(this.currGuess < this.oppCurrGuess) {
            return 'You Win!';
        }
        else {
            return "It's A Tie";
        }
    }
    get win() {
        return this.word === this.guesses[this.currGuess - 1];
    }

    get lost() {
        return this.currGuess === 6;
    }

    get oppWin() {
        return this.oppWord === this.oppGuesses[this.oppCurrGuess - 1];
    }
    get oppLost() {
        return this.oppCurrGuess === 6;
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
      get oppAllGuesses() {
        return this.oppGuesses.slice(0, this.oppCurrGuess).join('').split('')
      }

    get oppExactGuesses() {
        return (
          this.oppWord
            .split('')
            .filter((letter, i) => {
              return this.oppGuesses
                .slice(0, this.oppCurrGuess)
                .map((word) => word[i])
                .includes(letter)
            })
        )
      }
      
      get oppInexactGuesses() {
        return this.oppWord
          .split('')
          .filter((letter) => this.oppAllGuesses.includes(letter))
      }
    
      selectPlayAgain(choice: number) {
        runInAction(() => {
            this.playAgain = choice;
        });
        socket.emit('againSelection', this.roomCode, choice, this.oppNextWord);
      }

    init(roomCode: string, host: number) {
        socket.emit('checkRoom', roomCode,socket.id);
        console.log('Checking room');
        socket.on('2players', () => {
            console.log('2 players in room');
            socket.emit('getPlayerData', roomCode);
        });
        socket.on('playerData', (users:string[],secretWords:string[]) => {
            console.log('Player data received', users, secretWords);
            runInAction(() => {
                this.roomCode = roomCode
                this.oppName = users[host];
                this.name = users[host == 1 ? 0 : 1];
                this.word = secretWords[host];

                if (host == 0) {
                    this.oppWord = secretWords[1];
                }
                else {
                    this.oppWord = secretWords[0];
                }
                this.oppGuesses = new Array(6).fill('');
                this.guesses = new Array(6).fill('');
                this.currGuess = 0;
                this.oppCurrGuess = 0;
            });
        });

        socket.on('opponentGuess', (guess) => {
            console.log('Opponent guessed', guess);
            console.log(socket.id);
            runInAction(() => {
                this.oppGuesses[this.oppCurrGuess] = guess;
                this.oppCurrGuess += 1;
            });
        });

        socket.on('opponentAgainSelection', (choice,oppWord) => {
            runInAction(() => {
                this.oppPlayAgain = choice;
                this.nextWord = oppWord;
            });
            if(this.playAgain === 1 && this.oppPlayAgain === 1) {
            socket.emit('playAgain', this.roomCode, this.oppWord);
            }
        });

        socket.on('playAgain', () => {
            runInAction(() => {
                this.oppGuesses = new Array(6).fill('');
                this.guesses = new Array(6).fill('');
                this.currGuess = 0;
                this.oppCurrGuess = 0;
                this.playAgain = -1;
                this.oppPlayAgain = -1;
                this.word = this.nextWord;
                this.oppWord = this.oppNextWord;
            });
        });

        return () => {
            socket.off('2players');
            socket.off('playerData');
            socket.off('opponentGuess');
            socket.off('opponentAgainSelection');
            socket.off('playAgain');
        }
    }

    submitGuess() {
        if (words.includes(this.guesses[this.currGuess])) {
            socket.emit('guess', this.guesses[this.currGuess], this.roomCode);
            runInAction(() => {
                this.currGuess += 1;
            });
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
            runInAction(() => {
                this.guesses[this.currGuess] = this.guesses[this.currGuess].slice(0, this.guesses[this.currGuess].length - 1);
            });
            return;
        }
        if (this.guesses[this.currGuess].length < 5 && e.key.match(/[A-z]/)) {
            runInAction(() => {
                this.guesses[this.currGuess] = this.guesses[this.currGuess] + e.key.toLowerCase();
            });
            console.log(this.guesses);
        }
    }
}

const onlineGameStore = new OnlineGameStore();
export default onlineGameStore;