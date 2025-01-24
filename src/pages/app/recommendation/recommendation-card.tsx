import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Key } from 'react';
import { Link } from 'react-router-dom';

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

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export default function RecommendationCard({
  recommendation,
}: RecommendationCardProps) {
  const images = JSON.parse(recommendation.Images.replace(/'/g, '"'));
  const curators = JSON.parse(recommendation.Curators.replace(/'/g, '"'));

  return (
    <Link
      to={`https://www.tipsiti.com/cities/${stringToSlug(
        recommendation.City,
      )}/places/${recommendation.Slug}`}
      target="_blank"
    >
      <Card className="overflow-hidden">
        <div className="relative">
          <img
            src={images[0] || '/placeholder.svg'}
            alt={recommendation.Name}
            className="object-cover aspect-video"
          />
        </div>
        <CardHeader>
          <CardTitle>{recommendation.Name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-gray-600">
            {recommendation.Description}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge>{recommendation['Price Range']}</Badge>
            <Badge variant="outline">{recommendation['Time Rating']}</Badge>
            <Badge variant="secondary">
              {recommendation['Place Category']}
            </Badge>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold">Curated by:</h4>
            <div className="flex -space-x-2 overflow-hidden">
              {curators &&
                curators.map(
                  (
                    curator: { [x: string]: string },
                    index: Key | null | undefined,
                  ) => (
                    <Avatar key={index} className="border-2 border-background">
                      <AvatarImage
                        src={curator['Curator Profile Image']}
                        alt={curator['Curator Name']}
                      />
                      <AvatarFallback>
                        {curator['Curator Name'].charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ),
                )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function stringToSlug(str: string) {
  return str.toLowerCase().trim().replace(/\s+/g, '-');
}
