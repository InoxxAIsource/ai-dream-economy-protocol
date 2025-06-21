import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FloatingParticles from "@/components/FloatingParticles";
import { Bed, Palette, ArrowLeftRight, Brain, Rocket } from "lucide-react";

const Landing = () => {
  const valueProps = [
    {
      icon: Bed,
      title: "Earn While Sleeping",
      description: "Turn your nightly rest into passive income through dream data monetization",
      gradient: "from-[hsl(258,84%,66%)] to-[hsl(215,82%,61%)]"
    },
    {
      icon: Palette,
      title: "AI Dream Art",
      description: "Our AI transforms your dreams into unique digital artwork and NFTs",
      gradient: "from-[hsl(215,82%,61%)] to-[hsl(325,84%,61%)]"
    },
    {
      icon: ArrowLeftRight,
      title: "Trade Dream NFTs",
      description: "Buy, sell, and collect unique dream-inspired NFTs in our marketplace",
      gradient: "from-[hsl(325,84%,61%)] to-[hsl(43,89%,56%)]"
    },
    {
      icon: Brain,
      title: "Collective Insights",
      description: "Predict trends from the collective subconscious of dreamers worldwide",
      gradient: "from-[hsl(43,89%,56%)] to-[hsl(258,84%,66%)]"
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Record Your Dreams",
      description: "Use our intuitive dream journal to capture your sleep experiences and subconscious insights"
    },
    {
      number: 2,
      title: "AI Analysis",
      description: "Our advanced AI interprets your dreams and generates unique digital art representations"
    },
    {
      number: 3,
      title: "Monetize & Trade",
      description: "Mint your dream art as NFTs and earn from sleep data while building your dream portfolio"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <FloatingParticles />
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="floating">
            <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-6">
              Turn Your Dreams Into Digital Gold
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            The world's first platform to monetize sleep through AI-powered dream interpretation and NFT creation
          </p>
          
          <Button 
            size="lg"
            className="bg-gradient-to-r from-[hsl(258,84%,66%)] to-[hsl(215,82%,61%)] hover:from-[hsl(215,82%,61%)] hover:to-[hsl(325,84%,61%)] px-8 py-4 text-lg font-semibold pulse-glow transform hover:scale-105 transition-all duration-300"
          >
            <Rocket className="mr-2 h-5 w-5" />
            Start Dream Mining Tonight
          </Button>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center gradient-text mb-16">Why Dream With Us?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valueProps.map((prop, index) => {
              const Icon = prop.icon;
              return (
                <Card key={index} className="glass-card border-white/10 hover:dream-glow transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${prop.gradient} rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-white">{prop.title}</h3>
                    <p className="text-gray-300">{prop.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold gradient-text mb-16">How It Works</h2>
          
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center md:space-x-8 space-y-4 md:space-y-0">
                <div className="w-20 h-20 bg-gradient-to-r from-[hsl(258,84%,66%)] to-[hsl(215,82%,61%)] rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
                  {step.number}
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-semibold mb-2 text-white">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
