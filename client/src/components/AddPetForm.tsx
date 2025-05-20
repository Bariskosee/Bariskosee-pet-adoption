import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PetFormData } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { petsApi } from "@/api";
import { useToast } from "@/hooks/use-toast";

interface AddPetFormProps {
  onSuccess?: () => void;
}

const petFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  breed: z.string().optional(),
  age: z.number().int().nonnegative().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url("Must be a valid URL").optional(),
});

const AddPetForm = ({ onSuccess }: AddPetFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PetFormData>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: "",
      type: "",
      breed: "",
      age: undefined,
      description: "",
      imageUrl: "",
    },
  });

  const createPetMutation = useMutation({
    mutationFn: petsApi.createPet,
    onSuccess: () => {
      toast({
        title: "Pet added",
        description: "Your pet has been added successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/pets'] });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add pet. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PetFormData) => {
    createPetMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Pet name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pet type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Dog">Dog</SelectItem>
                  <SelectItem value="Cat">Cat</SelectItem>
                  <SelectItem value="Rabbit">Rabbit</SelectItem>
                  <SelectItem value="Bird">Bird</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="breed"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Breed (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Breed" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age (years, optional)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  placeholder="Age in years" 
                  {...field}
                  onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about this pet" 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL (optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4 flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={() => onSuccess && onSuccess()}>
            Cancel
          </Button>
          <Button type="submit" disabled={createPetMutation.isPending}>
            {createPetMutation.isPending ? "Adding..." : "Add Pet"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddPetForm;
