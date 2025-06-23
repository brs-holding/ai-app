# AI APP

This is a fork of [Adorable](https://github.com/freestyle-sh/adorable) - an AI agent that can make websites and apps through a chat interface.

## Key Changes in this Fork

- Uses OpenRouter.ai instead of direct Anthropic API access
- Simplified setup with updated environment variables

## Features

- Chat interface for interacting with AI code assistants
- Patch-based code editing with user approval
- Git integration for version control
- Preview capabilities for code changes

## Setup Instructions

### Prerequisites

- Node.js
- PostgreSQL database (Neon is easy and has a good free tier)
- OpenRouter.ai API key
- Freestyle API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/brs-holding/ai-app.git
cd ai-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   
Create a `.env` file in the root directory with the following variables:

```
# Database
# Format: postgres://username:password@hostname/database?sslmode=require
DATABASE_URL=postgres://username:password@hostname/database?sslmode=require

# OpenRouter API (instead of Anthropic)
OPENROUTER_API_KEY=your_openrouter_api_key

# Freestyle API
FREESTYLE_API_KEY=your_freestyle_api_key

# Stack Auth (already configured)
NEXT_PUBLIC_STACK_PROJECT_ID=05ca6f77-8b32-4a85-842e-202292205cb7
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pck_480ezqt381a2vw2tratqesdggfrjk6zy2tkkc0ts9n0tr
STACK_SECRET_SERVER_KEY=ssk_53efkpvpcfm79sddka91k784kjb617380zh488crj8648

# Preview Domain (optional)
# PREVIEW_DOMAIN=your-domain.app
```

4. Set up your database:

   a. Create a PostgreSQL database. The easiest option is to use [Neon](https://neon.tech/):
      - Sign up for a free account at https://neon.tech/
      - Create a new project
      - Create a new database named "adorable"
      - Get your connection string from the Neon dashboard
      - Update the DATABASE_URL in your .env file with the connection string

   b. Initialize the database schema:

   ```bash
   npx drizzle-kit push
   ```

5. Set up Stack Auth (optional):

Go to the [Stack Auth dashboard](https://app.stackframe.co/) and create a new application.
In Configuration > Domains, enable "Allow all localhost callbacks for development" to be able to sign in locally.

Add the following environment variables to your `.env` file:

```
NEXT_PUBLIC_STACK_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=<your-publishable-client-key>
STACK_SECRET_SERVER_KEY=<your-secret-server-key>
```

6. Run the development server:

```bash
npm run dev
```

7. Open http://localhost:3000 in your browser.

## Using OpenRouter.ai

This fork uses OpenRouter.ai instead of directly connecting to Anthropic. OpenRouter allows you to access various models, including Claude, through a single API.

To get an OpenRouter API key:
1. Sign up at [OpenRouter.ai](https://openrouter.ai/)
2. Create an API key
3. Add it to your `.env` file as `OPENROUTER_API_KEY`

## Deployment

For production deployment:

```bash
npm run build
npm run start
```

Or use the included deployment script:

```bash
./deploy.sh
```

## Credits

This project is based on [Adorable](https://github.com/freestyle-sh/adorable) by Freestyle.
