import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DateRangeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const DateRangeFilter = ({ value, onChange }: DateRangeFilterProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[160px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="3m">Last 3 months</SelectItem>
        <SelectItem value="6m">Last 6 months</SelectItem>
        <SelectItem value="1y">Last year</SelectItem>
        <SelectItem value="all">All time</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default DateRangeFilter;
