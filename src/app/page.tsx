'use client';

import { useState } from 'react';
import { Stack, Button } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MultiplayerForm from './components/MultiplayerForm';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function Home() {
    const [showForm, setShowForm] = useState(false);
    const router = useRouter();

    function multiplayer() {
        setShowForm(true);
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen">
            <Stack sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} direction="column" spacing={2}>
                <h1 className="text-6xl font-bold uppercase">Juscon's Wordle Clone</h1>
                <Stack direction="row" spacing={2}>
                    {!showForm ? (
                        <Button>
                            <Link href="/play">
                                Solo
                            </Link>
                        </Button>
                    ) : null}
                    <Button onClick={multiplayer}>Multiplayer</Button>
                </Stack>
                {showForm ? <MultiplayerForm router={router} setShowForm={setShowForm} /> : null}
            </Stack>
            <div className="fixed bottom-0 right-0 p-2 text-gray-700">
                <Stack direction="column" spacing={2}>
                    <Link target="_blank" href="https://github.com/Jusconn"><GitHubIcon /> Jusconn</Link>
                    <Link target="_blank" href="https://www.linkedin.com/in/justin-chacon/"><LinkedInIcon /> Justin Chacon</Link>
                </Stack>
            </div>
        </div>
    );
}