
import React, { useState, useEffect, useCallback } from 'react';
import { Theme, QuestionAnswerItem, View, AiSuggestion, STARL, QuestionType, PanelSimulationRecord } from './types';
import { INITIAL_QUESTIONS }
from './constants';
import useLocalStorage from './hooks/useLocalStorage';
import useDisclosure from './hooks/useDisclosure';
import Layout from './components/layout/Layout';
import QuestionList from './components/qanda/QuestionList';
import AddQuestionForm from './components/qanda/AddQuestionForm';
import Modal from './components/ui/Modal';
import SearchBar from './components/ui/SearchBar';
import FlashcardView from './components/flashcards/FlashcardView';
import ProgressDisplay from './components/tracking/ProgressDisplay';
import InterviewModeView from './components/interviewmode/InterviewModeView';
import AiRefinementModal from './components/ai/AiRefinementModal';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import Button from './components/ui/Button';
import { v4 as uuidv4 } from 'uuid';


const App: React.FC = () => {
  const [theme, setTheme] = useLocalStorage<Theme>('app-theme', 'light');
  const [questions, setQuestions] = useLocalStorage<QuestionAnswerItem[]>('interview-questions', INITIAL_QUESTIONS);
  const [activeView, setActiveView] = useLocalStorage<View>('active-view', View.PROGRESS);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<QuestionAnswerItem | null>(null);
  const [questionTypeFilter, setQuestionTypeFilter] = useLocalStorage<'all' | QuestionType>('question-type-filter', 'all');
  const [panelSimulationHistory, setPanelSimulationHistory] = useLocalStorage<PanelSimulationRecord[]>('panel-simulation-history', []);
  const [startPanelSessionFlow, setStartPanelSessionFlow] = useState(false);


  const { isOpen: isAddModalOpen, onOpen: onOpenAddModal, onClose: onCloseAddModal } = useDisclosure();
  const { isOpen: isAiModalOpen, onOpen: onOpenAiModal, onClose: onCloseAiModal } = useDisclosure();
  
  const [aiSuggestion, setAiSuggestion] = useState<AiSuggestion | null>(null);
  const [isAiRefining, setIsAiRefining] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const [ai, setAi] = useState<GoogleGenAI | null>(null);
  useEffect(() => {
    if (process.env.API_KEY) {
      setAi(new GoogleGenAI({ apiKey: process.env.API_KEY }));
    } else {
      console.warn("API_KEY environment variable not set. AI features will be disabled.");
    }
  }, []);


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleSaveQuestion = (item: QuestionAnswerItem) => {
    setQuestions(prev => {
      const existingIndex = prev.findIndex(q => q.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = item;
        return updated;
      }
      return [item, ...prev.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())];
    });
    setEditingItem(null); 
  };

  const handleDeleteQuestion = useCallback((id: string) => {
    if (window.confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
      setQuestions(prev => prev.filter(q => q.id !== id));
    }
  }, [setQuestions]);

  const handleToggleMastered = useCallback((id: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, mastered: !q.mastered, updatedAt: new Date().toISOString() } : q));
  }, [setQuestions]);

  const handleToggleFlagged = useCallback((id: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, flaggedForInterview: !q.flaggedForInterview, updatedAt: new Date().toISOString() } : q));
  }, [setQuestions]);

  const handleEditQuestion = (item: QuestionAnswerItem) => {
    setEditingItem(item);
    onOpenAddModal();
  };
  
  const openNewQuestionModal = () => {
    setEditingItem(null); 
    onOpenAddModal();
  };

  const handleAiRefine = useCallback(async (item: QuestionAnswerItem) => {
    if (!ai) {
        setAiError("Gemini API client is not initialized. Please ensure API_KEY is configured.");
        onOpenAiModal();
        return;
    }
    if (!process.env.API_KEY) {
      setAiError("API Key not configured. AI Refinement is unavailable.");
      setAiSuggestion(null);
      setIsAiRefining(false);
      onOpenAiModal();
      return;
    }

    setIsAiRefining(true);
    setAiError(null);
    setAiSuggestion(null);
    onOpenAiModal();

    let promptContent = "";
    if (item.type === QuestionType.LEADERSHIP_PRINCIPLE && item.answerSTARL) {
        const starl = item.answerSTARL;
        promptContent = `Question: "${item.question}" (Principle: ${item.principleOrCategory})\n\nCurrent STARL Answer:\nSituation: ${starl.situation}\nTask: ${starl.task}\nAction: ${starl.action}\nResult: ${starl.result}\nLearning: ${starl.learning}\n\n---\nRefine this STARL answer for an Amazon Area Manager interview. Focus on clarity, impact, conciseness, and strong adherence to each component of the STARL method. Ensure the language is professional and results-oriented. Provide the refined answer in the same STARL format. If a section is weak, suggest improvements.`;
    } else if (item.type === QuestionType.FREESTYLE && item.answerFreestyle) {
        promptContent = `Question: "${item.question}" (Category: ${item.principleOrCategory})\n\nCurrent Answer: "${item.answerFreestyle}"\n\n---\nRefine this freestyle answer for an Amazon Area Manager interview. Focus on clarity, impact, conciseness, and professionalism. Ensure the answer directly addresses the question and showcases relevant qualities.`;
    } else {
        setAiError("Cannot refine: Answer is not provided or type is incompatible.");
        setIsAiRefining(false);
        return;
    }

    const fullPrompt = `You are an expert Amazon interview coach. ${promptContent}`;

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: fullPrompt,
      });
      
      setAiSuggestion({
        originalQuestion: item.question,
        originalAnswer: item.answerSTARL || item.answerFreestyle,
        suggestedText: response.text,
      });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      setAiError(`Failed to get suggestion: ${error.message || 'Unknown error'}`);
    } finally {
      setIsAiRefining(false);
    }
  }, [ai, onOpenAiModal]);

  const handleApplyAiSuggestion = (questionId: string, refinedAnswer: STARL | string) => {
    const originalQuestionItem = questions.find(q => q.id === questionId);
    if (!originalQuestionItem) return;

    const updatedQuestion = { ...originalQuestionItem };
    if (typeof refinedAnswer === 'string' && originalQuestionItem.type === QuestionType.FREESTYLE) {
        updatedQuestion.answerFreestyle = refinedAnswer;
    } else if (typeof refinedAnswer === 'object' && originalQuestionItem.type === QuestionType.LEADERSHIP_PRINCIPLE) {
        updatedQuestion.answerSTARL = refinedAnswer as STARL; 
    } else if (typeof refinedAnswer === 'string' && originalQuestionItem.type === QuestionType.LEADERSHIP_PRINCIPLE) {
        updatedQuestion.answerSTARL = {
            ...(updatedQuestion.answerSTARL || { situation: '', task: '', action: '', result: '', learning: '' }),
            learning: (updatedQuestion.answerSTARL?.learning || "") + "\n\nAI Suggestion (raw):\n" + refinedAnswer
        };
    }
    updatedQuestion.updatedAt = new Date().toISOString();
    handleSaveQuestion(updatedQuestion);
    onCloseAiModal();
};

  const handleSavePanelSession = useCallback((sessionData: Omit<PanelSimulationRecord, 'id'>) => {
    const newRecord: PanelSimulationRecord = {
      id: uuidv4(),
      ...sessionData,
    };
    setPanelSimulationHistory(prev => [newRecord, ...prev].sort((a,b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()));
  }, [setPanelSimulationHistory]);

  const handleClearPanelHistory = useCallback(() => {
    if (window.confirm("Are you sure you want to clear all panel simulation history? This action cannot be undone.")) {
      setPanelSimulationHistory([]);
    }
  }, [setPanelSimulationHistory]);

  const handleInitiatePanelSession = useCallback(() => {
    setStartPanelSessionFlow(true);
    setActiveView(View.INTERVIEW_MODE);
  }, [setActiveView]);

  const handlePanelSessionFlowConsumed = useCallback(() => {
    setStartPanelSessionFlow(false);
  }, []);


  const renderView = () => {
    const itemsToDisplayByType = questions.filter(item => {
        if (questionTypeFilter === 'all') return true;
        return item.type === questionTypeFilter;
    });

    switch (activeView) {
      case View.ALL_QUESTIONS:
        return (
          <>
            <div className="mb-5 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="flex-grow w-full sm:w-auto">
                <SearchBar searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
              </div>
              <div className="flex space-x-2 flex-shrink-0 w-full sm:w-auto justify-center">
                {(['all', QuestionType.LEADERSHIP_PRINCIPLE, QuestionType.FREESTYLE] as const).map(type => (
                  <Button
                    key={type}
                    variant={questionTypeFilter === type ? 'primary' : 'secondary'}
                    onClick={() => setQuestionTypeFilter(type)}
                    size="sm"
                    className="flex-grow sm:flex-grow-0"
                  >
                    {type === 'all' ? 'All Types' : (type === QuestionType.LEADERSHIP_PRINCIPLE ? 'LPs' : 'Freestyle')}
                  </Button>
                ))}
              </div>
            </div>
            <QuestionList 
              items={itemsToDisplayByType} 
              onToggleMastered={handleToggleMastered}
              onEdit={handleEditQuestion}
              onDelete={handleDeleteQuestion}
              onToggleFlagged={handleToggleFlagged}
              onAiRefine={handleAiRefine}
              searchTerm={searchTerm} 
            />
          </>
        );
      case View.FLASHCARDS:
        return <FlashcardView items={itemsToDisplayByType} />;
      case View.PROGRESS:
        return <ProgressDisplay 
                    items={questions} 
                    panelSimulationHistory={panelSimulationHistory}
                    onClearPanelHistory={handleClearPanelHistory}
                    onInitiatePanelSession={handleInitiatePanelSession}
                />; 
      case View.INTERVIEW_MODE:
        return <InterviewModeView 
                    items={questions} 
                    onAiRefine={handleAiRefine} 
                    onToggleFlagged={handleToggleFlagged}
                    onSavePanelSession={handleSavePanelSession}
                    startPanelSessionFlow={startPanelSessionFlow}
                    onPanelSessionFlowConsumed={handlePanelSessionFlowConsumed}
                />;
      default:
        return null;
    }
  };

  return (
    <Layout 
        theme={theme} 
        onToggleTheme={toggleTheme}
        activeView={activeView}
        onViewChange={(view) => setActiveView(view)}
        onOpenAddModal={openNewQuestionModal}
        showAddButton={activeView === View.ALL_QUESTIONS || activeView === View.PROGRESS}
    >
      {renderView()}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => { onCloseAddModal(); setEditingItem(null); }} 
        title={editingItem ? "Edit Question" : "Add New Question"}
        size="2xl"
      >
        <AddQuestionForm 
            onSave={handleSaveQuestion} 
            onClose={() => { onCloseAddModal(); setEditingItem(null); }} 
            existingItem={editingItem}
        />
      </Modal>
      <AiRefinementModal
        isOpen={isAiModalOpen}
        onClose={onCloseAiModal}
        isLoading={isAiRefining}
        suggestion={aiSuggestion}
        error={aiError}
        onApply={(refinedContent) => { 
            if (aiSuggestion?.originalQuestion) {
                const questionToUpdate = questions.find(q => q.question === aiSuggestion.originalQuestion);
                if (questionToUpdate) {
                    handleApplyAiSuggestion(questionToUpdate.id, refinedContent);
                }
            }
        }}
        questionBeingRefined={aiSuggestion ? questions.find(q => q.question === aiSuggestion.originalQuestion) : null}
      />
    </Layout>
  );
};

export default App;
