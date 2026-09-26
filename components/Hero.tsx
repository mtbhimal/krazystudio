"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Waveform from "./Waveform";

const container = {
hidden: {},
show: {
transition: {
staggerChildren: 0.12,
delayChildren: 0.2,
},
},
};

const item = {
hidden: {
opacity: 0,
y: 25,
},
show: {
opacity: 1,
y: 0,
transition: {
duration: 0.7,
ease: [0.22, 1, 0.36, 1],
},
},
};

const particles = [
{ x: "-48%", y: "-35%", delay: 0, size: 4 },
{ x: "48%", y: "-40%", delay: 0.5, size: 3 },
{ x: "-58%", y: "0%", delay: 1, size: 3 },
{ x: "58%", y: "5%", delay: 1.5, size: 4 },
{ x: "-48%", y: "40%", delay: 2, size: 3 },
{ x: "48%", y: "45%", delay: 2.5, size: 3 },
];

const equalizerBars = [
20, 35, 55, 30, 70, 45, 85, 55, 35, 65, 90, 45, 75, 40, 60, 30,
];

export default function Hero() {
return ( <section className="relative min-h-screen overflow-hidden bg-glow-violet px-6 pb-10 pt-28 md:pt-36">

```
  {/* =========================================================
      BACKGROUND
  ========================================================== */}

  <div className="absolute inset-0 -z-20 bg-[#060508]" />

  {/* Orange glow */}
  <motion.div
    className="
      absolute
      left-1/2
      top-[42%]
      -z-10
      h-[600px]
      w-[600px]
      -translate-x-1/2
      -translate-y-1/2
      rounded-full
      bg-[#FF6A00]/10
      blur-[130px]
    "
    animate={{
      scale: [0.8, 1.15, 0.8],
      opacity: [0.25, 0.5, 0.25],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />

  {/* Violet secondary glow */}
  <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_25%,rgba(139,92,246,0.10),transparent_35%)]" />

  {/* =========================================================
      CYBER GRID
  ========================================================== */}

  <div
    className="
      pointer-events-none
      absolute
      inset-0
      -z-10
      opacity-[0.025]
      bg-[linear-gradient(rgba(255,106,0,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,106,0,1)_1px,transparent_1px)]
      bg-[size:45px_45px]
    "
  />

  {/* Animated horizontal scan */}
  <motion.div
    className="
      pointer-events-none
      absolute
      left-0
      top-1/3
      -z-10
      h-px
      w-full
      bg-gradient-to-r
      from-transparent
      via-[#FF6A00]/20
      to-transparent
    "
    animate={{
      opacity: [0, 0.8, 0],
      scaleX: [0.4, 1, 0.4],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />

  {/* =========================================================
      MAIN CONTENT
  ========================================================== */}

  <motion.div
    variants={container}
    initial="hidden"
    animate="show"
    className="relative z-10 mx-auto flex min-h-[calc(100vh-9rem)] max-w-7xl flex-col items-center justify-center text-center"
  >

    {/* Eyebrow */}
    <motion.div
      variants={item}
      className="mb-7 flex items-center justify-center gap-3"
    >
      <motion.span
        className="h-px w-10 bg-[#FF6A00]"
        animate={{
          opacity: [0.3, 1, 0.3],
          scaleX: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />

      <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#FF8A1F] md:text-xs">
        Recording · Mixing · Mastering
      </p>

      <motion.span
        className="h-px w-10 bg-[#FF6A00]"
        animate={{
          opacity: [1, 0.3, 1],
          scaleX: [1, 0.6, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />
    </motion.div>

    {/* =========================================================
        BRAND / TITLE
    ========================================================== */}

    <motion.div
      variants={item}
      className="relative mx-auto w-fit"
    >

      {/* Outer pulse rings */}
      <motion.div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          -z-10
          h-[108%]
          w-[108%]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          border-[#FF6A00]/15
        "
        animate={{
          scale: [0.92, 1.05, 0.92],
          opacity: [0.25, 0.65, 0.25],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          -z-10
          h-[120%]
          w-[120%]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          border-[#FF6A00]/10
        "
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Rotating cyber ring */}
      <motion.div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          -z-10
          h-[135%]
          w-[135%]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border border-dashed
          border-[#FF6A00]/10
        "
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* =====================================================
          FLOATING AUDIO PARTICLES
      ====================================================== */}

      {particles.map((particle, index) => (
        <motion.span
          key={index}
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            rounded-full
            bg-[#FF6A00]
          "
          style={{
            width: particle.size,
            height: particle.size,
            x: particle.x,
            y: particle.y,
            boxShadow: "0 0 15px rgba(255,106,0,0.9)",
          }}
          animate={{
            opacity: [0.15, 1, 0.15],
            scale: [0.6, 1.6, 0.6],
          }}
          transition={{
            duration: 2.5,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* =====================================================
          TITLE
      ========================================================== */}

      <h1
        className="
          relative
          font-display
          font-semibold
          uppercase
          leading-[0.78]
          tracking-[-0.055em]
          text-paper
          text-[18vw]
          md:text-[9rem]
          lg:text-[10.5rem]
          xl:text-[11.5rem]
        "
      >
        {/* KRAZY */}
        <motion.span
          className="block"
          animate={{
            textShadow: [
              "0 0 0 rgba(255,106,0,0)",
              "0 0 45px rgba(255,106,0,0.18)",
              "0 0 0 rgba(255,106,0,0)",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          KRAZY
        </motion.span>

        {/* MUSIC */}
        <motion.span
          className="
            block
            bg-gradient-to-r
            from-white
            via-[#FF8A1F]
            to-white
            bg-[length:200%_100%]
            bg-clip-text
            text-transparent
          "
          animate={{
            backgroundPosition: [
              "0% 50%",
              "100% 50%",
              "0% 50%",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          MUSIC
        </motion.span>

        {/* STUDIO */}
        <span
          className="
            mt-4
            block
            text-[0.22em]
            font-medium
            tracking-[0.5em]
            text-white/45
            md:mt-5
          "
        >
          STUDIO
        </span>
      </h1>
    </motion.div>

    {/* =========================================================
        DESCRIPTION
    ========================================================== */}

    <motion.p
      variants={item}
      className="
        mx-auto
        mt-9
        max-w-xl
        text-sm
        leading-relaxed
        text-mist
        md:text-base
        lg:text-lg
      "
    >
      Where sound becomes an experience. A room built for artists
      who don&apos;t settle for a rough mix.
    </motion.p>

    {/* =========================================================
        BUTTONS
    ========================================================== */}

    <motion.div
      variants={item}
      className="mt-9 flex flex-wrap items-center justify-center gap-4"
    >
      <Link href="/booking">
        <motion.div
          whileHover={{
            scale: 1.06,
            boxShadow: "0 0 40px rgba(255,106,0,0.45)",
          }}
          whileTap={{
            scale: 0.96,
          }}
          className="
            rounded-full
            bg-[#FF6A00]
            px-8
            py-4
            font-bold
            text-black
            shadow-[0_8px_30px_rgba(255,106,0,0.22)]
            transition-all
            duration-300
            hover:bg-[#FF8A1F]
          "
        >
          Book a Session
        </motion.div>
      </Link>

      <Link href="/#portfolio">
        <motion.div
          whileHover={{
            scale: 1.04,
            borderColor: "rgba(255,106,0,0.55)",
            backgroundColor: "rgba(255,106,0,0.06)",
          }}
          whileTap={{
            scale: 0.97,
          }}
          className="
            rounded-full
            border
            border-white/15
            bg-white/[0.02]
            px-8
            py-4
            font-semibold
            text-paper
            backdrop-blur-sm
            transition-all
            duration-300
          "
        >
          Explore Our Work
        </motion.div>
      </Link>
    </motion.div>

    {/* =========================================================
        AUDIO STATUS
    ========================================================== */}

    <motion.div
      variants={item}
      className="mt-9 flex items-center gap-3"
    >
      <motion.span
        className="
          h-2
          w-2
          rounded-full
          bg-[#FF6A00]
          shadow-[0_0_12px_#FF6A00]
        "
        animate={{
          opacity: [0.3, 1, 0.3],
          scale: [0.8, 1.3, 0.8],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
        }}
      />

      <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/30">
        Studio Sessions Available
      </span>
    </motion.div>

    {/* =========================================================
        MINI CYBER EQUALIZER
    ========================================================== */}

    <motion.div
      variants={item}
      className="mt-7 flex h-8 items-end justify-center gap-1"
    >
      {equalizerBars.map((height, index) => (
        <motion.span
          key={index}
          className="w-1 rounded-full bg-[#FF6A00]"
          style={{
            height: `${height}%`,
            boxShadow: "0 0 8px rgba(255,106,0,0.35)",
          }}
          animate={{
            height: [
              `${height * 0.35}%`,
              `${height}%`,
              `${height * 0.55}%`,
              `${height}%`,
            ],
            opacity: [0.35, 1, 0.55, 1],
          }}
          transition={{
            duration: 1 + (index % 4) * 0.15,
            repeat: Infinity,
            delay: index * 0.06,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  </motion.div>

  {/* =========================================================
      MAIN WAVEFORM
  ========================================================== */}

  <motion.div
    initial={{
      opacity: 0,
      y: 25,
    }}
    animate={{
      opacity: 1,
      y: 0,
    }}
    transition={{
      delay: 1,
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
    }}
    className="
      pointer-events-none
      relative
      z-10
      mx-auto
      mt-5
      flex
      w-full
      justify-center
      px-4
      sm:mt-6
    "
  >
    {/* Orange glow behind waveform */}
    <div
      className="
        absolute
        left-1/2
        top-1/2
        h-10
        w-[70%]
        -translate-x-1/2
        -translate-y-1/2
        rounded-full
        bg-[#FF6A00]/10
        blur-2xl
      "
    />

    <Waveform
      bars={72}
      className="
        relative
        h-10
        w-full
        max-w-[700px]
        opacity-80
        sm:h-12
        md:h-14
      "
      color="violet"
    />
  </motion.div>
</section>
);
}
