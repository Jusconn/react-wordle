import * as React from 'react';
import {useState} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { CircularProgress, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import words from '../../../words.json';
import OnlineGameStore from "../../../stores/OnlineGameStore";
import { observer } from "mobx-react-lite";

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#121213',
  border: '2px solid #222',
  boxShadow: 24,
  p: 4,
};

function AskPlayAgain(){
  const [prompt, setPrompt] = useState(0);
  const [error, setError] = useState('');
  return <>
  <Typography id="modal-modal-title" variant="h6" component="h2" sx={{mt:0.25, textAlign: 'center'}}>
            {prompt === 0 ? "Do you want to play again?" : prompt === 1 ? "Choose a New Secret Word" : ""}
          </Typography>
          <Box sx={{display:"flex", justifyContent: "center"}}>
            {prompt === 0 ? <>
              <Button onClick={() => {
            setPrompt(1);
          }
          } sx={{color:'green'}}>Yes</Button>
          <Button onClick={() => OnlineGameStore.selectPlayAgain(0)} sx={{color:'red'}}>No</Button></> 
          : prompt === 1 ? <>
          <form onSubmit={
            (e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              
              const target = e.target as typeof e.target & {
                elements: { secretWord: { value: string } };
              };
              const word = target.elements.secretWord.value.toLowerCase();
              if(!words.includes(word)) {
                setError('Secret word must be a valid 5 letter word');
                return;
              }

              OnlineGameStore.oppNextWord = word;
              OnlineGameStore.selectPlayAgain(1);
              setPrompt(2);

          }}>
            <TextField id="standard-basic" label="Secret Word" name="secretWord" sx={{label: {color:'grey'},input: {color:'white'}, 
            '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'white',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'white',
        },
          }}/>
            <Button type="submit" sx={{color:'green', mt:1}}>Submit</Button>
            <Typography sx={{color:'red'}}>{error}</Typography>
          </form>
          </> : <></>}
          </Box>
  </>}

export default observer (function ModalGameOver({open}: {open: boolean}) {
  return (
    <div>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h1 className="text-4xl font-bold uppercase text-green-400 text-center">{OnlineGameStore.winner}</h1>
            <AskPlayAgain key={open ? 'open' : 'closed'}/>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {OnlineGameStore.oppName} 
            {OnlineGameStore.oppPlayAgain === -1 ? <CircularProgress size={15}/> : OnlineGameStore.oppPlayAgain === 1 ? <CheckIcon sx={{color:'green'}}/> : <CloseIcon sx={{color:'red'}}/>}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 1 }}>
            {OnlineGameStore.name}
            {OnlineGameStore.playAgain === -1 ? <CircularProgress size={15}/> : OnlineGameStore.playAgain === 1 ? <CheckIcon sx={{color:'green'}}/> : <CloseIcon sx={{color:'red'}}/>}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
});