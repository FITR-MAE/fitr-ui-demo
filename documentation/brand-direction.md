# Brand Direction

## Related documents

- **`ui.md`** — high-level UI reference mapping brand surfaces to screen structure.
- **`design-guidelines.md`** — design system (tokens, typography, components) used to implement this brand direction in code.
- **`AGENTS.md`** — repo setup, build commands, and implementation caveats.

## Overview

Fitr is a personal style engine and identity platform, not just a fashion app.

The product should feel like a system that understands a user’s style, helps define it, and supports daily action around it. The goal is not simply to give users a place to post outfits. The goal is to help them understand who they are stylistically, evolve that identity over time, and apply it in a way that feels intelligent, personal, and exciting.

## Brand Principles

- **Identity-led**: the product should feel rooted in the user’s style DNA and sense of self
- Intelligent: recommendations and guidance should feel informed, contextual, and AI-backed
- Social and aspirational: users should feel excited to share fits and inspired to improve them
- Actionable: the system should help users make decisions, not just consume content

## Product Role

Fitr sits at the intersection of identity, intelligence, utility, and inspiration.

It should help users:

- understand their style
- refine their aesthetic
- make daily fit decisions
- discover adjacent inspiration
- express themselves socially

## Core Surfaces

The current product is built around six main surfaces:

- Flow / Home
- Notifications
- Drops
- Studio
- Profile
- Search

Together, these pages should express the full system: discovery, creation, guidance, identity, and connection.

> **Brand → code mapping:** these surface names are the intended product vocabulary; the codebase does not yet match it one-to-one. Flow = ForYou at `/`, Drops = Post at `/post`, Studio = Stylist at `/stylist` (page title "Studio"), Notifications = `/notifications`, Profile = `/profile`, Search = `/search`. Only "Studio" currently appears as its brand name in the UI. See `design-guidelines.md` for implementation conventions and `AGENTS.md` for route caveats (notably the `routes.ts`/`routes.tsx` shadowing that currently makes `/activity/:id` unreachable).

## Home

The home page should have a strong branded identity in the same way other platforms have a signature feed concept.

Names explored:

- Flow
- Pulse

This page should represent the living stream of a user’s style world. It is the place where inspiration, content, and daily relevance come together.

## Notifications

Notifications should be understood as a combined updates and communication surface.

It is made up of two parts:

- Activity
- Messages

Activity covers interactions, events, and fashion-related alerts such as sales or tracking. Messages is the direct conversation layer.

## Drops

Drops is the creation surface.

It can also grow into the wardrobe management surface so that publishing and clothing management live close together. Over time, this surface should support richer wardrobe context such as purchase information, receipts, fabric details, and care instructions.

## Studio

Studio is the engine of the app.

This is the intelligence layer of Fitr and the place where the product becomes most differentiated. It is where users receive guidance, interpretation, and personalized style direction.

Studio should bring together:

- AI chat
- daily fit recommendations
- style identity modeling
- similarity-based recommendations

Alternative naming explored:

- Atelier
- Studio
- Maison

## AI Identity

The AI should have a distinct name and presence. It should not feel like a generic chatbot. It should feel like a personal fashion intelligence with context about the user and their wardrobe.

Names explored:

- Celine
- Véra
- Maëlle
- Élan
- SŌEN

## Fits

Fits is the daily utility layer.

It should answer the practical question: what should I wear today, and how do I apply my style in a way that feels current and personal?

Recommendations should feel shaped by:

- weather
- wardrobe
- past behavior
- trends
- overall style direction

## Style DNA

Style DNA is the logic layer behind Fits.

It represents who and what the user is stylistically. It should go beyond colour analysis and become a broader identity model.

This can include:

- primary identity
- secondary trait
- descriptive language
- most liked clothing types
- top colours

Example identity language:

- Soft autumn librarian
- Soft power icon
- Mysterious regular at the coffee shop
- The off duty rapper
- The air around you is crisp
- Tailored and dangerous

## Orbit

Orbit is the inspiration and recommendation layer.

It should show similar users and explain why they are relevant. It should feel like style overlap, inspiration with context, and recommendation through similarity.

Orbit should help answer three questions:

- who overlaps with me
- why they overlap with me
- what I can take from their style

## Profile

Profile is the public and personal identity page.

Publicly it should show the user as a person and a style presence. Privately it can hold more personal activity and saved context.

Wardrobe visibility should remain flexible, with the ability to hide everything or only selected items.

## Search

Search should support discovery across the full fashion ecosystem inside the app.

This includes:

- posts
- users
- clothes
- brands
- stores

Each search mode can have its own filters and discovery logic.

## Future Opportunities

### Year-End Wrapped

Fitr should eventually have a yearly style report similar to Spotify Wrapped.

Names explored:

- Maison: YOU
- The ERA
- The style report
- The drip report

### Style This Album / Photo

Users should be able to input music or imagery and receive a fit direction based on that input.

Examples:

- link Spotify or an album
- match a fit to a song
- match a fit to a photo

### Style Challenges

The product can support recurring social challenges built around a vibe, image, or prompt. This creates a stronger community and discovery loop through voting, nominations, prizes, and features.
