import Image from 'next/image';
import { Artist, Track } from '@/app/types'; // Create this types file

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";



interface ModalProps {
    artist: Artist;
    onClose: () => void;
    topTracks: Track[];
}

export default function Modal({ artist, onClose, topTracks }: ModalProps) {
    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{artist.name}</DialogTitle>
                    <DialogDescription>
                        Genres: {artist.genres.join(', ')}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center justify-center">
                        <Image
                            src={artist.images[0].url}
                            alt={artist.name}
                            width={200}
                            height={200}
                            className="rounded-lg"
                        />
                    </div>

                </div>
                <DialogFooter>
                    <Button asChild>
                        <a
                            href={artist.external_urls.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Listen on Spotify
                        </a>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
