import {
  Music,
  ShoppingBag,
  SunDim,
  Thermometer,
  Tornado,
  Wind,
  CloudDrizzle,
  Binoculars,
  Activity,
  Beer,
  Palette,
  Coffee,
  Utensils,
  MapPin,
  Egg,
  Sandwich,
  Bed,
  Calendar,
  Smile,
  Moon,
  Store,
  Sun,
  Cake,
  Palmtree,
} from 'lucide-react';

const budgetOptions = [
  { id: 'low', label: 'Low', range: '0 - 15', icon: '💰' },
  { id: 'medium', label: 'Medium', range: '15 - 50', icon: '💰💰' },
  {
    id: 'comfortable',
    label: 'Comfortable',
    range: '50 - 100',
    icon: '💰💰💰',
  },
  { id: 'high', label: 'High', range: '100+', icon: '💰💰💰💰' },
];

const timeRatingOptions = [
  { id: 'day', label: 'I have one day', icon: SunDim },
  { id: 'week', label: 'I have one week', icon: Thermometer },
  { id: 'weekend', label: 'I have one weekend', icon: Tornado },
  { id: 'month', label: 'I have one month', icon: Wind },
  { id: 'season', label: 'I have one season', icon: CloudDrizzle },
];

const activities = [
  { icon: Binoculars, label: 'Sightseeing' },
  { icon: Activity, label: 'Activities' },
  { icon: Beer, label: 'Bars' },
  { icon: Palette, label: 'Arts & Culture' },
  { icon: Coffee, label: 'Cafes' },
  { icon: Utensils, label: 'Dinner' },
  { icon: ShoppingBag, label: 'Shopping' },
  { icon: MapPin, label: 'Neighborhoods' },
  { icon: Egg, label: 'Breakfast' },
  { icon: Sandwich, label: 'Lunch' },
  { icon: Palmtree, label: 'Parks & Nature' },
  { icon: Music, label: 'Live Entertainment' },
  { icon: Bed, label: 'Lodging' },
  { icon: Calendar, label: 'Weekend' },
  { icon: Smile, label: 'Kid Friendly' },
  { icon: Moon, label: 'Nightlife' },
  { icon: Store, label: 'Markets' },
  { icon: Sun, label: 'Outdoor' },
  { icon: Cake, label: 'Bakeries' },
];

export { budgetOptions, timeRatingOptions, activities };
