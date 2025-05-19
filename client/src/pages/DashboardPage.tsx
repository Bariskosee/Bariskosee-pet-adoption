import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import StatCard from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { petsApi, favoritesApi, adoptionsApi } from "@/api";
import { useAuth } from "@/hooks/useAuth";
import { PawPrint, Heart, Home } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const DashboardPage = () => {
  const { user } = useAuth();

  const { data: pets, isLoading: isPetsLoading } = useQuery({
    queryKey: ['/api/pets'],
    queryFn: petsApi.getAllPets,
  });

  const { data: favorites, isLoading: isFavoritesLoading } = useQuery({
    queryKey: ['/api/favorites'],
    queryFn: favoritesApi.getUserFavorites,
    enabled: !!user,
  });

  const { data: adoptions, isLoading: isAdoptionsLoading } = useQuery({
    queryKey: ['/api/adoptions'],
    queryFn: adoptionsApi.getUserAdoptions,
    enabled: !!user,
  });

  return (
    <Layout>
      <div className="p-6">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Dashboard
            </h2>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          {isPetsLoading ? (
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ) : (
            <StatCard
              title="Available Pets"
              value={pets?.length || 0}
              icon={<PawPrint className="h-5 w-5" />}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
              linkHref="/pets"
              linkText="View all pets"
            />
          )}

          {isFavoritesLoading ? (
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ) : (
            <StatCard
              title="Your Favorites"
              value={favorites?.length || 0}
              icon={<Heart className="h-5 w-5" />}
              iconBgColor="bg-red-100"
              iconColor="text-red-600"
              linkHref="/favorites"
              linkText="View favorites"
            />
          )}

          {isAdoptionsLoading ? (
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ) : (
            <StatCard
              title="Your Adoptions"
              value={adoptions?.length || 0}
              icon={<Home className="h-5 w-5" />}
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
              linkHref="/adoptions"
              linkText="View adoptions"
            />
          )}
        </div>

        {/* Recent Activity & Welcome */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to PetAdopt</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Find your perfect pet companion and provide a loving home to animals in need.
                Browse available pets, save your favorites, and complete adoptions all in one place.
              </p>
              <div className="mt-4 bg-blue-50 p-4 rounded-md">
                <h4 className="font-medium text-blue-800">Getting Started</h4>
                <ul className="mt-2 space-y-2 text-sm text-blue-700">
                  <li className="flex items-center">
                    <PawPrint className="h-4 w-4 mr-2" />
                    Browse pets and find your match
                  </li>
                  <li className="flex items-center">
                    <Heart className="h-4 w-4 mr-2" />
                    Save pets to your favorites list
                  </li>
                  <li className="flex items-center">
                    <Home className="h-4 w-4 mr-2" />
                    Complete the adoption process
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {isAdoptionsLoading || isFavoritesLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {adoptions && adoptions.length > 0 ? (
                    adoptions.slice(0, 3).map((adoption) => (
                      <div key={adoption.id} className="py-3 flex">
                        <div className="flex-shrink-0">
                          <Home className="h-5 w-5 text-green-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-900">
                            You adopted <span className="font-medium">{adoption.pet?.name || "a pet"}</span>
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(adoption.adoptedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : favorites && favorites.length > 0 ? (
                    favorites.slice(0, 3).map((favorite) => (
                      <div key={favorite.id} className="py-3 flex">
                        <div className="flex-shrink-0">
                          <Heart className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-900">
                            You favorited <span className="font-medium">{favorite.pet?.name || "a pet"}</span>
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 py-3">
                      No recent activity. Start by browsing pets!
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
