import { motion } from 'motion/react';

interface Location {
  name: string;
  address: string;
  emoji: string;
  note: string;
  link: string;
  isHotel?: boolean;
  hotelUrl?: string;
}

const LOCATIONS: Location[] = [
  {
    name: 'Home Base Hotel',
    address: 'Drury Inn & Suites St. Louis Fairview Heights, 12 Ludwig Dr, Fairview Heights, IL 62208',
    emoji: '🏨',
    note: 'Where the family is staying — book early!',
    link: 'https://maps.google.com/?q=Drury+Inn+Suites+St+Louis+Fairview+Heights+12+Ludwig+Dr+Fairview+Heights+IL',
    isHotel: true,
    hotelUrl: 'https://www.druryhotels.com/locations/fairview-heights-il/drury-inn-suites-st-louis-fairview-heights',
  },
  {
    name: 'Thanksgiving Dinner',
    address: 'TBD — St. Louis, MO',
    emoji: '🦃',
    note: 'The big feast — details coming soon!',
    link: 'https://maps.google.com/?q=St+Louis+MO',
  },
  {
    name: 'Friday Game Night',
    address: 'TBD — St. Louis area',
    emoji: '🎮',
    note: 'Friday night fun — games, laughs, and family competition!',
    link: 'https://maps.google.com/?q=St+Louis+MO',
  },
  {
    name: 'Saturday Football',
    address: 'TBD — St. Louis area',
    emoji: '🏈',
    note: 'Turkey Bowl Saturday — come ready to play!',
    link: 'https://maps.google.com/?q=St+Louis+MO',
  },
  {
    name: 'Dance Class',
    address: 'Grandview Plaza, Florissant, MO',
    emoji: '💃',
    note: 'Get your moves ready — dance class in Florissant!',
    link: 'https://maps.google.com/?q=Grandview+Plaza+Florissant+MO',
  },
  {
    name: 'Paint & Karaoke',
    address: 'The Jack Foundation, Patterson Ave, Florissant, MO',
    emoji: '🎤',
    note: 'Paint, sing, and show out at the Jack Foundation!',
    link: 'https://maps.google.com/?q=Jack+Foundation+Patterson+Florissant+MO',
  },
  {
    name: 'Gateway Arch',
    address: 'Gateway Arch National Park, 11 N 4th St, St. Louis, MO 63102',
    emoji: '🌉',
    note: 'Iconic St. Louis landmark — a must-see!',
    link: 'https://maps.google.com/?q=Gateway+Arch+National+Park+11+N+4th+St+St+Louis+MO+63102',
  },
  {
    name: 'City Museum',
    address: 'City Museum, 750 N 16th St, St. Louis, MO 63103',
    emoji: '🎨',
    note: 'Wild, one-of-a-kind attraction — all ages love it',
    link: 'https://maps.google.com/?q=City+Museum+750+N+16th+St+St+Louis+MO+63103',
  },
];

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
} as const;

export default function MapSection() {
  return (
    <section id="map" className="py-xxl px-6" style={{ background: 'hsl(var(--dark-text))' }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideUp}
        >
          <span
            className="inline-block px-4 py-1 rounded-full text-sm font-bold mb-4"
            style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
          >
            📍 Where We're Going
          </span>
          <h2
            className="text-4xl md:text-5xl font-black mb-3"
            style={{ fontFamily: 'var(--font-heading)', color: 'hsl(var(--golden))' }}
          >
            St. Louis Takeover Map
          </h2>
          <p className="text-lg" style={{ color: 'hsl(var(--cream) / 0.7)' }}>
            All the spots for our weekend — tap any address to open in Google Maps.
          </p>
        </motion.div>

        {/* Embedded map */}
        <motion.div
          className="rounded-3xl overflow-hidden mb-10 shadow-2xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={slideUp}
        >
          <iframe
            title="St. Louis event locations map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d99373.27!2d-90.2490!3d38.6270!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x87d8b4a9faed8ef9%3A0xbe39eaca22bbe90b!2sSt.%20Louis%2C%20MO!5e0!3m2!1sen!2sus!4v1"
            width="100%"
            height="380"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>

        {/* Location cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {LOCATIONS.map((loc, i) => (
            <motion.div
              key={loc.name}
              className="rounded-2xl p-5 flex gap-4 items-start"
              style={{
                background: loc.isHotel ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.12)',
                border: loc.isHotel ? 'none' : '1px solid hsl(var(--primary) / 0.25)',
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={slideUp}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            >
              <span className="text-3xl flex-shrink-0 mt-0.5">{loc.emoji}</span>
              <div className="min-w-0 flex-1">
                <p
                  className="font-black text-base mb-0.5"
                  style={{ color: loc.isHotel ? 'hsl(var(--primary-foreground))' : 'hsl(var(--golden))' }}
                >
                  {loc.name}
                  {loc.isHotel && (
                    <span
                      className="ml-2 text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{ background: 'hsl(var(--golden))', color: 'hsl(var(--dark-text))' }}
                    >
                      Our Hotel
                    </span>
                  )}
                </p>
                <p
                  className="text-sm mb-1 opacity-80"
                  style={{ color: loc.isHotel ? 'hsl(var(--primary-foreground))' : 'hsl(var(--cream))' }}
                >
                  {loc.note}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <a
                    href={loc.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:scale-105"
                    style={{
                      background: loc.isHotel ? 'hsl(var(--golden))' : 'hsl(var(--primary))',
                      color: loc.isHotel ? 'hsl(var(--dark-text))' : 'hsl(var(--primary-foreground))',
                    }}
                  >
                    📍 Open in Maps
                  </a>
                  {loc.isHotel && loc.hotelUrl && (
                    <a
                      href={loc.hotelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:scale-105"
                      style={{ background: 'hsl(var(--dark-text))', color: 'hsl(var(--cream))' }}
                    >
                      🏨 Book Hotel
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
