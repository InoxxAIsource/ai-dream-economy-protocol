import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Zap, DollarSign, Link2, Moon, Brain, Clock, TrendingUp, Calendar, Watch, Heart, Target, Apple, Smartphone } from "lucide-react";

const SleepDashboard = () => {
  const [connectedTracker, setConnectedTracker] = useState<string | null>(null);

  const stats = [
    {
      title: "Sleep Quality Score",
      value: "--",
      subtitle: "No data available",
      icon: Activity,
      color: "text-[hsl(258,84%,66%)]"
    },
    {
      title: "REM Sleep",
      value: "--",
      subtitle: "Optimal for dreams",
      icon: Brain,
      color: "text-[hsl(215,82%,61%)]"
    },
    {
      title: "Dream Frequency",
      value: "--",
      subtitle: "Dreams per week",
      icon: Zap,
      color: "text-[hsl(325,84%,61%)]"
    },
    {
      title: "Earnings This Week",
      value: "$0.00",
      subtitle: "Connect sleep tracker",
      icon: DollarSign,
      color: "text-[hsl(43,89%,56%)]"
    }
  ];

  const sleepStages = [
    { name: "Awake", duration: 0, percentage: 0, color: "bg-red-500" },
    { name: "Light Sleep", duration: 0, percentage: 0, color: "bg-blue-400" },
    { name: "Deep Sleep", duration: 0, percentage: 0, color: "bg-indigo-600" },
    { name: "REM Sleep", duration: 0, percentage: 0, color: "bg-purple-500" }
  ];

  const trackerOptions = [
    { 
      id: "apple", 
      name: "Apple Health", 
      icon: Apple, 
      description: "iPhone & Apple Watch integration",
      status: "available" 
    },
    { 
      id: "fitbit", 
      name: "Fitbit", 
      icon: Heart, 
      description: "Comprehensive sleep tracking",
      status: "available" 
    },
    { 
      id: "oura", 
      name: "Oura Ring", 
      icon: Target, 
      description: "Advanced sleep & recovery metrics",
      status: "available" 
    },
    { 
      id: "garmin", 
      name: "Garmin", 
      icon: Watch, 
      description: "Sports watch sleep analysis",
      status: "available" 
    },
    { 
      id: "samsung", 
      name: "Samsung Health", 
      icon: Smartphone, 
      description: "Galaxy device integration",
      status: "available" 
    }
  ];

  const dreamTimes = [
    { time: "2:30 AM", stage: "REM", quality: 85, description: "Optimal for vivid dreams" },
    { time: "4:15 AM", stage: "REM", quality: 78, description: "Good dream recall window" },
    { time: "6:00 AM", stage: "Light", quality: 45, description: "Wake-up transition" }
  ];

  const handleConnectTracker = (trackerId: string) => {
    setConnectedTracker(trackerId);
    // Integration logic would go here
  };

  if (!connectedTracker) {
    return (
      <div className="p-6 lg:p-12 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-2">Sleep Data Dashboard</h1>
            <p className="text-gray-300">Connect your sleep tracker to unlock dream mining potential</p>
          </div>
          
          <div className="grid lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="glass-card border-white/10">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">
                      {stat.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-gray-400" />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${stat.color}`}>
                      {stat.value}
                    </div>
                    <p className="text-xs text-gray-400">
                      {stat.subtitle}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Sleep Tracker Integration */}
          <Card className="glass-card border-white/10 mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white flex items-center">
                <Link2 className="mr-2 h-5 w-5" />
                Connect Sleep Tracker
              </CardTitle>
              <p className="text-gray-400">Choose your preferred sleep tracking device to start earning from your dreams</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trackerOptions.map((tracker) => {
                  const Icon = tracker.icon;
                  return (
                    <Card 
                      key={tracker.id}
                      className="glass-card border-white/20 hover:border-[hsl(258,84%,66%)] cursor-pointer transition-all duration-200 hover:scale-105 dream-shimmer"
                      onClick={() => handleConnectTracker(tracker.id)}
                    >
                      <CardContent className="p-6 text-center">
                        <Icon className="h-12 w-12 mx-auto mb-4 text-[hsl(258,84%,66%)]" />
                        <h3 className="font-semibold text-white mb-2">{tracker.name}</h3>
                        <p className="text-sm text-gray-400 mb-4">{tracker.description}</p>
                        <Badge className="category-tag">
                          {tracker.status === 'available' ? 'Available' : 'Coming Soon'}
                        </Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          {/* Benefits Preview */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="glass-card border-white/10">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[hsl(215,82%,61%)] to-[hsl(258,84%,66%)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">REM Optimization</h3>
                <p className="text-sm text-gray-400">Track REM cycles for optimal dream recording times</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[hsl(325,84%,61%)] to-[hsl(43,89%,56%)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Sleep Patterns</h3>
                <p className="text-sm text-gray-400">Identify patterns that enhance dream recall and quality</p>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-[hsl(43,89%,56%)] to-[hsl(258,84%,66%)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Earning Potential</h3>
                <p className="text-sm text-gray-400">Higher quality sleep data = better dream monetization</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-12 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Sleep Data Dashboard</h1>
            <div className="flex items-center space-x-2">
              <Badge className="category-tag">
                Connected to {trackerOptions.find(t => t.id === connectedTracker)?.name}
              </Badge>
              <Badge variant="outline" className="border-green-500/50 text-green-400">
                Live Data
              </Badge>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="glass-card border-white/20 text-white hover:bg-white/20"
            onClick={() => setConnectedTracker(null)}
          >
            <Link2 className="mr-2 h-4 w-4" />
            Change Tracker
          </Button>
        </div>
        
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="glass-card border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
                  <p className="text-xs text-gray-400">
                    {stat.subtitle}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="stages" className="space-y-6">
          <TabsList className="glass-card border-white/10">
            <TabsTrigger value="stages" className="data-[state=active]:bg-white/20">Sleep Stages</TabsTrigger>
            <TabsTrigger value="timeline" className="data-[state=active]:bg-white/20">Dream Timeline</TabsTrigger>
            <TabsTrigger value="patterns" className="data-[state=active]:bg-white/20">Patterns</TabsTrigger>
          </TabsList>

          <TabsContent value="stages">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center">
                  <Moon className="mr-2 h-5 w-5" />
                  Sleep Stage Breakdown
                </CardTitle>
                <p className="text-gray-400">No sleep data available - connect your tracker to see detailed analysis</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {sleepStages.map((stage, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{stage.name}</span>
                      <span className="text-gray-400">{stage.duration}min ({stage.percentage}%)</span>
                    </div>
                    <Progress value={stage.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card className="glass-card border-white/10">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-white flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Optimal Dream Recording Windows
                </CardTitle>
                <p className="text-gray-400">Based on REM cycles and sleep patterns</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center text-gray-400 py-8">
                  Connect sleep tracker to view personalized dream recording recommendations
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patterns">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white">Weekly Trends</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8 text-gray-400">
                  Sleep pattern analysis available after 7 days of data
                </CardContent>
              </Card>

              <Card className="glass-card border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-white">Dream Quality Correlation</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-8 text-gray-400">
                  Insights available after recording your first dreams
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SleepDashboard;
