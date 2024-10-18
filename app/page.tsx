"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header'; // Fix: Change the import statement to '@/components/header'
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Modal from '@/components/Modal'; // Create this component

import useTopArtists from '@/hooks/useTopArtists';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
import { Artist, Track } from '@/app/types';

export default function Homepage() {
  const router = useRouter();
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  // const REDIRECT_URL = "http://localhost:3000/";
  // const REDIRECT_URL = "https://yanniszzzz.netlify.app/";
  // const REDIRECT_URL = "https://audioatlas.netlify.app/";
  const SCOPE = [
    'user-top-read',
    'user-read-recently-played',
    'user-read-playback-state',
    'user-read-currently-playing',
    'user-read-private',
  ].join(' ');

  const [token, setToken] = useState("");
  const [userName, setUserName] = useState("");
  const [timeRange, setTimeRange] = useState<string>('short_term');
  const [limit, setLimit] = useState<number>(20);  // Démarre avec 20 artistes par défaut
  const [topTracks, setTopTracks] = useState<Track[]>([]); // Nouvel état pour les top tracks
  const [randomArtist, setRandomArtist] = useState<Artist | null>(null); // Nouvel état pour l'artiste aléatoire
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const { topArtists, isLoading, error } = useTopArtists(token, timeRange, limit);

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

  useEffect(() => {
    if (token) {
      fetch("https://api.spotify.com/v1/me", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(data => {
          setUserName(data.display_name || ""); // Récupérer le nom d'utilisateur et le stocker
        })
        .catch(err => console.error(err));
    }
  }, [token]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Mélanger les artistes avant de les afficher
  const shuffledArtists = shuffleArray([...topArtists]);
  useEffect(() => {
    if (topArtists.length > 0) {
      const shuffledArtists = [...topArtists];
      const randomArtist = shuffledArtists[Math.floor(Math.random() * shuffledArtists.length)];
      setRandomArtist({ ...randomArtist, genres: randomArtist.genres || [] });
    }
  }, [topArtists]);
  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    window.location.reload();
  };
  useEffect(() => {
    if (randomArtist && token) {
      fetch(`https://api.spotify.com/v1/artists/${randomArtist.id}/top-tracks?market=FR`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(data => {
          setTopTracks(data.tracks.slice(0, 3)); // Prendre seulement les 3 premiers tracks
        })
        .catch(err => console.error(err));
    }
  }, [randomArtist, token]);

  const handleArtistClick = (artist: Artist) => {
    setSelectedArtist(artist);
    // Fetch top tracks for the selected artist here
  };

  return (
    <div className='overflow-hidden bg-gray-60'>
      <header>
        <Header />
      </header>
      <main className='mt-28'>
        {/* Error handling */}
        {error && <div className="text-red-500 text-center mb-4">Error: {error}</div>}

        {/* Hero Section */}
        {randomArtist && (
          <section className="flex mx-[20%] justify-between h-[50vh] bg-gray-300  p-8 rounded-lg shadow-lg w-[60%] ">
            <div className="relative w-1/2 h-full ">
              {randomArtist.images.length > 0 && (
                <Image
                  src={randomArtist.images[0].url}
                  alt={randomArtist.name}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                  className="rounded-lg"
                />
              )}
            </div>
            <div className="w-1/2 h-full flex flex-col justify-center px-8">
              <h1 className="text-4xl font-bold text-black mb-4">{randomArtist.name}</h1>
              <p className="text-md text-black mb-4">Genres: {randomArtist.genres.join(', ')}</p>
              <a
                href={randomArtist.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                Listen on Spotify
              </a>
              {/* Top Tracks Section */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">Top Tracks</h2>
                <ul>
                  {topTracks.map((track: Track, index) => (
                    <li key={track.id} className="text-lg text-black mb-2">
                      <a
                        href={track.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className=" hover:text-green-500"
                      >
                        {index + 1}. {track.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </section>
        )}
        <div className='p-24'>
          <h2 className='text-xl '>
            Artists you like
          </h2>
        </div>
        <div className="flex justify-center mx-auto max-w-[70%] overflow-hidden">
          <Splide
            options={{
              type: "loop",
              drag: "free",
              arrows: false,
              pagination: false,
              perPage: 16,
              autoScroll: {
                pauseOnHover: false,
                pauseOnFocus: false,
                interval: 0,
                speed: 0.8,
              },
              breakpoints: {
                480: {
                  perPage: 2,
                  gap: '3px'
                },
              }
            }}
            extensions={{ AutoScroll }}>
            {shuffledArtists.map((artist) => (
              <SplideSlide key={artist.id} onClick={() => handleArtistClick(artist)}>
                <div className="flex flex-col items-center">
                  {artist.images.length > 0 && (
                    <Image
                      src={artist.images[0].url}
                      alt={artist.name}
                      width={150}
                      height={150}
                      className="rounded-full"
                    />
                  )}
                  <h2 className="text-xl font-bold mt-2 text-center">{artist.name}</h2>
                </div>
              </SplideSlide>
            ))}
          </Splide>
        </div>

        {selectedArtist && (
          <Modal
            artist={selectedArtist}
            onClose={() => setSelectedArtist(null)}
            topTracks={topTracks}
          />
        )}
      </main>
    </div>
  );
}
