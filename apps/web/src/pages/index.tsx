import { useEffect } from "react";
import { useRouter } from "next/router";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useMovies, useFiltersMetadata } from "@/modules/movies/api/queries";
import { Filters } from "@/modules/movies/components";
import { FilterFormData, filterFormSchema } from "@/modules/movies/schema";

const filterFormDefaultValues: FilterFormData = {};

export default function Page() {
  const formMethods = useForm<FilterFormData>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: filterFormDefaultValues,
  });

  const { data: movies } = useMovies(formMethods.getValues());
  const { data: filtersMetadata } = useFiltersMetadata();

  const router = useRouter();

  const handleSubmit = async (data: FilterFormData) => {
    const { duration, ...restParams } = { ...router.query, ...data };
    // remove duration from query if it's undefined
    await router.replace({
      query: { ...restParams, ...(duration && { duration }) },
    });
  };

  // synchronize form state with query params on page enter
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const genres = searchParams.getAll("genres");
    const duration = searchParams.get("duration");

    if (genres) formMethods.setValue("genres", genres);
    if (duration) formMethods.setValue("duration", Number.parseInt(duration));
  }, []);

  useEffect(() => {
    const { unsubscribe } = formMethods.watch(() =>
      formMethods.handleSubmit(handleSubmit)()
    );
    return () => unsubscribe();
  }, [formMethods.watch]);

  return (
    <div>
      <FormProvider {...formMethods}>
        {filtersMetadata && (
          <Filters data={filtersMetadata} onReset={() => formMethods.reset()} />
        )}
      </FormProvider>

      {movies?.map((movie) => (
        <div key={movie.id}>
          <h1>
            {movie.title} - {movie.year}
          </h1>
          <object
            data={movie.posterUrl}
            type="image/jpg"
            style={{ width: 250 }}
          >
            <img
              style={{ width: 250 }}
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/800px-Question_mark_%28black%29.svg.png"
            />
          </object>
          <p>
            <b>{movie.director}</b> - {movie.genres.join(", ")}
          </p>
          <p>{movie.plot}</p>
        </div>
      ))}
    </div>
  );
}
