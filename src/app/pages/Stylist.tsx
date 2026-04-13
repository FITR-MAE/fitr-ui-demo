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

import { PageHeader, PageShell } from "../components/Page";
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
};

type InspirationOutfit = {
  id: number;
  profileNodeId: string;
  title: string;
  image: string;
  popularity: string;
  reason: string;
  matchingItems: string[];
};

type CircleNodeData = {
  label: string;
  avatar?: string;
  selected?: boolean;
  isUser?: boolean;
};

const CircleNode: React.FC<NodeProps<Node<CircleNodeData>>> = ({ data }) => {
  const { label, avatar, selected, isUser } = data;
  const size = isUser ? 64 : 56;
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
  const halfFor = (nodeId: string) => (nodeId === "you" ? 32 : 28);
  const sx = sourceNode.internals.positionAbsolute.x + halfFor(source);
  const sy = sourceNode.internals.positionAbsolute.y + halfFor(source);
  const tx = targetNode.internals.positionAbsolute.x + halfFor(target);
  const ty = targetNode.internals.positionAbsolute.y + halfFor(target);
  const [path] = getStraightPath({ sourceX: sx, sourceY: sy, targetX: tx, targetY: ty });
  return <BaseEdge id={id} path={path} style={style} />;
};

const edgeTypes = { floating: FloatingEdge };

const tabs = [
  { id: "ai", label: "Chat" },
  { id: "outfits", label: "Looks" },
  { id: "colour", label: "Colour" },
  { id: "inspirations", label: "Inspiration" },
] as const;

const weather = {
  sunny: { icon: Sun, label: "24°", hint: "Light layers and cleaner silhouettes feel best today." },
  cloudy: { icon: Cloud, label: "18°", hint: "Add one soft outer layer for balance and warmth." },
  rainy: { icon: Droplet, label: "14°", hint: "Lean into practical textures and water-safe shoes." },
} as const;

const quickPrompts = ["Build me a coffee run look", "What works with white trousers?", "Make this feel sharper"];

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
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    note: "Soft tailoring, warm neutrals, and easy layering with a clean finish.",
    wardrobe: ["Boxy oat blazer", "Cream rib tank", "Wide-leg stone trousers"],
    similarity: 94,
  },
  {
    id: 2,
    nodeId: "marcus",
    name: "Marcus Vale",
    handle: "@marcusmode",
    avatar:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36",
    note: "Sharp casual outfits built from polos, structured outerwear, and darker trousers.",
    wardrobe: ["Navy knit polo", "Camel overshirt", "Pleated black trousers"],
    similarity: 91,
  },
  {
    id: 3,
    nodeId: "nina",
    name: "Nina Sloane",
    handle: "@ninasloane",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956",
    note: "Minimal wardrobe staples with tonal colour stories and cleaner sneakers.",
    wardrobe: ["Sand poplin shirt", "Taupe drawstring trousers", "White leather trainers"],
    similarity: 88,
  },
  {
    id: 4,
    nodeId: "ava",
    name: "Ava Moreau",
    handle: "@avamoreau",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    note: "Elevated basics with cleaner contrasts, soft suiting, and polished off-duty layers.",
    wardrobe: ["Black funnel-neck top", "Ivory straight trousers", "Structured leather tote"],
    similarity: 86,
  },
  {
    id: 5,
    nodeId: "celine",
    name: "Celine Tran",
    handle: "@celinefits",
    avatar: "https://images.unsplash.com/photo-1681958758197-0a37ed2e72b2",
    note: "Oversized silhouettes, bold colour blocking, and textured layers with streetwear edge.",
    wardrobe: ["Oversized washed denim jacket", "Graphic tee", "Cargo trousers"],
    similarity: 83,
  },
  {
    id: 6,
    nodeId: "rafi",
    name: "Rafi Osei",
    handle: "@rafiosei",
    avatar: "https://images.unsplash.com/photo-1680474166817-d1c2539c0a61",
    note: "Relaxed modern cuts, earthy tones, and mixing high and low pieces effortlessly.",
    wardrobe: ["Linen chore jacket", "Ribbed henley", "Washed black jeans"],
    similarity: 79,
  },
];

const userProfile = {
  id: "you",
  name: "You",
  avatar:
    "https://images.unsplash.com/photo-1517841905240-472988babdf9",
  note: "Your current direction is clean, tailored, and wardrobe-led.",
};

const inspirationOutfits: InspirationOutfit[] = [
  {
    id: 1,
    profileNodeId: "lena",
    title: "Soft neutral tailoring",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
    popularity: "4.1k saves",
    reason: "Works because it overlaps with your linen shirt, beige trousers, and lighter layering pieces.",
    matchingItems: ["White linen shirt", "Beige wide-leg trousers", "Camel blazer"],
  },
  {
    id: 2,
    profileNodeId: "lena",
    title: "Easy gallery-day look",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",
    popularity: "3.4k likes",
    reason: "A softer version of what you already wear, with the same relaxed tailoring and neutral balance.",
    matchingItems: ["White linen shirt", "Khaki chinos"],
  },
  {
    id: 3,
    profileNodeId: "marcus",
    title: "Sharp off-duty layers",
    image:
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2",
    popularity: "5.2k saves",
    reason: "This lands because your navy polo and black trousers already set up the same sharper silhouette.",
    matchingItems: ["Navy polo", "Black tailored pants", "Camel blazer"],
  },
  {
    id: 4,
    profileNodeId: "marcus",
    title: "Minimal city uniform",
    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae",
    popularity: "2.9k likes",
    reason: "The clean dark base maps closely to pieces you already own, just with a slightly more structured finish.",
    matchingItems: ["Black tailored pants", "White sneakers"],
  },
  {
    id: 5,
    profileNodeId: "nina",
    title: "Tone-on-tone essentials",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105",
    popularity: "4.8k saves",
    reason: "It stays in your lane: quiet tones, cleaner sneakers, and easy separation between top and bottom.",
    matchingItems: ["White linen shirt", "Khaki chinos", "White sneakers"],
  },
  {
    id: 6,
    profileNodeId: "nina",
    title: "Clean weekend edit",
    image:
      "https://images.unsplash.com/photo-1651742532474-ea4401a34a10",
    popularity: "2.5k likes",
    reason: "The proportions and palette line up with the pieces already sitting in your wardrobe rotation.",
    matchingItems: ["Beige wide-leg trousers", "Camel blazer"],
  },
  {
    id: 7,
    profileNodeId: "ava",
    title: "Polished contrast dressing",
    image:
      "https://images.unsplash.com/photo-1651744258699-d322dff9632c",
    popularity: "3.8k saves",
    reason: "A more elevated branch of your current wardrobe, using the same clean separates with stronger contrast.",
    matchingItems: ["Black tailored pants", "White linen shirt"],
  },
  {
    id: 8,
    profileNodeId: "ava",
    title: "Structured evening casual",
    image:
      "https://images.unsplash.com/photo-1651744258886-7987b4d3e949",
    popularity: "2.2k likes",
    reason: "It borrows your sharper pieces and pushes them one step further without needing a full wardrobe change.",
    matchingItems: ["Camel blazer", "Black tailored pants"],
  },
  {
    id: 9,
    profileNodeId: "celine",
    title: "Oversized denim moment",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
    popularity: "5.1k saves",
    reason: "Uses the same oversized proportions you're drawn to, with added texture from the washed denim.",
    matchingItems: ["Oversized denim jacket", "Graphic tee", "Cargo trousers"],
  },
  {
    id: 10,
    profileNodeId: "celine",
    title: "Bold colour block edit",
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
    popularity: "3.9k likes",
    reason: "Matches your vibe if you're going for something louder without leaving your comfort zone.",
    matchingItems: ["Washed bomber", "Black graphic tee", "Slim cargo pants"],
  },
  {
    id: 11,
    profileNodeId: "rafi",
    title: "Earthy weekend layers",
    image:
      "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2",
    popularity: "4.3k saves",
    reason: "Earth tones and relaxed tailoring align with what you already reach for on weekends.",
    matchingItems: ["Linen chore jacket", "Ribbed henley", "Washed black jeans"],
  },
  {
    id: 12,
    profileNodeId: "rafi",
    title: "Smart casual refresh",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    popularity: "2.8k likes",
    reason: "Pulls from your existing wardrobe but reframes it with smarter proportions and tonal cohesion.",
    matchingItems: ["Cream knit polo", "Tan chinos", "White sneakers"],
  },
];

const interactivePillClass = "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors active:scale-95";

const compactListRowClass =
  "flex min-h-[4.5rem] items-center gap-3 rounded-2xl border border-border px-3.5 py-3 transition-colors hover:bg-muted/40 active:scale-[0.98]";

const sectionSurfaceClass = "rounded-2xl p-3";
const briefSectionClass = "rounded-2xl px-3 py-2.5";

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
      text: "Tell me the occasion, the vibe, or one item you want to wear. I’ll give you a clean outfit direction that works with what you already own.",
    },
  ]);
  const shouldAnimate = !useReducedMotion();

  const generateTimeoutRef = useRef<number | null>(null);
  const replyTimeoutRef = useRef<number | null>(null);

  const currentWeather = weather.sunny;
  const WeatherIcon = currentWeather.icon;
  const activePalette = colorPalettes.find((palette) => palette.name === selectedPalette) ?? colorPalettes[0];
  const selectedInspiration =
    inspirationProfiles.find((profile) => profile.nodeId === selectedInspirationNodeId) ?? inspirationProfiles[0];
  const selectedInspirationOutfits = inspirationOutfits.filter(
    (outfit) => outfit.profileNodeId === selectedInspiration.nodeId,
  );
  const RADIUS = 170;
  const initialPositions = useMemo(() => {
    const map: Record<string, { x: number; y: number }> = {
      [userProfile.id]: { x: -32, y: -32 },
    };
    inspirationProfiles.forEach((profile, index) => {
      const angle = (index / inspirationProfiles.length) * Math.PI * 2 - Math.PI / 2;
      map[profile.nodeId] = { x: Math.cos(angle) * RADIUS - 28, y: Math.sin(angle) * RADIUS - 28 };
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
      const half = 28;
      const cx = current.position.x + half;
      const cy = current.position.y + half;
      const angle = Math.atan2(cy, cx);
      origin = {
        x: Math.cos(angle) * RADIUS - half,
        y: Math.sin(angle) * RADIUS - half,
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
          text: "Start with a clean base, then add one sharper piece. Your linen shirt or navy polo works well with tailored trousers or chinos, and you can finish with the camel blazer if you want a more polished edge.",
        },
      ]);
    }, 900);
  };

  return (
    <PageShell contentClassName="h-full min-h-0 overflow-hidden bg-background pb-0">
      <PageHeader title="Stylist" />
      <motion.div
        layout={shouldAnimate}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="app-page-content flex h-full min-h-0 flex-col gap-3 overflow-hidden px-0 pt-2 pb-2"
      >
        <div className={`${briefSectionClass} shrink-0`}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-base font-semibold text-foreground">Today&apos;s brief</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {currentWeather.hint} Built for quick, direct outfit decisions.
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
                            placeholder="Ask your stylist..."
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
                      <h2 className="text-base font-semibold text-foreground">Style preferences</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Keep the brief focused so the look suggestions stay cleaner.
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
                              ? "border-zinc-800 bg-zinc-800 text-white"
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
                    <h2 className="text-base font-semibold text-foreground">Recommended looks</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      A direct edit based on the current brief and selected preferences.
                    </p>
                  </div>

                  <div className="mt-4 space-y-3">
                    {recommendations.map((rec) => (
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
                    <h2 className="text-base font-semibold text-foreground">Colour direction</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Pick a tone and palette, then use the wardrobe matches below.
                    </p>
                  </div>

                  <div className="mt-4 space-y-2">
                    {skinTones.map((tone) => {
                      const selected = selectedSkinTone === tone.id;

                      return (
                        <button
                          key={tone.id}
                          type="button"
                          onClick={() => setSelectedSkinTone(tone.id)}
                          className={`flex min-h-[52px] w-full items-center justify-between rounded-2xl px-3 py-2.5 text-sm transition-colors active:scale-[0.98] ${
                            selected
                              ? "bg-zinc-800 text-white"
                              : "border border-border bg-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                          }`}
                        >
                          <span className="font-medium">{tone.label}</span>
                          {selected && <Check className="h-4 w-4" />}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3 rounded-2xl border border-border px-3.5 py-3">
                    <div className="mb-1 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      Recommended
                    </div>
                    <div className="text-sm text-foreground">
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
                              ? "border-zinc-800 bg-zinc-800 text-white"
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
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-semibold text-foreground">Wardrobe matches</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        The current colour direction first, then the full wardrobe below.
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
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-xs text-muted-foreground">Selected</div>
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

                  <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border px-3.5 py-3">
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
                </div>

                <div className={sectionSurfaceClass}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-base font-semibold text-foreground">
                        Popular outfits from {selectedInspiration.name}
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
                          <p className="text-sm text-muted-foreground">{outfit.reason}</p>
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
                    <div className="mb-3 text-xs font-medium text-muted-foreground">Shared wardrobe signals</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedInspiration.wardrobe.map((item) => (
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </PageShell>
  );
}
