import * as React from 'react';
import { format, getYear, getMonth } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

interface IDatePicker {
  defaultValue?: string;
  className?: string;
  disabled?: boolean;
  value?: Date | string;
  onChange: (date: Date) => void;
}

function DatePicker({ value, onChange, disabled }: IDatePicker) {
  const [date, setDate] = React.useState<Date | string | undefined>(value);
  const [month, setMonth] = React.useState(getMonth(value || new Date()));
  const [year, setYear] = React.useState(getYear(value || new Date()));

  React.useEffect(() => {
    setDate(value);
    if (value) {
      setMonth(getMonth(value));
      setYear(getYear(value));
    }
  }, [value]);

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1902 + 5 },
    (_, i) => 1902 + i,
  );

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const handleMonthChange = (value: string) => {
    setMonth(months.indexOf(value));
  };

  const handleYearChange = (value: string) => {
    setYear(parseInt(value));
  };

  const handleSelectDate = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    onChange(selectedDate as Date); // Sync with RHF
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full border bg-gray-300 justify-start flex  gap-2 items-center text-left font-normal rounded h-[33px] disabled:cursor-not-allowed disabled:bg-gray-300 active:border-blue-200',
            !date && 'text-muted-foreground',
          )}
          disabled={disabled}
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          {date ? format(date, 'PPP') : <span>DD/MM/YYYY</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex items-center justify-between px-3 pt-2 gap-x-2">
          <Select
            value={months[month]}
            onValueChange={handleMonthChange}
            disabled={disabled}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={year.toString()}
            onValueChange={handleYearChange}
            disabled={disabled}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-80">
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>

        <Calendar
          mode="single"
          selected={date as Date}
          onSelect={handleSelectDate}
          month={new Date(year, month)}
          onMonthChange={(newMonth) => {
            setMonth(getMonth(newMonth));
            setYear(getYear(newMonth));
          }}
          initialFocus
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}

export default DatePicker;
