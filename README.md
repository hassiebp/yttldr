# yttldr

Simple YouTube video summarizer. Get LLM generated video summaries and ask questions to learn more.

## How it works

The main user input is a valid Youtube URL. This can be both for the regular Youtube top-level domain or for Youtube sharing links (`youtu.be`).
yttldr parses the youtube video ID, fetches the transcript, feeds it into the LLM context and requests a LLM generation for an initial summary.
Users can than chat back and forth with the LLM that maintains the transcript in context.

## Tech stack

- [NextJS]() for fast bootstrapping of a fullstack app and easy deployment path
- [Vercel AI SDK]() to handle LLM calls on the backend and chat UI state on the client
- [Langfuse]() to host the main prompt and for observability into the apps performance

## FAQ

### Why am I not getting a summary of my video?🥺

If you have provided a valid youtube URL, probably the parsing of the video ID failed or the video has no transcript. Please open an issue or drop me a DM, social links are in my profile.

## Learn more

Check out my [LinkedIn](https://linkedin.com/in/hassieb) or [X](https://x.com/hassiebpakzad) to learn more about building with LLMs.
