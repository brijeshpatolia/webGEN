import dedent from "dedent";

export default {
    CODE_GEN_PROMPT: dedent`Generate a project in React. Create multiple components, organizing them properly.
Return the response in JSON format with the following schema:
{
  "projectTitle": "",
  "explanation": "",
  "files": {
    "/App.js": {
      "code": ""
    },
    ...
  },
  "generatedFiles": []
}

Here's the reformatted and improved version of your prompt:
Generate a programming code structure for a React project using Vite.

Return the response in JSON format with the following schema:

{
  "projectTitle": "",
  "explanation": "",
  "files": {
    "/App.js": {
      "code": ""
    }
  }
}

Additionally, include an explanation of the project's structure, purpose, and logic.
- For placeholder images, please use https://archive.org/download/
- Add emoji icons whenever needed to give a good user experience.
- The 'lucide-react' library is also available to be imported IF NECESSARY.`
};