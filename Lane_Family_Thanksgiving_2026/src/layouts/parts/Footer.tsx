export default function Footer() {
  return (
    <footer
      className="py-14 px-6 text-center"
      style={{ background: 'hsl(var(--dark-text))', color: 'hsl(var(--cream))' }}>
      
      <div className="max-w-4xl mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/horizontal.png"
            alt="Lane Family Thanksgiving 2026"
            className="block h-auto w-auto object-contain"
            style={{
              maxHeight: '72px',
              mixBlendMode: 'screen',
              filter: 'brightness(1.05)'
            }}
            width={260}
            height={72} />
          
        </div>

        <p
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--golden))' }}>
          
          See you in St. Louis!
        </p>
        <p className="text-lg mb-8 opacity-80">Thanksgiving 2026 — The Lanes are coming together 🦃</p>

        {/* Contact card */}
        <div
          className="inline-block rounded-2xl px-8 py-5 mb-8 text-left"
          style={{ background: 'hsl(var(--primary) / 0.15)', border: '1px solid hsl(var(--primary) / 0.3)' }}>
          
          <p
            className="text-xs font-bold uppercase tracking-widest mb-2 opacity-60">
            
            Questions? Contact
          </p>
          <p
            className="text-xl font-black mb-3 text-center"
            style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--golden))' }}>
            
            Kesha Robinson
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="mailto:krobin1973@gmail.com"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all hover:scale-105"
              style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}>
              
              ✉️ krobin1973@gmail.com
            </a>
            <a
              href="tel:3149414700"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all hover:scale-105"
              style={{ background: 'hsl(var(--golden))', color: 'hsl(var(--dark-text))' }}>
              
              📞 314-941-4700
            </a>
          </div>
        </div>

        <div className="flex justify-center gap-2 flex-wrap mb-8">
          {['🍂', '🏈', '🦃', '🍁', '🎉', '🍂'].map((emoji, i) =>
          <span key={i} className="text-2xl">{emoji}</span>
          )}
        </div>

        <div
          className="w-16 h-px mx-auto mb-6 opacity-30"
          style={{ background: 'hsl(var(--cream))' }} />
        

        <p className="text-sm opacity-50">
          Lane Family Thanksgiving 2026 · St. Louis, MO · Private family event
        </p>
      </div>
    </footer>);

}