import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import { adoptionsApi } from "@/api";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { formatDistance } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Home, PawPrint } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Adoption } from "@/types";

const AdoptionsPage = () => {
  const { data: adoptions, isLoading } = useQuery({
    queryKey: ['/api/adoptions'],
    queryFn: adoptionsApi.getUserAdoptions,
  });

  const getAdoptionDate = (adoption: Adoption) => {
    try {
      const date = new Date(adoption.adoptedAt);
      return `${date.toLocaleDateString()} (${formatDistance(date, new Date(), { addSuffix: true })})`;
    } catch (error) {
      return "Unknown date";
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              My Adoptions
            </h2>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {[...Array(3)].map((_, i) => (
                <li key={i} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="ml-4 flex-1">
                      <Skeleton className="h-5 w-40 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : adoptions && adoptions.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {adoptions.map((adoption) => (
                <li key={adoption.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                          <AvatarImage 
                            src={adoption.pet?.imageUrl || `https://source.unsplash.com/random/100x100/?${adoption.pet?.type.toLowerCase()}`} 
                            alt={adoption.pet?.name || "Pet"} 
                          />
                          <AvatarFallback>{adoption.pet?.name?.charAt(0) || "P"}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {adoption.pet?.name || "Unknown Pet"}
                          </div>
                          <div className="text-sm text-gray-500">
                            {adoption.pet?.type} {adoption.pet?.breed ? `• ${adoption.pet?.breed}` : ""}
                            {adoption.pet?.age ? ` • ${adoption.pet?.age} ${adoption.pet?.age === 1 ? "year" : "years"} old` : ""}
                          </div>
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Adoption Complete
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <div className="flex items-center text-sm text-gray-500">
                          <Home className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <p>
                            Adopted on {getAdoptionDate(adoption)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <Button variant="link" className="p-0 h-auto text-primary-600 hover:text-primary-500">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <Home className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No adoptions yet</h3>
            <p className="mt-1 text-gray-500">
              When you adopt a pet, it will appear here.
            </p>
            <div className="mt-6">
              <Link href="/pets">
                <Button>
                  <PawPrint className="mr-2 h-4 w-4" />
                  Browse Pets for Adoption
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdoptionsPage;
