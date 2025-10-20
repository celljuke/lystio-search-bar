"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface AiPromptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (prompt: string) => Promise<void>;
  isLoading?: boolean;
}

export function AiPromptDialog({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: AiPromptDialogProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = async () => {
    if (!prompt.trim() || isLoading) return;
    await onSubmit(prompt);
    setPrompt(""); // Clear after submission
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const examplePrompts = [
    "Find me a large apartment with a garage",
    "Houses in Wien under €2000",
    "3+ bedroom apartments near city center",
    "Properties with balcony and parking",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-2xl p-0 gap-0 overflow-hidden border-none"
        showCloseButton={false}
      >
        {/* Hidden title for accessibility */}
        <DialogTitle className="sr-only">Lystio AI Search</DialogTitle>

        {/* Custom Close Button - positioned absolutely over the header */}
        <DialogClose className="absolute top-4 right-4 z-50 rounded-full p-2 bg-white/20 hover:bg-white/30 transition-colors opacity-70 hover:opacity-100 focus:ring-2 focus:ring-white/50 focus:outline-none">
          <X className="w-5 h-5 text-white" />
          <span className="sr-only">Close</span>
        </DialogClose>

        {/* Header with animated gradient background */}
        <div className="relative bg-gradient-to-r from-primary to-primary p-6">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-2xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute bottom-4 left-4 w-20 h-20 bg-white/10 rounded-full blur-2xl"
          />

          <div className="relative flex items-center gap-3">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Lystio AI Search
              </h2>
              <p className="text-purple-100 text-sm mt-1">
                Describe your ideal property in natural language
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Textarea */}
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Find me a 3-bedroom apartment in Vienna with parking and balcony under €1500/month"
              disabled={isLoading}
              className={cn(
                "w-full h-32 p-4 border-2 border-gray-200 rounded-2xl",
                "focus:border-purple-500 focus:ring-4 focus:ring-purple-100",
                "outline-none transition-all resize-none",
                "placeholder:text-gray-400 text-gray-900",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {prompt.length}/500
            </div>
          </div>

          {/* Example Prompts */}
          {!prompt && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4"
            >
              <p className="text-sm font-medium text-gray-700 mb-2">
                Try these examples:
              </p>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((example, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    onClick={() => setPrompt(example)}
                    className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs rounded-full transition-colors"
                  >
                    {example}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handleSubmit}
              disabled={!prompt.trim() || isLoading}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 h-12 rounded-xl font-medium transition-all",
                "bg-gradient-to-r from-purple-600 to-pink-600 text-white",
                "hover:shadow-lg hover:scale-105",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Search with AI</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="px-6 h-12 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Keyboard Shortcut Hint */}
          <p className="text-xs text-gray-400 text-center mt-3">
            Press{" "}
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
              ⌘
            </kbd>{" "}
            +{" "}
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600">
              Enter
            </kbd>{" "}
            to submit
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
