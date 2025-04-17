import React, { useState, useRef, useEffect } from "react";
import { ToneSelector } from "../../src/component/ToneSelector";
import { EmailInput } from "../../src/component/EmailInput";
import { Button } from "../../src/component/ui/button";
import { RefreshCcw, X, Sparkles, Copy } from "lucide-react";
import { useToast } from "../../src/hook/use-toast";

export function ToneCraftApp() {
  const [tone, setTone] = useState("professional");
  const [emailInput, setEmailInput] = useState("");
  const [rewrittenEmail, setRewrittenEmail] = useState("");
  const [promptPreview, setPromptPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const emailInputRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handleToneChange = (newTone) => {
    setTone(newTone);
    setError("");
    toast({
      title: "Tone Updated",
      description: `Email tone set to ${newTone.charAt(0).toUpperCase() + newTone.slice(1)}`,
    });
  };

  const handleEmailInputChange = (event) => {
    setEmailInput(event.target.value);
    setError("");
  };

  const handleRewriteClick = async () => {
    if (emailInput.trim() === "") {
      setError("Please enter an email to rewrite.");
      return;
    }

    setLoading(true);
    setError("");
    const prompt = `Rewrite the following email with a ${tone} tone: "${emailInput}"`;
    setPromptPreview(prompt);

    try {
      const response = await fetch("http://localhost:5000/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (response.ok) {
        setRewrittenEmail(data.text);
        toast({
          title: "Email Rewritten",
          description: "Your email has been successfully rewritten!",
        });
      } else {
        setError(data.error || "Error generating rewritten email.");
        setRewrittenEmail("");
      }
    } catch (error) {
      console.error("Error calling backend:", error);
      setError("Failed to connect to the server. Please try again.");
      setRewrittenEmail("");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(rewrittenEmail);
    toast({
      title: "Copied to clipboard",
      description: "The rewritten email has been copied.",
    });
  };

  const clearError = () => {
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Sparkles className="text-purple-600 h-7 w-7" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              ToneCraft
            </h1>
          </div>
          <p className="text-gray-600">Transform your email's tone with a single click</p>
        </div>

        {/* Error Handling */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 flex justify-between items-center">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={clearError} 
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {/* Tone Selector */}
            <ToneSelector selectedTone={tone} onToneChange={handleToneChange} />

            {/* Email Input */}
            <EmailInput
              label="Original Email"
              subtext="Paste the email you want to rewrite"
              placeholder="Type or paste your email here..."
              value={emailInput}
              onChange={handleEmailInputChange}
              ref={emailInputRef}
              error={error && !emailInput.trim() ? "Email content is required" : ""}
            />

            {/* Rewrite Button */}
            <Button
              onClick={handleRewriteClick}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              size="lg"
            >
              {loading ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Crafting your email...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Rewrite with {tone.charAt(0).toUpperCase() + tone.slice(1)} Tone
                </>
              )}
            </Button>
          </div>

          <div className="space-y-6">
            {/* Rewritten Email */}
            <div className="relative">
              <EmailInput
                label="Rewritten Email"
                subtext="Your rewritten email will appear here"
                placeholder="Your rewritten email will appear here..."
                value={rewrittenEmail}
                readOnly
                className={`transition-all duration-300 ${
                  rewrittenEmail ? "bg-purple-50 border-purple-200" : "bg-gray-50"
                }`}
              />
              {rewrittenEmail && (
                <button 
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2 p-1 bg-white rounded-md shadow-sm hover:bg-gray-100 transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy size={16} className="text-gray-500" />
                </button>
              )}
            </div>

            {/* Prompt Preview */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Prompt Preview</label>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-600 min-h-[60px]">
                {promptPreview || "Generated prompt will be shown here..."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
