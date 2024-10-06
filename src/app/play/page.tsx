'use client';
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Row } from "./components/Row";
import Keyboard from "./components/Keyboard";
import GameStore from "../../stores/GameStore";

export default observer(function Game() {
  useEffect(() => {
    GameStore.init();
    window.addEventListener('keyup', GameStore.handleKeyUp);
    return () => window.removeEventListener('keyup', GameStore.handleKeyUp);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <h1 className="text-6xl font-bold uppercase">{"Juscon's Wordle Clone"}</h1>
      {GameStore.guesses.map((_, i) => (
        <Row 
        key={`row-${i+1}`}
        word={GameStore.word} 
        guess={GameStore.guesses[i]}
        isGuessed={i < GameStore.currGuess} />
      ))}
      {GameStore.win && <h1 className="text-4xl font-bold uppercase text-green-400">You Win!</h1>}
      {GameStore.lost && <h1 className="text-4xl font-bold uppercase text-red-400">Sorry! the word was {GameStore.word}</h1>}
      <Keyboard store={GameStore} />
    </div>
  );
});