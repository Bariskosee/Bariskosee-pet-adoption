import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import PetCard from "@/components/PetCard";
import { favoritesApi } from "@/api";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, PawPrint } from "lucide-react";

const FavoritesPage = () => {
  const { data: favorites, isLoading, refetch } = useQuery({
    queryKey: ['/api/favorites'],
    queryFn: favoritesApi.getUserFavorites,
  });

  return (
    <Layout>
      <div className="p-6">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              My Favorites
            </h2>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow">
                <Skeleton className="w-full h-48" />
                <div className="p-4">
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="flex space-x-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : favorites && favorites.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((favorite) => (
              <PetCard
                key={favorite.id}
                pet={favorite.pet!}
                isFavorite={true}
                refetch={refetch}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <Heart className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No favorites yet</h3>
            <p className="mt-1 text-gray-500">
              Start adding pets to your favorites to see them here.
            </p>
            <div className="mt-6">
              <Link href="/pets">
                <Button>
                  <PawPrint className="mr-2 h-4 w-4" />
                  Browse Pets
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FavoritesPage;
