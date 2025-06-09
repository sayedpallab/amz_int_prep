import React, { useState, useEffect, useCallback } from 'react';
import { QuestionAnswerItem, STARL, QuestionType } from '../../types';
import Button from '../ui/Button';
import { ChevronLeftIcon, ChevronRightIcon, StarIcon, SparklesIcon } from '../../constants';

interface FlashcardViewProps {
  items: QuestionAnswerItem[];
}

const FlashcardView: React.FC<FlashcardViewProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledItems, setShuffledItems] = useState<QuestionAnswerItem[]>([]);

  const shuffleArray = useCallback(<T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);
  
  useEffect(() => {
    if (items.length > 0) {
       setShuffledItems(shuffleArray(items));
       setCurrentIndex(0);
       setIsFlipped(false);
    } else {
       setShuffledItems([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]); 

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev + 1) % shuffledItems.length), isFlipped ? 400 : 0); 
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex((prev) => (prev - 1 + shuffledItems.length) % shuffledItems.length), isFlipped ? 400 : 0);
  };
  
  const handleShuffle = () => {
    setShuffledItems(shuffleArray(items));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  if (shuffledItems.length === 0) {
    return (
      <div className="text-center py-10 px-4">
        <svg className="mx-auto h-16 w-16 text-theme-border-color dark:text-theme-dark-border-color mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"  strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h3 className="font-serif text-xl font-semibold text-theme-text-primary dark:text-theme-dark-text-primary mb-2">No Questions for Flashcards</h3>
        <p className="text-theme-text-secondary dark:text-theme-dark-text-secondary">Add some questions in the "Q&A Database" to start practicing with flashcards.</p>
      </div>
    );
  }

  const currentItem = shuffledItems[currentIndex];
  const lpTagStyle = "bg-theme-accent-secondary dark:bg-theme-dark-accent-secondary text-white"; 
  const freestyleTagStyle = "bg-theme-accent-ai dark:bg-theme-dark-accent-ai text-white";

  return (
    <div className="flex flex-col items-center space-y-6 p-2 sm:p-4 max-w-2xl mx-auto">
      <div className="w-full text-center">
        <p className="text-sm text-theme-text-secondary dark:text-theme-dark-text-secondary">Card {currentIndex + 1} of {shuffledItems.length}</p>
        <span className={`mt-1 px-3 py-1 text-xs font-bold rounded-full ${currentItem.type === QuestionType.LEADERSHIP_PRINCIPLE ? lpTagStyle : freestyleTagStyle} inline-flex items-center shadow-sm`}>
          {currentItem.type === QuestionType.LEADERSHIP_PRINCIPLE ? <StarIcon className="w-3 h-3 mr-1.5" /> : <SparklesIcon className="w-3 h-3 mr-1.5" />}
          {currentItem.principleOrCategory}
        </span>
      </div>

      {/* Flashcard Container - matches user's #flashcard-container style */}
      <div
        className="w-full max-w-xl h-[400px] sm:h-[450px] perspective" // Use max-w-xl for responsiveness
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div 
            className={`relative w-full h-full transition-transform duration-700 ease-in-out transform-style-3d ${isFlipped ? '[transform:rotateY(180deg)]' : ''} animate-flip`} // Using Tailwind's defined flip animation
        >
            {/* Front of card - matches user's .card-face .card-front */}
            <div className="absolute w-full h-full backface-hidden flex flex-col justify-center items-center p-6 sm:p-8 overflow-y-auto bg-theme-bg-card dark:bg-theme-dark-bg-card rounded-lg shadow-md dark:shadow-dark-md border border-theme-border-color dark:border-theme-dark-border-color text-center">
                <h4 className="font-serif text-xl sm:text-2xl font-bold text-theme-text-primary dark:text-theme-dark-text-primary">{currentItem.question}</h4>
                <p className="mt-4 text-xs text-theme-text-secondary dark:text-theme-dark-text-secondary">(Click to reveal answer)</p>
            </div>
            {/* Back of card - matches user's .card-face .card-back */}
            <div className="absolute w-full h-full [transform:rotateY(180deg)] backface-hidden flex flex-col justify-start items-start p-6 sm:p-8 overflow-y-auto text-left bg-theme-bg-card dark:bg-theme-dark-bg-card rounded-lg shadow-md dark:shadow-dark-md border border-theme-border-color dark:border-theme-dark-border-color">
                 {currentItem.type === QuestionType.LEADERSHIP_PRINCIPLE && currentItem.answerSTARL && (
                    <div className="space-y-2 text-sm sm:text-base">
                         {(Object.keys(currentItem.answerSTARL) as Array<keyof STARL>).map(key => (
                            currentItem.answerSTARL && (currentItem.answerSTARL[key] || key === "learning") &&
                            <div key={key} className="mb-2">
                                <strong className="font-semibold text-theme-text-primary dark:text-theme-dark-text-primary capitalize">{key}:</strong>
                                <p className="text-theme-text-secondary dark:text-theme-dark-text-secondary whitespace-pre-wrap leading-relaxed mt-0.5">{currentItem.answerSTARL[key] || (key === "learning" ? <span className="italic">No specific learning noted.</span> : "")}</p>
                            </div>
                        ))}
                    </div>
                )}
                {currentItem.type === QuestionType.FREESTYLE && (
                    <p className="text-theme-text-secondary dark:text-theme-dark-text-secondary whitespace-pre-wrap text-sm sm:text-base leading-relaxed">{currentItem.answerFreestyle || "No answer provided."}</p>
                )}
                 <p className="mt-auto pt-4 text-xs text-theme-text-secondary dark:text-theme-dark-text-secondary self-center">(Click to see question)</p>
            </div>
        </div>
      </div>

      <div className="flex justify-between items-center w-full max-w-md mt-4 sm:mt-6">
        <Button onClick={handlePrev} leftIcon={<ChevronLeftIcon />} variant="secondary" size="md" disabled={shuffledItems.length <= 1}>Previous</Button>
        <Button onClick={handleShuffle} variant="ghost" size="md" className="text-theme-text-secondary dark:text-theme-dark-text-secondary hover:text-theme-accent-primary dark:hover:text-theme-dark-accent-primary">Shuffle</Button>
        <Button onClick={handleNext} rightIcon={<ChevronRightIcon />} variant="secondary" size="md" disabled={shuffledItems.length <= 1}>Next</Button>
      </div>
    </div>
  );
};

export default FlashcardView;