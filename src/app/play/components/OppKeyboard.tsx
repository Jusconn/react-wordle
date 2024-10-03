import OnlineGameStore from "../../../stores/OnlineGameStore";
import { observer } from "mobx-react-lite";
import BackspaceIcon from '@mui/icons-material/Backspace';

export default observer(function OppKeyboard({ store }: { store: typeof OnlineGameStore }) {
  const keys = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];


  return (
    <div>
      {keys.map((row, i) => (
        <div key={i} className="flex justify-center">
          {i === 2 ? <button className="px-6 m-px flex h-10 w-10 items-center justify-center rounded-md bg-gray-500">Enter</button> : null}
          {
          row.split('').map((char, j) => {
            const bgcolor = store.oppExactGuesses.includes(char)
              ? "bg-right"
              : store.oppInexactGuesses.includes(char)
              ? "bg-wrong"
              : store.oppAllGuesses.includes(char)
              ? "bg-empty"
              : "bg-gray-500";
            return (
              <button
                key={j}
                className={`m-px flex h-10 w-10 items-center justify-center rounded-md ${bgcolor}`}
              >
                {char}
              </button>
            );
          })}
          {i === 2 ? <button className="m-px flex h-10 w-10 items-center justify-center rounded-md bg-gray-500"><BackspaceIcon/></button> : null}
        </div>
      ))}
    </div>
  );
});