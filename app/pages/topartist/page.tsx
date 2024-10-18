"use client"

import React, { useState } from 'react';
import useTopArtists from '@/hooks/useTopArtists';
import Head from 'next/head';
import Header from '@/components/header';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"




const TopArtistsPage: React.FC = () => {
    const token = localStorage.getItem('token') || ''; // Récupérer le token de localStorage ou autre méthode d'authentification
    const [timeRange, setTimeRange] = useState<string>('short_term');
    const [limit, setLimit] = useState<number>(20);  // Démarre avec 20 artistes par défaut
    const { topArtists, isLoading, error } = useTopArtists(token, timeRange, limit);



    const handleTimeRangeChange = (range: string) => {
        setTimeRange(range);
    };

    const handleLimitChange = (value: number) => {
        setLimit(value);
    };

    return (
        <div className="bg-black text-white min-h-screen">
            <Header />
            <div className='pt-20' >
                <h1 className="text-center text-3xl font-bold p-4">Top Artists</h1>
            </div>
            <div className="flex justify-center space-x-4 p-4">
                <Button className={`py-2 px-4 rounded-lg text-lg ${timeRange === 'short_term' ? 'bg-green-500' : 'bg-green-700 hover:bg-green-500'}`} onClick={() => handleTimeRangeChange('short_term')}>Last Month</Button>
                <button className={`py-2 px-4 rounded-lg text-lg ${timeRange === 'medium_term' ? 'bg-green-500' : 'bg-green-700 hover:bg-green-500'}`} onClick={() => handleTimeRangeChange('medium_term')}>Last 6 Months</button>
                <button className={`py-2 px-4 rounded-lg text-lg ${timeRange === 'long_term' ? 'bg-green-500' : 'bg-green-700 hover:bg-green-500'}`} onClick={() => handleTimeRangeChange('long_term')}>All Time</button>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}
            {isLoading ? (
                <p className="text-center">Loading...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {topArtists.map((artist, index) => (
                        <div key={artist.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                            <h2 className="text-3xl font-bold">{index + 1}. {artist.name}</h2>
                            <a href={artist.external_urls.spotify} target="_blank" rel="noreferrer" className="text-green-400 hover:text-green-300">
                                Open in Spotify
                            </a>
                            {artist.images.length > 0 && (
                                <Image src={artist.images[0].url} alt={artist.name} width={150} height={150} className=" mx-auto mt-4" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TopArtistsPage;
