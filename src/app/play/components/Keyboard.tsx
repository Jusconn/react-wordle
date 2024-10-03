import GameStore from "../../../stores/GameStore";
import OnlineGameStore from "../../../stores/OnlineGameStore";
import { observer } from "mobx-react-lite";
import BackspaceIcon from '@mui/icons-material/Backspace';

export default observer(function Keyboard({ store }: { store: typeof GameStore | typeof OnlineGameStore }) {
  const keys = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

  const handleKeyPress = (char: string) => {
    const event = new KeyboardEvent('keyup', { key: char });
    window.dispatchEvent(event);
  };

  return (
    <div>
      {keys.map((row, i) => (
        <div key={i} className="flex justify-center">
          {i === 2 ? <button onClick={() => handleKeyPress('Enter')} className="px-6 m-px flex h-10 w-10 items-center justify-center rounded-md bg-gray-500">Enter</button> : null}
          {
          row.split('').map((char, j) => {
            const bgcolor = store.exactGuesses.includes(char)
              ? "bg-right"
              : store.inexactGuesses.includes(char)
              ? "bg-wrong"
              : store.allGuesses.includes(char)
              ? "bg-empty"
              : "bg-gray-500";
            return (
              <button
                onClick={() => handleKeyPress(char)}
                key={j}
                className={`m-px flex h-10 w-10 items-center justify-center rounded-md ${bgcolor}`}
              >
                {char}
              </button>
            );
          })}
          {i === 2 ? <button onClick={() => handleKeyPress('Backspace')} className="m-px flex h-10 w-10 items-center justify-center rounded-md bg-gray-500"><BackspaceIcon/></button> : null}
        </div>
      ))}
    </div>
  );
});