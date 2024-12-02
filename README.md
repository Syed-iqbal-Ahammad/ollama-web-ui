# Ollama Web UI 🌐

https://github.com/user-attachments/assets/44068023-462a-48ef-860f-0d07cd49baf1

A beautiful and user-friendly interface to run Ollama's models locally, with an option to expose the local model to the internet for broader accessibility. This project aims to make it as easy as possible to get started with large language models (LLMs) without tedious setup!

Try it online: [ollama-web-ui.vercel.app](https://ollama-web-ui.vercel.app)

> **Note**: This project uses MongoDB instead of local storage, providing better performance and scalability.

## Features 🎉

- **Beautiful & Intuitive UI**: Inspired by ChatGPT to enhance user familiarity and ease of use.
- **MongoDB Compatible**: Ensures high performance and scalability for chat storage.
- **Fully Responsive**: Chat seamlessly across devices, whether on desktop or mobile.
- **Easy Setup**: Just clone the repo, and you're ready to go—no hassle!
- **Code Syntax Highlighting**: Messages containing code are highlighted for easy reference.
- **Copy Code Blocks**: Quickly copy highlighted code with a single click.
- **Model Download/Pull**: Download or pull models directly from the interface.
- **Quick Model Switching**: Easily switch between models with a click.
- **Chat History**: Chats are saved and easily accessible.
- **Light & Dark Mode**: Toggle between light and dark themes.
- **Temporary Chats**: Engage in temporary chats without saving the history.
- **Multiple Accounts**: Login with different accounts to manage various tasks.

## Getting Started 🚀

To use the web interface, these requisites must be met:

1. Download [Ollama](https://ollama.com/download) and have it running. Or run it in a Docker container. Check the [docs](https://github.com/ollama/ollama) for instructions.
2. Node.js (18+) and npm is required. [Download](https://nodejs.org/en/download)


### You can use Ollama Web UI in two ways:

### 1. Using the Website

- Use a MongoDB Atlas URL to store chats and other data.
- The MongoDB URL format should be: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net` (Ensure access is permitted to all IPs: `0.0.0.0/0`).
- Open [ollama-web-ui.vercel.app](https://ollama-web-ui.vercel.app).
- Expose your local Ollama model to the internet (use a tool like [ngrok](https://ngrok.com/) for this) and paste that URL in the `OLLAMA_HOST` field on the website.

### 2. Running Locally (Recommended).

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/Syed-iqbal-Ahammad/ollama-web-ui.git
   cd ollama-web-ui
   npm install
   npm run dev
   ```
2. Open your browser and go to `http://localhost:3000`.

## Upcoming Features 🛠️

If you show support by starring the GitHub repository, more features will be added, including:

- Web Search 🔍
- Voice-to-Text 🎙️
- And more!

## Tech Stack 💻

- **Next.js**: React framework for server-side rendering and static site generation.
- **Tailwind CSS**: Utility-first CSS framework.
- **ShadCN-UI**: UI components built with Radix UI and Tailwind CSS.
- **MongoDB**: NoSQL database for storing chat history and other data.
- **Ollama REST API**: Interface for running models locally.

## Helpful Links 🔗

- [Ollama](https://ollama.com/) - Official Ollama website
- [Ollama REST API Documentation](https://github.com/ollama/ollama/blob/main/docs/api.md) - API documentation for `OLLAMA_HOST`
- [Ollama JS Library](https://github.com/ollama/ollama-js) - Official JavaScript library for `OLLAMA_HOST`

--- 

