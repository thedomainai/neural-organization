"use client";

import { useState, useRef } from "react";
import { Terminal, Send, ChevronUp, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export function ResearchConsole() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: query }]);
    setQuery("");
    setIsLoading(true);
    
    setTimeout(() => {
        setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: "Recent strategic analysis suggests that focusing on foundation models with multi-modal capabilities will yield 25% higher efficiency in vertical agent orchestration over the next quarter." 
        }]);
        setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
    }
  };

  return (
    <div 
      className={cn(
        "border-t bg-white shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out flex flex-col rounded-t-2xl mx-4",
        isExpanded ? "h-[50vh]" : "h-16"
      )}
    >
      {/* 3. Improved Header & Whitespace */}
      <div 
        className="flex items-center justify-between px-8 h-16 cursor-pointer hover:bg-slate-50 transition-colors rounded-t-2xl"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 text-sm font-bold text-slate-700">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          <span>Deep Research Console</span>
          {!isExpanded && messages.length > 0 && (
             <span className="text-[10px] font-medium bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
               {messages.length} messages
             </span>
          )}
        </div>
        <div className="flex items-center gap-4">
            {!isExpanded && <span className="text-[10px] text-slate-400 font-medium">Click to expand strategic terminal</span>}
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full bg-slate-100">
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Chat content area with more padding */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6 font-mono text-sm scroll-smooth">
             {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
                    <Terminal size={48} className="mb-4 text-slate-100" />
                    <p className="text-center">Enter your follow-up query to dive deeper into the trends.</p>
                </div>
             )}
             {messages.map((msg, i) => (
                <div key={i} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                    <div className={cn(
                        "max-w-[80%] rounded-2xl p-4 shadow-sm",
                        msg.role === 'user' ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-800"
                    )}>
                        {msg.content}
                    </div>
                </div>
             ))}
             {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-slate-100 rounded-2xl p-4 animate-pulse flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                </div>
             )}
          </div>

          {/* 3. Corrected Button size and Textarea layout */}
          <div className="p-6 border-t bg-slate-50/50">
             <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex items-end gap-3 bg-white p-2 pl-4 rounded-xl border border-slate-200 shadow-sm focus-within:border-indigo-300 transition-colors">
                <Textarea 
                    ref={textareaRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask follow-up questions..."
                    className="min-h-[40px] max-h-[120px] border-none shadow-none focus-visible:ring-0 p-2 resize-none text-sm"
                />
                <Button 
                    type="submit" 
                    size="icon" 
                    className="h-10 w-10 shrink-0 mb-0.5 rounded-lg" 
                    disabled={isLoading || !query.trim()}
                >
                    <Send className="h-4 w-4" />
                </Button>
             </form>
             <div className="text-center mt-3">
                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Domain AI Strategic Intelligence Console</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}