import RecommendationCard from './recommendation-card';

interface Recommendation {
  ID: string;
  Name: string;
  Images: string;
  City: string;
  Slug: string;
  Description: string;
  'Price Range': string;
  'Time Rating': string;
  'Place Category': string;
  Curators: string;
}

interface RecommendationsListProps {
  recommendations: Recommendation[];
}

export default function RecommendationsList({
  recommendations,
}: RecommendationsListProps) {
  return (
    <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
      {recommendations.map((recommendation) => {
        const curator = recommendation.Curators;

        return (
          <RecommendationCard
            key={recommendation.ID}
            recommendation={{
              ...recommendation,
              Curators: curator,
            }}
          />
        );
      })}
    </div>
  );
}
