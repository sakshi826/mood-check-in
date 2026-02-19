import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const MoodCheckIn = () => {
  return (
    <div className="max-w-md mx-auto space-y-8 py-8 px-4 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-mood-great/20 flex items-center justify-center text-5xl">
          
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Feeling Good</h1>
          <p className="text-muted-foreground text-lg italic px-4">
            "Today may have had its ups and downs. Take a moment to acknowledge where you are without judgment."
          </p>
        </div>
      </div>

      <div className="bg-muted/30 p-6 rounded-3xl border border-muted space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground opacity-70">Daily Reflection</h3>
        <p className="text-foreground leading-relaxed">
          Mindfulness isn't about clearing your mind, but about being present with whatever arises. 
          Each breath is a new opportunity to start fresh.
        </p>
      </div>

      <Button
        className="w-full h-14 rounded-2xl text-lg font-semibold transition-all hover:shadow-xl hover:-translate-y-1 active:scale-95 group"
        onClick={() => window.location.reload()}
      >
        Continue
        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"/>
      </Button>
      
      <p className="text-center text-xs text-muted-foreground opacity-50">
        Your reflections are personal and stay on your screen.
      </p>
    </div>
  );
};

export default MoodCheckIn;