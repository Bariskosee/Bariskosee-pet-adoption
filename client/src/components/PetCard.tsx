import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Pet } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { favoritesApi, adoptionsApi } from "@/api";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface PetCardProps {
  pet: Pet;
  isFavorite?: boolean;
  isAdopted?: boolean;
  refetch?: () => void;
}

const PetCard = ({ pet, isFavorite = false, isAdopted = false, refetch }: PetCardProps) => {
  const [confirmAdopt, setConfirmAdopt] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Default image if none provided
  const petImage = pet.imageUrl || `https://source.unsplash.com/random/400x300/?${pet.type.toLowerCase()}`;

  // Add to favorites mutation
  const addToFavoritesMutation = useMutation({
    mutationFn: favoritesApi.addToFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      queryClient.invalidateQueries({ queryKey: ['/api/pets'] });
      toast({
        title: "Added to favorites",
        description: `${pet.name} has been added to your favorites.`,
      });
      if (refetch) refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add to favorites. Try again later.",
        variant: "destructive",
      });
    },
  });

  // Remove from favorites mutation
  const removeFromFavoritesMutation = useMutation({
    mutationFn: favoritesApi.removeFromFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      queryClient.invalidateQueries({ queryKey: ['/api/pets'] });
      toast({
        title: "Removed from favorites",
        description: `${pet.name} has been removed from your favorites.`,
      });
      if (refetch) refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to remove from favorites. Try again later.",
        variant: "destructive",
      });
    },
  });

  // Create adoption mutation
  const adoptMutation = useMutation({
    mutationFn: adoptionsApi.createAdoption,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/adoptions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/pets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      toast({
        title: "Adoption successful!",
        description: `You've successfully adopted ${pet.name}!`,
      });
      if (refetch) refetch();
    },
    onError: (error) => {
      toast({
        title: "Adoption failed",
        description: "This pet may have already been adopted by someone else.",
        variant: "destructive",
      });
    },
  });

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFromFavoritesMutation.mutate(pet.id);
    } else {
      addToFavoritesMutation.mutate(pet.id);
    }
  };

  const handleAdoptConfirm = () => {
    adoptMutation.mutate(pet.id);
    setConfirmAdopt(false);
  };

  return (
    <>
      <Card className="overflow-hidden shadow hover:shadow-lg transition-shadow">
        <img
          src={petImage}
          alt={`${pet.type} named ${pet.name}`}
          className="w-full h-48 object-cover"
        />
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-900">{pet.name}</h3>
            <button
              onClick={handleFavoriteToggle}
              className={`focus:outline-none ${
                isFavorite ? "text-red-500" : "text-gray-400 hover:text-red-500"
              }`}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              disabled={isAdopted || addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending}
            >
              <Heart className={isFavorite ? "fill-current" : ""} />
            </button>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {pet.type} {pet.breed ? `• ${pet.breed}` : ""}
            {pet.age ? ` • ${pet.age} ${pet.age === 1 ? "year" : "years"} old` : ""}
          </p>
          <div className="mt-4 flex space-x-3">
            <Button 
              variant="default" 
              className="flex-1"
              disabled={adoptMutation.isPending}
            >
              View Details
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setConfirmAdopt(true)}
              disabled={isAdopted || adoptMutation.isPending}
            >
              {isAdopted ? "Adopted" : "Adopt"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Adoption Confirmation Dialog */}
      <Dialog open={confirmAdopt} onOpenChange={setConfirmAdopt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Adoption</DialogTitle>
            <DialogDescription>
              Are you sure you want to adopt {pet.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAdopt(false)}>Cancel</Button>
            <Button onClick={handleAdoptConfirm} disabled={adoptMutation.isPending}>
              {adoptMutation.isPending ? "Processing..." : "Confirm Adoption"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PetCard;
