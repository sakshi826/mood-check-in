import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { getUserId } from "../lib/auth";
import { saveMoodEntry } from "../lib/db";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const MOODS = [
  { emoji: "😊", label: "Great", value: 5, colorClass: "bg-mood-great/15 border-mood-great text-mood-great" },
  { emoji: "🙂", label: "Good", value: 4, colorClass: "bg-mood-good/15 border-mood-good text-mood-good" },
  { emoji: "😐", label: "Okay", value: 3, colorClass: "bg-mood-okay/15 border-mood-okay text-mood-okay" },
  { emoji: "😔", label: "Low", value: 2, colorClass: "bg-mood-low/15 border-mood-low text-mood-low" },
  { emoji: "😫", label: "Struggling", value: 1, colorClass: "bg-mood-struggling/15 border-mood-struggling text-mood-struggling" },
];

const MoodCheckIn = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLog = async () => {
    const userId = getUserId();
    if (userId && selected !== null) {
      setIsLoading(true);
      try {
        await saveMoodEntry(userId, {
          mood_rating: selected,
          notes: note,
          logged_at: new Date().toISOString(),
        });
        setIsLogged(true);
      } catch (error) {
        console.error("Failed to save mood:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const selectedMood = MOODS.find((m) => m.value === selected);

  if (isLogged) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center">
          <Check className="w-10 h-10 text-success" strokeWidth={3} />
        </div>
        <h2 className="text-3xl font-bold text-foreground">Mood Logged!</h2>
        <p className="text-muted-foreground max-w-xs">
          You're tracking <span className="font-semibold text-foreground">{selectedMood?.label}</span> today.
          Self-awareness is the first step to wellness.
        </p>
        <Button
          variant="outline"
          onClick={() => { setIsLogged(false); setSelected(null); setNote(""); }}
          className="rounded-full px-8"
        >
          Check in again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-8 py-8 px-4">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">How are you?</h1>
        <p className="text-muted-foreground text-lg italic">"Acknowledge your feelings without judgment."</p>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {MOODS.map((mood) => (
          <button
            key={mood.value}
            onClick={() => setSelected(mood.value)}
            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-300 ${selected === mood.value
              ? mood.colorClass + " scale-110 shadow-lg"
              : "border-transparent hover:bg-muted bg-muted/50"
              }`}
          >
            <span className="text-3xl">{mood.emoji}</span>
            <span className="text-[10px] font-medium uppercase tracking-wider opacity-60">{mood.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-muted-foreground">Any reflections? (Optional)</label>
        <Textarea
          placeholder="What's contributing to your mood today?"
          className="min-h-[120px] rounded-2xl border-muted bg-muted/30 focus:bg-background transition-all"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <Button
        className="w-full h-14 rounded-2xl text-lg font-semibold transition-all hover:shadow-xl hover:-translate-y-1 active:scale-95 group"
        disabled={selected === null || isLoading}
        onClick={handleLog}
      >
        {isLoading ? "Saving..." : "Log Mood"}
        {!isLoading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"/>}
      </Button>
    </div>
  );
};

export default MoodCheckIn;
