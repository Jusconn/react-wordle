import { Dispatch, SetStateAction, useState, useEffect, use } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Stack, Typography } from "@mui/material";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import socket from '../../socket-client';
import words from '../../words.json';

export default function MultiplayerForm({ router, setShowForm }: { router:AppRouterInstance, setShowForm: Dispatch<SetStateAction<boolean>> }) {
    const [page, setPage] = useState(0); // 0 = main, 1 = join, 2 = create
    const [error, setError] = useState(['']);

    useEffect(() => {
        // Handle server response for room creation or joining
        socket.on('roomCreated', (roomCode,userName) => {
            console.log(`Room created with code: ${roomCode}`);
            router.push(`/play/online?roomCode=${roomCode}&userName=${userName}&host=1`);
        });

        socket.on('roomJoined', (roomCode,userName) => {
            console.log(`Joined room with code: ${roomCode}`);
            router.push(`/play/online?roomCode=${roomCode}&userName=${userName}&host=0`);
        });

        socket.on('roomError', (error: string) => {
            console.error(`Error: ${error}`);
            setError([error]);
            // Handle error (e.g., show a message to the user)
        });

        return () => {
            socket.off('roomCreated');
            socket.off('roomJoined');
            socket.off('roomError');
        };
    }, [socket, router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(['']);
        const newErrors: string[] = [];
        const form = e.target as HTMLFormElement;
        const username = form.username.value;
        const secretWord = form.secretWord.value.toLowerCase();
        let roomCode = form.roomCode?.value ?? Math.random().toString(36).substring(2, 8);

        if(!words.includes(secretWord)) {newErrors.push('Secret word must be a valid 5 letter word');}
        if(username === '') {newErrors.push('Username cannot be empty');}
        if(username.length > 10) {newErrors.push('Username cannot be greater than 10 characters');}
        if(roomCode.length !== 6) {newErrors.push('Room code must be 6 characters long');}

        setError(newErrors);
        if (newErrors.length > 0) {
            return;
        }


        const data = [ roomCode, username, secretWord, socket.id ];
        console.log("Data to be sent:", JSON.stringify(data));

        if (page === 1) {
            // Join Room
            socket.emit('joinRoom', data);
        } else if (page === 2) {
            // Create Room
            socket.emit('createRoom', data);
        }
    };

    return (
        page === 0 ? (
            <div className="flex flex-col items-center justify-center">
                <IconButton onClick={() => { setShowForm(false); socket.disconnect(); }}>
                    <CloseIcon sx={{ color: "white" }} />
                </IconButton>
                <Stack direction="column" spacing={2}>
                    <button onClick={() => setPage(1)} className="bg-gray-500 hover:bg-wrong active:bg-right">Join Room</button>
                    <button onClick={() => setPage(2)} className="bg-gray-500 hover:bg-wrong active:bg-right">Create Room</button>
                </Stack>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center">
                <form className="flex flex-col items-start justify-center" onSubmit={handleSubmit}>
                    <IconButton onClick={() => setPage(0)}>
                        <ArrowBackIcon sx={{ color: "white" }} />
                    </IconButton>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="username" className="mr-2">
                            Your Name
                        </label>
                        <input type="text" name="username" id="username" className="black-text rounded-md" style={{ paddingLeft: '5px', color:'black' }} />
                    </div>
                    <div className="flex flex-col mb-4">
                        <label htmlFor="secretWord" className="mr-2">
                            Secret Word
                        </label>
                        <input type="text" name="secretWord" id="secretWord" className="black-text rounded-md" style={{ paddingLeft: '5px', color:'black' }} />
                    </div>
                    {page === 1 && (
                        <div className="flex flex-col mb-4">
                            <label htmlFor="roomCode" className="mr-2">
                                Room Code
                            </label>
                            <input type="text" name="roomCode" id="roomCode" className="black-text rounded-md" style={{ paddingLeft: '5px', color:'black' }} />
                        </div>
                    )}
                    <button type="submit" className="bg-gray-500 hover:red-300" style={{ alignSelf: 'center' }}>
                        {page === 1 ? "Join Room" : "Create Room"}
                    </button>
                </form>
                {error.map((err, i) => <Typography key={i} variant="body1" color="error">{err}</Typography>)}
            </div>
        )
    );
}