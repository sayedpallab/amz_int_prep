import React from 'react';
import { QuestionAnswerItem, QuestionType, STARL, ConfidenceLevel } from '../../types';
import { EditIcon, DeleteIcon, CheckCircleIcon, XCircleIcon, SparklesIcon, StarIcon, BookmarkIcon, BrainIcon, GaugeIcon, confidenceColors } from '../../constants';
import Button from '../ui/Button';

interface QuestionAnswerCardProps {
  item: QuestionAnswerItem;
  onToggleMastered: (id: string) => void;
  onEdit: (item: QuestionAnswerItem) => void;
  onDelete: (id: string) => void;
  onToggleFlagged: (id: string) => void;
  onAiRefine: (item: QuestionAnswerItem) => void;
}

const StarlItemDisplay: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <div className="mb-3 last:mb-0">
    <strong className="font-semibold text-theme-text-primary dark:text-theme-dark-text-primary text-sm capitalize">{title}:</strong>
    <p className="text-theme-text-secondary dark:text-theme-dark-text-secondary whitespace-pre-wrap text-sm leading-relaxed">{content || <span className="italic">Not provided.</span>}</p>
  </div>
);

const QuestionAnswerCard: React.FC<QuestionAnswerCardProps> = ({ item, onToggleMastered, onEdit, onDelete, onToggleFlagged, onAiRefine }) => {
  
  const getConfidenceChip = (level: ConfidenceLevel) => {
    if (!level) return null;
    const colors = confidenceColors[level];
    return (
        <span className={`ml-2 px-2.5 py-1 text-xs font-semibold rounded-full ${colors.bg} ${colors.text} ${colors.darkBg} ${colors.darkText} inline-flex items-center`}>
           <GaugeIcon className="w-3 h-3 mr-1"/> {level.charAt(0).toUpperCase() + level.slice(1)}
        </span>
    );
  };

  const lpTagStyle = "bg-theme-accent-secondary dark:bg-theme-dark-accent-secondary text-white dark:text-theme-dark-text-primary"; // Example, adjust as needed
  const freestyleTagStyle = "bg-theme-accent-ai dark:bg-theme-dark-accent-ai text-white dark:text-theme-dark-text-primary";


  return (
    <div className={`bg-theme-bg-card dark:bg-theme-dark-bg-card shadow-md dark:shadow-dark-md rounded-lg p-5 sm:p-6 border border-theme-border-color dark:border-theme-dark-border-color transition-all duration-300 hover:shadow-lg dark:hover:shadow-dark-lg`}>
      <div className="flex flex-col sm:flex-row justify-between items-start mb-3">
        <div className="mb-2 sm:mb-0">
            <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${item.type === QuestionType.LEADERSHIP_PRINCIPLE ? lpTagStyle : freestyleTagStyle} inline-flex items-center shadow-sm`}>
              {item.type === QuestionType.LEADERSHIP_PRINCIPLE ? <StarIcon className="w-3.5 h-3.5 mr-1.5" /> : <SparklesIcon className="w-3.5 h-3.5 mr-1.5" />}
              {item.principleOrCategory}
            </span>
            {getConfidenceChip(item.confidenceLevel)}
            {item.flaggedForInterview && (
                <span className="ml-2 px-2.5 py-1 text-xs font-semibold rounded-full bg-theme-accent-primary dark:bg-theme-dark-accent-primary text-white inline-flex items-center" title="Flagged for Interview">
                    <BookmarkIcon filled className="w-3 h-3 mr-1"/> Flagged
                </span>
            )}
        </div>
        
        <div className="flex space-x-1 flex-shrink-0 self-start sm:self-center">
          <Button size="sm" variant="ai" onClick={() => onAiRefine(item)} title="Refine with AI"> <BrainIcon className="w-4 h-4" /> </Button>
          <Button size="sm" variant="ghost" onClick={() => onToggleFlagged(item.id)} title={item.flaggedForInterview ? "Unflag" : "Flag for Interview"} className={`${item.flaggedForInterview ? 'text-theme-accent-primary dark:text-theme-dark-accent-primary' : 'text-theme-text-secondary dark:text-theme-dark-text-secondary'}`}>
            <BookmarkIcon filled={item.flaggedForInterview} className="w-4 h-4" />
          </Button>
           <Button size="sm" variant="ghost" onClick={() => onToggleMastered(item.id)} title={item.mastered ? "Mark Not Mastered" : "Mark Mastered"} className={`${item.mastered ? 'text-theme-accent-secondary dark:text-theme-dark-accent-secondary' : 'text-theme-text-secondary dark:text-theme-dark-text-secondary'}`}>
            {item.mastered ? <CheckCircleIcon className="w-4 h-4" /> : <XCircleIcon className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <h3 className="font-serif text-lg sm:text-xl font-bold text-theme-text-primary dark:text-theme-dark-text-primary mb-3">{item.question}</h3>
      
      {item.tags && item.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {item.tags.map(tag => (
            <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
      )}


      {item.type === QuestionType.LEADERSHIP_PRINCIPLE && item.answerSTARL && (
        <div className="mt-4 border-l-3 pl-4 space-y-2 border-theme-accent-primary dark:border-theme-dark-accent-primary">
          {(Object.keys(item.answerSTARL) as Array<keyof STARL>).map(key => (
             item.answerSTARL && (item.answerSTARL[key] || key === 'learning') &&
            <StarlItemDisplay key={key} title={key} content={item.answerSTARL[key]} />
          ))}
        </div>
      )}

      {item.type === QuestionType.FREESTYLE && (
        <div className={`mt-4 p-4 border-l-4 rounded-r-md bg-theme-bg-main dark:bg-theme-dark-bg-main border-theme-accent-primary dark:border-theme-dark-accent-primary`}>
            <p className="text-theme-text-secondary dark:text-theme-dark-text-secondary whitespace-pre-wrap text-sm leading-relaxed">
                {item.answerFreestyle || <span className="italic">No answer provided.</span>}
            </p>
        </div>
      )}
      
      <div className="mt-5 text-right flex justify-between items-center">
        <p className="text-xs text-theme-text-secondary dark:text-theme-dark-text-secondary">
            Updated: {new Date(item.updatedAt).toLocaleDateString()}
        </p>
        <div>
          <Button size="sm" variant="secondary" onClick={() => onEdit(item)} className="mr-2"> <EditIcon className="w-4 h-4 mr-1 sm:mr-2"/> Edit</Button>
          <Button size="sm" variant="danger" onClick={() => onDelete(item.id)}> <DeleteIcon className="w-4 h-4 mr-1 sm:mr-2"/> Delete</Button>
        </div>
      </div>
    </div>
  );
};

export default QuestionAnswerCard;