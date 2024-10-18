"use client"

import React, { useState } from 'react';
import useTopSongs from '@/hooks/useTopSongs';

import Header from '@/components/header';
import Image from 'next/image';
import { Button } from '@/components/ui/button';


const TopArtistsPage: React.FC = () => {
    const token = localStorage.getItem('token') || ''; // Récupérer le token de localStorage ou autre méthode d'authentification
    const [timeRange, setTimeRange] = useState<string>('short_term');
    const [limit, setLimit] = useState<number>(20);  // Démarre avec 20 artistes par défaut
    const { topSongs, isLoading, error } = useTopSongs(token, timeRange, limit);



    const handleTimeRangeChange = (range: string) => {
        setTimeRange(range);
    };

    return (
        <div className='bg-black text-white min-h-screen'>
            <Header />
            <Header />
            <div className='pt-20' >
                <h1 className="text-center text-3xl font-bold p-4">Top Songs</h1>
            </div>
            <div className='flex justify-center space-x-4 p-4'>
                <Button className={`py-2 px-4 rounded-lg text-lg ${timeRange === 'short_term' ? 'bg-green-500' : 'bg-green-700 hover:bg-green-500'}`} onClick={() => handleTimeRangeChange('short_term')}>Last Month</Button>
                <Button className={`py-2 px-4 rounded-lg text-lg ${timeRange === 'medium_term' ? 'bg-green-500' : 'bg-green-700 hover:bg-green-500'}`} onClick={() => handleTimeRangeChange('medium_term')}>Last 6 Months</Button>
                <Button className={`py-2 px-4 rounded-lg text-lg ${timeRange === 'long_term' ? 'bg-green-500' : 'bg-green-700 hover:bg-green-500'}`} onClick={() => handleTimeRangeChange('long_term')}>All Time</Button>
            </div>
            {error && <p className="text-red-500 text-center">{error}</p>}
            {isLoading ? (
                <p className="text-center">Loading...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {topSongs.map((Songs, index) => (
                        <div key={Songs.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                            <h2 className="text-3xl font-bold">{index + 1}. {Songs.name}</h2>
                            <a href={Songs.external_urls.spotify} target="_blank" rel="noreferrer" className="text-green-400 hover:text-green-300">
                                Open in Spotify
                            </a>
                            {Songs.album.images.length > 0 && (
                                <Image src={Songs.album.images[0].url} alt={Songs.name} width={150} height={150} className=" mx-auto mt-4" />
                            )}
                        </div>
                    ))}


                </div>
            )}
        </div>
    );

};

export default TopArtistsPage;
