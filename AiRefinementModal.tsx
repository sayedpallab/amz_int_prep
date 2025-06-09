
import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { AiSuggestion, QuestionAnswerItem, QuestionType, STARL } from '../../types';
import { BrainIcon, SparklesIcon } from '../../constants';

interface AiRefinementModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
  suggestion: AiSuggestion | null;
  error: string | null;
  onApply: (suggestionText: string) => void;
  questionBeingRefined: QuestionAnswerItem | null;
}

const AiRefinementModal: React.FC<AiRefinementModalProps> = ({
  isOpen,
  onClose,
  isLoading,
  suggestion,
  error,
  onApply,
  questionBeingRefined
}) => {

  const parseStarlFromString = (text: string): STARL | null => {
    const starl: Partial<STARL> = {};
    const lines = text.split(/\\r\\n|\\n|\\r|\n/); // Handle various newlines
    let currentKey: keyof STARL | null = null;

    const starlKeys: (keyof STARL)[] = ["situation", "task", "action", "result", "learning"];

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue; 

        let matchedKey = false;
        for (const key of starlKeys) {
            // Regex to match "Key:", "Key :", "Key  :" etc. case-insensitively
            const regex = new RegExp(`^${key}\\s*:\\s*`, "i"); 
            if (regex.test(trimmedLine)) {
                currentKey = key;
                starl[currentKey] = trimmedLine.replace(regex, "").trim();
                matchedKey = true;
                break;
            }
        }
        if (!matchedKey && currentKey && starl[currentKey] !== undefined) {
            // Append to existing key's value if it's a multi-line entry
            starl[currentKey] += `\n${trimmedLine}`;
        } else if (!matchedKey && !currentKey) {
            // Line doesn't match a key and no key is active - could be intro/outro text
            // If starl object is still empty, this might be the start of general text
            if (Object.keys(starl).length === 0 && !starl.situation) { // Check specific key
                 // Heuristic: if it's the first meaningful line and doesn't match a key,
                 // it might be freestyle response or general text.
                 // For now, we'll assume this parser is for STARL.
            }
        }
    }
    
    if (starl.situation && starl.action && starl.result) { // Basic check for STARL
        return {
            situation: starl.situation || '',
            task: starl.task || '',
            action: starl.action || '',
            result: starl.result || '',
            learning: starl.learning || '',
        };
    }
    return null; 
};


  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Suggestion copied to clipboard!");
    }).catch(err => {
      console.error("Failed to copy text: ", err);
      alert("Failed to copy suggestion.");
    });
  };
  
  const renderSuggestionContent = () => {
    if (!suggestion || !suggestion.suggestedText) return null;

    if (questionBeingRefined?.type === QuestionType.LEADERSHIP_PRINCIPLE) {
        const parsedSTARL = parseStarlFromString(suggestion.suggestedText);
        if (parsedSTARL) {
            return (
                <div className="space-y-3 text-sm">
                    {(Object.keys(parsedSTARL) as Array<keyof STARL>).map(key => (
                        (parsedSTARL[key] || key === 'learning') &&
                        <div key={key}>
                            <h5 className="font-semibold text-theme-text-primary dark:text-theme-dark-text-primary capitalize">{key}:</h5>
                            <p className="text-theme-text-secondary dark:text-theme-dark-text-secondary whitespace-pre-wrap bg-theme-bg-main dark:bg-theme-dark-bg-main p-2.5 rounded-md border border-theme-border-color dark:border-theme-dark-border-color">
                                {parsedSTARL[key] || (key === 'learning' ? <span className="italic">Not explicitly provided.</span> : '')}
                            </p>
                        </div>
                    ))}
                </div>
            );
        }
    }
    // Fallback to plain text display for Freestyle or if STARL parsing fails
    return <p className="text-theme-text-secondary dark:text-theme-dark-text-secondary whitespace-pre-wrap text-sm bg-theme-bg-main dark:bg-theme-dark-bg-main p-3 rounded-md border border-theme-border-color dark:border-theme-dark-border-color">{suggestion.suggestedText}</p>;
  };

  const scrollbarStyles = `
    .pretty-scrollbar::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    .pretty-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .pretty-scrollbar::-webkit-scrollbar-thumb {
      background: #CC8B79; /* theme-accent-primary */
      border-radius: 4px;
    }
    .dark .pretty-scrollbar::-webkit-scrollbar-thumb {
      background: #D99C8C; /* theme-dark-accent-primary */
    }
    .pretty-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #b3705f; /* theme-accent-primary-hover (example) */
    }
    .dark .pretty-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #c08573; /* theme-dark-accent-primary-hover (example) */
    }
  `;


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Answer Refinement" size="3xl">
      <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
      <div className="space-y-4">
        {isLoading && (
          <div className="flex flex-col items-center justify-center p-10 min-h-[200px]">
            <SparklesIcon className="w-12 h-12 text-theme-accent-primary dark:text-theme-dark-accent-primary animate-pulse" />
            <p className="mt-4 text-lg font-medium text-theme-text-primary dark:text-theme-dark-text-primary">
              Gemini is thinking...
            </p>
            <p className="text-sm text-theme-text-secondary dark:text-theme-dark-text-secondary">Please wait a moment.</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="p-4 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 border border-red-300 dark:border-red-700 rounded-md">
            <h4 className="text-md font-semibold text-red-700 dark:text-red-200">Error Refining Answer</h4>
            <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
          </div>
        )}

        {!isLoading && !error && suggestion && (
          <>
            <div>
              <h4 className="text-md font-semibold text-theme-text-primary dark:text-theme-dark-text-primary mb-1 flex items-center">
                <SparklesIcon className="w-5 h-5 inline mr-2 text-theme-accent-primary dark:text-theme-dark-accent-primary" />
                AI Suggestion for:
              </h4>
              <p className="text-sm italic text-theme-text-secondary dark:text-theme-dark-text-secondary truncate" title={suggestion.originalQuestion}>"{suggestion.originalQuestion}"</p>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-1 mt-2 mb-3 pretty-scrollbar">
              {renderSuggestionContent()}
            </div>
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-3">
                <Button variant="secondary" onClick={() => handleCopyToClipboard(suggestion.suggestedText)} size="md">
                    Copy Suggestion
                </Button>
                <Button variant="primary" onClick={() => {
                    onApply(suggestion.suggestedText); 
                    onClose();
                }}
                size="md"
                >
                    Use Suggestion (Edit Manually)
                </Button>
            </div>
          </>
        )}
        
        {!isLoading && !error && !suggestion && (
             <p className="text-theme-text-secondary dark:text-theme-dark-text-secondary text-center py-5">No suggestion available. AI might not be configured or an issue occurred.</p>
        )}

        <div className="mt-4 flex justify-end border-t border-theme-border-color dark:border-theme-dark-border-color pt-4">
          <Button variant="ghost" onClick={onClose} size="md">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AiRefinementModal;
