// Get references to DOM elements
const topicSelect = document.getElementById('topicSelect');
const responseDiv = document.getElementById('response');

// Add change event listener to the select
topicSelect.addEventListener('change', async () => {
  try {
    // Show loading state
    responseDiv.textContent = 'Loading...';
    
    // Get the selected topic
    const topic = topicSelect.value;

    // Prepare the prompt
    const prompt = `Give me a recent story about ${topic}.`;

    // Make API request to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-search-preview',

        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that summarizes recent stories about the provided topic from this week. Keep your answers brief, clear, and engaging for a general audience.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],

        web_search_options: {}
      })
    });

    // Parse the response
    const data = await response.json();
    
    // Function to convert markdown links to HTML links
    const convertLinks = (text) => {
      return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    };
    
    // Format and update the UI with the response
    const text = data.choices[0].message.content;
    const formattedText = text
      .split('\n\n')  // Split into paragraphs
      .filter(para => para.trim() !== '')  // Remove empty paragraphs
      .map(para => `<p>${convertLinks(para)}</p>`)  // Convert links and wrap in p tags
      .join('');
    
    responseDiv.innerHTML = formattedText;

  } catch (error) {
    // Handle any errors
    responseDiv.textContent = 'Sorry, there was an error getting the update. Please try again.';
    console.error('Error:', error);
  }
});
