import type { CSSProperties } from "react";
import styles from "./ProcessArtwork.module.css";

export type ProcessIconId = "discovery" | "analysis" | "documents" | "flows" | "agreement" | "design" | "development" | "testing" | "launch";

/** Purpose-drawn site-local vector illustrations used because raster image generation is unavailable here. */
export function ProcessArtwork({ icon, className, style }: { icon: ProcessIconId; className?: string; style?: CSSProperties }) {
  const id = `process-${icon}`;
  return (
    <svg className={className} style={style} viewBox="0 0 180 150" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-blue`} x1="0" x2="1" y1="0" y2="1"><stop stopColor="#86c5ff"/><stop offset=".52" stopColor="#2d82f6"/><stop offset="1" stopColor="#2355c9"/></linearGradient>
        <linearGradient id={`${id}-light`} x1="0" x2=".9" y1="0" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#dbeaff"/></linearGradient>
        <linearGradient id={`${id}-violet`} x1="0" x2="1" y1="0" y2="1"><stop stopColor="#e4d6ff"/><stop offset="1" stopColor="#8f77ef"/></linearGradient>
        <linearGradient id={`${id}-cyan`} x1="0" x2="1" y1="0" y2="1"><stop stopColor="#8de7f6"/><stop offset="1" stopColor="#2aaed6"/></linearGradient>
        <filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="180%"><feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#558be2" floodOpacity=".22"/></filter>
      </defs>
      <ellipse cx="91" cy="128" rx="58" ry="10" fill="#b9ceff" opacity=".28" />
      <g filter={`url(#${id}-shadow)`} strokeLinecap="round" strokeLinejoin="round">
        {icon === "discovery" && <>
          <path d="M28 35h61a13 13 0 0 1 13 13v26a13 13 0 0 1-13 13H57L43 99V87H28a13 13 0 0 1-13-13V48a13 13 0 0 1 13-13Z" fill={`url(#${id}-blue)`}/>
          <path d="M34 48h43M34 59h28" stroke="#e7f3ff" strokeWidth="5"/>
          <path d="M81 68h53a12 12 0 0 1 12 12v20a12 12 0 0 1-12 12h-8v10l-13-10H81a12 12 0 0 1-12-12V80a12 12 0 0 1 12-12Z" fill={`url(#${id}-violet)`}/>
          <circle cx="126" cy="46" r="17" fill={`url(#${id}-light)`} stroke="#80b4fa" strokeWidth="6"/><path d="m139 59 14 14" stroke="#3180ee" strokeWidth="8"/>
        </>}
        {icon === "analysis" && <>
          <rect x="28" y="25" width="102" height="90" rx="12" fill={`url(#${id}-light)`} stroke="#a8c9ff" strokeWidth="3"/>
          <path d="M43 44h49M43 54h28" stroke="#a8c9ff" strokeWidth="4"/>
          <rect x="44" y="77" width="13" height="25" rx="5" fill={`url(#${id}-cyan)`}/><rect x="64" y="65" width="13" height="37" rx="5" fill={`url(#${id}-blue)`}/><rect x="84" y="56" width="13" height="46" rx="5" fill={`url(#${id}-violet)`}/>
          <circle cx="125" cy="91" r="20" fill="#f4fbff" stroke="#2d82f6" strokeWidth="6"/><path d="m140 106 13 13" stroke="#557fe0" strokeWidth="8"/>
        </>}
        {icon === "documents" && <>
          <rect x="23" y="40" width="76" height="84" rx="9" fill="#b8d7ff" transform="rotate(-8 23 40)"/>
          <rect x="38" y="24" width="80" height="98" rx="10" fill={`url(#${id}-light)`} stroke="#85b8f7" strokeWidth="3"/>
          <path d="M52 42h46M52 54h41M52 66h35M52 88h50M52 100h43" stroke="#9bb9e9" strokeWidth="5"/>
          <rect x="108" y="50" width="49" height="65" rx="8" fill={`url(#${id}-blue)`}/><path d="M118 66h29M118 78h23M118 93h29" stroke="#e6f4ff" strokeWidth="4"/>
        </>}
        {icon === "flows" && <>
          <path d="M52 50h76M52 50v51h76M128 50v51" stroke="#7baaf3" strokeWidth="5" fill="none"/>
          <rect x="23" y="32" width="57" height="35" rx="10" fill={`url(#${id}-blue)`}/><rect x="101" y="32" width="55" height="35" rx="10" fill={`url(#${id}-violet)`}/>
          <rect x="23" y="84" width="57" height="35" rx="10" fill={`url(#${id}-cyan)`}/><rect x="101" y="84" width="55" height="35" rx="10" fill={`url(#${id}-blue)`}/>
          <circle cx="51" cy="49" r="5" fill="#fff"/><circle cx="128" cy="49" r="5" fill="#fff"/><circle cx="51" cy="101" r="5" fill="#fff"/><circle cx="128" cy="101" r="5" fill="#fff"/>
        </>}
        {icon === "agreement" && <>
          <path d="M46 19h54l26 25v79H46a9 9 0 0 1-9-9V28a9 9 0 0 1 9-9Z" fill={`url(#${id}-light)`} stroke="#9bc1fa" strokeWidth="3"/><path d="M100 20v24h25" fill="#cfe2ff" stroke="#9bc1fa" strokeWidth="3"/>
          <path d="M55 58h49M55 70h43M55 84h29" stroke="#a8bee5" strokeWidth="5"/>
          <path d="m104 106 31-37 12 10-31 37-17 7z" fill={`url(#${id}-blue)`}/><path d="m97 123 9-19 13 11z" fill="#f7c66d"/><path d="m105 109 10 8" stroke="#fff" strokeWidth="3"/>
        </>}
        {icon === "design" && <>
          <rect x="20" y="23" width="119" height="86" rx="12" fill={`url(#${id}-blue)`}/><rect x="27" y="32" width="105" height="67" rx="6" fill={`url(#${id}-light)`}/>
          <rect x="37" y="43" width="31" height="39" rx="5" fill={`url(#${id}-violet)`}/><path d="M78 46h43M78 58h34M78 71h39" stroke="#8eaddb" strokeWidth="5"/>
          <path d="M65 110v12m-20 2h64" stroke="#3b66bb" strokeWidth="7"/>
          <circle cx="143" cy="40" r="20" fill="#fff" stroke="#a9c9fa" strokeWidth="3"/><circle cx="137" cy="37" r="5" fill="#fb8584"/><circle cx="149" cy="37" r="5" fill="#7cc9ff"/><circle cx="143" cy="48" r="5" fill="#a88aff"/>
        </>}
        {icon === "development" && <>
          <rect x="21" y="28" width="138" height="88" rx="13" fill={`url(#${id}-blue)`}/><rect x="29" y="37" width="122" height="69" rx="7" fill="#f9fcff"/>
          <circle cx="41" cy="46" r="3" fill="#f18b9b"/><circle cx="52" cy="46" r="3" fill="#ffc766"/><circle cx="63" cy="46" r="3" fill="#72d2b0"/>
          <path d="m65 68-13 10 13 10m24-20 13 10-13 10m12-24-7 29" fill="none" stroke="#4387ed" strokeWidth="6"/>
          <path d="M71 116v10m-28 1h84" stroke="#5376c7" strokeWidth="7"/>
        </>}
        {icon === "testing" && <>
          <rect x="20" y="24" width="138" height="88" rx="14" fill={`url(#${id}-blue)`}/><rect x="29" y="33" width="120" height="69" rx="8" fill={`url(#${id}-light)`}/>
          <path d="M40 49h49M40 60h36" stroke="#92b1dc" strokeWidth="5"/><rect x="40" y="72" width="44" height="19" rx="6" fill="#e6efff"/><path d="m50 80 6 6 13-14" fill="none" stroke="#24b778" strokeWidth="5"/>
          <circle cx="121" cy="66" r="20" fill="#e5fbf3" stroke="#2fc58d" strokeWidth="6"/><path d="m111 66 7 7 14-16" fill="none" stroke="#129b69" strokeWidth="5"/>
          <path d="M72 113v11m-24 2h82" stroke="#5376c7" strokeWidth="7"/>
        </>}
        {icon === "launch" && <>
          <path d="M88 17c19 11 27 33 24 61L82 106 57 80c-4-27 10-51 31-63Z" fill={`url(#${id}-light)`} stroke="#74aaf5" strokeWidth="4"/>
          <circle cx="88" cy="55" r="12" fill={`url(#${id}-violet)`} stroke="#fff" strokeWidth="4"/><path d="m59 71-23 14-2 23 30-17m48-1 23 14 3 22-30-17" fill={`url(#${id}-blue)`}/>
          <path d="m70 103-9 20 24-10m16-10 9 20-23-10" fill="#ffb960"/><path d="M87 104c-9 13-9 22 0 34 9-12 9-21 0-34Z" fill="#fb8b73"/>
          <circle cx="36" cy="38" r="4" fill="#a78af7"/><circle cx="143" cy="48" r="5" fill="#ffbf63"/>
        </>}
      </g>
    </svg>
  );
}

export function JourneyArtwork({ locale }: { locale: "en" | "ar" }) {
  const label = locale === "en" ? "Illustrated software delivery journey" : "رسم توضيحي لمسار تنفيذ البرنامج";
  return (
    <div className={styles.journeyArt} role="img" aria-label={label}>
      <div className={styles.journeyHalo} />
      <div className={styles.journeyTrack} aria-hidden="true" />
      <div className={styles.journeyStations} aria-hidden="true">
        {(["discovery", "documents", "flows", "design", "development", "testing", "launch"] as const).map((icon, index) => (
          <span className={`${styles.journeyStation} ${styles[`journeyStation${index + 1}`]}`} key={icon}>
            <ProcessArtwork icon={icon} />
          </span>
        ))}
      </div>
      <span className={`${styles.journeyOrbit} ${styles.journeyOrbitOne}`} />
      <span className={`${styles.journeyOrbit} ${styles.journeyOrbitTwo}`} />
    </div>
  );
}
