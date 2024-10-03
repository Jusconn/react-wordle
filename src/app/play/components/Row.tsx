export type RowProps = {
    isGuessed: boolean;
    guess: string;
    word: string;
};

export function Row({isGuessed, guess, word}: RowProps) {
    return (<>
    <div className="grid grid-cols-5 gap-2 mb-2">
        {new Array(5).fill(0).map((_, i) => {
            const bg =  !isGuessed ? "bg-black" : guess[i] === word[i] ? "bg-green-400" : word.includes(guess[i]) ? "bg-yellow-400" : "bg-black";
            return (
                <div key={i} className={`h-16 w-16 border border-gray-400 ${bg} font-bold uppercase text-white flex items-center justify-center`}>
                    {guess[i]}
                </div>
            )
        })}
    </div>
    </>)
}