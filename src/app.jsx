import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "./component/ui/sonner";
import { Toaster } from "./component/ui/toaster";
import { TooltipProvider } from "./component/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [tone, setTone] = useState("professional");
  const [emailInput, setEmailInput] = useState("");
  const [rewrittenEmail, setRewrittenEmail] = useState("");
  const [promptPreview, setPromptPreview] = useState("");
  const emailInputRef = useRef(null);

  const tones = [
    {
      value: "professional",
      label: "Professional",
      desc: "Clear, concise and business-appropriate",
      color: "bg-blue-100 border-blue-300 text-blue-700",
    },
    {
      value: "friendly",
      label: "Friendly",
      desc: "Warm, approachable and personable",
      color: "bg-green-100 border-green-300 text-green-700",
    },
    {
      value: "formal",
      label: "Formal",
      desc: "Respectful, sophisticated and traditional",
      color: "bg-purple-100 border-purple-300 text-purple-700",
    },
    {
      value: "casual",
      label: "Casual",
      desc: "Relaxed, conversational and laid-back",
      color: "bg-yellow-100 border-yellow-300 text-yellow-700",
    },
    {
      value: "enthusiastic",
      label: "Enthusiastic",
      desc: "Energetic, positive and motivating",
      color: "bg-red-100 border-red-300 text-red-700",
    },
  ];

  const handleToneChange = (newTone) => setTone(newTone);
  const handleEmailInputChange = (e) => setEmailInput(e.target.value);

  const handleRewriteClick = () => {
    if (!emailInput.trim()) return;
    const prompt = `Rewrite the following email with a ${tone} tone: "${emailInput}"`;
    setPromptPreview(prompt);
    setRewrittenEmail("Your rewritten email will appear here...");
  };

  useEffect(() => {
    if (emailInputRef.current) emailInputRef.current.focus();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;