import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Web3Provider } from "@/components/Web3Provider";
import Navigation from "@/components/Navigation";
import Landing from "@/pages/Landing";
import DreamJournal from "@/pages/DreamJournal";
import SleepDashboard from "@/pages/SleepDashboard";
import NFTMarketplace from "@/pages/NFTMarketplace";
import AIInterpreter from "@/pages/AIInterpreter";
import DreamMining from "@/pages/DreamMining";
import BlockchainDashboard from "@/pages/BlockchainDashboard";
import RewardsClaim from "@/pages/RewardsClaim";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="flex min-h-screen">
      <Navigation />
      <main className="flex-1 lg:ml-64">
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/journal" component={DreamJournal} />
          <Route path="/dashboard" component={SleepDashboard} />
          <Route path="/marketplace" component={NFTMarketplace} />
          <Route path="/interpreter" component={AIInterpreter} />
          <Route path="/mining" component={DreamMining} />
          <Route path="/blockchain" component={BlockchainDashboard} />
          <Route path="/rewards" component={RewardsClaim} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <Web3Provider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </Web3Provider>
  );
}

export default App;
