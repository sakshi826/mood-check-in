import { useState } from "react";
import { Check } from "lucide-react";
import { getUserId } from "../lib/auth";
import { saveMoodEntry, MoodEntry } from "../lib/db";

const MOODS = [
  { emoji: "😊", label: "Great", value: 5, colorClass: "bg-mood-great/15 border-mood-great" },
  { emoji: "🙂", label: "Good", value: 4, colorClass: "bg-mood-good/15 border-mood-good" },
  { emoji: "😐", label: "Okay", value: 3, colorClass: "bg-mood-okay/15 border-mood-okay" },
  { emoji: "😟", label: "Low", value: 2, colorClass: "bg-mood-low/15 border-mood-low" },
  { emoji: "😢", label: "Struggling", value: 1, colorClass: "bg-mood-struggling/15 border-mood-struggling" },
] as const;

export default function MoodCheckIn() {
  const [selected, setSelected] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [logged, setLogged] = useState(false);

  const selectedMood = MOODS.find((m) => m.value === selected);

  const handleLog = async () => {
    if (selected === null || !selectedMood) return;

    const userId = getUserId();
    if (!userId) return;

    const entry: MoodEntry = {
      mood_rating: selected,
      label: selectedMood.label,
      notes: note,
      logged_at: new Date().toISOString(),
    };

    try {
      await saveMoodEntry(userId, entry);
      setLogged(true);
    } catch (error) {
      console.error("Failed to save mood entry:", error);
    }
  };

  const handleReset = () => {
    setSelected(null);
    setNote("");
    setLogged(false);
  };

  if (logged) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="flex flex-col items-center gap-6 animate-fade-in-up">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success animate-check-pop">
            <Check className="h-10 w-10 text-success-foreground" strokeWidth={3} />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Mood Logged!</h2>
          <p className="text-lg text-muted-foreground">
            You're feeling <span className="font-semibold text-foreground">{selectedMood?.label}</span> today.
          </p>
          <button
            onClick={handleReset}
            className="mt-4 rounded-full bg-primary px-8 py-3 text-base font-semibold text-primary-foreground transition-transform hover:scale-105 active:scale-95"
          >
            Log Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-10">
        {/* Header */}
        <div className="text-center animate-fade-in-up">
          <h1 className="text-3xl font-bold text-foreground">How are you feeling?</h1>
          <p className="mt-2 text-base text-muted-foreground">Tap to select your mood</p>
        </div>

        {/* Mood buttons */}
        <div className="flex w-full justify-center gap-3 sm:gap-5" style={{ animationDelay: "0.1s" }}>
          {MOODS.map((mood) => {
            const isSelected = selected === mood.value;
            return (
              <button
                key={mood.value}
                onClick={() => setSelected(mood.value)}
                className={`
                  flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-4 transition-all duration-200
                  ${isSelected
                    ? `${mood.colorClass} animate-bounce-select mood-shadow`
                    : "border-transparent bg-card hover:scale-105"
                  }
                `}
              >
                <span className="text-4xl">{mood.emoji}</span>
                <span className={`text-xs font-medium ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                  {mood.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Note field */}
        <div className="w-full animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note (optional)"
            className="w-full rounded-full border border-input bg-card px-5 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-shadow focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* CTAs */}
        <div className="flex w-full items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <button
            onClick={handleReset}
            className="rounded-full px-6 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Skip
          </button>
          <button
            onClick={handleLog}
            disabled={selected === null}
            className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
          >
            Log Mood
          </button>
        </div>
      </div>
    </div>
  );
}
