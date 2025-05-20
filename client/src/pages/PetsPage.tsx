import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { petsApi, favoritesApi, adoptionsApi } from "@/api";
import Layout from "@/components/Layout";
import PetCard from "@/components/PetCard";
import AddPetForm from "@/components/AddPetForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pet } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus } from "lucide-react";

const PetsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showAddPetDialog, setShowAddPetDialog] = useState(false);

  const { data: pets, isLoading: isPetsLoading } = useQuery({
    queryKey: ['/api/pets'],
    queryFn: petsApi.getAllPets,
  });

  const { data: favorites, isLoading: isFavoritesLoading } = useQuery({
    queryKey: ['/api/favorites'],
    queryFn: favoritesApi.getUserFavorites,
  });

  const { data: adoptions, isLoading: isAdoptionsLoading } = useQuery({
    queryKey: ['/api/adoptions'],
    queryFn: adoptionsApi.getUserAdoptions,
  });

  const isLoading = isPetsLoading || isFavoritesLoading || isAdoptionsLoading;

  const handleAddPetSuccess = () => {
    setShowAddPetDialog(false);
  };

  // Filter and search pets
  const filteredPets = !pets
    ? []
    : pets.filter((pet) => {
        const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            (pet.breed && pet.breed.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesType = typeFilter === "all" || pet.type.toLowerCase() === typeFilter.toLowerCase();
        return matchesSearch && matchesType;
      });

  // Determine if pet is favorite or adopted
  const isPetFavorite = (petId: number) => {
    return favorites?.some(favorite => favorite.petId === petId) || false;
  };

  const isPetAdopted = (petId: number) => {
    return adoptions?.some(adoption => adoption.petId === petId) || false;
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Available Pets
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Button onClick={() => setShowAddPetDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Pet
            </Button>
          </div>
        </div>

        {/* Search and filters */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="md:flex space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search pets by name or breed"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Pets</SelectItem>
                  <SelectItem value="dog">Dogs</SelectItem>
                  <SelectItem value="cat">Cats</SelectItem>
                  <SelectItem value="rabbit">Rabbits</SelectItem>
                  <SelectItem value="bird">Birds</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Pet Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
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
        ) : filteredPets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <Search className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No pets found</h3>
            <p className="mt-1 text-gray-500">
              {searchQuery || typeFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "There are currently no pets available for adoption."}
            </p>
            {(searchQuery || typeFilter !== "all") && (
              <div className="mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setTypeFilter("all");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                isFavorite={isPetFavorite(pet.id)}
                isAdopted={isPetAdopted(pet.id)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Add Pet Dialog */}
      <Dialog open={showAddPetDialog} onOpenChange={setShowAddPetDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Pet</DialogTitle>
          </DialogHeader>
          <AddPetForm onSuccess={handleAddPetSuccess} />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default PetsPage;
