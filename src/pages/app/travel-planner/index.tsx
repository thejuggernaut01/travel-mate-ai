import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { cn } from '@/lib/utils';

import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { activities, budgetOptions, timeRatingOptions } from '@/data';
import { Input } from '@/components/ui/input';
import { useDebounceValue } from 'usehooks-ts';
import { useGetDestination } from '@/services/base.service';
import { IDestination } from '@/types';
import ReactLoading from 'react-loading';
import { ScrollArea } from '@/components/ui/scroll-area';
import { TravelPlannerSchema, TravelPlannerType } from './travel-planner.model';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import InputErrorWrapper from '@/components/custom/input-error-wrapper';
import { BaseHelper } from '@/utils';
import { generateRecommendations, supabase } from '@/utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { fetchCityHistoryGroq } from '@/hooks/fetchHistory';

const TravelPlanner = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    formState: { errors },
    handleSubmit,
    register,
    control,
    setValue,
    watch,
  } = useForm<TravelPlannerType>({
    resolver: zodResolver(TravelPlannerSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    criteriaMode: 'all',
  });

  const destination = watch('destination');

  const [debouncedDestinationValue] = useDebounceValue(destination, 500);
  const { data, isLoading } = useGetDestination(debouncedDestinationValue);

  const handleFormSubmit = async (formValues: TravelPlannerType) => {
    setIsSubmitting(true);
    try {
      const userInput = { query: formValues };
      const hash = await BaseHelper.generateHash(userInput);

      const { data } = await supabase
        .from('recommendations')
        .select('*')
        .eq('hash', hash)
        .single();

      if (data) {
        navigate(`/recommendation/${data.id}`);
      } else {
        // Generate new recommendations
        const recommendations = await generateRecommendations(userInput);

        const city = userInput.query.destination.split(',')[0];
        const history = await fetchCityHistoryGroq(city);

        // Save new recommendation to the database
        const { data: newRecord, error: insertError } = await supabase
          .from('recommendations')
          .insert([
            {
              hash,
              user_input: userInput,
              recommendations,
              history,
            },
          ])
          .select('id')
          .single();

        if (newRecord) {
          navigate(`/recommendation/${newRecord.id}`);
        } else {
          console.error('Error saving recommendation:', insertError);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="w-[85%] md:w-[700px] mx-auto mt-14 mb-28">
        <div className="space-y-16">
          <div className="space-y-1">
            <h1 className="text-3xl font-medium md:text-4xl">
              Your journey, your way
            </h1>
            <p className="text-sm text-gray-600 md:text-base">
              Share your interests, and our planner will map out a trip that’s
              uniquely yours
            </p>
          </div>

          <form
            className="space-y-12"
            onSubmit={handleSubmit(handleFormSubmit)}
          >
            <section className="space-y-4">
              <Label
                htmlFor="destination"
                className="text-xl font-medium sm:text-2xl text-[#1F2937]"
              >
                What is destination of choice?
              </Label>

              <div className="relative">
                <div>
                  <InputErrorWrapper error={errors.destination?.message}>
                    <Input
                      id="destination"
                      className="shadow-none"
                      placeholder="New York"
                      {...register('destination')}
                    />
                  </InputErrorWrapper>

                  {isLoading && (
                    <ReactLoading
                      type="spokes"
                      width={20}
                      height={20}
                      color="#9b9c9d"
                      className="absolute top-[35%] right-4 flex justify-end"
                    />
                  )}
                </div>

                {data?.destinationMetas &&
                  data?.destinationMetas.length > 0 && (
                    <Card className="mt-1 rounded-md shadow-lg">
                      <ScrollArea
                        className={cn(
                          'w-full border rounded-md',
                          data?.destinationMetas.length > 3 && 'h-72',
                        )}
                      >
                        <CardContent className="p-2">
                          <ul className="space-y-2">
                            {data?.destinationMetas?.map(
                              (data: IDestination) => {
                                const item = data?.cityMeta?.name
                                  ? `${data?.cityMeta?.name}, ${data?.stateMeta?.name}`
                                  : `${data?.stateMeta?.name}, ${data?.countryMeta?.name}`;
                                return (
                                  <li
                                    key={data?.id}
                                    className="p-2 rounded cursor-pointer hover:bg-gray-100"
                                    onClick={() =>
                                      setValue('destination', item)
                                    }
                                  >
                                    <div className="flex items-center gap-x-4">
                                      <p>{data?.countryMeta?.flagEmoji}</p>
                                      <div>
                                        <h3>{item}</h3>
                                        <p className="text-sm text-muted-foreground">
                                          {data?.countryMeta?.name}
                                        </p>
                                      </div>
                                    </div>
                                  </li>
                                );
                              },
                            )}
                          </ul>
                        </CardContent>
                      </ScrollArea>
                    </Card>
                  )}
              </div>
            </section>

            <Separator />

            <section className="space-y-4">
              <Label className="text-xl font-medium sm:text-2xl text-[#1F2937]">
                How long are you planning to travel?
              </Label>
              <InputErrorWrapper error={errors.budget?.message}>
                <Controller
                  name="travel"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {timeRatingOptions.map((option) => {
                        const Icon = option.icon;

                        return (
                          <Card
                            key={option.id}
                            className={cn(
                              'p-4 cursor-pointer transition-colors shadow-none',
                              field.value === option.label
                                ? 'border-primary bg-primary/5'
                                : 'hover:border-primary/50',
                            )}
                            onClick={() => field.onChange(option.label)}
                          >
                            <div className="space-y-3">
                              <div className="text-2xl">
                                <Icon />
                              </div>
                              <div>
                                <h3 className="font-medium">{option.label}</h3>
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                />
              </InputErrorWrapper>
            </section>

            <Separator />

            <section className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-xl font-medium sm:text-2xl text-[#1F2937]">
                  What is Your Budget?
                </h2>
                <p className="text-muted-foreground">
                  The budget is exclusively allocated for activities and dining
                  purposes.
                </p>
              </div>
              <InputErrorWrapper error={errors.budget?.message}>
                <Controller
                  name="budget"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {budgetOptions.map((option) => (
                        <Card
                          key={option.id}
                          className={cn(
                            'p-4 cursor-pointer transition-colors shadow-none',
                            field.value === option.range
                              ? 'border-primary bg-primary/5'
                              : 'hover:border-primary/50',
                          )}
                          onClick={() => field.onChange(option.range)}
                        >
                          <div className="space-y-3">
                            <div className="text-2xl">{option.icon}</div>
                            <div>
                              <h3 className="font-medium">{option.label}</h3>
                              <p className="text-sm text-muted-foreground">
                                {option.range}
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                />
              </InputErrorWrapper>
            </section>

            <Separator />

            <section className="space-y-4">
              <h2 className="text-xl font-medium sm:text-2xl text-[#1F2937]">
                Which activities are you interested in?
              </h2>
              <InputErrorWrapper error={errors.activities?.message}>
                <Controller
                  name="activities"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      {activities.map((activity) => {
                        const isSelected = field.value?.includes(
                          activity.label,
                        );
                        return (
                          <Card
                            key={activity.label}
                            onClick={() =>
                              isSelected
                                ? field.onChange(
                                    field.value.filter(
                                      (a) => a !== activity.label,
                                    ),
                                  )
                                : field.onChange([
                                    ...(field.value || []),
                                    activity.label,
                                  ])
                            }
                            className={cn(
                              'flex flex-col items-center justify-center p-6 rounded-lg border transition-all shadow-none cursor-pointer',
                              isSelected
                                ? 'border-black bg-gray-100'
                                : 'border-gray-200 hover:border-gray-300',
                            )}
                            aria-pressed={isSelected}
                          >
                            <activity.icon className="w-6 h-6 mb-2 text-gray-600" />
                            <span className="text-sm text-gray-900">
                              {activity.label}
                            </span>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                />
              </InputErrorWrapper>
            </section>

            <Separator />

            <Button
              className="px-5 py-6 text-base text-white bg-black border rounded-xl hover:bg-black/90 disabled:bg-black"
              disabled={isSubmitting}
              isSubmitting={isSubmitting}
            >
              Submit
            </Button>
          </form>
        </div>
      </main>
    </>
  );
};

export default TravelPlanner;
