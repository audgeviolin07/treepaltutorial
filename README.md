### Step 1: Get the Code

Either clone the repository using Git:

```bash
git clone https://github.com/yourusername/terms-of-service-analyzer.git
cd terms-of-service-analyzer
```
### Step 2. Install dependencies:


```shellscript
npm install
# or
yarn install
```

This will install all the necessary packages defined in the `package.json` file, including:

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui components
- AI SDK
- Other utility libraries


### Step 3: Set Up Environment Variables

Create a `.env` file in the root directory of the project:

```shellscript
touch .env
```

Open the `.env` file in your code editor and add your OpenAI API key:

```plaintext
OPENAI_API_KEY=your_openai_api_key_here
```

Replace `your_openai_api_key_here` with your actual OpenAI API key. You can obtain an API key by:

1. Going to [https://platform.openai.com/](https://platform.openai.com/)
2. Creating an account or signing in
3. Navigating to the API keys section
4. Creating a new API key


### Step 4: Run the Application

#### Development Mode

To run the application in development mode with hot-reloading:

```shellscript
npm run dev
```

This will start the development server, typically on port 3000. Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to see the application.

#### Production Build

For a production build, use the following commands:

```shellscript
# Build the application
npm run build

# Start the production server
npm start
```

The production build will be optimized for performance and will typically run on port 3000 unless configured otherwise.

### Troubleshooting

#### Common Issues

1. **"Module not found" errors**:

1. Make sure you've run `npm install` correctly
2. Try deleting the `node_modules` folder and `package-lock.json` file, then run `npm install` again



2. **Environment variable issues**:

1. Ensure your `.env` file is in the root directory
2. Make sure there are no spaces around the equals sign in the `.env` file
3. Restart the development server after changing environment variables



3. **Port already in use**:

1. If port 3000 is already in use, you can specify a different port:

```shellscript
npm run dev -- -p 3001
```





4. **OpenAI API errors**:

1. Verify your API key is correct
2. Check if you have sufficient credits in your OpenAI account
3. The application will run in demo mode if the API key is invalid or missing





## How It Works

1. **URL Input**: Enter any website URL or a direct link to a Terms of Service page.
2. **Automated Extraction**: The application will:

1. Connect to the website
2. Search for Terms of Service links
3. Extract the content from those pages
4. Fall back to known URLs for popular websites



3. **AI Analysis**: The extracted content is analyzed using OpenAI's GPT-4o model to:

1. Generate a comprehensive summary
2. Prepare for answering specific questions



4. **Interactive Chat**: Ask specific questions about the Terms of Service and receive AI-generated answers based on the actual content.
5. **Suggested Questions**: The AI generates relevant questions based on the content of the Terms of Service.


## Technologies Used

- **Next.js**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Reusable UI components
- **OpenAI API**: AI-powered text generation and analysis
- **AI SDK**: Simplified AI integration


## Project Structure

```plaintext
├── app/
│   ├── actions.ts         # Server actions for API calls
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page component
├── components/
│   ├── analysis-process.tsx    # Process visualization
│   ├── chat-interface.tsx      # Chat UI component
│   ├── process-animation.tsx   # Animation component
│   ├── suggested-questions.tsx # AI-generated questions
│   ├── ui/                     # UI components
│   └── website-analyzer.tsx    # Main analyzer component
├── lib/
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Utility functions
├── .env                   # Environment variables
└── README.md              # Project documentation
```

## Additional npm Commands

- **Lint the code**:

```shellscript
npm run lint
```


- **Run tests** (if implemented):

```shellscript
npm test
```


- **Clean the cache** (if you encounter strange build issues):

```shellscript
npm cache clean --force
```




## Limitations and Considerations

- **API Key Required**: The application requires an OpenAI API key to function fully. Without it, it will run in demonstration mode with limited functionality.
- **Website Access**: Some websites may block automated access or have CAPTCHAs that prevent content extraction.
- **Content Extraction**: The quality of analysis depends on the ability to extract clean text from websites, which can vary based on the site's structure.
- **Rate Limits**: Be aware of OpenAI API rate limits and costs when using the application extensively.


## Demo Mode

If you don't have an OpenAI API key, the application will run in demonstration mode, showing the UI and flow but using mock data instead of real AI analysis.

## License

MIT License

```plaintext

```
