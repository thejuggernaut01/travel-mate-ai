import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UserQueryProps {
  query: {
    budget: string;
    travel: string;
    activities: string[];
    destination: string;
  };
}

export default function UserQuery({ query }: UserQueryProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Your Travel Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Budget:</h3>
            <p>{query.budget}</p>
          </div>
          <div>
            <h3 className="font-semibold">Travel Duration:</h3>
            <p>{query.travel}</p>
          </div>
          <div className="col-span-2">
            <h3 className="mb-2 font-semibold">Activities:</h3>
            <div className="flex flex-wrap gap-2">
              {query.activities.map((activity, index) => (
                <Badge key={index} variant="secondary">
                  {activity}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
