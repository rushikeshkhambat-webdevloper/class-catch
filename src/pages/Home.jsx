import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      <header className="px-8 py-5 flex justify-between items-center border-b border-[var(--border)]">
        <span className="text-xl font-bold">Class Catch</span>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login">
            <button className="!bg-transparent !text-[var(--text-primary)] border border-[var(--border)]">
              Login
            </button>
          </Link>
          <Link to="/register"><button>Get Started</button></Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
        <span className="inline-block px-3 py-1 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full text-xs font-medium text-[var(--text-secondary)] mb-6">
          📚 Built for students
        </span>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight max-w-3xl">
          Never Miss a Class Again
        </h1>
        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mb-10 leading-relaxed">
          When you're absent, catch up with recorded classes. Share notes with classmates.
          Let AI summarize everything so you learn faster.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link to="/register"><button className="!px-6 !py-3 !text-base">Get Started Free</button></Link>
          <Link to="/login">
            <button className="!px-6 !py-3 !text-base !bg-transparent !text-[var(--text-primary)] border border-[var(--border)]">
              I have an account
            </button>
          </Link>
        </div>
      </main>

      <section className="px-8 py-16 border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '🎥', title: 'Recorded Classes', desc: 'Teachers upload videos of every session so nobody misses out.' },
            { icon: '📝', title: 'Shared Notes', desc: 'Students share notes and upvote the best ones. Everyone learns together.' },
            { icon: '✨', title: 'AI Summaries', desc: 'One-click AI summaries turn long notes into quick, readable takeaways.' }
          ].map(f => (
            <div key={f.title} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-8 py-6 border-t border-[var(--border)] text-center text-sm text-[var(--text-secondary)]">
        © 2026 Class Catch · Built with ❤️ for students
      </footer>
    </div>
  );
}