import React, { useState } from 'react';
import './App.css';

function App() {
  const [tone, setTone] = useState('professional');
  const [emailInput, setEmailInput] = useState('');
  const [rewrittenEmail, setRewrittenEmail] = useState('');
  const [promptPreview, setPromptPreview] = useState('');
  const [loading, setLoading] = useState(false);

  const apiKey = 'YOUR_GEMINI_API_KEY'; // Replace with your actual API key
  const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'; // Replace if the endpoint is different
  const modelName = 'gemini-pro';

  const handleToneChange = (event) => {
    setTone(event.target.value);
  };

  const handleEmailInputChange = (event) => {
    setEmailInput(event.target.value);
  };

  const handleRewriteClick = async () => {
    if (emailInput.trim() === '') {
      alert('Please enter your email.');
      return;
    }

    setLoading(true);
    const prompt = `Rewrite the following email with a ${tone} tone: "${emailInput}"`;
    setPromptPreview(prompt);

    try {
      const rewrittenText = await callGeminiAPI(emailInput, tone, prompt);
      setRewrittenEmail(rewrittenText);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setRewrittenEmail("Error generating rewritten email.");
    } finally {
      setLoading(false);
    }
  };

  async function callGeminiAPI(email, selectedTone, prompt) {
    try {
      const response = await fetch(`${apiUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelName,
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 256,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API Error:', errorData);
        return `Error from Gemini API: ${response.statusText}`;
      }

      const data = await response.json();
      if (data && data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.warn('Gemini API response format unexpected:', data);
        return '(Unexpected response from Gemini API)';
      }

    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return 'Failed to call Gemini API.';
    }
  }

  return (
    <div className="container">
      <h1>Email Tone Changer</h1>

      <label htmlFor="tone">Select Tone:</label>
      <select id="tone" value={tone} onChange={handleToneChange}>
        <option value="professional">Professional</option>
        <option value="friendly">Friendly</option>
        <option value="formal">Formal</option>
        <option value="casual">Casual</option>
        <option value="enthusiastic">Enthusiastic</option>
      </select>

      <label htmlFor="email-input">Enter Email:</label>
      <textarea
        id="email-input"
        rows="8"
        placeholder="Type your email here..."
        value={emailInput}
        onChange={handleEmailInputChange}
      />

      <button onClick={handleRewriteClick} disabled={loading}>
        {loading ? 'Rewriting...' : 'Rewrite Email'}
      </button>

      <label htmlFor="rewritten-email">Rewritten Email:</label>
      <textarea
        id="rewritten-email"
        rows="8"
        placeholder="Rewritten email will appear here..."
        value={rewrittenEmail}
        readOnly
      />

      <label htmlFor="prompt-preview">Prompt Preview:</label>
      <textarea
        id="prompt-preview"
        rows="4"
        placeholder="Generated prompt will be shown here..."
        value={promptPreview}
        readOnly
      />
    </div>
  );
}

export default App;