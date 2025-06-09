
import React, { useState, useEffect, useCallback } from 'react';
import { QuestionAnswerItem, STARL, QuestionType, PanelSimulationRecord } from '../../types';
import Button from '../ui/Button';
import { ChevronLeftIcon, ChevronRightIcon, BrainIcon, BookmarkIcon, SparklesIcon, StarIcon, ClipboardCheckIcon } from '../../constants';

interface InterviewModeViewProps {
  items: QuestionAnswerItem[];
  onAiRefine: (item: QuestionAnswerItem) => void;
  onToggleFlagged: (id: string) => void;
  onSavePanelSession: (sessionData: Omit<PanelSimulationRecord, 'id'>) => void;
  startPanelSessionFlow: boolean; // Added
  onPanelSessionFlowConsumed: () => void; // Added
  // panelSimulationHistory and onClearPanelHistory removed
}

const PANEL_DURATION_MINUTES = 30;

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};


const InterviewModeView: React.FC<InterviewModeViewProps> = ({ 
    items, 
    onAiRefine, 
    onToggleFlagged,
    onSavePanelSession,
    startPanelSessionFlow,      // Consuming prop
    onPanelSessionFlowConsumed, // Consuming prop
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [notes, setNotes] = useState<{ [key: string]: string }>({});
  const [isPanelSessionActive, setIsPanelSessionActive] = useState(false);
  const [panelSessionQuestions, setPanelSessionQuestions] = useState<QuestionAnswerItem[]>([]);
  const [currentPanelQuestionIndex, setCurrentPanelQuestionIndex] = useState(0);
  const [panelTimer, setPanelTimer] = useState(PANEL_DURATION_MINUTES * 60);
  const [panelSessionEndTime, setPanelSessionEndTime] = useState<number | null>(null);

  const flaggedItems = items.filter(item => item.flaggedForInterview);
  
  useEffect(() => {
    if (!isPanelSessionActive && flaggedItems.length > 0 && currentIndex >= flaggedItems.length) {
      setCurrentIndex(0);
    }
     if (!isPanelSessionActive && flaggedItems.length === 0) {
      setCurrentIndex(0); 
    }
  }, [flaggedItems, currentIndex, isPanelSessionActive]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (isPanelSessionActive && panelSessionEndTime) {
      intervalId = setInterval(() => {
        const remainingTime = Math.max(0, Math.floor((panelSessionEndTime - Date.now()) / 1000));
        setPanelTimer(remainingTime);
        if (remainingTime === 0) {
          handleEndPanelSession(true); 
        }
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPanelSessionActive, panelSessionEndTime]);

  const internalHandleStartPanelSession = useCallback(() => {
    const freestyleQuestions = items.filter(item => item.type === QuestionType.FREESTYLE);
    const lpQuestions = items.filter(item => item.type === QuestionType.LEADERSHIP_PRINCIPLE);

    if (freestyleQuestions.length < 2) {
      alert("Not enough Freestyle questions. Please add at least 2 Freestyle questions to start a panel simulation.");
      return false;
    }
    if (lpQuestions.length < 3) {
      alert("Not enough Leadership Principle questions. Please add at least 3 LP questions to start a panel simulation.");
      return false;
    }

    const uniqueLPs = [...new Set(lpQuestions.map(q => q.principleOrCategory))];
    if (uniqueLPs.length < 2) {
      alert("Not enough variety in Leadership Principles. Please ensure your LP questions cover at least 2 different LPs.");
      return false;
    }

    const selectedFreestyle = shuffleArray(freestyleQuestions).slice(0, 2);
    const shuffledLPs = shuffleArray(uniqueLPs);
    const lp1Name = shuffledLPs[0];
    const lp2Name = shuffledLPs[1];
    const questionsFromLp1 = shuffleArray(lpQuestions.filter(q => q.principleOrCategory === lp1Name));
    const questionsFromLp2 = shuffleArray(lpQuestions.filter(q => q.principleOrCategory === lp2Name));
    
    let selectedLPs: QuestionAnswerItem[] = [];
    if (questionsFromLp1.length >= 2 && questionsFromLp2.length >= 1) {
        selectedLPs = [...questionsFromLp1.slice(0,2), questionsFromLp2[0]];
    } else if (questionsFromLp1.length >= 1 && questionsFromLp2.length >= 2) {
        selectedLPs = [questionsFromLp1[0], ...questionsFromLp2.slice(0,2)];
    } else { 
        selectedLPs = shuffleArray([...questionsFromLp1, ...questionsFromLp2]).slice(0,3);
        if (selectedLPs.length < 3) {
             alert("Could not gather 3 LP questions from 2 distinct LPs with current data. Please add more questions or diversify LPs.");
             return false;
        }
    }
    
    const sessionQs = shuffleArray([...selectedFreestyle, ...selectedLPs]);
    
    setPanelSessionQuestions(sessionQs);
    setCurrentPanelQuestionIndex(0);
    setPanelTimer(PANEL_DURATION_MINUTES * 60);
    setPanelSessionEndTime(Date.now() + PANEL_DURATION_MINUTES * 60 * 1000);
    setIsPanelSessionActive(true);
    setNotes({}); 
    return true;
  }, [items]);

  useEffect(() => {
    if (startPanelSessionFlow) {
      const success = internalHandleStartPanelSession();
      if (!success) { // If starting failed (e.g. not enough questions), still consume the flow
         onPanelSessionFlowConsumed();
      } else {
         // Success, ensure flow is consumed. It might be consumed immediately if alerts happen.
         // If internalHandleStartPanelSession becomes async or has setStates before return,
         // this might need adjustment. For now, it's synchronous after alerts.
         onPanelSessionFlowConsumed();
      }
    }
  }, [startPanelSessionFlow, internalHandleStartPanelSession, onPanelSessionFlowConsumed]);


  const handleEndPanelSession = useCallback((autoEnded = false) => {
    if (panelSessionQuestions.length > 0) { 
        const sessionData: Omit<PanelSimulationRecord, 'id'> = {
            completedAt: new Date().toISOString(),
            questions: panelSessionQuestions.map(q => ({ 
                id: q.id, 
                question: q.question, 
                type: q.type, 
                principleOrCategory: q.principleOrCategory 
            })),
            durationMinutes: PANEL_DURATION_MINUTES,
        };
        onSavePanelSession(sessionData);
    }

    setIsPanelSessionActive(false);
    setPanelSessionQuestions([]); 
    setCurrentPanelQuestionIndex(0);
    if (autoEnded) {
        alert("Panel simulation time is up!");
    }
  }, [panelSessionQuestions, onSavePanelSession]);

  const handlePanelNav = (direction: 'next' | 'prev') => {
    setCurrentPanelQuestionIndex(prev => {
      if (direction === 'next') return (prev + 1) % panelSessionQuestions.length;
      return (prev - 1 + panelSessionQuestions.length) % panelSessionQuestions.length;
    });
  };

  const handleDefaultNav = (direction: 'next' | 'prev') => {
    if (flaggedItems.length === 0) return;
    setCurrentIndex((prev) => {
      if (direction === 'next') return (prev + 1) % flaggedItems.length;
      return (prev - 1 + flaggedItems.length) % flaggedItems.length;
    });
  };

  const handleNotesChange = (itemId: string, value: string) => {
    setNotes(prevNotes => ({
      ...prevNotes,
      [itemId]: value,
    }));
  };
  
  const currentDisplayItem = isPanelSessionActive ? panelSessionQuestions[currentPanelQuestionIndex] : (flaggedItems.length > 0 ? flaggedItems[currentIndex] : null);
  const displayItemsCount = isPanelSessionActive ? panelSessionQuestions.length : flaggedItems.length;
  const currentDisplayIndex = isPanelSessionActive ? currentPanelQuestionIndex : currentIndex;

  const lpTagStyle = "bg-theme-accent-secondary dark:bg-theme-dark-accent-secondary text-white"; 
  const freestyleTagStyle = "bg-theme-accent-ai dark:bg-theme-dark-accent-ai text-white";

  return (
    <div className="max-w-3xl mx-auto p-1 sm:p-2 space-y-5">
      {/* Panel Simulation Start Button and History KPIs removed */}

      {isPanelSessionActive && currentDisplayItem && (
        <>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center sticky top-[70px] bg-theme-bg-main dark:bg-theme-dark-bg-main py-2 z-10 rounded-md px-2 shadow-sm">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-theme-text-primary dark:text-theme-dark-text-primary mb-1 sm:mb-0">
            Panel Simulation Active
            </h2>
            <div className="text-lg font-semibold text-theme-accent-primary dark:text-theme-dark-accent-primary">
                Time: {formatTime(panelTimer)}
            </div>
        </div>
        <p className="text-sm text-theme-text-secondary dark:text-theme-dark-text-secondary text-center -mt-3">
            Question {currentDisplayIndex + 1} of {displayItemsCount}
        </p>
        </>
      )}

      {!isPanelSessionActive && flaggedItems.length === 0 && (
         <div className="text-center py-10 px-4 bg-theme-bg-card dark:bg-theme-dark-bg-card rounded-lg shadow-md">
            <svg className="mx-auto h-12 w-12 text-theme-border-color dark:text-theme-dark-border-color mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" strokeWidth={1}>
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className="font-serif mt-2 text-lg font-semibold text-theme-text-primary dark:text-theme-dark-text-primary">Interview Focus: Flagged Questions</h3>
            <p className="mt-1 text-sm text-theme-text-secondary dark:text-theme-dark-text-secondary">
            You haven't flagged any questions for focused practice yet. Go to "All Questions" and use the <BookmarkIcon className="w-4 h-4 inline align-text-bottom"/> icon to flag important ones.
            Alternatively, start a <strong className="text-theme-accent-primary dark:text-theme-dark-accent-primary">Guided Panel Simulation</strong> from the "Progress" tab.
            </p>
        </div>
      )}
      
      {!isPanelSessionActive && flaggedItems.length > 0 && !currentDisplayItem && (
         <p className="text-center text-lg text-theme-text-secondary dark:text-theme-dark-text-secondary py-5">Loading flagged questions...</p>
      )}


      {currentDisplayItem && (
        <div className="animate-fade-in">
          {!isPanelSessionActive && flaggedItems.length > 0 && (
            <div className="mb-4">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-theme-text-primary dark:text-theme-dark-text-primary text-center">
                    Flagged Question Practice
                </h2>
                 <p className="text-sm text-theme-text-secondary dark:text-theme-dark-text-secondary text-center">
                    Focus Question {currentDisplayIndex + 1} of {displayItemsCount}
                </p>
            </div>
          )}
          <div className="bg-theme-bg-card dark:bg-theme-dark-bg-card shadow-lg dark:shadow-dark-lg rounded-lg p-5 sm:p-6">
            <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${currentDisplayItem.type === QuestionType.LEADERSHIP_PRINCIPLE ? lpTagStyle : freestyleTagStyle} inline-flex items-center shadow-sm`}>
                    {currentDisplayItem.type === QuestionType.LEADERSHIP_PRINCIPLE ? <StarIcon className="w-3 h-3 mr-1.5" /> : <SparklesIcon className="w-3 h-3 mr-1.5" />}
                    {currentDisplayItem.principleOrCategory}
                </span>
                <div className="flex space-x-1.5">
                    <Button variant="ai" size="sm" onClick={() => onAiRefine(currentDisplayItem)} title="Refine with AI" className="p-1.5">
                        <BrainIcon className="w-4 h-4" />
                    </Button>
                    {!isPanelSessionActive && ( 
                       <Button variant="ghost" size="sm" onClick={() => onToggleFlagged(currentDisplayItem.id)} title={currentDisplayItem.flaggedForInterview ? "Unflag this question" : "Flag this question"} className={`${currentDisplayItem.flaggedForInterview ? 'text-theme-accent-primary dark:text-theme-dark-accent-primary' : 'text-theme-text-secondary dark:text-theme-dark-text-secondary'} p-1.5`}>
                           <BookmarkIcon filled={currentDisplayItem.flaggedForInterview} className="w-4 h-4" />
                       </Button>
                    )}
                </div>
            </div>

            <h3 className="font-serif text-xl font-bold text-theme-text-primary dark:text-theme-dark-text-primary mb-4 leading-tight">
            {currentDisplayItem.question}
            </h3>
            
            <div className="max-h-[45vh] sm:max-h-[40vh] overflow-y-auto pr-2 space-y-3 text-theme-text-secondary dark:text-theme-dark-text-secondary text-sm sm:text-base leading-relaxed pretty-scrollbar">
            {currentDisplayItem.type === QuestionType.LEADERSHIP_PRINCIPLE && currentDisplayItem.answerSTARL && (
                Object.entries(currentDisplayItem.answerSTARL).map(([key, value]) => (
                (value || key === 'learning') && 
                <div key={key} className="mb-2">
                    <strong className="font-semibold text-theme-text-primary dark:text-theme-dark-text-primary capitalize">{key}:</strong>
                    <p className="whitespace-pre-wrap mt-0.5">{value || <span className="italic">Not provided. Consider adding details.</span>}</p>
                </div>
                ))
            )}
            {currentDisplayItem.type === QuestionType.FREESTYLE && (
                <p className="whitespace-pre-wrap">
                {currentDisplayItem.answerFreestyle || <span className="italic">No answer provided.</span>}
                </p>
            )}
            </div>
          </div>

          <div className="flex justify-between items-center mt-5">
            <Button 
                onClick={() => isPanelSessionActive ? handlePanelNav('prev') : handleDefaultNav('prev')} 
                leftIcon={<ChevronLeftIcon />} 
                variant="secondary" 
                size="md" 
                disabled={displayItemsCount <= 1}
            >
            Previous
            </Button>
            {isPanelSessionActive && (
                <Button onClick={() => handleEndPanelSession(false)} variant="warning" size="md">
                    End Session Early
                </Button>
            )}
            <Button 
                onClick={() => isPanelSessionActive ? handlePanelNav('next') : handleDefaultNav('next')} 
                rightIcon={<ChevronRightIcon />} 
                variant="secondary" 
                size="md" 
                disabled={displayItemsCount <= 1}
            >
            Next
            </Button>
          </div>
          <div className="mt-6 p-4 bg-theme-bg-main dark:bg-theme-dark-bg-main rounded-md shadow-sm border border-theme-border-color dark:border-theme-dark-border-color">
            <h4 className="text-sm font-semibold text-theme-text-primary dark:text-theme-dark-text-primary mb-2">Quick Notes / Interviewer Questions:</h4>
            <textarea
            rows={3}
            value={notes[currentDisplayItem.id] || ''}
            onChange={(e) => handleNotesChange(currentDisplayItem.id, e.target.value)}
            className="w-full p-2.5 text-sm border border-theme-border-color dark:border-theme-dark-border-color rounded-md bg-theme-bg-card dark:bg-theme-dark-bg-card text-theme-text-primary dark:text-theme-dark-text-primary focus:ring-2 focus:ring-theme-accent-primary dark:focus:ring-theme-dark-accent-primary focus:border-theme-accent-primary dark:focus:border-theme-dark-accent-primary"
            placeholder="Jot down keywords, new questions asked, or feedback here..."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewModeView;
