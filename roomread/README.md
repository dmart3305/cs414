This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
### Build I delivers a fully functional vertical slice of RoomRead, including authenticated user access, dynamic country and category navigation, and an interactive beginner-level lesson engine powered by structured, data-driven content.

## Getting Started
After opening the code in your IDE of choice, start a new terminal and cd into the roomread folder. 
Make sure to run npm install to ensure you have the correct dependencies.

Within the roomread folder create a file named ".env.local". The icon should be a gear. 

<img width="226" height="609" alt="Screenshot 2026-02-27 151320" src="https://github.com/user-attachments/assets/366a9062-7a86-4f06-8836-73a6714806a3" />

Paste this link and text into the file and save all:

NEXT_PUBLIC_SUPABASE_URL=https://vsiqpgutlryxcdgorhyx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzaXFwZ3V0bHJ5eGNkZ29yaHl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NjU3MDksImV4cCI6MjA4NzA0MTcwOX0.PeueoV7HvkifPImG4pHayvB2tDKME-QZJ_zyR7OGfB4

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
<img width="557" height="278" alt="image" src="https://github.com/user-attachments/assets/2ea88b3c-6d8c-49b2-b500-bfb3c9a8de31" />


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You will be met with a login page, use an email that you can verify to create an account. Once logged in you are free to explore our home page and enter the country categories. 


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
