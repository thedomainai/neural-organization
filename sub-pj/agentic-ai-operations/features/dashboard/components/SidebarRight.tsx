"use client";

import { useState } from "react";
import { ExternalLink, Filter, History, X } from "lucide-react";
import { Article, Category } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarRightProps {
  articles: Article[];
  categories: Category[];
}

export function SidebarRight({ articles, categories }: SidebarRightProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const filteredArticles = selectedTag
    ? articles.filter((a) => a.tag === selectedTag)
    : articles;

  return (
    <>
      <div className="flex flex-col h-full bg-slate-50 border-l border-slate-200">
        <div className="p-6 border-b border-slate-200 bg-slate-100/30 flex justify-between items-center">
          <h2 className="font-bold text-slate-700 flex items-center gap-2 text-sm uppercase tracking-tight">
            <History size={16} className="text-slate-400" />
            Live Feed
          </h2>
          {selectedTag && (
            <button 
              className="text-[10px] text-indigo-600 font-bold hover:underline"
              onClick={() => setSelectedTag(null)}
            >
              CLEAR
            </button>
          )}
        </div>

        {/* 1. Horizontal Scroll Category Filter */}
        <div className="bg-white border-b border-slate-200 overflow-hidden">
           <div className="flex overflow-x-auto p-4 gap-2 no-scrollbar scroll-smooth">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedTag(selectedTag === cat.label ? null : cat.label)}
                  className={cn(
                    "whitespace-nowrap text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider transition-all border shrink-0",
                    selectedTag === cat.label 
                      ? "ring-2 ring-indigo-500 ring-offset-1 opacity-100 border-indigo-200" 
                      : "opacity-60 hover:opacity-100 border-transparent",
                    cat.color
                  )}
                >
                  {cat.label}
                </button>
              ))}
           </div>
        </div>

        {/* Article List with more whitespace */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {filteredArticles.map((article) => (
            <div 
              key={article.id} 
              onClick={() => setSelectedArticle(article)}
              className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 group hover:shadow-md hover:border-indigo-200 transition-all duration-200 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                  <span className={cn(
                      "text-[9px] font-bold px-2 py-0.5 rounded",
                      getCategoryColorClass(article.tag, categories)
                  )}>
                    {article.tag}
                  </span>
                  {article.impact === "High" && (
                      <span className="text-[9px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded ring-1 ring-red-100">
                          HIGH
                      </span>
                  )}
              </div>
              
              <h3 className="font-bold text-slate-800 text-sm mb-3 leading-snug group-hover:text-indigo-600 transition-colors">
                  {article.title}
              </h3>
              
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {article.summary}
              </p>

              <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400 font-medium">
                  <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                      Relevance {article.relevanceScore}%
                  </span>
                  <span>{new Date(article.publishedAt).toLocaleDateString('ja-JP')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Article Popup Window (Modal) */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
                <Badge className={getCategoryColorClass(selectedArticle.tag, categories)}>
                    {selectedArticle.tag}
                </Badge>
                <button 
                    onClick={() => setSelectedArticle(null)}
                    className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                    <X size={20} className="text-slate-500" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">
                    {selectedArticle.title}
                </h2>
                <div className="flex gap-4 mb-8 text-xs text-slate-400">
                    <span>Published: {new Date(selectedArticle.publishedAt).toLocaleString()}</span>
                    <span>Impact Level: {selectedArticle.impact}</span>
                </div>
                <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 leading-loose text-lg">
                        {selectedArticle.summary}
                    </p>
                    <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-500 italic">
                        Full analysis of this trend is available in the weekly briefing. Follow the link below for original source.
                    </div>
                </div>
            </div>
            <div className="p-6 border-t bg-slate-50 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setSelectedArticle(null)}>Close</Button>
                <Button asChild>
                    <a href={selectedArticle.sourceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        View Original <ExternalLink size={14} />
                    </a>
                </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function getCategoryColorClass(tagName: string, categories: Category[]) {
    const cat = categories.find(c => c.label === tagName);
    return cat ? cat.color : "bg-slate-100 text-slate-600";
}