'use client';

import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from '@codesandbox/sandpack-react';
import dedent from 'dedent';
import Prompt from '@/data/Prompt';
import { MessagesContext } from '@/context/MessagesContext';

function CodeView() {
  const [active, setActive] = useState('Code');
  const { messages } = useContext(MessagesContext);

  // Define your desired file structure.
  // Note: The HTML file is now at '/index.html' (not '/public/index.html').
  const [files, setFiles] = useState({
    '/index.html': {
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
    },
    '/App.css': {
      code: `@tailwind base;
@tailwind components;
@tailwind utilities;`,
    },
    '/tailwind.config.js': {
      code: `/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};`,
    },
    '/postcss.config.js': {
      code: `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`,
    },
    '/src/App.jsx': {
      code: `import React from 'react';

export default function App() {
  return <h1 className="text-center text-2xl font-bold">Hello, Tailwind CSS!</h1>;
}
`,
    },
    '/src/main.jsx': {
      code: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import '../App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,
    },
  });

  // Helper function to adjust file paths for the proper React folder structure.
  const adjustFilePath = (filePath) => {
    let path = filePath.trim();

    // Remove any leading './'
    if (path.startsWith('./')) {
      path = path.slice(2);
    }

    // Ensure the path starts with a '/'
    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    // Files that should remain at the root (config files)
    const rootConfigFiles = ['/tailwind.config.js', '/postcss.config.js', '/App.css', '/index.html'];

    // If the file belongs in the root or is a config file, leave it unchanged.
    if (rootConfigFiles.includes(path)) {
      return path;
    }

    // Otherwise, ensure the file is placed under the src folder.
    if (!path.startsWith('/src/')) {
      path = '/src/' + path.slice(1);
    }

    // Convert .js extensions to .jsx for React components (unless it's a config file).
    if (path.endsWith('.js') && !path.includes('config')) {
      path = path.replace(/\.js$/, '.jsx');
    }

    return path;
  };

  // Trigger AI code generation when a new user message arrives.
  useEffect(() => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
      generateAiCode();
    }
  }, [messages]);

  const generateAiCode = async () => {
    try {
      const lastMessage = messages.length > 0 ? messages[messages.length - 1].content : '';
      const PROMPT = dedent`${lastMessage} ${Prompt.CODE_GEN_PROMPT}`;

      const response = await axios.post('/api/gen-ai-code', { prompt: PROMPT });
      if (response.status !== 200) {
        throw new Error(`AI request failed: ${response.statusText}`);
      }
      const aiResp = response.data.result;
      if (!aiResp || !aiResp.files) {
        throw new Error('Invalid AI response format.');
      }
      console.log('Generated AI Code:', aiResp);

      // Adjust file paths and merge AI-generated files.
      const newFiles = {};
      Object.entries(aiResp.files).forEach(([filePath, fileData]) => {
        const adjustedPath = adjustFilePath(filePath);
        newFiles[adjustedPath] = { code: fileData.code };
      });

      setFiles((prevFiles) => ({
        ...prevFiles,
        ...newFiles,
      }));
    } catch (error) {
      console.error('Error generating AI code:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Navigation for Code / Preview */}
      <div className="bg-[#181818] p-3 border-b border-gray-700">
        <div className="flex items-center justify-center bg-[#222] p-2 rounded-full w-[180px] gap-4">
          <button
            onClick={() => setActive('Code')}
            className={`px-4 py-1 rounded-lg text-sm font-medium ${
              active === 'Code'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Code
          </button>
          <button
            onClick={() => setActive('Preview')}
            className={`px-4 py-1 rounded-lg text-sm font-medium ${
              active === 'Preview'
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      <SandpackProvider
        files={files}
        // Using "vanilla" ensures that no additional default files are injected.
        template="vanilla"
        theme="dark"
        customSetup={{
          // Define your app's JavaScript entry point.
          entry: '/src/main.jsx',
          dependencies: {
            react: 'latest',
            'react-dom': 'latest',
            tailwindcss: '^3.4.1',
            postcss: '^8',
            autoprefixer: '^10.0.0',
            'tailwind-merge': '^2.4.0',
            'tailwindcss-animate': '^1.0.7',
            'lucide-react': 'latest',
            'react-router-dom': 'latest',
            firebase: '^11.1.0',
            '@google/generative-ai': '^0.21.0',
          },
        }}
        options={{ externalResources: ['https://cdn.tailwindcss.com'] }}
      >
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
}

export default CodeView;
