"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Separator } from './ui/separator';


export default function Header() {
    const router = useRouter();
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const RESPONSE_TYPE = "token";
    // const REDIRECT_URL = "http://localhost:3000/";
    // const REDIRECT_URL = "https://yanniszzzz.netlify.app/";
    // const REDIRECT_URL = "https://audioatlas.netlify.app/";
    const SCOPE = [
        'user-top-read',
        'user-read-recently-played',
    ].join(' ');

    const [token, setToken] = useState("");



    useEffect(() => {
        const hash = window.location.hash;
        const tokenInLocalStorage = localStorage.getItem("token");

        if (!tokenInLocalStorage && hash) {
            const newToken = hash.substring(1).split("&").find(elem => elem.startsWith("access_token"))?.split("=")[1];

            window.location.hash = "";
            localStorage.setItem("token", newToken || "");
            setToken(newToken || ""); // Fix: Use conditional operator to check if newToken is defined
            router.push("/");
        } else {
            setToken(tokenInLocalStorage || ""); // Fix: Use conditional operator to check if tokenInLocalStorage is defined
        }
    }, [router]);

    const handleLogin = () => {
        const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
        const REDIRECT_URL = process.env.NEXT_PUBLIC_REDIRECT_URL;
        window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=${encodeURIComponent(SCOPE)}&response_type=${RESPONSE_TYPE}`;
    };

    const logout = () => {
        setToken("");
        localStorage.removeItem("token");
        router.push("/");
    };



    return (
        <header>
            <div className='top-0 left-0 right-0 h-[80px] flex items-center justify-between px-4 z-50 absolute md:px-6 lg:px-8  text-black'>
                <div className='flex items-center px-[10%] '>
                    <Button className='cursor-pointer mr-6 hover:text-black-500 rounded-3xl text-xl' onClick={() => router.push('/')}>MyMusicTops</Button>
                    {token &&
                        <div className='flex items-center'>
                            <Button className='   cursor-pointer mr-6 hover:text-black-500 rounded-3xl text-xl ' onClick={() => router.push('/pages/topartist')}>Top Artists</Button>
                            <Button className='cursor-pointer mr-6 hover:text-black-500 rounded-3xl text-xl' onClick={() => router.push('/pages/topsong')}>Top Tracks</Button>
                            <Button className='cursor-pointer mr-6 hover:text-black-500 rounded-3xl text-xl' onClick={() => router.push('/random')}>Shuffle </Button>
                            <Button className='cursor-pointer mr-6 hover:text-black-500 rounded-3xl text-xl' onClick={() => router.push('/recently-played')}>Recently Played</Button>

                        </div>
                    }
                </div>

                {!token ?
                    <Button className='bg-green-500 text-black py-2 px-4 rounded hover:bg-green-600 text-xl' onClick={handleLogin}>Login to Spotify</Button>
                    : <Button onClick={logout} className='bg-green-500 text-black py-2 px-4 rounded hover:bg-green-600 text-xl'>Logout</Button>
                }

            </div>
        </header>

    );
};