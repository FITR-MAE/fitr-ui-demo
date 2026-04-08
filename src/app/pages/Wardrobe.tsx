import { motion } from "motion/react";
import { Plus, Trash2, Tag, Search } from "lucide-react";
import { useState } from "react";

interface ClothingItem {
  id: number;
  image: string;
  name: string;
  category: string;
  tags: string[];
}

const initialWardrobe: ClothingItem[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1604882767135-b41fac508fff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMHdhcmRyb2JlJTIwbWluaW1hbHxlbnwxfHx8fDE3NzU2ODkyNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    name: "Camel Coat",
    category: "Outerwear",
    tags: ["winter", "neutral", "classic"],
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1524282745852-a463fa495a7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxjbG90aGluZyUyMHdhcmRyb2JlJTIwbWluaW1hbHxlbnwxfHx8fDE3NzU2ODkyNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    name: "Linen Shirts",
    category: "Tops",
    tags: ["summer", "casual", "basics"],
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1561365452-adb940139ffa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxjbG90aGluZyUyMHdhcmRyb2JlJTIwbWluaW1hbHxlbnwxfHx8fDE3NzU2ODkyNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    name: "Classic Tops",
    category: "Tops",
    tags: ["wardrobe staples", "layering"],
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1677779817420-b3ad7a4a1f2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxjbG90aGluZyUyMHdhcmRyb2JlJTIwbWluaW1hbHxlbnwxfHx8fDE3NzU2ODkyNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    name: "Designer Blazer",
    category: "Outerwear",
    tags: ["formal", "luxury", "structured"],
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1775226236498-969b38fe7032?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxjbG90aGluZyUyMHdhcmRyb2JlJTIwbWluaW1hbHxlbnwxfHx8fDE3NzU2ODkyNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    name: "Casual Essentials",
    category: "Accessories",
    tags: ["everyday", "minimal", "versatile"],
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1761896902115-49793a359daf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxjbG90aGluZyUyMHdhcmRyb2JlJTIwbWluaW1hbHxlbnwxfHx8fDE3NzU2ODkyNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    name: "Daily Accessories",
    category: "Accessories",
    tags: ["basics", "minimalist"],
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1624222244232-5f1ae13bbd53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw4fHxjbG90aGluZyUyMHdhcmRyb2JlJTIwbWluaW1hbHxlbnwxfHx8fDE3NzU2ODkyNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    name: "White Shirt",
    category: "Tops",
    tags: ["classic", "versatile", "timeless"],
  },
];

const categories = ["All", "Tops", "Bottoms", "Outerwear", "Accessories"];

export function Wardrobe() {
  const [items, setItems] = useState<ClothingItem[]>(initialWardrobe);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const deleteItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedItem(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="mb-6">My Wardrobe</h1>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search items or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-muted border-0 rounded-lg outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? "bg-foreground text-background"
                    : "bg-muted text-foreground hover:bg-accent"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-20">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            onClick={() =>
              setSelectedItem(selectedItem === item.id ? null : item.id)
            }
            className={`cursor-pointer rounded-lg overflow-hidden transition-all ${
              selectedItem === item.id ? "ring-2 ring-foreground" : ""
            }`}
          >
            <div className="aspect-square bg-muted overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3 bg-card">
              <h3 className="text-sm mb-1">{item.name}</h3>
              <p className="text-xs text-muted-foreground mb-2">
                {item.category}
              </p>
              <div className="flex gap-1 flex-wrap">
                {item.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-muted text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: filteredItems.length * 0.05 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 hover:border-foreground/50 hover:bg-muted/50 transition-colors"
        >
          <Plus className="w-8 h-8" />
          <span className="text-sm">Add Item</span>
        </motion.button>
      </div>

      {selectedItem && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-20 left-0 right-0 md:bottom-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md bg-card border border-border rounded-t-2xl md:rounded-2xl p-4 shadow-lg z-40"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5" />
              <span className="text-sm">Item selected</span>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => deleteItem(selectedItem)}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </motion.button>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-muted rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
