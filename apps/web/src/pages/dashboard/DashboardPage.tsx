import { useAuth } from "@/auth/AuthProvider";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { PartyPopper, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { Bar, BarChart, Label, Pie, PieChart, XAxis, YAxis } from "recharts";

const chartData = [
  { result: "win", count: 27, fill: "var(--chart-2)" },
  { result: "lose", count: 20, fill: "var(--chart-1)" },
];

const chartConfig = {
  win: {
    label: "Win",
    color: "var(--chart-2)",
  },
  lose: {
    label: "Lose",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const chartConfigWinners = {
  mcqueen: {
    label: "McQueen",
    color: "var(--chart-2)",
  },
  francesco: {
    label: "Francesco",
    color: "var(--chart-1)",
  },
  turbo: {
    label: "turbo",
    color: "var(--chart-2)",
  },
  verstappen: {
    label: "Verstappen",
    color: "var(--chart-1)",
  },
  sergio: {
    label: "Sergio",
    color: "var(--chart-2)",
  },
  lewis: {
    label: "Lewis",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const chartDataWinners = [
  { runner: "mcqueen", win_races: 1, fill: "var(--chart-1)" },
  { runner: "francesco", win_races: 0, fill: "var(--chart-2)" },
  { runner: "turbo", win_races: 1, fill: "var(--chart-1)" },
  { runner: "verstappen", win_races: 2, fill: "var(--chart-2)" },
  { runner: "sergio", win_races: 1, fill: "var(--chart-1)" },
  { runner: "lewis", win_races: 1, fill: "var(--chart-2)" },
];

export default function Dashboard() {
  const { user } = useAuth();

  const total_bets = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, []);

  return (
    <main className="min-h-screen animate-fade-in flex flex-col flex-1 w-full py-5">
      <h2 className="pb-5 text-lg font-bold ">Hello, {user.name} !!</h2>

      <div className="grid md:grid-cols-2 gap-2">
        <div>
          <Card className="h-full min-w-full max-w-sm">
            <CardHeader>
              <CardTitle>Look your wins so far</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="min-h-10 w-full">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={chartData}
                    dataKey="count"
                    nameKey="result"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-3xl font-bold"
                              >
                                {total_bets.toLocaleString()}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                                Bets
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 leading-none font-medium">
                Trending up by 5.2% this month{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Showing total bets for the last 6 months
              </div>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card className="h-full min-w-full max-w-sm">
            <CardHeader>
              <CardTitle>Look at the winners of the day</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={chartConfigWinners}
                className="min-h-10 w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={chartDataWinners}
                  layout="vertical"
                  margin={{
                    left: 0,
                  }}
                >
                  <YAxis
                    dataKey="runner"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) =>
                      chartConfigWinners[
                        value as keyof typeof chartConfigWinners
                      ]?.label
                    }
                  />
                  <XAxis dataKey="win_races" type="number" hide />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="win_races" radius={5} />
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
              <div className="flex items-center gap-2 leading-none font-medium">
                Two wins in a row for Verstappen
                <PartyPopper className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Showing winners of the day
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
