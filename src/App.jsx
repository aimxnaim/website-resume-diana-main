import styles from "./App.module.css";
import { About } from "./components/About/About";
import { Achievements } from "./components/Achievements/Achievements";
import { Contact } from "./components/Contact/Contact";
import { Experience } from "./components/Experience/Experience";
import { Game } from "./components/Game/Game";
import { Hero } from "./components/Hero/Hero";
import { Navbar } from "./components/Navbar/Navbar";
import { Particles } from "./components/Particles/Particles";
import { Projects } from "./components/Projects/Projects";
import { ScrollProgress } from "./components/ScrollProgress/ScrollProgress";
import { Skills } from "./components/Skills/Skills";
import { Ticker } from "./components/Ticker/Ticker";

function App() {
  return (
    <div className={styles.App}>
      <ScrollProgress />
      <Particles />
      <Navbar />
      <main id="main">
        <Hero />
        <Ticker />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Achievements />
        <Game />
      </main>
      <Contact />
    </div>
  );
}

export default App;
