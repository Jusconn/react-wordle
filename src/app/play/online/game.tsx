'use client';
import { observer } from "mobx-react-lite";
import { Suspense, use, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Stack } from "@mui/material";
import { Row } from ".././components/Row";
import Keyboard from ".././components/Keyboard";
import OppKeyboard from "../components/OppKeyboard";
import ModalGameOver from "../components/ModalGameOver";
import OnlineGameStore from "../../../stores/OnlineGameStore";

export default observer(function Game() {
  const searchParams = useSearchParams();
  const roomCode = searchParams.get('roomCode');
  const userName = searchParams.get('userName');
  const host = searchParams.get('host');
  const [openModal,setOpenModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if(OnlineGameStore.playAgain === 0){
        router.push('/');
    }
    // disabled because mobX store is observable
    //eslint-disable-next-line react-hooks/exhaustive-deps
  },[OnlineGameStore.playAgain,router]);
  useEffect(() => {
    OnlineGameStore.init(roomCode!,host! as unknown as number);
    console.log('Game mounted');
    window.addEventListener('keyup', OnlineGameStore.handleKeyUp);
    return () => window.removeEventListener('keyup', OnlineGameStore.handleKeyUp);
  },[host,roomCode]);

  useEffect(() => {
    if ((OnlineGameStore.win || OnlineGameStore.lost) && (OnlineGameStore.oppWin || OnlineGameStore.oppLost)) {
      setOpenModal(true);
    }
    if(OnlineGameStore.playAgain === 1 && OnlineGameStore.oppPlayAgain === 1) {
      setOpenModal(false);
    }
    // disabled because mobX store is observable
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [OnlineGameStore.win, OnlineGameStore.lost, OnlineGameStore.oppWin, OnlineGameStore.oppLost, OnlineGameStore.playAgain, OnlineGameStore.oppPlayAgain]);
  return (
    <Stack sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} direction="row" spacing={2}>
      {/* player1 board */}
      <div className="flex flex-col items-center justify-center h-screen w-screen">
      <h1 className="text-6xl font-bold uppercase">{userName}</h1>
      {OnlineGameStore.guesses.map((_, i) => (
        <Row 
        key={`row-${i+1}`}
        word={OnlineGameStore.word} 
        guess={OnlineGameStore.guesses[i]}
        isGuessed={i < OnlineGameStore.currGuess} />
      ))}
      {OnlineGameStore.win && <h1 className="text-4xl font-bold uppercase text-green-400">You Guessed It In {OnlineGameStore.currGuess}!</h1>}
      {OnlineGameStore.lost && <h1 className="text-4xl font-bold uppercase text-red-400">Sorry! The Word Was {OnlineGameStore.word}!</h1>}
      <Keyboard store={OnlineGameStore} />
    </div>
    <Stack direction="column" alignItems='center' justifyContent='center' spacing={1}>
        <h1 className="text-6xl font-bold uppercase">VS</h1>
        <h6 className="text-xs font-bold uppercase">Room Code:</h6>
        <h6 className="text-xs font-bold uppercase tracking-widest">{roomCode}</h6>
    </Stack>
    {/* player2 board */}
    <div className="flex flex-col items-center justify-center h-screen w-screen">
      <h1 className="text-6xl font-bold uppercase">{OnlineGameStore.oppName}</h1>
      {OnlineGameStore.oppGuesses.map((_, i) => (
        <Row 
        key={`row-${i+1}`}
        word={OnlineGameStore.oppWord} 
        guess={OnlineGameStore.oppGuesses[i]}
        isGuessed={i < OnlineGameStore.oppCurrGuess} />
      ))}
      {OnlineGameStore.oppWin && <h1 className="text-4xl font-bold uppercase text-green-400">Guessed It In {OnlineGameStore.oppCurrGuess}!</h1>}
      {OnlineGameStore.oppLost && <h1 className="text-4xl font-bold uppercase text-red-400">{"Couldn't Guess It!"}</h1>}
      <OppKeyboard store={OnlineGameStore} />
    </div>
    <ModalGameOver open={openModal} />
    </Stack>
  );
});