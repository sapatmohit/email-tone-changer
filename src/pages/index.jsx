import React, { useState, useRef, useEffect } from "react";
import { Sparkles, RefreshCcw, X, Copy } from "lucide-react";
import { cn } from "../../src/lib/utils";
import { Button } from "../../src/component/ui/button";
import { Textarea } from "../../src/component/ui/textarea";
import { useToast } from "../../src/hook/use-toast";

const Index = () => {
  const [tone, setTone] = useState("professional");
  const [emailInput, setEmailInput] = useState("");
  const [rewrittenEmail, setRewrittenEmail] = useState("");
  const [promptPreview, setPromptPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const emailInputRef = useRef(null);
  const { toast } = useToast();

  const tones = [
    {
      value: "professional",
      label: "Professional",
      description: "Clear, concise and business-appropriate",
      color: "bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200",
    },
    {
      value: "friendly",
      label: "Friendly",
      description: "Warm, approachable and personable",
      color: "bg-green-100 border-green-300 text-green-700 hover:bg-green-200",
    },
    {
      value: "formal",
      label: "Formal",
      description: "Respectful, sophisticated and traditional",
      color: "bg-purple-100 border-purple-300 text-purple-700 hover:bg-purple-200",
    },
    {
      value: "casual",
      label: "Casual",
      description: "Relaxed, conversational and laid-back",
      color: "bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200",
    },
    {
      value: "enthusiastic",
      label: "Enthusiastic",
      description: "Energetic, positive and motivating",
      color: "bg-rose-100 border-rose-300 text-rose-700 hover:bg-rose-200",
    },
  ];

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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The text has been copied to your clipboard.",
    });
  };

  const clearError = () => {
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Sparkles className="text-purple-600 h-7 w-7" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              ToneCraft
            </h1>
          </div>
          <p className="text-gray-600">Transform your email's tone with a single click</p>
        </div>

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
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-gray-700">Select Tone</label>
                <p className="text-xs text-gray-500">Choose how you'd like your email to sound</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {tones.map((toneOption) => (
                  <button
                    key={toneOption.value}
                    onClick={() => handleToneChange(toneOption.value)}
                    className={cn(
                      "relative flex flex-col items-start p-3 border rounded-lg transition-all duration-200",
                      toneOption.color,
                      tone === toneOption.value
                        ? "ring-2 ring-offset-2 ring-purple-500"
                        : "hover:scale-105"
                    )}
                  >
                    {tone === toneOption.value && (
                      <div className="absolute right-2 top-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      </div>
                    )}
                    <div className="font-medium">{toneOption.label}</div>
                    <div className="text-xs mt-1 opacity-90">{toneOption.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Original Email</label>
                <p className="text-xs text-gray-500">Paste the email you want to rewrite</p>
              </div>
              <Textarea
                placeholder="Type or paste your email here..."
                value={emailInput}
                onChange={handleEmailInputChange}
                ref={emailInputRef}
                className={cn(
                  "min-h-[150px] resize-none transition-all focus:ring-purple-500",
                  error && !emailInput.trim() ? "border-red-500 focus:ring-red-500" : ""
                )}
              />
              {error && !emailInput.trim() && (
                <p className="text-sm text-red-500">Email content is required</p>
              )}
            </div>

            <Button
              onClick={handleRewriteClick}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3"
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
            <div className="space-y-2">
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-gray-700">Rewritten Email</label>
                <p className="text-xs text-gray-500">Your rewritten email will appear here</p>
              </div>
              <div className="relative">
                <Textarea
                  placeholder="Rewritten email will appear here..."
                  value={rewrittenEmail}
                  readOnly
                  className={cn(
                    "min-h-[150px] resize-none transition-opacity duration-300",
                    rewrittenEmail ? "bg-purple-50 border-purple-200" : "bg-gray-50"
                  )}
                />
                {rewrittenEmail && (
                  <button
                    onClick={() => copyToClipboard(rewrittenEmail)}
                    className="absolute top-2 right-2 p-1 bg-white rounded-md shadow-sm hover:bg-gray-100 transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy size={16} className="text-gray-500" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Prompt Preview</label>
              <Textarea
                placeholder="Generated prompt will be shown here..."
                value={promptPreview}
                readOnly
                className="min-h-[100px] text-sm text-gray-600 bg-gray-50 resize-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
