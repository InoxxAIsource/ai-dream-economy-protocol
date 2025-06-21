import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Apple, Heart } from "lucide-react";

const Settings = () => {
  return (
    <div className="p-6 lg:p-12 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold gradient-text mb-8">Settings</h1>
        
        <div className="space-y-6">
          {/* Profile Settings */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-300">Display Name</Label>
                  <Input 
                    id="name"
                    placeholder="Enter your name" 
                    className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-[hsl(258,84%,66%)]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-300">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="your@email.com" 
                    className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-[hsl(258,84%,66%)]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Privacy Settings */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">Privacy & Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium text-white">Share Dream Data</h4>
                  <p className="text-sm text-gray-400">Allow anonymous dream data to be used for AI training</p>
                </div>
                <Switch />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium text-white">Public Dream Profile</h4>
                  <p className="text-sm text-gray-400">Make your dream interpretations visible to other users</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
          
          {/* Sleep Tracker Integration */}
          <Card className="glass-card border-white/10">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">Sleep Tracker Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="glass-card border-white/20 text-white hover:bg-white/20 h-20 flex-col space-y-2"
                >
                  <Apple className="h-6 w-6" />
                  <span className="text-sm">Apple Health</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="glass-card border-white/20 text-white hover:bg-white/20 h-20 flex-col space-y-2"
                >
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-red-500 to-yellow-500" />
                  <span className="text-sm">Google Fit</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="glass-card border-white/20 text-white hover:bg-white/20 h-20 flex-col space-y-2"
                >
                  <Heart className="h-6 w-6" />
                  <span className="text-sm">Fitbit</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
