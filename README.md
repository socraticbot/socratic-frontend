# socratic-frontend

## Getting Started

### Environment setup

This frontend application requires two environment variables to run: the URL of your [socratic-bot](https://github.com/vschrenk/socratic-bot) chat server, and its API key (this is the `SOCRATIC_CHATSERVER_TOKEN` value you provide as part of the `docker run` invocation).

Once you have these values, copy `.env.schema` to `.env.local` and fill in the variables with your values.

### Running

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
