import PageSuspense from '@/components/custom/page-suspense';
import { TravelRecommendation } from '@/types';
import { supabase } from '@/utils/supabaseClient';
import { MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BriefHistory } from './brief-history';
import UserQuery from './user-query';
import RecommendationsList from './recommendation-list';
import { Button } from '@/components/ui/button';

const Recommendation = () => {
  const { id } = useParams();
  const [recommendation, setRecommendation] = useState<TravelRecommendation>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendation = async () => {
      const { data, error } = await supabase
        .from('recommendations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching recommendation:', error);
      } else {
        setRecommendation(data);
      }
      setLoading(false);
    };

    fetchRecommendation();
  }, [id]);

  if (loading) return <PageSuspense />;

  if (recommendation!.recommendations.length === 0)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-y-7">
          <div className="text-3xl">
            No recommendation found for this Location.
          </div>
          <Link to="/travel-planner" className="block">
            <Button className="px-3 py-6 text-base text-white bg-black border w-fit rounded-xl hover:bg-black/90">
              Go back
            </Button>
          </Link>
        </div>
      </div>
    );

  return (
    <>
      <main className="min-h-screen bg-gray-100">
        <header className="py-4 bg-primary text-primary-foreground">
          <div className="container flex items-center justify-between px-4 mx-auto">
            <div className="flex items-center">
              <MapPin className="mr-2" />
              <span>{recommendation!.user_input.query.destination}</span>
            </div>

            <div>
              <Link
                to="/chat"
                className="px-4 py-[6px] text-sm border rounded-full"
              >
                Explore
              </Link>
            </div>
          </div>
        </header>

        <div className="container px-4 py-8 mx-auto">
          <UserQuery
            query={{
              activities: recommendation!.user_input.query.activities,
              destination: recommendation!.user_input.query.destination,
              travel: recommendation!.user_input.query.travel,
              budget: recommendation!.user_input.query.budget,
            }}
          />

          <RecommendationsList
            recommendations={recommendation!.recommendations}
          />

          <BriefHistory
            history={recommendation!.history}
            city={recommendation!.user_input.query.destination}
          />
        </div>
      </main>
    </>
  );
};

export default Recommendation;
