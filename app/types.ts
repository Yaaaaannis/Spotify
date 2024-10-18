export interface Track {
    id: string;
    name: string;
    external_urls: {
        spotify: string;
    };
}

export interface Artist {
    id: string;
    name: string;
    images: { url: string }[];
    genres: string[];
    external_urls: {
        spotify: string;
    };
}
