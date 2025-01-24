import { TravelPlannerProps } from '@/pages/app/travel-planner/travel-planner.types';

interface IDestination {
  id: string;
  type: string;
  countryMeta: {
    code: string;
    name: string;
    flagEmoji: string;
    flagSvgUrl: string;
    capitalCity: string;
  };
  stateMeta: {
    code: string;
    name: string;
  };
  cityMeta: {
    code: string;
    name: string;
  };
}

type DestinationProps = {
  destinationMetas: IDestination[];
  hasNextPage: boolean;
};

type QueryProps = {
  query: TravelPlannerProps;
};

type TravelRecommendation = {
  id: string;
  hash: string;
  user_input: QueryProps;
  recommendations: {
    ID: string;
    City: string;
    Name: string;
    Slug: string;
    Images: string;
    // Country: string;
    Curators: string;
    // Location: string;
    Description: string;
    'Price Range': string;
    'Time Rating': string;
    'Place Category': string;
  }[];
  history: string;
  created_at: string;
};

export type {
  DestinationProps,
  IDestination,
  QueryProps,
  TravelRecommendation,
};
