
import React from 'react';
import { QuestionAnswerItem } from '../../types';
import QuestionAnswerCard from './QuestionAnswerCard';

interface QuestionListProps {
  items: QuestionAnswerItem[];
  onToggleMastered: (id: string) => void;
  onEdit: (item: QuestionAnswerItem) => void;
  onDelete: (id: string) => void;
  onToggleFlagged: (id: string) => void; // New prop
  onAiRefine: (item: QuestionAnswerItem) => void; // New prop
  searchTerm: string;
}

const QuestionList: React.FC<QuestionListProps> = ({ items, onToggleMastered, onEdit, onDelete, onToggleFlagged, onAiRefine, searchTerm }) => {
  const filteredItems = items.filter(item => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const inQuestion = item.question.toLowerCase().includes(lowerSearchTerm);
    const inPrinciple = item.principleOrCategory.toLowerCase().includes(lowerSearchTerm);
    let inAnswer = false;
    if (item.answerSTARL) {
      inAnswer = Object.values(item.answerSTARL).some(val => val?.toLowerCase().includes(lowerSearchTerm));
    } else if (item.answerFreestyle) {
      inAnswer = item.answerFreestyle.toLowerCase().includes(lowerSearchTerm);
    }
    return inQuestion || inAnswer || inPrinciple;
  });

  if (items.length === 0) {
    return <p className="text-center text-slate-500 dark:text-slate-400 py-10 text-lg">No questions added yet. Click "Add Question" to get started!</p>;
  }
  
  if (filteredItems.length === 0 && searchTerm) {
     return <p className="text-center text-slate-500 dark:text-slate-400 py-10 text-lg">No questions match your search for "{searchTerm}".</p>;
  }


  return (
    <div className="space-y-5">
      {filteredItems.map(item => (
        <QuestionAnswerCard
          key={item.id}
          item={item}
          onToggleMastered={onToggleMastered}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleFlagged={onToggleFlagged}
          onAiRefine={onAiRefine}
        />
      ))}
    </div>
  );
};

export default QuestionList;