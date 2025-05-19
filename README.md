# 📄 webGEN – AI-Powered Web App Generator

webGEN is an AI-powered development assistant that allows users to generate and interact with web applications through a natural chat interface. It leverages AI to understand user prompts, generate code, and provide a real-time coding environment.

-----

## 🚀 Features

  - 🧠 **AI-Powered Code Generation** — Describe the web app or component you want to build, and AI will generate the code for you.
  - 💬 **Interactive Chat Interface** — Converse with the AI to refine requirements and guide the generation process.
  - 💻 **Live Code Preview & Editing** — View generated code in a Sandpack code editor and see live previews. Modify the code as needed.
  - 🔮 **Convex Backend** — Utilizes Convex for real-time database and backend functions.
  - 🔐 **Google Authentication** — Secure user login with Google OAuth.
  - ✨ **Component-Based Architecture** — Built with React and Next.js for a modern frontend experience.

-----

## 🛠️ Tech Stack

### ⚙️ Backend

  - **Next.js 14 App Router** (API Routes)
  - **Convex** (Real-time Database & Backend Functions)
  - **OpenAI API** (GPT-4o-mini for Chat and Code Generation)

### 🌐 Frontend

  - **Next.js 15**
  - **React 18**
  - **Tailwind CSS**
  - **Shadcn UI** (Components)
  - **Lucide React** (Icons)
  - **Sandpack** (Live Code Editor & Preview)
  - **Axios** (HTTP Client)

-----

## 🧩 Architecture Overview

1.  **User provides a prompt** via the chat interface in the `Hero` or `ChatView` component.
2.  If it's a new project, a **Convex workspace is created**.
3.  The prompt is sent to a **Next.js API route** (`/api/ai-chat` or `/api/gen-ai-code`).
4.  The API route interacts with the **OpenAI API** to get a chat response or generate code.
5.  Generated code (JSON structure with files) is processed and displayed in the `CodeView` component using Sandpack.
6.  Chat messages are stored in the **Convex database** and updated in real-time in the `ChatView`.
7.  User authentication is handled via Google OAuth, and user details are managed using React Context and Convex.

-----

## 🧪 Getting Started

### 1\. Clone the repo

```bash
git clone https://github.com/brijeshpatolia/webgen.git
cd webgen
```

### 2\. Install dependencies

```bash
npm install
```

### 3\. Set up environment variables

Create a `.env.local` file in the root of your project with the following variables:

```env
NEXT_PUBLIC_CONVEX_URL=your_convex_url
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

You will need to sign up for accounts with [Convex](https://convex.dev), [OpenAI](https://openai.com), and [Google Cloud Platform](https://console.cloud.google.com) to obtain these keys.

### 4\. Run Convex dev server

In a separate terminal, run:

```bash
npx convex dev
```

### 5\. Start the Next.js dev server

```bash
npm run dev
```

Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

-----

## 🧾 Example Use Case

1.  Navigate to the application.
2.  In the input field, type a prompt like:
    > "Create a simple counter component with increment and decrement buttons."
3.  The AI will generate the React code for the counter.
4.  You can view the code in the editor, see the live preview, and chat further to refine it.

-----

## 🧠 Learning Resources Used (Implicit)

This project builds upon concepts and tools from:

  - [Next.js Documentation](https://nextjs.org/docs)
  - [Convex Documentation](https://docs.convex.dev)
  - [OpenAI API Documentation](https://platform.openai.com/docs)
  - [Tailwind CSS Documentation](https://tailwindcss.com/docs)
  - [Shadcn UI](https://ui.shadcn.com)
  - [Sandpack Documentation](https://sandpack.codesandbox.io)

-----

## 🙌 Author

Developed by [Brijesh Patolia](https://github.com/brijeshpatolia)

If you like this project, give it a ⭐ on GitHub and feel free to contribute or reach out\!

-----

## 📄 License
MIT
