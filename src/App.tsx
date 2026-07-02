import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { ResultsScreen } from "./components/ResultsScreen";
import { StatsDrawer } from "./components/StatsDrawer";
import { TypingArena } from "./components/TypingArena";
import useTypingStore from "./store/typing/typingStore";
import useApp from "./useApp";

export default function App() {
  /*======================== Store ========================*/

  const { engine } = useApp();

  const view = useTypingStore((s) => s.view);
  const words = useTypingStore((s) => s.words);
  const testResult = useTypingStore((s) => s.testResult);

  /*======================== Return ========================*/

  return (
    <div className="hud-grid flex min-h-screen flex-col bg-zinc-950 text-zinc-300">
      <Header />
      <main className="flex flex-1 flex-col justify-center">
        {view === "typing" ? (
          <TypingArena
            words={words}
            wordStates={engine.wordStates}
            currentInput={engine.currentInput}
            currentIndex={engine.currentIndex}
            lockedInputs={engine.lockedInputs}
            handleKeyDown={engine.handleKeyDown}
            phase={engine.phase}
          />
        ) : (
          testResult && <ResultsScreen />
        )}
      </main>
      <Footer />
      <StatsDrawer />
    </div>
  );
}
