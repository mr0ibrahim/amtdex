import { useId } from "react"

export type ArtworkKind = "web" | "systems" | "shield" | "contact" | "plan" | "launch"

/** Original AMTDEX vectors. Unique IDs allow multiple instances in one page. */
export function BrandArtwork({ kind = "systems", className = "" }: { kind?: ArtworkKind; className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "")
  const ink = `url(#${id}-ink)`
  const paper = `url(#${id}-paper)`
  return (
    <svg viewBox="0 0 320 240" className={`brand-artwork ${className}`} fill="none" aria-hidden="true" focusable="false" data-artwork={kind}>
      <defs>
        <linearGradient id={`${id}-ink`} x1="70" y1="40" x2="260" y2="220" gradientUnits="userSpaceOnUse"><stop stopColor="#8053B9" /><stop offset="1" stopColor="#281849" /></linearGradient>
        <linearGradient id={`${id}-paper`} x1="70" y1="40" x2="270" y2="220" gradientUnits="userSpaceOnUse"><stop stopColor="white" /><stop offset="1" stopColor="#EDE4FA" /></linearGradient>
      </defs>
      <ellipse cx="160" cy="216" rx="108" ry="12" fill="#281849" opacity=".06" />
      <circle cx="160" cy="116" r="92" stroke="currentColor" opacity=".09" />
      <circle cx="160" cy="116" r="114" stroke="currentColor" opacity=".04" />
      <g className="vector-main">
        {kind === "web" && <>
          <rect x="68" y="30" width="208" height="151" rx="18" fill={ink} transform="rotate(7 172 105)" opacity=".25" />
          <rect x="42" y="52" width="222" height="148" rx="16" fill={paper} stroke="#D6C4EB" />
          <path d="M42 84H264" stroke="#D6C4EB" /><circle cx="59" cy="68" r="3" fill="#AE8BD0" /><circle cx="70" cy="68" r="3" fill="#D3BFE8" /><circle cx="81" cy="68" r="3" fill="#E2D4EF" />
          <rect x="58" y="101" width="72" height="81" rx="9" fill={ink} /><path d="M69 116H112M69 128H101M69 155H105M69 167H95" stroke="white" opacity=".45" strokeWidth="4" strokeLinecap="round" />
          <rect x="145" y="102" width="100" height="34" rx="8" fill="white" stroke="#E7DEF1" />
          <path d="m163 154-11 10 11 10m31-20 11 10-11 10m-14-22-6 24" stroke="#694196" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pathLength="1" className="vector-trace" />
          <rect x="214" y="158" width="64" height="52" rx="12" fill={ink} /><path d="m233 183 9 8 17-20" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </>}
        {kind === "systems" && <>
          <path d="m160 36 97 49-97 49-97-49Z" fill={paper} stroke="#CCB5E5" />
          <path d="m63 118 97 49 97-49v28l-97 49-97-49Z" fill={ink} opacity=".5" />
          <path d="m63 83 97 49 97-49v28l-97 49-97-49Z" fill={ink} />
          <path d="m93 85 67 34 67-34" stroke="#B191D4" strokeWidth="2" pathLength="1" className="vector-trace" />
          <rect x="132" y="63" width="56" height="34" rx="8" fill={ink} /><path d="M145 79h30m-23-8v16m14-16v16" stroke="white" strokeWidth="2" />
          <path d="M160 160v38m-69-70-25 15m163-15 25 15" stroke="#C4A4DF" strokeWidth="2" strokeDasharray="4 5" />
          <circle cx="160" cy="203" r="10" fill="#D1AF62" /><circle cx="61" cy="147" r="7" fill="#EEE5F8" stroke="#B995D6" /><circle cx="259" cy="147" r="7" fill="#EEE5F8" stroke="#B995D6" />
        </>}
        {kind === "shield" && <>
          <rect x="90" y="39" width="147" height="173" rx="16" fill="#9B75BF" opacity=".4" transform="rotate(-14 163 125)" />
          <rect x="89" y="29" width="147" height="179" rx="16" fill={paper} stroke="#D3BDE8" transform="rotate(7 163 118)" />
          <path d="m161 58 49 19v39c0 31-28 51-49 61-21-10-49-30-49-61V77Z" fill={ink} stroke="#9C78C0" strokeWidth="2" />
          <path d="m137 114 17 17 31-36" stroke="#F2D89F" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" pathLength="1" className="vector-trace" />
          <path d="M132 186h62" stroke="#C3AEDB" strokeWidth="3" strokeLinecap="round" />
          <circle cx="230" cy="176" r="21" fill="#EBD7A8" /><path d="m220 176 7 7 13-15" stroke="#67491D" strokeWidth="3" strokeLinecap="round" />
        </>}
        {kind === "contact" && <>
          <rect x="76" y="35" width="175" height="130" rx="19" fill={ink} transform="rotate(9 163 100)" opacity=".3" />
          <rect x="52" y="58" width="201" height="128" rx="18" fill={paper} stroke="#D7C5E9" />
          <path d="m55 64 98 70 97-70" stroke="#AB88CB" strokeWidth="2" pathLength="1" className="vector-trace" /><path d="m55 182 64-58m132 58-64-58" stroke="#D9C6EB" strokeWidth="2" />
          <rect x="186" y="134" width="86" height="60" rx="16" fill={ink} /><path d="m205 191-5 15 24-12" fill="#382052" />
          <circle cx="210" cy="162" r="4" fill="white" /><circle cx="228" cy="162" r="4" fill="white" /><circle cx="246" cy="162" r="4" fill="white" />
          <path d="m69 39 6-14m-22 24-14-5" stroke="#D0AF6F" strokeWidth="3" strokeLinecap="round" />
        </>}
        {kind === "plan" && <>
          <rect x="68" y="39" width="183" height="168" rx="17" fill={paper} stroke="#D5C0E9" />
          <rect x="86" y="25" width="93" height="31" rx="10" fill={ink} />
          {[81, 122, 163].map((y,i)=><g key={y}><rect x="90" y={y} width="23" height="23" rx="7" fill={i===2?'#E2D5F1':ink} /><path d={`M128 ${y+7}h92m-92 10h59`} stroke="#C5ACDE" strokeWidth="4" strokeLinecap="round" />{i<2&&<path d={`m96 ${y+11} 4 4 8-9`} stroke="white" strokeWidth="2" strokeLinecap="round" />}</g>)}
          <circle cx="237" cy="177" r="27" fill={ink} /><path d="M237 161v16l11 7" stroke="#EFD49D" strokeWidth="3" strokeLinecap="round" pathLength="1" className="vector-trace" />
        </>}
        {kind === "launch" && <>
          <path d="M119 156c-19 1-34 12-37 37 25-3 36-18 37-37Z" fill="#EBD4A1" />
          <path d="m132 147-35-3 16-36 41-8m24 25 2 39-37 17-2-34" fill="#C9ADE2" stroke="#AC89CE" strokeWidth="2" />
          <path d="M123 135c9-42 35-72 91-82 0 55-28 84-70 103Z" fill={ink} stroke="#8C62B3" strokeWidth="2" />
          <circle cx="178" cy="95" r="16" fill="#EEE5F8" /><circle cx="178" cy="95" r="8" fill="#C7ABD9" />
          <path d="m98 201 39-39m-30 5-24 24m49-11-15 15" stroke="#B690D5" strokeWidth="3" strokeLinecap="round" pathLength="1" className="vector-trace" />
          <path d="m240 66 4-12 4 12 12 4-12 4-4 12-4-12-12-4Z" fill="#D7B775" />
        </>}
      </g>
      <g className="vector-satellites" fill="#B596D2"><circle cx="45" cy="119" r="4" /><circle cx="277" cy="87" r="3" /><circle cx="264" cy="212" r="2" /><path d="M267 35v12m-6-6h12" stroke="#D7B775" strokeWidth="2" strokeLinecap="round" /></g>
    </svg>
  )
}
