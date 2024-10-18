import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Define the artist type with required properties
type Artist = {
    id: string;
    name: string;
    images: { url: string }[];
    external_urls: { spotify: string };
    // include other properties of an artist here
};

// Define the return type of the hook
type UseTopArtistsResult = {
    topArtists: Artist[];
    isLoading: boolean;
    error: Error | null;
};

// Function to use top artists from Spotify
const useTopArtists = (token: string, timeRange: string = 'short_term', limit: number) => {
    const [topArtists, setTopArtists] = useState<Artist[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);



    const fetchTopArtists = useCallback(async () => {
        if (!token) {
            setError('No token provided.');
            setIsLoading(false);
            return;
        }

        try {
            const { data } = await axios.get(`https://api.spotify.com/v1/me/top/artists?time_range=${timeRange}&limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setTopArtists(data.items);
            setError(null);
        } catch (err) {
            setError('Failed to fetch top artists');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [token, timeRange, limit]);

    useEffect(() => {
        fetchTopArtists();
    }, [fetchTopArtists]);

    return { topArtists, isLoading, error, };
};

export default useTopArtists;