import { Check, ChevronRight, Cloud, Droplet, Heart, Plus, RefreshCw, Send, Sparkles, Sun } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  Background,
  BaseEdge,
  Handle,
  Position,
  applyNodeChanges,
  getStraightPath,
  useInternalNode,
  type Edge,
  type EdgeProps,
  type Node,
  type NodeChange,
  type NodeProps,
} from "@xyflow/react";
// @ts-expect-error vite handles css side-effect imports
import "@xyflow/react/dist/style.css";

import { PageShell } from "../components/Page";
import { Button } from "../components/ui/button";

type WeatherKind = "sunny" | "cloudy" | "rainy";
type TabId = "ai" | "outfits" | "colour" | "inspirations";

type OutfitRecommendation = {
  id: number;
  outfit: { top: string; bottom: string; shoes: string };
  occasion: string;
  style: string;
  confidence: number;
  weather: WeatherKind;
  note: string;
};

type PastFit = OutfitRecommendation & {
  date: string;
  source: string;
};

type DnaPracticeLook = {
  id: number;
  title: string;
  description: string;
};

type ChatMessage = {
  id: number;
  role: "user" | "ai";
  text: string;
};

type PaletteCard = {
  name: string;
  note: string;
  colors: string[];
};

type InspirationProfile = {
  id: number;
  nodeId: string;
  name: string;
  handle: string;
  avatar: string;
  note: string;
  wardrobe: string[];
  similarity: number;
  whyInOrbit: string;
  topOverlap: string;
  bestBorrowedMove: string;
  soenNote: string;
  nextMove: string;
  sharedSignals: {
    palette: string[];
    silhouette: string[];
    wardrobe: string[];
    energy: string[];
  };
};

type InspirationOutfit = {
  id: number;
  profileNodeId: string;
  title: string;
  image: string;
  popularity: string;
  reason: string;
  signal: string;
  translatesAs: string;
  matchingItems: string[];
};

type CircleNodeData = {
  label: string;
  avatar?: string;
  selected?: boolean;
  isUser?: boolean;
};

type StyleBase = {
  base: string;
  label: string;
  trait: string;
  score: number;
  note: string;
};

const USER_NODE_SIZE = 80;
const PROFILE_NODE_SIZE = 56;

const CircleNode: React.FC<NodeProps<Node<CircleNodeData>>> = ({ data }) => {
  const { label, avatar, selected, isUser } = data;
  const size = isUser ? USER_NODE_SIZE : PROFILE_NODE_SIZE;
  const handleStyle = { opacity: 0, width: 1, height: 1, background: "transparent", border: "none" } as const;
  return (
    <div className="flex flex-col items-center">
      <Handle type="target" position={Position.Top} style={handleStyle} isConnectable={false} />
      <Handle type="source" position={Position.Bottom} style={handleStyle} isConnectable={false} />
      <div
        className="overflow-hidden rounded-full border bg-background transition-shadow"
        style={{
          width: size,
          height: size,
          borderColor: selected || isUser ? "#030213" : "rgba(0,0,0,0.15)",
          borderWidth: selected || isUser ? 2 : 1,
          boxShadow: selected ? "0 0 0 4px rgba(3,2,19,0.08)" : "none",
          background: isUser ? "#030213" : "#ffffff",
        }}
      >
        {avatar ? <img src={avatar} alt={label} className="h-full w-full object-cover" /> : null}
      </div>
    </div>
  );
};

const nodeTypes = { circle: CircleNode };

const FloatingEdge: React.FC<EdgeProps> = ({ id, source, target, style }) => {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);
  if (!sourceNode || !targetNode) return null;
  const halfFor = (nodeId: string) => (nodeId === "you" ? USER_NODE_SIZE / 2 : PROFILE_NODE_SIZE / 2);
  const sx = sourceNode.internals.positionAbsolute.x + halfFor(source);
  const sy = sourceNode.internals.positionAbsolute.y + halfFor(source);
  const tx = targetNode.internals.positionAbsolute.x + halfFor(target);
  const ty = targetNode.internals.positionAbsolute.y + halfFor(target);
  const [path] = getStraightPath({ sourceX: sx, sourceY: sy, targetX: tx, targetY: ty });
  return <BaseEdge id={id} path={path} style={style} />;
};

const edgeTypes = { floating: FloatingEdge };

const MIN_ORBIT_RADIUS = 120;
const MAX_ORBIT_RADIUS = 210;

const getOrbitRadius = (similarity: number) => {
  const similarities = inspirationProfiles.map((profile) => profile.similarity);
  const minSimilarity = Math.min(...similarities);
  const maxSimilarity = Math.max(...similarities);
  if (minSimilarity === maxSimilarity) return (MIN_ORBIT_RADIUS + MAX_ORBIT_RADIUS) / 2;
  const normalized = (maxSimilarity - similarity) / (maxSimilarity - minSimilarity);
  return MIN_ORBIT_RADIUS + normalized * (MAX_ORBIT_RADIUS - MIN_ORBIT_RADIUS);
};

const tabs = [
  { id: "ai", label: "SŌEN" },
  { id: "outfits", label: "Fits" },
  { id: "colour", label: "Style DNA" },
  { id: "inspirations", label: "Orbit" },
] as const;

const weather = {
  sunny: { icon: Sun, label: "24°", hint: "Light layers and cleaner silhouettes feel best today." },
  cloudy: { icon: Cloud, label: "18°", hint: "Add one soft outer layer for balance and warmth." },
  rainy: { icon: Droplet, label: "14°", hint: "Lean into practical textures and water-safe shoes." },
} as const;

const quickPrompts = [
  "Build me a sharp coffee run fit",
  "Style my white trousers for today",
  "What should I wear if I want quiet confidence?",
];

const preferences = ["Casual", "Tailored", "Minimal", "Soft colour", "Smart layers", "Clean sneakers"];

const skinTones = [
  { id: "fair", label: "Fair", recommended: "Powder blue, rose, soft taupe, washed lilac." },
  { id: "light", label: "Light", recommended: "Muted peach, sage, sky blue, dusty pink." },
  { id: "medium", label: "Medium", recommended: "Terracotta, olive, camel, emerald." },
  { id: "tan", label: "Tan", recommended: "Rust, ochre, deep teal, burgundy." },
  { id: "dark", label: "Dark", recommended: "Ivory, cobalt, forest green, rich berry." },
] as const;

const colorPalettes: PaletteCard[] = [
  {
    name: "Spring Warm",
    note: "Fresh contrast with lighter warmth and easy daytime energy.",
    colors: ["#FF6B6B", "#FFA06B", "#FFE66D", "#A8E6CF"],
  },
  {
    name: "Summer Cool",
    note: "Soft cool neutrals that keep the look polished without feeling heavy.",
    colors: ["#7FDBFF", "#B8C5D6", "#F5E6D3", "#C9B8A8"],
  },
  {
    name: "Autumn Earth",
    note: "Grounded tones that make layered outfits feel richer and more intentional.",
    colors: ["#8B4513", "#A0522D", "#CD853F", "#DEB887"],
  },
  {
    name: "Winter Deep",
    note: "High contrast colour stories with sharper edges and cleaner impact.",
    colors: ["#1A1A2E", "#16213E", "#0F3460", "#E94560"],
  },
];

const wardrobeItems = [
  { id: 1, name: "White Linen Shirt", category: "Tops", color: "#FFFFFF" },
  { id: 2, name: "Beige Wide-Leg Trousers", category: "Bottoms", color: "#E8D9C5" },
  { id: 3, name: "Navy Polo", category: "Tops", color: "#1A1A2E" },
  { id: 4, name: "Khaki Chinos", category: "Bottoms", color: "#C3B091" },
  { id: 5, name: "Camel Blazer", category: "Outerwear", color: "#A0522D" },
  { id: 6, name: "Black Tailored Pants", category: "Bottoms", color: "#1A1A1A" },
];

const inspirationProfiles: InspirationProfile[] = [
  {
    id: 1,
    nodeId: "lena",
    name: "Lena Hart",
    handle: "@lenalooks",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    note: "Soft tailoring, warm neutrals, and easy layering with a clean finish.",
    wardrobe: ["Boxy oat blazer", "Cream rib tank", "Wide-leg stone trousers"],
    similarity: 97,
    whyInOrbit: "Lena sits close because her softer tailoring still follows your preference for clean lines and restrained palettes.",
    topOverlap: "Warm neutrals, easy tailoring, and wardrobe-led layering.",
    bestBorrowedMove: "Soften your sharper fits with one lighter tailored layer.",
    soenNote: "Lena is useful when you want to stay polished but relax the energy slightly.",
    nextMove: "Try your camel blazer over a lighter base and keep the trousers fluid.",
    sharedSignals: {
      palette: ["Warm neutrals", "Low contrast"],
      silhouette: ["Soft tailoring", "Long trouser line"],
      wardrobe: ["Light blazer", "Relaxed separates"],
      energy: ["Calm", "Polished"],
    },
  },
  {
    id: 2,
    nodeId: "marcus",
    name: "Marcus Vale",
    handle: "@marcusmode",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
    note: "Sharp casual outfits built from polos, structured outerwear, and darker trousers.",
    wardrobe: ["Navy knit polo", "Camel overshirt", "Pleated black trousers"],
    similarity: 92,
    whyInOrbit: "Marcus matches because his wardrobe logic is nearly identical to yours, just pushed a little more structured.",
    topOverlap: "Polos, sharper outerwear, and darker tailored trousers.",
    bestBorrowedMove: "Increase contrast in evening fits without changing the base pieces.",
    soenNote: "Marcus is a strong reference when you want more presence from the same silhouette language.",
    nextMove: "Pair the navy polo with black tailored pants and let the outer layer do the sharpening.",
    sharedSignals: {
      palette: ["Dark anchors", "Controlled contrast"],
      silhouette: ["Structured top layer", "Straight trouser"],
      wardrobe: ["Polo", "Tailored pants"],
      energy: ["Sharp", "Off-duty control"],
    },
  },
  {
    id: 3,
    nodeId: "nina",
    name: "Nina Sloane",
    handle: "@ninasloane",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
    note: "Minimal wardrobe staples with tonal colour stories and cleaner sneakers.",
    wardrobe: ["Sand poplin shirt", "Taupe drawstring trousers", "White leather trainers"],
    similarity: 85,
    whyInOrbit: "Nina overlaps with your quieter side: tonal dressing, cleaner trainers, and low-noise styling choices.",
    topOverlap: "Tone-on-tone dressing with cleaner casual finishes.",
    bestBorrowedMove: "Let one tonal story carry the full fit instead of relying on contrast.",
    soenNote: "Nina is most useful when you want your fits to feel lighter and less deliberate without losing control.",
    nextMove: "Run the white linen shirt with khaki chinos and keep the accessories nearly invisible.",
    sharedSignals: {
      palette: ["Quiet tones", "Soft neutrals"],
      silhouette: ["Easy proportions", "Clean break"],
      wardrobe: ["Light shirting", "Sneakers"],
      energy: ["Easy", "Understated"],
    },
  },
  {
    id: 4,
    nodeId: "ava",
    name: "Ava Moreau",
    handle: "@avamoreau",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    note: "Elevated basics with cleaner contrasts, soft suiting, and polished off-duty layers.",
    wardrobe: ["Black funnel-neck top", "Ivory straight trousers", "Structured leather tote"],
    similarity: 78,
    whyInOrbit: "Ava sits in orbit because she uses the same clean base as you, but pushes it into a more elevated contrast story.",
    topOverlap: "Cleaner separates, stronger contrast, and polished day-to-night styling.",
    bestBorrowedMove: "Push one fit each week into a slightly more dressed evening direction.",
    soenNote: "Ava is your stretch match for sharper polish without abandoning your existing wardrobe logic.",
    nextMove: "Use the black tailored pants as your anchor and brighten the upper half of the fit.",
    sharedSignals: {
      palette: ["Black and ivory", "Sharper contrast"],
      silhouette: ["Clean column", "Refined structure"],
      wardrobe: ["Tailored trousers", "Structured layer"],
      energy: ["Elevated", "Controlled"],
    },
  },
  {
    id: 5,
    nodeId: "celine",
    name: "Celine Tran",
    handle: "@celinefits",
    avatar: "https://images.unsplash.com/photo-1681958758197-0a37ed2e72b2",
    note: "Oversized silhouettes, bold colour blocking, and textured layers with streetwear edge.",
    wardrobe: ["Oversized washed denim jacket", "Graphic tee", "Cargo trousers"],
    similarity: 66,
    whyInOrbit: "Celine is a stretch orbit profile. The overlap is more about confidence and layering than exact wardrobe matches.",
    topOverlap: "Texture, statement layering, and stronger visual tension.",
    bestBorrowedMove: "Introduce one louder layer while keeping the rest of your fit disciplined.",
    soenNote: "Celine shows where your style could expand if you want more texture and attitude without losing control.",
    nextMove: "Keep the base clean and try one oversized jacket or louder outer layer on top.",
    sharedSignals: {
      palette: ["Dark anchors", "Bolder contrast"],
      silhouette: ["Oversized outer layer", "Relaxed base"],
      wardrobe: ["Layering piece", "Graphic accent"],
      energy: ["Expressive", "Confident"],
    },
  },
  {
    id: 6,
    nodeId: "rafi",
    name: "Rafi Osei",
    handle: "@rafiosei",
    avatar: "https://images.unsplash.com/photo-1680474166817-d1c2539c0a61",
    note: "Relaxed modern cuts, earthy tones, and mixing high and low pieces effortlessly.",
    wardrobe: ["Linen chore jacket", "Ribbed henley", "Washed black jeans"],
    similarity: 54,
    whyInOrbit: "Rafi is in orbit because his relaxed shapes and earthy tones mirror your casual wardrobe instincts.",
    topOverlap: "Earth tones, relaxed tailoring, and practical layering.",
    bestBorrowedMove: "Loosen one weekend fit without losing the cleaner line underneath.",
    soenNote: "Rafi is useful when you want the fit to feel more lived-in while keeping the palette intentional.",
    nextMove: "Take your usual smart-casual base and soften it with a chore jacket or ribbed layer.",
    sharedSignals: {
      palette: ["Earth tones", "Washed neutrals"],
      silhouette: ["Relaxed top layer", "Straight leg"],
      wardrobe: ["Chore jacket", "Textured knit"],
      energy: ["Grounded", "Easy"],
    },
  },
];

const userProfile = {
  id: "you",
  name: "You",
  avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
  note: "Your current direction is clean, tailored, and wardrobe-led.",
};

const inspirationOutfits: InspirationOutfit[] = [
  {
    id: 1,
    profileNodeId: "lena",
    title: "Soft neutral tailoring",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
    popularity: "4.1k saves",
    reason: "Works because it overlaps with your linen shirt, beige trousers, and lighter layering pieces.",
    signal: "Soft tailoring with warm neutrals",
    translatesAs: "Use your lighter wardrobe pieces to soften the fit without losing structure.",
    matchingItems: ["White linen shirt", "Beige wide-leg trousers", "Camel blazer"],
  },
  {
    id: 2,
    profileNodeId: "lena",
    title: "Easy gallery-day look",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    popularity: "3.4k likes",
    reason: "A softer version of what you already wear, with the same relaxed tailoring and neutral balance.",
    signal: "Relaxed tailoring for daytime",
    translatesAs: "Keep the palette nearly tonal and let the proportions do the work.",
    matchingItems: ["White linen shirt", "Khaki chinos"],
  },
  {
    id: 3,
    profileNodeId: "marcus",
    title: "Sharp off-duty layers",
    image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2",
    popularity: "5.2k saves",
    reason: "This lands because your navy polo and black trousers already set up the same sharper silhouette.",
    signal: "Sharp off-duty contrast",
    translatesAs: "Lean into your darker anchors and let one clean top layer increase presence.",
    matchingItems: ["Navy polo", "Black tailored pants", "Camel blazer"],
  },
  {
    id: 4,
    profileNodeId: "marcus",
    title: "Minimal city uniform",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae",
    popularity: "2.9k likes",
    reason: "The clean dark base maps closely to pieces you already own, just with a slightly more structured finish.",
    signal: "Minimal city uniform",
    translatesAs: "Keep the fit narrow, darker, and uninterrupted through the leg.",
    matchingItems: ["Black tailored pants", "White sneakers"],
  },
  {
    id: 5,
    profileNodeId: "nina",
    title: "Tone-on-tone essentials",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105",
    popularity: "4.8k saves",
    reason: "It stays in your lane: quiet tones, cleaner sneakers, and easy separation between top and bottom.",
    signal: "Tone-on-tone essentials",
    translatesAs: "Let quieter neutrals carry the fit when you want low effort and high control.",
    matchingItems: ["White linen shirt", "Khaki chinos", "White sneakers"],
  },
  {
    id: 6,
    profileNodeId: "nina",
    title: "Clean weekend edit",
    image: "https://images.unsplash.com/photo-1651742532474-ea4401a34a10",
    popularity: "2.5k likes",
    reason: "The proportions and palette line up with the pieces already sitting in your wardrobe rotation.",
    signal: "Weekend tonal ease",
    translatesAs: "Keep contrast low and let one tailored layer sharpen the weekend base.",
    matchingItems: ["Beige wide-leg trousers", "Camel blazer"],
  },
  {
    id: 7,
    profileNodeId: "ava",
    title: "Polished contrast dressing",
    image: "https://images.unsplash.com/photo-1651744258699-d322dff9632c",
    popularity: "3.8k saves",
    reason: "A more elevated branch of your current wardrobe, using the same clean separates with stronger contrast.",
    signal: "Polished contrast dressing",
    translatesAs: "Build from your cleanest separates and push the contrast one step further for evening energy.",
    matchingItems: ["Black tailored pants", "White linen shirt"],
  },
  {
    id: 8,
    profileNodeId: "ava",
    title: "Structured evening casual",
    image: "https://images.unsplash.com/photo-1651744258886-7987b4d3e949",
    popularity: "2.2k likes",
    reason: "It borrows your sharper pieces and pushes them one step further without needing a full wardrobe change.",
    signal: "Structured evening casual",
    translatesAs: "Use the same wardrobe logic you already trust, just with a cleaner, more dressed finish.",
    matchingItems: ["Camel blazer", "Black tailored pants"],
  },
  {
    id: 9,
    profileNodeId: "celine",
    title: "Oversized denim moment",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
    popularity: "5.1k saves",
    reason: "Uses the same oversized proportions you're drawn to, with added texture from the washed denim.",
    signal: "Oversized texture play",
    translatesAs: "Borrow the attitude of the outer layer while keeping your base sharper and quieter.",
    matchingItems: ["Oversized denim jacket", "Graphic tee", "Cargo trousers"],
  },
  {
    id: 10,
    profileNodeId: "celine",
    title: "Bold colour block edit",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    popularity: "3.9k likes",
    reason: "Matches your vibe if you're going for something louder without leaving your comfort zone.",
    signal: "Bold colour blocking",
    translatesAs: "Keep one louder piece, then neutralize the rest of the fit so it still feels like you.",
    matchingItems: ["Washed bomber", "Black graphic tee", "Slim cargo pants"],
  },
  {
    id: 11,
    profileNodeId: "rafi",
    title: "Earthy weekend layers",
    image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2",
    popularity: "4.3k saves",
    reason: "Earth tones and relaxed tailoring align with what you already reach for on weekends.",
    signal: "Earthy relaxed layers",
    translatesAs: "Relax the top half of the fit while keeping the line of the trouser clean.",
    matchingItems: ["Linen chore jacket", "Ribbed henley", "Washed black jeans"],
  },
  {
    id: 12,
    profileNodeId: "rafi",
    title: "Smart casual refresh",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    popularity: "2.8k likes",
    reason: "Pulls from your existing wardrobe but reframes it with smarter proportions and tonal cohesion.",
    signal: "Smart casual refresh",
    translatesAs: "Use one textured layer to make your usual smart-casual base feel more considered.",
    matchingItems: ["Cream knit polo", "Tan chinos", "White sneakers"],
  },
];

const interactivePillClass = "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors active:scale-95";

const compactListRowClass =
  "flex min-h-[4.5rem] items-center gap-3 rounded-2xl border border-border bg-card p-3 transition-colors hover:bg-muted/40 active:scale-[0.98]";

const sectionSurfaceClass = "app-surface p-3";
const briefSectionClass = "app-surface px-3 py-2.5";

const recommendations: OutfitRecommendation[] = [
  {
    id: 1,
    outfit: { top: "White Linen Shirt", bottom: "Beige Wide-Leg Trousers", shoes: "Leather Loafers" },
    occasion: "Casual office",
    style: "Minimalist Chic",
    confidence: 94,
    weather: "sunny",
    note: "Keeps the palette light while still feeling sharp enough for meetings.",
  },
  {
    id: 2,
    outfit: { top: "Camel Blazer", bottom: "Black Tailored Pants", shoes: "Chelsea Boots" },
    occasion: "Business meeting",
    style: "Professional",
    confidence: 91,
    weather: "cloudy",
    note: "The blazer adds structure without making the look feel too formal or heavy.",
  },
  {
    id: 3,
    outfit: { top: "Navy Polo", bottom: "Khaki Chinos", shoes: "White Sneakers" },
    occasion: "Outdoor lunch",
    style: "Smart Casual",
    confidence: 86,
    weather: "rainy",
    note: "Balanced proportions and practical shoes make this easy to wear all day.",
  },
];

const pastFits: PastFit[] = [
  {
    id: 101,
    outfit: { top: "Camel Blazer", bottom: "Khaki Chinos", shoes: "White Sneakers" },
    occasion: "Client lunch",
    style: "Easy tailored",
    confidence: 89,
    weather: "sunny",
    note: "You landed on a sharper daytime balance here, and it is worth repeating when you want polish without stiffness.",
    date: "Last Thursday",
    source: "Worn",
  },
  {
    id: 102,
    outfit: { top: "White Linen Shirt", bottom: "Black Tailored Pants", shoes: "Chelsea Boots" },
    occasion: "Dinner plans",
    style: "Clean contrast",
    confidence: 92,
    weather: "cloudy",
    note: "This fit worked because the contrast stayed clean and the silhouette stayed controlled from top to bottom.",
    date: "6 days ago",
    source: "Saved",
  },
];

const dnaSignals = [
  "Clean contrast",
  "Tailored base",
  "Quiet confidence",
  "Controlled silhouette",
  "Low-noise palette",
];

const styleGenome: StyleBase[] = [
  {
    base: "A",
    label: "Aesthetic",
    trait: "Tailored",
    score: 94,
    note: "Your strongest read starts with cleaner structure and a composed first impression.",
  },
  {
    base: "T",
    label: "Tailoring",
    trait: "Sharp",
    score: 91,
    note: "You look best when the line stays controlled through the shoulder, waist, and trouser break.",
  },
  {
    base: "C",
    label: "Colour",
    trait: "Low-noise",
    score: 88,
    note: "Restrained palettes keep the fit intentional and let one contrast point do the work.",
  },
  {
    base: "G",
    label: "Grounding",
    trait: "Quiet confidence",
    score: 92,
    note: "Even your stronger looks land best when they feel calm, precise, and wardrobe-native.",
  },
];

const styleGenomeSequence = styleGenome.map((item) => item.base).join("-");
const styleGenomeSummary = styleGenome.map((item) => item.trait).join(" / ");

const silhouetteNotes = [
  "Straighter trouser lines give your fits the cleanest finish.",
  "A sharper top layer works best when the rest of the look stays calm.",
  "Controlled volume beats oversized shapes when you want presence without noise.",
];

const wardrobeGaps = [
  "Dark leather loafer",
  "Structured transitional jacket",
  "Cool-toned knit layer",
  "Sharper evening trouser",
];

const dnaPracticeLooks: DnaPracticeLook[] = [
  {
    id: 1,
    title: "Quiet office control",
    description:
      "A restrained palette, cleaner break at the trouser, and one sharper layer keeps the fit confident without looking overworked.",
  },
  {
    id: 2,
    title: "Off-duty precision",
    description:
      "Even the relaxed version of your style works best when the lines stay neat and the palette stays disciplined.",
  },
];

const fitReasons = [
  {
    label: "Silhouette",
    text: "A cleaner top line and straighter trouser shape keep the fit controlled from the first read.",
  },
  {
    label: "Palette",
    text: "Warm neutrals and darker anchors keep the composition calm without flattening it.",
  },
  {
    label: "Context",
    text: "It is polished enough for a full day out, but still relaxed enough to feel natural on you.",
  },
  {
    label: "Why it feels like you",
    text: "The fit follows your DNA: tailored base, low-noise colour, and one piece carrying the tension.",
  },
];

const buildAroundItem = {
  title: "Build around your white linen shirt",
  description:
    "Keep the shirt open at the neck, add the black tailored pants, and finish with loafers or clean sneakers depending on how sharp you want the day to feel.",
  supporting: [
    "Adds contrast without heaviness",
    "Already aligned with your strongest palette",
    "Easy to shift from day to evening",
  ],
};

function weatherIcon(kind: WeatherKind) {
  if (kind === "sunny") return <Sun className="h-3 w-3 text-muted-foreground" />;
  if (kind === "cloudy") return <Cloud className="h-3 w-3 text-muted-foreground" />;
  return <Droplet className="h-3 w-3 text-muted-foreground" />;
}

export function Stylist() {
  const [activeTab, setActiveTab] = useState<TabId>("ai");
  const [selectedPreferences, setSelectedPreferences] = useState<Set<string>>(
    new Set(["Casual", "Minimal", "Clean sneakers"]),
  );
  const [likedOutfits, setLikedOutfits] = useState<Set<number>>(new Set());
  const [selectedSkinTone, setSelectedSkinTone] = useState<string>("medium");
  const [selectedPalette, setSelectedPalette] = useState<string>("Autumn Earth");
  const [selectedInspirationNodeId, setSelectedInspirationNodeId] = useState<string>(inspirationProfiles[0].nodeId);
  const [generating, setGenerating] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "ai",
      text: "I’m SŌEN. Give me the occasion, the weather, or one piece you want to wear, and I’ll turn it into a fit direction that feels like you.",
    },
  ]);
  const shouldAnimate = !useReducedMotion();

  const generateTimeoutRef = useRef<number | null>(null);
  const replyTimeoutRef = useRef<number | null>(null);

  const currentWeather = weather.sunny;
  const WeatherIcon = currentWeather.icon;
  const activePalette = colorPalettes.find((palette) => palette.name === selectedPalette) ?? colorPalettes[0];
  const featuredRecommendation = recommendations[0];
  const alternativeRecommendations = recommendations.slice(1);
  const selectedInspiration =
    inspirationProfiles.find((profile) => profile.nodeId === selectedInspirationNodeId) ?? inspirationProfiles[0];
  const selectedInspirationOutfits = inspirationOutfits.filter(
    (outfit) => outfit.profileNodeId === selectedInspiration.nodeId,
  );
  const borrowedOrbitFit = selectedInspirationOutfits[0];
  const initialPositions = useMemo(() => {
    const map: Record<string, { x: number; y: number }> = {
      [userProfile.id]: { x: -(USER_NODE_SIZE / 2), y: -(USER_NODE_SIZE / 2) },
    };
    inspirationProfiles.forEach((profile, index) => {
      const angle = (index / inspirationProfiles.length) * Math.PI * 2 - Math.PI / 2;
      const radius = getOrbitRadius(profile.similarity);
      map[profile.nodeId] = { x: Math.cos(angle) * radius - 28, y: Math.sin(angle) * radius - 28 };
    });
    return map;
  }, []);
  const targetPositionsRef = useRef<Record<string, { x: number; y: number }>>({ ...initialPositions });

  const [graphNodes, setGraphNodes] = useState<Node<CircleNodeData>[]>(() => [
    {
      id: userProfile.id,
      type: "circle",
      position: initialPositions[userProfile.id],
      data: { label: userProfile.name, avatar: userProfile.avatar, isUser: true },
    },
    ...inspirationProfiles.map((profile) => ({
      id: profile.nodeId,
      type: "circle" as const,
      position: initialPositions[profile.nodeId],
      data: {
        label: profile.name,
        avatar: profile.avatar,
        selected: profile.nodeId === inspirationProfiles[0].nodeId,
      },
    })),
  ]);

  const springFramesRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    setGraphNodes((nodes) =>
      nodes.map((n) => ({ ...n, data: { ...n.data, selected: n.id === selectedInspirationNodeId } })),
    );
  }, [selectedInspirationNodeId]);

  useEffect(() => {
    const frames = springFramesRef.current;
    return () => {
      frames.forEach((id) => cancelAnimationFrame(id));
      frames.clear();
    };
  }, []);

  const handleNodesChange = (changes: NodeChange<Node<CircleNodeData>>[]) => {
    setGraphNodes((nodes) => applyNodeChanges(changes, nodes));
  };

  const springBackToOrigin = (nodeId: string) => {
    const current = graphNodes.find((n) => n.id === nodeId);
    if (!current) return;
    let origin: { x: number; y: number };
    if (nodeId === userProfile.id) {
      origin = initialPositions[userProfile.id];
    } else {
      const profile = inspirationProfiles.find((item) => item.nodeId === nodeId);
      if (!profile) return;
      const half = 28;
      const cx = current.position.x + half;
      const cy = current.position.y + half;
      const angle = Math.atan2(cy, cx);
      const radius = getOrbitRadius(profile.similarity);
      origin = {
        x: Math.cos(angle) * radius - half,
        y: Math.sin(angle) * radius - half,
      };
    }
    targetPositionsRef.current[nodeId] = origin;
    const frames = springFramesRef.current;
    const existing = frames.get(nodeId);
    if (existing) cancelAnimationFrame(existing);

    const stiffness = 0.12;
    const damping = 0.72;
    let vx = 0;
    let vy = 0;

    const step = () => {
      let done = false;
      setGraphNodes((nodes) =>
        nodes.map((n) => {
          if (n.id !== nodeId) return n;
          const dx = origin.x - n.position.x;
          const dy = origin.y - n.position.y;
          vx = (vx + dx * stiffness) * damping;
          vy = (vy + dy * stiffness) * damping;
          const nx = n.position.x + vx;
          const ny = n.position.y + vy;
          if (Math.abs(dx) < 0.3 && Math.abs(dy) < 0.3 && Math.abs(vx) < 0.3 && Math.abs(vy) < 0.3) {
            done = true;
            return { ...n, position: { x: origin.x, y: origin.y } };
          }
          return { ...n, position: { x: nx, y: ny } };
        }),
      );
      if (done) {
        frames.delete(nodeId);
      } else {
        frames.set(nodeId, requestAnimationFrame(step));
      }
    };
    frames.set(nodeId, requestAnimationFrame(step));
  };

  const inspirationGraphEdges: Edge[] = inspirationProfiles.map((profile) => ({
    id: `${userProfile.id}-${profile.nodeId}`,
    source: userProfile.id,
    target: profile.nodeId,
    type: "floating",
    style: {
      stroke: profile.nodeId === selectedInspirationNodeId ? "#030213" : "rgba(0,0,0,0.2)",
      strokeWidth: 1,
    },
  }));
  const tabPanelMotionProps = shouldAnimate
    ? {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
      }
    : {};

  useEffect(() => {
    return () => {
      if (generateTimeoutRef.current !== null) window.clearTimeout(generateTimeoutRef.current);
      if (replyTimeoutRef.current !== null) window.clearTimeout(replyTimeoutRef.current);
    };
  }, []);

  const togglePreference = (label: string) => {
    setSelectedPreferences((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const toggleLike = (id: number) => {
    setLikedOutfits((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const generateOutfits = () => {
    if (generateTimeoutRef.current !== null) window.clearTimeout(generateTimeoutRef.current);
    setGenerating(true);
    generateTimeoutRef.current = window.setTimeout(() => setGenerating(false), 1200);
  };

  const handleSendMessage = (prompt?: string) => {
    const nextMessage = (prompt ?? chatInput).trim();
    if (!nextMessage) return;

    setChatMessages((prev) => [...prev, { id: Date.now(), role: "user", text: nextMessage }]);
    setChatInput("");

    if (replyTimeoutRef.current !== null) window.clearTimeout(replyTimeoutRef.current);
    replyTimeoutRef.current = window.setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          text: "Start with a clean base, then anchor it with one sharper signal. Your linen shirt or navy polo already gives you that control, so I would pair one with tailored trousers or chinos and bring in the camel blazer only if you want more presence.",
        },
      ]);
    }, 900);
  };

  return (
    <PageShell contentClassName="h-full min-h-0 overflow-hidden bg-background pb-0">
      <motion.div
        layout={shouldAnimate}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="app-page-content flex h-full min-h-0 flex-col gap-3 overflow-hidden px-0 pb-2"
      >
        <div className={`${briefSectionClass} shrink-0`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold text-foreground">Today&apos;s direction</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {currentWeather.hint} Built around what feels right today, not just what fills the rail.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2 rounded-2xl px-3 py-2">
              <WeatherIcon className="h-4 w-4 text-foreground" />
              <span className="text-xl font-semibold">{currentWeather.label}</span>
            </div>
          </div>
        </div>
        <motion.div
          layout={shouldAnimate}
          transition={{ duration: 0.24, ease: "easeOut" }}
          className="flex shrink-0 justify-center px-3"
        >
          <div className="inline-flex flex-wrap justify-center rounded-full border border-border bg-card p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>
        <div className="min-h-0 flex-1 overflow-hidden px-3">
          <AnimatePresence mode="wait">
            {activeTab === "ai" && (
              <motion.div
                key="ai"
                layout={shouldAnimate}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="h-full min-h-0 overflow-hidden"
                {...tabPanelMotionProps}
              >
                <div className="flex h-full min-h-0 flex-col overflow-hidden">
                  <div className="min-h-0 flex-1 overflow-hidden">
                    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl">
                      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain px-2.5 py-2.5 pr-2">
                        {chatMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                                message.role === "user" ? "bg-foreground text-background" : "text-foreground"
                              }`}
                            >
                              {message.text}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="shrink-0 px-2.5 py-2.5">
                        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                          {quickPrompts.map((prompt) => (
                            <button
                              key={prompt}
                              type="button"
                              onClick={() => handleSendMessage(prompt)}
                              className={`${interactivePillClass} shrink-0 border-border bg-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground`}
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <input
                            type="text"
                            value={chatInput}
                            onChange={(event) => setChatInput(event.target.value)}
                            onKeyDown={(event) => event.key === "Enter" && handleSendMessage()}
                            placeholder="Ask SŌEN..."
                            className="h-12 flex-1 rounded-full border border-border bg-transparent px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                          <button
                            type="button"
                            aria-label="Send message"
                            onClick={() => handleSendMessage()}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-colors hover:bg-foreground/90 active:scale-95"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "outfits" && (
              <motion.div
                key="outfits"
                layout={shouldAnimate}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="h-full min-h-0 space-y-4 overflow-y-auto overscroll-contain pr-1"
                {...tabPanelMotionProps}
              >
                <div className={sectionSurfaceClass}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-semibold text-foreground">Your signals</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Keep your fit signals tight so today&apos;s recommendations stay aligned.
                      </p>
                    </div>
                    <Button
                      onClick={generateOutfits}
                      disabled={generating}
                      size="sm"
                      variant="outline"
                      className="rounded-full border-border bg-transparent text-foreground"
                    >
                      <RefreshCw className={`h-4 w-4 ${generating ? "animate-spin" : ""}`} />
                      {generating ? "Refreshing" : "Refresh"}
                    </Button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {preferences.map((label) => {
                      const selected = selectedPreferences.has(label);

                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => togglePreference(label)}
                          className={`${interactivePillClass} ${
                            selected
                              ? "border-foreground bg-foreground text-background"
                              : "border-border bg-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                          }`}
                        >
                          <span className="inline-flex items-center gap-1">
                            {label}
                            {selected && <Check className="h-3 w-3" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className={sectionSurfaceClass}>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">What to wear today</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Start with the strongest fit for today, shaped by your wardrobe, your signals, and the pace of the
                      day.
                    </p>
                  </div>

                  <div className="mt-4 rounded-2xl border border-border px-4 py-4">
                    <div className="flex items-start gap-3">
                      <button
                        type="button"
                        aria-label={
                          likedOutfits.has(featuredRecommendation.id)
                            ? `Unlike ${featuredRecommendation.style}`
                            : `Like ${featuredRecommendation.style}`
                        }
                        onClick={() => toggleLike(featuredRecommendation.id)}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border transition-transform active:scale-95"
                      >
                        <Heart
                          className={`h-4 w-4 ${likedOutfits.has(featuredRecommendation.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                        />
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">{featuredRecommendation.style}</p>
                            <p className="text-xs text-muted-foreground">{featuredRecommendation.occasion}</p>
                          </div>
                          <div className="shrink-0 text-right">
                            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                              {featuredRecommendation.confidence}%
                            </div>
                            <div className="mt-1 flex items-center justify-end gap-1">
                              {weatherIcon(featuredRecommendation.weather)}
                            </div>
                          </div>
                        </div>

                        <p className="mt-3 text-sm text-foreground">
                          {featuredRecommendation.outfit.top} with {featuredRecommendation.outfit.bottom} and{" "}
                          {featuredRecommendation.outfit.shoes}
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">{featuredRecommendation.note}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={sectionSurfaceClass}>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">Alternatives</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Two nearby directions when you want to go sharper or easier without leaving your lane.
                    </p>
                  </div>

                  <div className="mt-4 space-y-3">
                    {alternativeRecommendations.map((rec) => (
                      <div
                        key={rec.id}
                        className="rounded-2xl border border-border px-3.5 py-3 transition-colors hover:bg-muted/40 active:scale-[0.98]"
                      >
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            aria-label={likedOutfits.has(rec.id) ? `Unlike ${rec.style}` : `Like ${rec.style}`}
                            onClick={() => toggleLike(rec.id)}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border transition-transform active:scale-95"
                          >
                            <Heart
                              className={`h-4 w-4 ${likedOutfits.has(rec.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                            />
                          </button>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-medium text-foreground">{rec.style}</p>
                                <p className="text-xs text-muted-foreground">{rec.occasion}</p>
                              </div>
                              <div className="shrink-0 text-right">
                                <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                                  {rec.confidence}%
                                </div>
                                <div className="mt-1 flex items-center justify-end gap-1">
                                  {weatherIcon(rec.weather)}
                                </div>
                              </div>
                            </div>

                            <p className="mt-2 text-sm text-foreground">
                              {rec.outfit.top} with {rec.outfit.bottom} and {rec.outfit.shoes}
                            </p>
                            <p className="mt-1.5 text-xs text-muted-foreground">{rec.note}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={sectionSurfaceClass}>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">Why this works</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      The logic behind today&apos;s fit, grounded in your style DNA.
                    </p>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    {fitReasons.map((reason) => (
                      <div key={reason.label} className="rounded-2xl border border-border px-3.5 py-3">
                        <div className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                          {reason.label}
                        </div>
                        <p className="mt-1.5 text-sm text-foreground">{reason.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={sectionSurfaceClass}>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">Build around</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Start from one piece you already own and let the rest of the fit follow.
                    </p>
                  </div>

                  <div className="mt-4 rounded-2xl border border-border px-3.5 py-3">
                    <p className="text-sm font-medium text-foreground">{buildAroundItem.title}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{buildAroundItem.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {buildAroundItem.supporting.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={sectionSurfaceClass}>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">Past fits</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Recent directions worth revisiting when you want something proven.
                    </p>
                  </div>

                  <div className="mt-4 space-y-3">
                    {pastFits.map((fit) => (
                      <div key={fit.id} className="rounded-2xl border border-border px-3.5 py-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-medium text-foreground">{fit.style}</p>
                                <p className="text-xs text-muted-foreground">{fit.occasion}</p>
                              </div>
                              <div className="shrink-0 text-right">
                                <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                                  {fit.confidence}%
                                </div>
                                <div className="mt-1 flex items-center justify-end gap-1">
                                  {weatherIcon(fit.weather)}
                                </div>
                              </div>
                            </div>

                            <p className="mt-2 text-sm text-foreground">
                              {fit.outfit.top} with {fit.outfit.bottom} and {fit.outfit.shoes}
                            </p>
                            <p className="mt-1.5 text-xs text-muted-foreground">{fit.note}</p>
                            <div className="mt-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                              <span>{fit.date}</span>
                              <span className="h-1 w-1 rounded-full bg-border" />
                              <span>{fit.source}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "colour" && (
              <motion.div
                key="colour"
                layout={shouldAnimate}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="h-full min-h-0 space-y-4 overflow-y-auto overscroll-contain pr-1"
                {...tabPanelMotionProps}
              >
                <div className={sectionSurfaceClass}>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">Identity</h2>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                          Primary identity
                        </div>
                        <div className="mt-1 text-sm font-medium text-foreground">Tailored and Dangerous</div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Stability</div>
                        <div className="mt-1 text-sm font-medium text-foreground">92%</div>
                      </div>
                    </div>

                    <div className="mt-3 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      Secondary trait
                    </div>
                    <div className="mt-1 text-sm font-medium text-foreground">Quiet confidence</div>

                    <div className="mt-4 border-y border-border py-3">
                      <div className="flex flex-wrap items-center gap-2">
                        {styleGenome.map((item) => (
                          <div
                            key={item.base}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-sm font-semibold text-foreground"
                          >
                            {item.base}
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        Genome sequence
                      </div>
                      <div className="mt-1 text-sm font-medium text-foreground">{styleGenomeSequence}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{styleGenomeSummary}</div>
                    </div>

                    <p className="mt-4 text-sm text-muted-foreground">
                      Your style leans clean, controlled, and wardrobe-led. You look strongest when the silhouette is
                      sharp, the palette stays disciplined, and one piece carries the tension.
                    </p>

                    <div className="mt-4 divide-y divide-border border-t border-border">
                      {styleGenome.map((item) => (
                        <div key={item.base} className="py-3 first:pt-3 last:pb-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-2">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-sm font-semibold text-foreground">
                                {item.base}
                              </div>
                              <div className="min-w-0">
                                <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                                  {item.label}
                                </div>
                                <div className="mt-1 text-sm font-medium text-foreground">{item.trait}</div>
                              </div>
                            </div>
                            <div className="shrink-0 text-right">
                              <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                                Weight
                              </div>
                              <div className="mt-1 text-sm font-medium text-foreground">{item.score}%</div>
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{item.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 text-xs font-medium text-muted-foreground">Core signals</div>
                    <div className="flex flex-wrap gap-1.5">
                      {dnaSignals.map((signal) => (
                        <span
                          key={signal}
                          className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground"
                        >
                          {signal}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {skinTones.map((tone) => {
                      const selected = selectedSkinTone === tone.id;

                      return (
                        <button
                          key={tone.id}
                          type="button"
                          onClick={() => setSelectedSkinTone(tone.id)}
                          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors active:scale-95 ${
                            selected
                              ? "border-foreground bg-foreground text-background"
                              : "border-border bg-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                          }`}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            {tone.label}
                            {selected ? <Check className="h-3.5 w-3.5" /> : null}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3 border-t border-border pt-3">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Palette signal</div>
                    <div className="mt-1 text-sm text-foreground">
                      {skinTones.find((tone) => tone.id === selectedSkinTone)?.recommended}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {colorPalettes.map((palette) => {
                      const selected = selectedPalette === palette.name;

                      return (
                        <button
                          key={palette.name}
                          type="button"
                          onClick={() => setSelectedPalette(palette.name)}
                          className={`${interactivePillClass} ${
                            selected
                              ? "border-foreground bg-foreground text-background"
                              : "border-border bg-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                          }`}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <span className="flex gap-0.5">
                              {palette.colors.slice(0, 2).map((color) => (
                                <span
                                  key={color}
                                  className="h-3 w-3 rounded-full border border-white/30"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </span>
                            {palette.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex gap-2">
                    {activePalette.colors.map((color) => (
                      <div key={color} className="h-8 w-8 rounded-full" style={{ backgroundColor: color }} />
                    ))}
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground">{activePalette.note}</p>
                </div>

                <div className={sectionSurfaceClass}>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">Silhouette</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      The proportions that consistently make your style read cleanest.
                    </p>
                  </div>

                  <div className="mt-4 divide-y divide-border border-t border-border">
                    {silhouetteNotes.map((note) => (
                      <div key={note} className="py-3 text-sm text-foreground first:pt-3 last:pb-0">
                        {note}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={sectionSurfaceClass}>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">Wardrobe gaps</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Pieces that would strengthen your DNA instead of pulling it sideways.
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {wardrobeGaps.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={sectionSurfaceClass}>
                  <div>
                    <h2 className="text-base font-semibold text-foreground">DNA in practice</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      How your identity shows up when it is translated into real fits.
                    </p>
                  </div>

                  <div className="mt-4 divide-y divide-border border-t border-border">
                    {dnaPracticeLooks.map((look) => (
                      <div key={look.id} className="py-3 first:pt-3 last:pb-0">
                        <p className="text-sm font-medium text-foreground">{look.title}</p>
                        <p className="mt-1.5 text-sm text-muted-foreground">{look.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={sectionSurfaceClass}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-semibold text-foreground">Wardrobe matches</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Pieces in your wardrobe that already support this DNA, first by palette and then in full.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full border-border bg-transparent text-foreground"
                    >
                      <Plus className="h-4 w-4" />
                      Add items
                    </Button>
                  </div>

                  <div className="mt-4 space-y-2.5">
                    {wardrobeItems.map((item) => (
                      <div key={item.id} className={compactListRowClass}>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border">
                          <div
                            className="h-5 w-5 rounded-md border border-border"
                            style={{ backgroundColor: item.color }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-foreground">{item.name}</div>
                          <div className="text-xs text-muted-foreground">{item.category}</div>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 border-t border-border pt-4">
                    <div className="mb-3 text-xs font-medium text-muted-foreground">All wardrobe items</div>
                    <div className="space-y-2.5">
                      {wardrobeItems.map((item) => (
                        <div key={item.id} className={compactListRowClass}>
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-border">
                            <div
                              className="h-6 w-6 rounded-lg border border-border"
                              style={{ backgroundColor: item.color }}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-foreground">{item.name}</div>
                            <div className="text-xs text-muted-foreground">{item.category}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "inspirations" && (
              <motion.div
                key="inspirations"
                layout={shouldAnimate}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="h-full min-h-0 space-y-4 overflow-y-auto overscroll-contain pr-1"
                {...tabPanelMotionProps}
              >
                <div className={sectionSurfaceClass}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-semibold text-foreground">Your style graph</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        People whose style overlaps with your DNA, wardrobe, and fit behavior.
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-xs text-muted-foreground">In orbit</div>
                      <div className="mt-1 text-sm font-medium text-foreground">{selectedInspiration.name}</div>
                    </div>
                  </div>

                  <div className="mt-4 overflow-hidden rounded-2xl border border-border">
                    <div className="relative h-72 w-full overflow-hidden">
                      <ReactFlow
                        nodes={graphNodes}
                        edges={inspirationGraphEdges}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        onNodesChange={handleNodesChange}
                        onNodeDragStop={(_, node) => springBackToOrigin(node.id)}
                        fitView
                        fitViewOptions={{ padding: 0.25 }}
                        translateExtent={[
                          [-500, -400],
                          [500, 400],
                        ]}
                        minZoom={0.6}
                        maxZoom={2}
                        panOnDrag
                        zoomOnScroll
                        zoomOnPinch
                        zoomOnDoubleClick={false}
                        nodesConnectable={false}
                        nodesDraggable
                        elementsSelectable
                        proOptions={{ hideAttribution: true }}
                        onNodeClick={(_, node) => {
                          if (node.id !== userProfile.id) {
                            setSelectedInspirationNodeId(node.id);
                          }
                        }}
                      >
                        <Background color="rgba(0,0,0,0.04)" gap={20} size={1} />
                      </ReactFlow>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-border px-3.5 py-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={selectedInspiration.avatar}
                        alt={selectedInspiration.name}
                        className="h-12 w-12 rounded-full border border-white/15 object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium text-foreground">{selectedInspiration.name}</div>
                          <div className="text-xs text-muted-foreground">{selectedInspiration.handle}</div>
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">{selectedInspiration.note}</div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                          {selectedInspiration.similarity}%
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">match</div>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
                      <div className="rounded-2xl border border-border px-3 py-3">
                        <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Why in orbit</div>
                        <p className="mt-1.5 text-sm text-foreground">{selectedInspiration.whyInOrbit}</p>
                      </div>
                      <div className="rounded-2xl border border-border px-3 py-3">
                        <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Top overlap</div>
                        <p className="mt-1.5 text-sm text-foreground">{selectedInspiration.topOverlap}</p>
                      </div>
                      <div className="rounded-2xl border border-border px-3 py-3">
                        <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Best borrowed move</div>
                        <p className="mt-1.5 text-sm text-foreground">{selectedInspiration.bestBorrowedMove}</p>
                      </div>
                    </div>

                    <div className="mt-3 rounded-2xl border border-border px-3 py-3">
                      <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">SŌEN note</div>
                      <p className="mt-1.5 text-sm text-foreground">{selectedInspiration.soenNote}</p>
                    </div>
                  </div>
                </div>

                {borrowedOrbitFit ? (
                  <div className={sectionSurfaceClass}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-base font-semibold text-foreground">Borrowed from orbit</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                          One translated fit direction pulled from {selectedInspiration.name}&apos;s orbit and grounded in your wardrobe.
                        </p>
                      </div>
                      <Sparkles className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </div>

                    <div className="mt-4 rounded-2xl border border-border overflow-hidden">
                      <img src={borrowedOrbitFit.image} alt={borrowedOrbitFit.title} className="aspect-[4/5] w-full object-cover" />
                      <div className="space-y-3 px-4 py-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-medium text-foreground">{borrowedOrbitFit.title}</div>
                            <div className="mt-1 text-xs text-muted-foreground">{borrowedOrbitFit.signal}</div>
                          </div>
                          <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                            {selectedInspiration.similarity}% match
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{borrowedOrbitFit.translatesAs}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {borrowedOrbitFit.matchingItems.map((item) => (
                            <span key={item} className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className={sectionSurfaceClass}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-semibold text-foreground">
                        What to borrow from {selectedInspiration.name}
                      </h2>
                    </div>
                    <Sparkles className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </div>

                  <div className="mt-4 space-y-4">
                    {selectedInspirationOutfits.map((outfit) => (
                      <div key={outfit.id} className="rounded-2xl border border-border overflow-hidden">
                        <img src={outfit.image} alt={outfit.title} className="aspect-[4/5] w-full object-cover" />
                        <div className="px-4 py-4 space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm font-medium text-foreground">{outfit.title}</div>
                              <div className="mt-1 text-xs text-muted-foreground">{outfit.popularity}</div>
                            </div>
                            <img
                              src={selectedInspiration.avatar}
                              alt={selectedInspiration.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          </div>
                          <div className="rounded-2xl border border-border px-3 py-2">
                            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Signal</div>
                            <div className="mt-1 text-sm text-foreground">{outfit.signal}</div>
                          </div>
                          <p className="text-sm text-muted-foreground">{outfit.reason}</p>
                          <div className="rounded-2xl border border-border px-3 py-2">
                            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Why it translates</div>
                            <div className="mt-1 text-sm text-foreground">{outfit.translatesAs}</div>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {outfit.matchingItems.map((item) => (
                              <span
                                key={item}
                                className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 border-t border-border pt-4">
                    <div className="mb-3 text-xs font-medium text-muted-foreground">Shared signals</div>
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      <div className="rounded-2xl border border-border px-3 py-3">
                        <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Palette</div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {selectedInspiration.sharedSignals.palette.map((item) => (
                            <span key={item} className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-border px-3 py-3">
                        <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Silhouette</div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {selectedInspiration.sharedSignals.silhouette.map((item) => (
                            <span key={item} className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-border px-3 py-3">
                        <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Wardrobe</div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {selectedInspiration.sharedSignals.wardrobe.map((item) => (
                            <span key={item} className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="rounded-2xl border border-border px-3 py-3">
                        <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Energy</div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {selectedInspiration.sharedSignals.energy.map((item) => (
                            <span key={item} className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-border px-3 py-3">
                      <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Next move</div>
                      <p className="mt-1.5 text-sm text-foreground">{selectedInspiration.nextMove}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </PageShell>
  );
}
