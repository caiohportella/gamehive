import Image from "next/image";
import Link from "next/link";

interface GameCardProps {
  id: number;
  name: string;
  coverImageId?: string;
  rating?: number;
}

export function GameCard({ id, name, coverImageId, rating }: GameCardProps) {
  return (
    <Link
      href={`/game/${id}`}
      className="group relative flex flex-col gap-2 rounded-lg transition-transform hover:scale-[1.02]"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md bg-secondary/20 border border-secondary/10">
        {coverImageId ? (
          <Image
            src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${coverImageId}.jpg`}
            alt={name}
            fill
            className="object-cover transition-all group-hover:brightness-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-secondary">
            No Cover
          </div>
        )}
        {rating && (
          <div className="absolute top-2 right-2 rounded bg-background/90 px-2 py-1 text-xs font-bold text-foreground backdrop-blur">
            {Math.round(rating)}
          </div>
        )}
      </div>
      <h3 className="text-sm font-semibold text-foreground line-clamp-2">
        {name}
      </h3>
    </Link>
  );
}
