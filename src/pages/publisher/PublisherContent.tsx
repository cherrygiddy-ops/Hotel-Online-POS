import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { contentEngagement, usageTrends } from "@/data/publisherMockData";
import DateRangeFilter from "./DateRangeFilter";

export default function PublisherContent() {
  const [dateRange, setDateRange] = useState("6m");
  const [contentType, setContentType] = useState("all");

  const filteredContent = contentType === "all" ? contentEngagement : contentEngagement.filter((c) => c.type === contentType);
  return (
    <div className="space-y-6">
         <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Content Analytics</h1>
          <p className="text-muted-foreground mt-1">Engagement metrics across your content library</p>
        </div>
        <div className="flex gap-3">
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Video">Video</SelectItem>
              <SelectItem value="eBook">eBook</SelectItem>
              <SelectItem value="Lab Simulation">Lab Simulation</SelectItem>
              <SelectItem value="Game">Game</SelectItem>
              <SelectItem value="Dals Module">Dals Module</SelectItem>
            </SelectContent>
          </Select>
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-heading font-semibold mb-4">Engagement by Content</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={filteredContent} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={130} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
              <Bar dataKey="units" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="font-heading font-semibold mb-4">Usage Trends Over Time</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={usageTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
              <Legend />
              <Line type="monotone" dataKey="video" stroke="hsl(var(--chart-1))" strokeWidth={2} name="Video" dot={false} />
              <Line type="monotone" dataKey="ebook" stroke="hsl(var(--chart-2))" strokeWidth={2} name="eBook" dot={false} />
              <Line type="monotone" dataKey="lab" stroke="hsl(var(--chart-3))" strokeWidth={2} name="Lab" dot={false} />
              <Line type="monotone" dataKey="game" stroke="hsl(var(--chart-4))" strokeWidth={2} name="Game" dot={false} />
              <Line type="monotone" dataKey="dals" stroke="hsl(var(--chart-5))" strokeWidth={2} name="Dals" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h3 className="font-heading font-semibold mb-4">Units Consumed per Item</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Content</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Units</TableHead>
              <TableHead className="text-right">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContent.map((item) => (
              <TableRow key={item.name}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{item.type}</Badge>
                </TableCell>
                <TableCell className="text-right">{item.units.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <span className={`text-sm font-medium ${item.trend >= 0 ? "text-success" : "text-destructive"}`}>
                    {item.trend >= 0 ? "↑" : "↓"} {Math.abs(item.trend)}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
