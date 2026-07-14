import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  AtSign,
  Building2,
  Check,
  ChevronLeft,
  Globe2,
  LoaderCircle,
  MapPin,
  ShieldCheck,
  Store,
} from "lucide-react";

import { useAccounts, type BusinessKind } from "../components/AccountProvider";
import { PageHeader, PageSection, PageShell } from "../components/Page";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { cn } from "../components/ui/utils";

type FieldName = "name" | "handle" | "website" | "category" | "address";
type FormErrors = Partial<Record<FieldName, string>>;

const categories: Record<BusinessKind, string[]> = {
  brand: [
    "Luxury fashion",
    "Contemporary fashion",
    "Streetwear",
    "Footwear",
    "Accessories",
    "Beauty and lifestyle",
  ],
  store: [
    "Independent boutique",
    "Concept store",
    "Department store",
    "Vintage and resale",
    "Online retailer",
    "Multi-brand retailer",
  ],
};

const businessKinds: {
  value: BusinessKind;
  label: string;
  description: string;
  icon: typeof Building2;
}[] = [
  {
    value: "brand",
    label: "Brand",
    description: "Build your identity, publish collections, and grow your audience.",
    icon: Building2,
  },
  {
    value: "store",
    label: "Store",
    description: "Showcase a retail destination and help shoppers find your location.",
    icon: Store,
  },
];

function normalizeHandle(value: string) {
  return value
    .trim()
    .replace(/^@/, "")
    .replace(/[^a-zA-Z0-9._]/g, "")
    .toLowerCase();
}

function isValidWebsite(value: string) {
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`);
    return url.hostname.includes(".");
  } catch {
    return false;
  }
}

export function CreateBusinessAccount() {
  const navigate = useNavigate();
  const { accounts, createBusinessAccount } = useAccounts();
  const [businessKind, setBusinessKind] = useState<BusinessKind>("brand");
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizedHandle = normalizeHandle(handle);
  const previewHandle = normalizedHandle ? `@${normalizedHandle}` : "@yourhandle";
  const previewName = name.trim() || (businessKind === "brand" ? "Your brand" : "Your store");
  const previewInitial = name.trim().charAt(0).toUpperCase() || (businessKind === "brand" ? "B" : "S");
  const currentCategories = categories[businessKind];

  const clearError = (field: FieldName) => {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const chooseBusinessKind = (kind: BusinessKind) => {
    if (kind === businessKind) return;
    setBusinessKind(kind);
    setCategory("");
    clearError("category");
    if (kind === "brand") {
      setAddress("");
      clearError("address");
    }
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!name.trim()) nextErrors.name = "Enter the public name of your business.";
    if (!normalizedHandle) {
      nextErrors.handle = "Choose a handle for your profile.";
    } else if (
      accounts.some((account) => normalizeHandle(account.handle) === normalizedHandle)
    ) {
      nextErrors.handle = "This handle is already used by one of your accounts.";
    }
    if (website.trim() && !isValidWebsite(website.trim())) {
      nextErrors.website = "Enter a valid website, such as yourbrand.com.";
    }
    if (!category) nextErrors.category = "Select the category that fits your business.";
    if (businessKind === "store" && !address.trim()) {
      nextErrors.address = "Add the physical address customers can visit.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || !validate()) return;

    setIsSubmitting(true);

    try {
      const accountName = name.trim();
      createBusinessAccount({
        businessKind,
        name: accountName,
        handle: `@${normalizedHandle}`,
        bio: bio.trim(),
        website: website.trim(),
        category,
        address: businessKind === "store" ? address.trim() : undefined,
      });
      toast.success(`${accountName} is ready`, {
        description: "You are the Owner. Opening Brand Studio.",
      });
      navigate("/brand-studio", { replace: true });
    } catch {
      setIsSubmitting(false);
      toast.error("Account could not be created", {
        description: "Review your details and try again.",
      });
    }
  };

  return (
    <PageShell>
      <PageHeader
        title="Create business account"
        subtitle="Set up your presence on fitr"
        leading={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-9 w-9 rounded-full"
            aria-label="Go back"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        }
      />

      <form className="app-page-content space-y-4" onSubmit={handleSubmit} noValidate>
        <PageSection className="p-5">
          <div className="mb-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Business type
            </p>
            <h2 className="mt-1 app-section-title">How do you show up?</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Choose the profile that best matches how customers discover you.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Business type">
            {businessKinds.map((option) => {
              const Icon = option.icon;
              const isSelected = businessKind === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => chooseBusinessKind(option.value)}
                  className={cn(
                    "relative min-h-32 rounded-2xl border p-4 text-left transition-colors active:scale-[0.98]",
                    isSelected
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card text-foreground hover:bg-muted/60",
                  )}
                >
                  <div
                    className={cn(
                      "mb-4 flex h-9 w-9 items-center justify-center rounded-full",
                      isSelected ? "bg-background/15" : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-semibold">{option.label}</p>
                  <p
                    className={cn(
                      "mt-1 max-w-xs text-xs leading-relaxed",
                      isSelected ? "text-background/70" : "text-muted-foreground",
                    )}
                  >
                    {option.description}
                  </p>
                  {isSelected ? (
                    <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-background text-foreground">
                      <Check className="h-3 w-3" />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </PageSection>

        <PageSection className="p-5">
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              {businessKind === "brand" ? (
                <Building2 className="h-4 w-4" />
              ) : (
                <Store className="h-4 w-4" />
              )}
            </div>
            <div>
              <h2 className="app-section-title">Profile details</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                This information will be visible on your public profile.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="business-name">Business name</Label>
              <Input
                id="business-name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  clearError("name");
                }}
                placeholder={businessKind === "brand" ? "Studio North" : "North Street Store"}
                autoComplete="organization"
                maxLength={60}
                className="h-11 rounded-xl bg-background"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "business-name-error" : undefined}
              />
              {errors.name ? (
                <p id="business-name-error" className="text-xs text-destructive">
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-handle">Handle</Label>
              <div className="relative">
                <AtSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="business-handle"
                  value={handle}
                  onChange={(event) => {
                    setHandle(event.target.value);
                    clearError("handle");
                  }}
                  placeholder="studionorth"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  maxLength={31}
                  className="h-11 rounded-xl bg-background pl-9"
                  aria-invalid={Boolean(errors.handle)}
                  aria-describedby={errors.handle ? "business-handle-error" : "business-handle-preview"}
                />
              </div>
              {errors.handle ? (
                <p id="business-handle-error" className="text-xs text-destructive">
                  {errors.handle}
                </p>
              ) : (
                <p id="business-handle-preview" className="text-xs text-muted-foreground">
                  Your profile will use <span className="font-medium text-foreground">{previewHandle}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-category">Category</Label>
              <Select
                value={category}
                onValueChange={(value) => {
                  setCategory(value);
                  clearError("category");
                }}
              >
                <SelectTrigger
                  id="business-category"
                  className="h-11 rounded-xl bg-background"
                  aria-invalid={Boolean(errors.category)}
                  aria-describedby={errors.category ? "business-category-error" : undefined}
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {currentCategories.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category ? (
                <p id="business-category-error" className="text-xs text-destructive">
                  {errors.category}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-website">
                Website <span className="font-normal text-muted-foreground">Optional</span>
              </Label>
              <div className="relative">
                <Globe2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="business-website"
                  value={website}
                  onChange={(event) => {
                    setWebsite(event.target.value);
                    clearError("website");
                  }}
                  placeholder="studionorth.com"
                  inputMode="url"
                  autoCapitalize="none"
                  autoCorrect="off"
                  className="h-11 rounded-xl bg-background pl-9"
                  aria-invalid={Boolean(errors.website)}
                  aria-describedby={errors.website ? "business-website-error" : undefined}
                />
              </div>
              {errors.website ? (
                <p id="business-website-error" className="text-xs text-destructive">
                  {errors.website}
                </p>
              ) : null}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="business-bio">
                  Bio <span className="font-normal text-muted-foreground">Optional</span>
                </Label>
                <span className="text-xs text-muted-foreground">{bio.length}/160</span>
              </div>
              <Textarea
                id="business-bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="Describe your point of view, products, or community."
                maxLength={160}
                className="min-h-24 rounded-xl bg-background"
              />
            </div>

            {businessKind === "store" ? (
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="business-address">Physical address</Label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="business-address"
                    value={address}
                    onChange={(event) => {
                      setAddress(event.target.value);
                      clearError("address");
                    }}
                    placeholder="24 North Street, London, W1K 6DG"
                    autoComplete="street-address"
                    className="min-h-20 rounded-xl bg-background pl-9"
                    aria-invalid={Boolean(errors.address)}
                    aria-describedby={errors.address ? "business-address-error" : "business-address-help"}
                  />
                </div>
                {errors.address ? (
                  <p id="business-address-error" className="text-xs text-destructive">
                    {errors.address}
                  </p>
                ) : (
                  <p id="business-address-help" className="text-xs text-muted-foreground">
                    Required for store profiles so customers know where to visit.
                  </p>
                )}
              </div>
            ) : null}
          </div>
        </PageSection>

        <PageSection className="overflow-hidden p-0">
          <div className="border-b border-border px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Account preview
            </p>
          </div>
          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-400 text-lg font-semibold text-white">
                {previewInitial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="truncate text-base font-semibold text-foreground">{previewName}</p>
                  <span className="app-chip">{businessKind}</span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{previewHandle}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  {bio.trim() || "Your bio will help people understand what makes this business distinct."}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-2 border-t border-border pt-4 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {businessKind === "brand" ? (
                  <Building2 className="h-4 w-4 shrink-0" />
                ) : (
                  <Store className="h-4 w-4 shrink-0" />
                )}
                <span className="truncate">{category || "Category not selected"}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>You will be the Owner</span>
              </div>
              {website.trim() ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground sm:col-span-2">
                  <Globe2 className="h-4 w-4 shrink-0" />
                  <span className="truncate">{website.trim()}</span>
                </div>
              ) : null}
              {businessKind === "store" && address.trim() ? (
                <div className="flex items-start gap-2 text-xs text-muted-foreground sm:col-span-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{address.trim()}</span>
                </div>
              ) : null}
            </div>
          </div>
        </PageSection>

        <div className="sticky bottom-4 z-10 rounded-full bg-background/80 p-1 backdrop-blur-sm">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 w-full rounded-full bg-foreground px-5 text-sm font-semibold text-background hover:bg-foreground/90 active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Creating account
              </>
            ) : (
              `Create ${businessKind} account`
            )}
          </Button>
        </div>
      </form>
    </PageShell>
  );
}
