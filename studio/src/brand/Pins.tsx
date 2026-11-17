import React from "react";
import { AbsoluteFill } from "remotion";
import { loadFont } from "@remotion/google-fonts/IBMPlexSans";
import { loadFont as loadMono } from "@remotion/google-fonts/IBMPlexMono";
import { Sticker } from "./Bits";
import { Backdrop, BrandMark } from "./Chrome";
import { ProfilePicture, SiteBar } from "./Identity";
import { mono, palette as P, shadow, type } from "./tokens";

/**
 * Pinterest pins, 1000 x 1500 (2:3, Pinterest's recommended size), one calculator each:
 * the formula, what the letters mean, a worked example with the same numbers as the site's calculator,
 * and the tool's address. Same look as the reels and banners.
 */
// Prices need the rupee sign, which is in the latin-ext part of the fonts.
loadFont("normal", { weights: ["500", "600", "700"], subsets: ["latin-ext"] });
loadMono("normal", { weights: ["500", "600"], subsets: ["latin-ext"] });

const PAD = 70;

type PinSpec = {
  eyebrow: string;
  title: React.ReactNode[];
  formulas: { label: string; body: React.ReactNode }[];
  /** What each letter in the formula stands for. */
  legend?: [string, string][];
  /** What goes between a legend key and its meaning (default "= "). */
  legendSep?: string;
  example: { head: string; lines: string[]; result: string; sub: string };
  path: string;
  note: string;
};

/** Lime highlighter behind a key word, like the reel subtitles. */
const M: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ background: `linear-gradient(transparent 55%, ${P.lime} 55%, ${P.lime} 90%, transparent 90%)`, padding: "0 0.06em" }}>{children}</span>
);
const Sup: React.FC<{ children: React.ReactNode }> = ({ children }) => <sup style={{ fontSize: "0.58em", lineHeight: 0 }}>{children}</sup>;
const Frac: React.FC<{ top: React.ReactNode; bottom: React.ReactNode }> = ({ top, bottom }) => (
  <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", margin: "0 0.25em" }}>
    <span>{top}</span>
    <span style={{ alignSelf: "stretch", height: 5, borderRadius: 3, background: P.ink, margin: "6px 0 4px" }} />
    <span>{bottom}</span>
  </span>
);

export const PINS = {
  emi: {
    eyebrow: "Loans · made simple",
    title: [<>How <M>EMI</M> is</>, "calculated"],
    formulas: [{ label: "The EMI formula", body: <>EMI =<Frac top={<>P × r × (1 + r)<Sup>n</Sup></>} bottom={<>(1 + r)<Sup>n</Sup> − 1</>} /></> }],
    legend: [
      ["P", "loan amount"],
      ["r", "monthly rate (yearly % ÷ 12 ÷ 100)"],
      ["n", "number of months"],
    ],
    example: { head: "₹10,00,000 at 8.5% a year for 5 years", lines: ["r = 8.5 ÷ 12 ÷ 100 = 0.00708", "n = 5 × 12 = 60"], result: "EMI: about ₹20,517", sub: "a month, with total interest of about ₹2,30,992" },
    path: "/tools/emi-calculator",
    note: "An estimate. Your bank's exact rate and fees decide the real EMI.",
  },
  gst: {
    eyebrow: "GST · made simple",
    title: ["How to add or", <>remove <M>GST</M></>],
    formulas: [
      { label: "Add GST to a price", body: <>GST =<Frac top="Price × Rate" bottom="100" /></> },
      { label: "Take GST out of a total", body: <>Price =<Frac top="Total × 100" bottom="100 + Rate" /></> },
    ],
    example: { head: "₹1,000 at 18% GST", lines: ["GST = 1,000 × 18 ÷ 100 = ₹180", "Back: 1,180 × 100 ÷ 118 = ₹1,000"], result: "Total: ₹1,180", sub: "Within one state it splits: CGST 9% + SGST 9%" },
    path: "/tools/gst-calculator",
    note: "Check the GST rate for your item; rates differ by product.",
  },
  percent: {
    eyebrow: "Everyday maths · made simple",
    title: ["How to work out", <>a <M>percentage</M></>],
    formulas: [
      { label: "Percentage", body: <>% =<Frac top="Part" bottom="Total" />× 100</> },
      { label: "Percentage change", body: <>Change =<Frac top="New − Old" bottom="Old" />× 100</> },
    ],
    example: { head: "45 marks out of 60", lines: ["45 ÷ 60 × 100"], result: "= 75%", sub: "Price 200 to 250: 50 ÷ 200 × 100 = 25% rise" },
    path: "/tools/percentage-calculator",
    note: "Works for marks, discounts, prices and growth.",
  },
  discount: {
    eyebrow: "Shopping · made simple",
    title: ["How to work out", <>a <M>discount</M></>],
    formulas: [
      { label: "Price after discount", body: <>Pay =<Frac top="MRP × (100 − Off%)" bottom="100" /></> },
      { label: "Real discount %", body: <>Off% =<Frac top="MRP − Sale price" bottom="MRP" />× 100</> },
    ],
    example: { head: "₹2,499 at 30% off", lines: ["2,499 × 70 ÷ 100"], result: "Pay: ₹1,749.30", sub: "40% + extra 20% off is 52% off, not 60%" },
    path: "/tools/discount-calculator",
    note: "Stacked discounts apply one after the other.",
  },
  compound: {
    eyebrow: "Savings · made simple",
    title: ["How compound", <><M>interest</M> grows</>],
    formulas: [{ label: "Compounded once a year", body: <>A = P × (1 + r)<Sup>t</Sup></> }],
    legend: [
      ["P", "amount you put in"],
      ["r", "yearly rate ÷ 100"],
      ["t", "number of years"],
    ],
    example: { head: "₹1,00,000 at 7% a year for 10 years", lines: ["1,00,000 × 1.07^10"], result: "A: about ₹1,96,715", sub: "Interest earned: about ₹96,715" },
    path: "/tools/compound-interest-calculator",
    note: "An example only. Real returns depend on the actual rate.",
  },
  margin: {
    eyebrow: "Business · made simple",
    title: [<>Profit <M>margin</M></>, "vs markup"],
    formulas: [
      { label: "Margin (on the selling price)", body: <>Margin =<Frac top="Price − Cost" bottom="Price" />× 100</> },
      { label: "Markup (on the cost)", body: <>Markup =<Frac top="Price − Cost" bottom="Cost" />× 100</> },
    ],
    example: { head: "Cost ₹800, selling price ₹1,000", lines: ["Profit = 1,000 − 800 = ₹200", "200 ÷ 1,000 × 100  |  200 ÷ 800 × 100"], result: "Margin 20%, markup 25%", sub: "Same ₹200 profit, two different percentages" },
    path: "/tools/percentage-calculator",
    note: "Check which one your supplier or buyer means.",
  },
  sip: {
    eyebrow: "Investing · made simple",
    title: ["How a monthly", <><M>SIP</M> grows</>],
    formulas: [{ label: "SIP future value", body: <>FV = P ×<Frac top={<>(1 + r)<Sup>n</Sup> − 1</>} bottom="r" />× (1 + r)</> }],
    legend: [
      ["P", "monthly investment"],
      ["r", "monthly rate (yearly % ÷ 12 ÷ 100)"],
      ["n", "number of months"],
    ],
    example: { head: "₹5,000 a month at 12% for 10 years", lines: ["r = 12 ÷ 12 ÷ 100 = 0.01", "n = 10 × 12 = 120"], result: "FV: about ₹11,61,695", sub: "₹6,00,000 invested, about ₹5,61,695 growth" },
    path: "/tools/sip-calculator",
    note: "An example only. Fund returns change and are not guaranteed.",
  },
  fd: {
    eyebrow: "Savings · made simple",
    title: ["How a fixed", <><M>deposit</M> grows</>],
    formulas: [{ label: "Compounded every quarter", body: <>A = P × (1 + r ÷ 4)<Sup>4t</Sup></> }],
    legend: [
      ["P", "amount you deposit"],
      ["r", "yearly rate ÷ 100"],
      ["t", "number of years"],
    ],
    example: { head: "₹1,00,000 at 7% for 5 years", lines: ["1,00,000 × 1.0175^20"], result: "A: about ₹1,41,478", sub: "Interest earned: about ₹41,478" },
    path: "/tools/fd-calculator",
    note: "An estimate. Your bank's rate, rules and tax decide the real amount.",
  },
  bmi: {
    eyebrow: "Health · made simple",
    title: ["How to work out", <>your <M>BMI</M></>],
    formulas: [{ label: "Body mass index", body: <>BMI =<Frac top="Weight in kg" bottom={<>(Height in m)<Sup>2</Sup></>} /></> }],
    legend: [
      ["Under 18.5", "underweight"],
      ["18.5 to 24.9", "healthy range"],
      ["25 to 29.9", "overweight"],
      ["30 or more", "obesity"],
    ],
    example: { head: "70 kg and 170 cm tall", lines: ["1.70 × 1.70 = 2.89", "70 ÷ 2.89"], result: "BMI: about 24.2", sub: "In the healthy range for an adult" },
    path: "/tools/bmi-calculator",
    note: "A rough guide for adults, not medical advice.",
  },
  age: {
    eyebrow: "Dates · made simple",
    title: ["How to work out", <>your exact <M>age</M></>],
    formulas: [{ label: "Subtract years, months, then days", body: <>Age = As-on date − Birth date</> }],
    legend: [
      ["Days short?", "borrow the days of the month before"],
      ["Months short?", "borrow 12 months from the years"],
      ["Forms", "use the form's \"as on\" date, not today"],
    ],
    legendSep: "",
    example: { head: "Born 25 Mar 1999, as on 5 Nov 2026", lines: ["Years 27, months 8, days 5 − 25 (short)", "Borrow October's 31: 36 − 25 = 11"], result: "27 y 7 m 11 d", sub: "27 years, 7 months and 11 days" },
    path: "/tools/age-calculator",
    note: "Don't round up: write only completed years, months and days.",
  },
  words: {
    eyebrow: "Cheques · made simple",
    title: ["Write amounts", <>in <M>words</M></>],
    formulas: [
      { label: "Indian grouping: 3 digits, then 2 at a time", body: <>1,23,45,678</> },
      { label: "On a cheque", body: <>Rupees + words + Only</> },
    ],
    legend: [
      ["1,000", "one thousand"],
      ["1,00,000", "one lakh"],
      ["1,00,00,000", "one crore"],
    ],
    example: { head: "₹12,50,000 on a cheque", lines: ["12,50,000 = 12 lakh + 50 thousand"], result: "Twelve Lakh Fifty Thousand", sub: "Write: Rupees Twelve Lakh Fifty Thousand Only" },
    path: "/tools/number-to-words",
    note: "Always check the words against the figures before you sign.",
  },
  dates: {
    eyebrow: "Dates · made simple",
    title: ["Days between", <>two <M>dates</M></>],
    formulas: [
      { label: "Date difference", body: <>Days = End − Start</> },
      { label: "Counting both the first and last day", body: <>Days = End − Start + 1</> },
    ],
    legend: [
      ["30 days", "Apr, Jun, Sep, Nov"],
      ["31 days", "Jan, Mar, May, Jul, Aug, Oct, Dec"],
      ["28 or 29", "Feb (29 in a leap year)"],
    ],
    example: { head: "1 Jan 2026 to 15 Aug 2026", lines: ["31 + 28 + 31 + 30 + 31 + 30 + 31 = 212", "212 + 14 = 226"], result: "226 days", sub: "227 if you count both the first and last day" },
    path: "/tools/date-calculator",
    note: "Calendar days: weekends and holidays are not skipped.",
  },
  height: {
    eyebrow: "Units · made simple",
    title: ["Convert your", <>height to <M>feet</M></>],
    formulas: [
      { label: "Centimetres to inches", body: <>Inches = cm ÷ 2.54</> },
      { label: "Inches to feet", body: <>Feet = Inches ÷ 12</> },
    ],
    legend: [
      ["1 inch", "2.54 cm (exactly)"],
      ["1 foot", "12 inches = 30.48 cm"],
      ["1 metre", "100 cm"],
    ],
    example: { head: "170 cm tall", lines: ["170 ÷ 2.54 = 66.93 inches", "66.93 = 5 × 12 + 6.93"], result: "About 5 ft 7 in", sub: "5 feet 6.9 inches, rounded to the nearest inch" },
    path: "/tools/unit-converter",
    note: "Round only at the end, so the answer stays accurate.",
  },
  bill: {
    eyebrow: "Money · made simple",
    title: ["Split a bill", <>with a <M>tip</M></>],
    formulas: [
      { label: "The tip", body: <>Tip = Bill × Tip % ÷ 100</> },
      { label: "What each person pays", body: <>Each = (Bill + Tip) ÷ People</> },
    ],
    legend: [
      ["Bill", "the total before any tip"],
      ["Tip %", "for example 0, 5 or 10"],
      ["People", "everyone sharing the bill"],
    ],
    example: { head: "₹2,400 bill, 10% tip, 4 friends", lines: ["Tip = 2,400 × 10 ÷ 100 = ₹240", "Total = 2,400 + 240 = ₹2,640"], result: "₹660 each", sub: "₹2,640 shared by 4 people" },
    path: "/tools/bill-splitter",
    note: "Check the bill for a service charge before adding a tip.",
  },
  pixels: {
    eyebrow: "Photos · made simple",
    title: ["Photo size from", <>cm to <M>pixels</M></>],
    formulas: [{ label: "Centimetres to pixels", body: <>Pixels =<Frac top="cm × DPI" bottom="2.54" /></> }],
    legend: [
      ["DPI", "dots per inch, often 300 for print"],
      ["2.54", "centimetres in one inch"],
      ["Shape", "keep width and height in the same ratio"],
    ],
    example: { head: "3.5 × 4.5 cm photo at 300 DPI", lines: ["3.5 × 300 ÷ 2.54 = 413.39…", "4.5 × 300 ÷ 2.54 = 531.49…"], result: "413 × 531 px", sub: "Resize to this, then check the form's KB limit" },
    path: "/tools/image-resizer",
    note: "Every form sets its own size and file limit: follow its rules.",
  },
  // The site's word counter uses words ÷ 200, rounded up, with a 1-minute minimum.
  readtime: {
    eyebrow: "Writing · made simple",
    title: ["Reading time", <>from <M>word count</M></>],
    formulas: [{ label: "Reading time", body: <>Minutes =<Frac top="Words" bottom="200" /></> }],
    legend: [
      ["Words", "every word in your text"],
      ["200", "an average reading speed a minute"],
      ["Round up", "to the next whole minute"],
    ],
    example: { head: "A 1,250-word blog post", lines: ["1,250 ÷ 200 = 6.25", "6.25 rounded up = 7"], result: "About 7 min read", sub: "Read aloud at 130 words a minute: about 10 min" },
    path: "/tools/word-counter",
    note: "Readers differ: 200 words a minute is an average, not a rule.",
  },
  // The site's colour converter opens on #5f7429 = rgb(95, 116, 41).
  hexrgb: {
    eyebrow: "Design · made simple",
    title: ["Convert HEX", <>colour to <M>RGB</M></>],
    formulas: [{ label: "Each pair of HEX digits", body: <>Value = first × 16 + second</> }],
    legend: [
      ["A to F", "stand for 10, 11, 12, 13, 14, 15"],
      ["#RRGGBB", "red, green and blue pairs"],
      ["Range", "each value is 0 to 255"],
    ],
    example: { head: "#5F7429, an olive green", lines: ["5F = 5 × 16 + 15 = 95", "74 = 7 × 16 + 4 = 116", "29 = 2 × 16 + 9 = 41"], result: "rgb(95, 116, 41)", sub: "The same colour, written as three numbers" },
    path: "/tools/color-converter",
    note: "Short codes double each digit: #FA3 is #FFAA33.",
  },
  // The site's time zone converter opens on India (IST) to New York (ET).
  timezone: {
    eyebrow: "Time · made simple",
    title: ["Convert IST to", <>New York <M>time</M></>],
    formulas: [
      { label: "Winter (Nov to Mar)", body: <>New York = IST − 10 h 30 min</> },
      { label: "Summer (Mar to Nov)", body: <>New York = IST − 9 h 30 min</> },
    ],
    legend: [
      ["IST", "UTC + 5:30, no daylight saving"],
      ["EST", "UTC − 5, New York in winter"],
      ["EDT", "UTC − 4, New York in summer"],
    ],
    example: { head: "A 9:00 PM IST call in December", lines: ["9:00 PM − 10 h 30 min", "= 10:30 AM, the same day"], result: "10:30 AM in New York", sub: "Eastern Standard Time (EST)" },
    path: "/tools/time-zone-converter",
    note: "US clocks change in March and November: check the date.",
  },
  // 17 Nov 2026: the image size checker is the site's most searched tool (Search Console).
  imgsize: {
    eyebrow: "Photos · made simple",
    title: ["What size is", <>this <M>image</M>?</>],
    formulas: [
      { label: "Megapixels", body: <>MP =<Frac top="Width × Height" bottom="1,000,000" /></> },
      { label: "Print size in inches", body: <>Inches =<Frac top="Pixels" bottom="DPI" /></> },
    ],
    legend: [["DPI", "dots per inch, 300 for sharp prints"]],
    example: { head: "A 4000 × 3000 phone photo", lines: ["4000 × 3000 = 12,000,000 pixels", "4000 ÷ 300 = 13.3, 3000 ÷ 300 = 10"], result: "12 MP, 13.3 × 10 in", sub: "printed sharp at 300 DPI" },
    path: "/tools/image-dimension-checker",
    note: "Pixels are not KB: file size also depends on the format.",
  },
  // The checker reduces width and height by their greatest common divisor.
  ratio: {
    eyebrow: "Photos · made simple",
    title: ["Find an image's", <><M>aspect ratio</M></>],
    formulas: [{ label: "Aspect ratio", body: <>Ratio = W ÷ G : H ÷ G</> }],
    legend: [
      ["W, H", "width and height in pixels"],
      ["G", "the biggest number that divides both"],
    ],
    example: { head: "A 1920 × 1080 screenshot", lines: ["G = 120", "1920 ÷ 120 = 16, 1080 ÷ 120 = 9"], result: "16:9", sub: "1080 × 1350 (G = 270) is 4:5" },
    path: "/tools/image-dimension-checker",
    note: "Same ratio, any size: 1280 × 720 is 16:9 too.",
  },
  // Matches originalFromSale in the site's lib/discount-percentage.ts.
  original: {
    eyebrow: "Shopping · made simple",
    title: ["Find the price", <><M>before</M> the sale</>],
    formulas: [{ label: "Original price", body: <>Original =<Frac top="Sale price" bottom="1 − Off% ÷ 100" /></> }],
    example: { head: "₹1,499 after 25% off", lines: ["1,499 ÷ (1 − 0.25)", "= 1,499 ÷ 0.75"], result: "Was ₹1,998.67", sub: "Adding 25% back gives ₹1,873.75, which is wrong" },
    path: "/tools/discount-percentage-calculator",
    note: "The discount was taken from the original price, not the sale price.",
  },
} satisfies Record<string, PinSpec>;

const Label: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ ...type.label, fontSize: 21, color: P.olive, ...style }}>{children}</div>
);

const Card: React.FC<{ children: React.ReactNode; soft?: boolean; style?: React.CSSProperties }> = ({ children, soft = false, style }) => (
  <div style={{ background: soft ? P.limeSoft : P.card, border: `5px solid ${P.ink}`, borderRadius: 26, boxShadow: shadow.hard(8), padding: "30px 36px", ...style }}>{children}</div>
);

export const FormulaPin: React.FC<{ pin: keyof typeof PINS }> = ({ pin }) => {
  const p: PinSpec = PINS[pin];
  const face = 168;
  return (
    <AbsoluteFill>
      <Backdrop />
      {/* One column from the brand row down to the address, which always sits at the bottom. */}
      <div style={{ position: "absolute", left: PAD, right: PAD, top: 64, bottom: 52, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <BrandMark size={64} />
          <div style={{ ...type.display, letterSpacing: "-0.02em", fontSize: 38, color: P.ink }}>Internet Toolbox</div>
        </div>
        <Label style={{ marginTop: 52 }}>{p.eyebrow}</Label>
        <div style={{ ...type.display, fontSize: 92, color: P.ink, marginTop: 14 }}>
          {p.title.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
        <Card style={{ marginTop: 36, padding: "26px 36px" }}>
          {p.formulas.map((f, i) => (
            <div key={f.label} style={i ? { borderTop: `3px dashed ${P.lineStrong}`, marginTop: 18, paddingTop: 16 } : undefined}>
              <Label>{f.label}</Label>
              <div style={{ ...type.display, fontWeight: 600, letterSpacing: "-0.01em", fontSize: 46, lineHeight: 1.15, color: P.ink, marginTop: 10, display: "flex", alignItems: "center" }}>{f.body}</div>
            </div>
          ))}
        </Card>
        {p.legend && (
          <div style={{ marginTop: 30, display: "grid", gridTemplateColumns: "auto 1fr", columnGap: 18, rowGap: 8, ...type.body, fontSize: 31, color: P.ink2 }}>
            {p.legend.map(([k, v]) => (
              <React.Fragment key={k}>
                <span style={{ fontWeight: 700, color: P.ink }}>{k}</span>
                <span>{p.legendSep ?? "= "}{v}</span>
              </React.Fragment>
            ))}
          </div>
        )}
        <div style={{ position: "relative", marginTop: 50 }}>
          <Card soft style={{ padding: "26px 36px" }}>
            <div style={{ ...type.body, fontWeight: 600, fontSize: 32, color: P.ink, marginTop: 10 }}>{p.example.head}</div>
            {p.example.lines.map((l) => (
              <div key={l} style={{ fontFamily: mono, fontWeight: 500, fontSize: 27, color: P.ink2, marginTop: 8 }}>{l}</div>
            ))}
            <div style={{ ...type.display, fontSize: 58, color: P.ink, marginTop: 14 }}>{p.example.result}</div>
            <div style={{ ...type.body, fontSize: 29, color: P.ink2, marginTop: 6 }}>{p.example.sub}</div>
          </Card>
          <Sticker size={30} rotate={-4} style={{ position: "absolute", left: 28, top: -26 }}>Example</Sticker>
        </div>
        <div style={{ marginTop: "auto", paddingTop: 30, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Label>Try it free · no sign-up</Label>
          {/* Long tool addresses get a smaller size so they stay on one line. */}
          <SiteBar size={p.path.length > 30 ? 21 : 25} text={`internetoolbox.com${p.path}`} style={{ marginTop: 14 }} />
          <div style={{ ...type.body, fontSize: 22, color: P.ink3, marginTop: 16 }}>{p.note}</div>
        </div>
      </div>
      <div style={{ position: "absolute", right: PAD - 10, top: 36, width: face, height: face, boxSizing: "border-box", borderRadius: face, overflow: "hidden", border: `5px solid ${P.ink}`, boxShadow: shadow.hard(7) }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1080, transform: `scale(${(face - 10) / 1080})`, transformOrigin: "0 0" }}>
          <ProfilePicture />
        </div>
      </div>
    </AbsoluteFill>
  );
};
