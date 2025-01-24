import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

type BriefHistoryProps = {
  history: string;
  city: string;
};

export const BriefHistory: React.FC<BriefHistoryProps> = ({
  history,
  city,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>A Brief History of {city}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="whitespace-pre-wrap">{history}</p>
        </div>
      </CardContent>
    </Card>
  );
};
