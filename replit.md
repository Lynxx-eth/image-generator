# AI Banner & Image Generator

## Overview

This is an AI-powered banner and image generation application that leverages Google's Gemini AI (specifically the gemini-2.0-flash-preview-image-generation model) to create custom images from text prompts and edit existing images with AI. Users can:
- Generate images from text prompts
- Upload images and edit them with AI-powered modifications
- Choose from multiple image sizes including Twitter banner size (1500x500)
- Download generated images instantly

The application features a modern, dark-themed UI built with React and shadcn/ui components, emphasizing a clean, content-first design approach with dual functionality for both text-to-image generation and AI image editing.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework:** React with TypeScript using Vite as the build tool
- **Routing:** Wouter for lightweight client-side routing
- **UI Components:** shadcn/ui (Radix UI primitives) with Tailwind CSS
- **State Management:** TanStack Query (React Query) for server state
- **Form Handling:** React Hook Form with Zod validation

**Design System:**
- Dark mode as primary theme with light mode support
- Custom color palette based on HSL values with CSS variables
- Typography using Inter and Space Grotesk fonts
- Component library following the "New York" shadcn style variant
- Responsive design with mobile-first approach

**Key Design Decisions:**
- Content-first approach where generated images are the hero element
- Streamlined workflow to minimize steps from prompt to image
- Uses a hybrid design approach inspired by Midjourney, DALL-E, and Adobe Firefly

### Backend Architecture

**Technology Stack:**
- **Runtime:** Node.js with Express.js
- **Language:** TypeScript with ES modules
- **API Pattern:** RESTful endpoints

**Core Components:**
- Express server with custom middleware for request logging
- Vite integration for development with HMR (Hot Module Replacement)
- Static file serving for production builds

**API Endpoints:**
- `POST /api/generate-image` - Accepts prompt, size, and optional baseImage (for editing), returns base64 image data

**Request/Response Flow:**
1. Client submits prompt, size, and optional baseImage (for editing)
2. Backend validates input using Zod schema
3. If baseImage is provided, includes it in the Gemini API request for image editing
4. Calls Gemini AI API for image generation or editing
5. Returns base64-encoded image data to client

**Supported Image Sizes:**
- 512x512 - Small square format
- 1024x1024 - Large square format
- 1920x1080 - Full HD landscape
- 1500x500 - Twitter banner size

### Data Storage Solutions

**Current Implementation:**
- In-memory storage using Map data structure (MemStorage class)
- User management interface defined but minimal implementation
- No persistent database currently configured

**Database Configuration:**
- Drizzle ORM configured for PostgreSQL (via @neondatabase/serverless)
- Schema defined in shared/schema.ts
- Migration files configured to output to ./migrations directory
- Note: Database appears configured but not actively used for image storage

**Rationale for In-Memory Storage:**
- Suitable for prototype/demo phase
- No persistence requirement for generated images (stateless generation)
- Simplifies deployment and reduces dependencies

### External Dependencies

**AI/ML Services:**
- **Google Gemini AI** (@google/genai v1.22.0)
  - Model: gemini-2.0-flash-preview-image-generation
  - Supports text-to-image generation with multimodal responses
  - Requires GEMINI_API_KEY environment variable
  - Returns images as base64-encoded inline data

**Database & ORM:**
- **Neon Serverless** (@neondatabase/serverless v0.10.4) - PostgreSQL adapter
- **Drizzle ORM** (v0.39.1) - Type-safe database toolkit
- **Drizzle-Zod** (v0.7.0) - Schema validation integration

**UI & Styling:**
- **Radix UI** - Comprehensive set of accessible component primitives (accordion, dialog, dropdown, select, toast, etc.)
- **Tailwind CSS** - Utility-first CSS framework with custom configuration
- **class-variance-authority** - For component variant management
- **cmdk** - Command palette component

**Development Tools:**
- **Vite** - Build tool and dev server
- **esbuild** - JavaScript bundler for production builds
- **tsx** - TypeScript execution for development

**Session Management:**
- **connect-pg-simple** (v10.0.0) - PostgreSQL session store (configured but may not be actively used)

**Key Integration Patterns:**
- Environment-based configuration (DATABASE_URL, GEMINI_API_KEY)
- Shared schema validation between client and server using Zod
- Type-safe API communication with TypeScript across full stack
- Base64 image encoding for client-server image transfer