'use client';
import React, { useState } from 'react';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
  useSandpack,
} from "@codesandbox/sandpack-react";

const CodeView = () => {
  const [active, setActive] = useState('Code');

  // Store files dynamically in state
  const [files, setFiles] = useState({
    "/public/index.html": {
      code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>`
    },
    "/App.css": {
      code: `@tailwind base;
@tailwind components;
@tailwind utilities;`
    },
    "/tailwind.config.js": {
      code: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};`
    },
    "/postcss.config.js": {
      code: `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
export default config;`
    },
    "/App.js": {
      code: `export default function App() {
  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <h1 className="text-4xl text-white font-bold">Hello, Tailwind CSS!</h1>
    </div>
  );
}`
    }
  });

  // --- HELPER: shallow-compare two files objects ---
  const areFilesEqual = (a, b) => {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    for (const key of aKeys) {
      if (!b.hasOwnProperty(key) || a[key].code !== b[key].code) {
        return false;
      }
    }
    return true;
  };

  // --- Listens for changes in Sandpack, updates local files if they actually differ ---
  const SandpackListener = () => {
    const { sandpack } = useSandpack();
    const { files: sandpackFiles } = sandpack;

    React.useEffect(() => {
      if (!areFilesEqual(files, sandpackFiles)) {
        setFiles(sandpackFiles);
      }
    }, [sandpackFiles]); // runs whenever sandpackFiles changes

    return null;
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar Section */}
      <div className="bg-[#181818] p-3 border-b border-gray-700">
        <div className="flex items-center justify-center bg-[#222] p-2 rounded-full w-[180px] gap-4">
          <button
            className={`px-4 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
              active === 'Code'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
            onClick={() => setActive('Code')}
          >
            Code
          </button>

          <button
            className={`px-4 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
              active === 'Preview'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
            onClick={() => setActive('Preview')}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Sandpack Container */}
      <SandpackProvider
        files={files}
        template="react"
        theme="dark"
        customSetup={{
          dependencies: {
            postcss: "^8",
            tailwindcss: "^3.4.1",
            autoprefixer: "^10.0.0",
            uuid: "^2.0.3",
            "tailwind-merge": "^2.4.0",
            "tailwindcss-animate": "^1.0.7",
            "lucide-react": "latest",
            "react-router-dom": "latest",
            firebase: "^11.1.0",
            "@google/generative-ai": "^0.21.0"
          }
        }}
        options={{
          // normally you'd remove the Tailwind CDN from index.html
          // and rely on local PostCSS compilation
          externalResources: ['https://cdn.tailwindcss.com']
        }}
      >
        <SandpackListener /> {/* Only needed if you want 2-way sync */}
        <SandpackLayout className="flex flex-grow">
          {active === 'Code' ? (
            <>
              <SandpackFileExplorer style={{ height: '80vh' }} />
              <SandpackCodeEditor style={{ height: '80vh' }} />
            </>
          ) : (
            <SandpackPreview style={{ height: '80vh' }} showNavigator={true} />
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
};

export default CodeView;
