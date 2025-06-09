import React, { useState, useEffect } from 'react';
import { QuestionAnswerItem, QuestionType, STARL, ConfidenceLevel } from '../../types';
import { AMAZON_LEADERSHIP_PRINCIPLES } from '../../constants';
import Button from '../ui/Button';
import { v4 as uuidv4 } from 'uuid';

interface AddQuestionFormProps {
  onSave: (item: QuestionAnswerItem) => void;
  onClose: () => void;
  existingItem?: QuestionAnswerItem | null;
}

const initialStarl: STARL = { situation: '', task: '', action: '', result: '', learning: '' };
const confidenceLevels: ConfidenceLevel[] = ['low', 'medium', 'high'];

const AddQuestionForm: React.FC<AddQuestionFormProps> = ({ onSave, onClose, existingItem }) => {
  const [question, setQuestion] = useState('');
  const [type, setType] = useState<QuestionType>(QuestionType.LEADERSHIP_PRINCIPLE);
  const [principleOrCategory, setPrincipleOrCategory] = useState(AMAZON_LEADERSHIP_PRINCIPLES[0]);
  const [starl, setStarl] = useState<STARL>(initialStarl);
  const [freestyleAnswer, setFreestyleAnswer] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [flaggedForInterview, setFlaggedForInterview] = useState(false);
  const [confidence, setConfidence] = useState<ConfidenceLevel>(null);


  useEffect(() => {
    if (existingItem) {
      setQuestion(existingItem.question);
      setType(existingItem.type);
      setPrincipleOrCategory(existingItem.principleOrCategory);
      if (existingItem.type === QuestionType.LEADERSHIP_PRINCIPLE && existingItem.answerSTARL) {
        setStarl(existingItem.answerSTARL);
        setFreestyleAnswer('');
      } else if (existingItem.type === QuestionType.FREESTYLE && existingItem.answerFreestyle) {
        setFreestyleAnswer(existingItem.answerFreestyle);
        setStarl(initialStarl);
      }
      setTags(existingItem.tags || []);
      setFlaggedForInterview(existingItem.flaggedForInterview || false);
      setConfidence(existingItem.confidenceLevel || null);
    } else {
      // Reset form for new entry
      setQuestion('');
      setType(QuestionType.LEADERSHIP_PRINCIPLE);
      setPrincipleOrCategory(AMAZON_LEADERSHIP_PRINCIPLES[0]);
      setStarl(initialStarl);
      setFreestyleAnswer('');
      setTags([]);
      setCurrentTag('');
      setFlaggedForInterview(false);
      setConfidence(null);
    }
  }, [existingItem]);

  const handleStarlChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setStarl(prev => ({ ...prev, [name]: value }));
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTag(e.target.value);
  };

  const handleAddTag = () => {
    if (currentTag.trim() !== '' && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };
  
  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) {
      alert("Question cannot be empty.");
      return;
    }

    const newItem: QuestionAnswerItem = {
      id: existingItem?.id || uuidv4(),
      question,
      type,
      principleOrCategory,
      answerSTARL: type === QuestionType.LEADERSHIP_PRINCIPLE ? starl : undefined,
      answerFreestyle: type === QuestionType.FREESTYLE ? freestyleAnswer : undefined,
      mastered: existingItem?.mastered || false,
      flaggedForInterview,
      confidenceLevel: confidence,
      tags: tags,
      createdAt: existingItem?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSave(newItem);
    onClose();
  };
  
  const commonInputClass = "w-full p-3 border border-theme-border-color dark:border-theme-dark-border-color rounded-md bg-theme-bg-main dark:bg-theme-dark-bg-main text-theme-text-primary dark:text-theme-dark-text-primary focus:outline-none focus:ring-2 focus:ring-theme-accent-primary dark:focus:ring-theme-dark-accent-primary focus:border-theme-accent-primary dark:focus:border-theme-dark-accent-primary shadow-sm text-sm";
  const commonLabelClass = "block text-sm font-semibold text-theme-text-primary dark:text-theme-dark-text-primary mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="question" className={commonLabelClass}>Question</label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          className={commonInputClass}
          placeholder="e.g., Tell me about a time..."
          required
        />
      </div>
      
      <div>
        <label htmlFor="tags" className={commonLabelClass}>Keywords / Tags</label>
        <div className="flex items-center">
            <input
            type="text"
            id="tags"
            value={currentTag}
            onChange={handleTagInputChange}
            onKeyDown={handleTagKeyPress}
            className={`${commonInputClass} flex-grow mr-2`}
            placeholder="e.g., Q4 Peak, Stow Rate (press Enter or , to add)"
            />
            <Button type="button" variant="secondary" size="md" onClick={handleAddTag} className="px-4 py-3 text-sm">Add</Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
            {tags.map(tag => (
            <span key={tag} className="bg-theme-accent-ai-light dark:bg-theme-dark-accent-ai-light text-theme-accent-ai dark:text-theme-dark-accent-ai text-xs font-semibold px-2.5 py-1 rounded-full flex items-center">
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-1.5 text-theme-accent-ai dark:text-theme-dark-accent-ai hover:text-red-500 text-xs">✕</button>
            </span>
            ))}
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className={commonLabelClass}>Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => {
              setType(e.target.value as QuestionType);
              // Reset principle/category if type changes to avoid mismatch
              if (e.target.value === QuestionType.LEADERSHIP_PRINCIPLE) {
                setPrincipleOrCategory(AMAZON_LEADERSHIP_PRINCIPLES[0]);
              } else {
                setPrincipleOrCategory('General Fit'); // Default for freestyle
              }
            }}
            className={commonInputClass}
          >
            <option value={QuestionType.LEADERSHIP_PRINCIPLE}>Leadership Principle</option>
            <option value={QuestionType.FREESTYLE}>Freestyle & Fit</option>
          </select>
        </div>
        <div>
           <label htmlFor="principleOrCategory" className={commonLabelClass}>
            {type === QuestionType.LEADERSHIP_PRINCIPLE ? "Leadership Principle" : "Category"}
          </label>
          {type === QuestionType.LEADERSHIP_PRINCIPLE ? (
            <select
              id="principleOrCategory"
              value={principleOrCategory}
              onChange={(e) => setPrincipleOrCategory(e.target.value)}
              className={commonInputClass}
            >
              {AMAZON_LEADERSHIP_PRINCIPLES.map(lp => <option key={lp} value={lp}>{lp}</option>)}
            </select>
          ) : (
             <input
              id="principleOrCategory"
              type="text"
              value={principleOrCategory}
              onChange={(e) => setPrincipleOrCategory(e.target.value)}
              className={commonInputClass}
              placeholder="e.g., Motivation, Strengths"
            />
          )}
        </div>
      </div>

      {type === QuestionType.LEADERSHIP_PRINCIPLE && (
        <div className="space-y-3 p-4 border border-theme-border-color dark:border-theme-dark-border-color rounded-lg bg-theme-bg-main dark:bg-theme-dark-bg-main">
          <h3 className="text-md font-semibold text-theme-accent-primary dark:text-theme-dark-accent-primary mb-2">STAR(L) Answer</h3>
          {(Object.keys(initialStarl) as Array<keyof STARL>).map((key) => (
            <div key={key}>
              <label htmlFor={key} className={`${commonLabelClass} capitalize`}>{key}</label>
              <textarea
                id={key}
                name={key}
                value={starl[key]}
                onChange={handleStarlChange}
                rows={key === 'action' || key === 'result' ? 3 : 2}
                className={commonInputClass}
                placeholder={`${key.charAt(0).toUpperCase() + key.slice(1)}...`}
              />
            </div>
          ))}
        </div>
      )}

      {type === QuestionType.FREESTYLE && (
        <div>
          <label htmlFor="freestyleAnswer" className={commonLabelClass}>Answer Framework / Key Points</label>
          <textarea
            id="freestyleAnswer"
            value={freestyleAnswer}
            onChange={(e) => setFreestyleAnswer(e.target.value)}
            rows={5}
            className={commonInputClass}
            placeholder="Your concise answer or bullet points..."
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 items-end">
         <div>
            <label htmlFor="confidence" className={commonLabelClass}>Confidence Level</label>
            <select
                id="confidence"
                value={confidence || ''}
                onChange={(e) => setConfidence(e.target.value as ConfidenceLevel || null)}
                className={commonInputClass}
            >
                <option value="">Not Set</option>
                {confidenceLevels.map(level => (
                    <option key={level} value={level} className="capitalize">{level?.charAt(0).toUpperCase() + level!.slice(1)}</option>
                ))}
            </select>
        </div>
        <div className="flex items-center space-x-2 pt-3 md:pt-0">
            <input
            type="checkbox"
            id="flaggedForInterview"
            checked={flaggedForInterview}
            onChange={(e) => setFlaggedForInterview(e.target.checked)}
            className="h-4 w-4 rounded text-theme-accent-primary focus:ring-theme-accent-primary border-theme-border-color dark:border-theme-dark-border-color bg-theme-bg-main dark:bg-theme-dark-bg-card"
            />
            <label htmlFor="flaggedForInterview" className={`${commonLabelClass} mb-0 cursor-pointer`}>Flag for Interview Mode</label>
        </div>
      </div>


      <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
        {existingItem && (
            <Button type="button" variant="danger" onClick={() => {
                if (window.confirm("Are you sure you want to delete this story?")) {
                    // Call a prop for deletion if this form handles deletion directly
                    // For now, this button might be illustrative or need wiring up
                    console.log("Delete action triggered for item:", existingItem.id);
                     onClose(); // Placeholder: actual deletion handled by QuestionList/App
                }
            }} className="w-full sm:w-auto">
                Delete Story
            </Button>
        )}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto sm:ml-auto">
            <Button type="button" variant="secondary" onClick={onClose} className="w-full sm:w-auto">Cancel</Button>
            <Button type="submit" variant="primary" className="w-full sm:w-auto">{existingItem ? 'Save Changes' : 'Save Story'}</Button>
        </div>
      </div>
    </form>
  );
};

export default AddQuestionForm;