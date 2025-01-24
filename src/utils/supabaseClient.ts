import { QueryProps } from '@/types';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export const generateRecommendations = async (data: QueryProps) => {
  const city = data.query.destination.split(',')[0];
  const country = data.query.destination.split(', ')[1];
  const priceRange = data.query.budget;
  const placeCategories = data.query.activities;
  const timeRatings = data.query.travel;

  // Determine the price range condition
  const priceCondition =
    priceRange === '15 - 50'
      ? '$$: (~15 ~ 50)'
      : priceRange === '50 - 100'
      ? '$$$: (~50 ~ 100)'
      : '$$$$: (~100+)';

  const { data: recommendations, error } = await supabase
    .from('travelmate')
    .select('*')
    .ilike('City', `%${city}%`)
    .ilike('Country', `%${country}%`)
    .eq('Price Range', priceCondition)
    .in('Place Category', placeCategories)
    .eq('Time Rating', timeRatings)
    .limit(10);

  console.log({ recommendations, error });

  return recommendations;
};
