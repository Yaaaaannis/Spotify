import { useState, useEffect, useCallback, use } from 'react';
import axios from 'axios';

// Define the artist type with required properties
type Songs = {
    id: string;
    name: string;
    album: {
        images: { url: string }[];  // Images are part of the album object
    };
    external_urls: { spotify: string };
    // include other properties of an artist here
};

// Define the return type of the hook
type UseTopSongResult = {
    topSongs: Songs[];
    isLoading: boolean;
    error: Error | null;
};

// Function to use top artists from Spotify
const useTopSongs = (token: string, timeRange: string = 'short_term', limit: number) => {
    const [topSongs, setTopSongs] = useState<Songs[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);



    const fetchTopSongs = useCallback(async () => {
        if (!token) {
            setError('No token provided.');
            setIsLoading(false);
            return;
        }

        try {
            const { data } = await axios.get(`https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTopSongs(data.items);
            setError(null);
        } catch (err) {
            setError('Failed to fetch top artists');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [token, timeRange, limit]);

    useEffect(() => {
        fetchTopSongs();
    }, [fetchTopSongs]);

    return { topSongs, isLoading, error, };
};

export default useTopSongs;