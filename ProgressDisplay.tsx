

import React, { useState, useMemo } from 'react';
import { QuestionAnswerItem, QuestionType, ConfidenceLevel, PanelSimulationRecord } from '../../types';
import { AMAZON_LEADERSHIP_PRINCIPLES, confidenceColors as appConfidenceColors, GaugeIcon, ClipboardCheckIcon, StarIcon } from '../../constants';
import Button from '../ui/Button';

interface ProgressDisplayProps {
  items: QuestionAnswerItem[];
  panelSimulationHistory: PanelSimulationRecord[];
  onClearPanelHistory: () => void;
  onInitiatePanelSession: () => void;
}

const progressBarColors = {
    overall: "bg-gradient-to-r from-theme-accent-secondary to-theme-accent-primary dark:from-theme-dark-accent-secondary dark:to-theme-dark-accent-primary",
    lp: "bg-theme-accent-primary dark:bg-theme-dark-accent-primary",
    freestyle: "bg-theme-accent-ai dark:bg-theme-dark-accent-ai",
};

const ProgressBar: React.FC<{ progress: number; label?: string; barColorClass?: string; height?: string; showTextInside?: boolean }> = 
    ({ progress, label, barColorClass = progressBarColors.overall, height = "h-7", showTextInside = true }) => (
    <div className="w-full">
      {label && <div className="text-sm font-medium text-theme-text-primary dark:text-theme-dark-text-primary mb-1">{label}</div>}
      <div className={`bg-theme-border-color dark:bg-theme-dark-border-color rounded-md ${height} overflow-hidden shadow-sm`}>
        <div
          className={`${barColorClass} ${height} rounded-md flex items-center justify-center text-xs font-bold text-white transition-all duration-500 ease-out`}
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {showTextInside && progress > 5 ? `${progress.toFixed(0)}%` : ''}
          {!showTextInside && progress === 0 && <span className="opacity-50">&nbsp;</span>}
        </div>
      </div>
    </div>
);

const ProgressDisplay: React.FC<ProgressDisplayProps> = ({ items, panelSimulationHistory, onClearPanelHistory, onInitiatePanelSession }) => {
  const totalQuestions = items.length;
  const [showAllLPs, setShowAllLPs] = useState(false);

  const masteredQuestions = items.filter(item => item.mastered).length;
  const overallMasteryProgress = totalQuestions > 0 ? Math.round((masteredQuestions / totalQuestions) * 100) : 0;

  const lpStats = AMAZON_LEADERSHIP_PRINCIPLES.map(lp => {
    const lpItems = items.filter(item => item.type === QuestionType.LEADERSHIP_PRINCIPLE && item.principleOrCategory === lp);
    const masteredLpItems = lpItems.filter(item => item.mastered).length;
    const totalStories = lpItems.length;
    
    let sumConfidence = 0;
    let confidentItems = 0;
    lpItems.forEach(item => {
        if (item.confidenceLevel === 'high') sumConfidence += 2;
        else if (item.confidenceLevel === 'medium') sumConfidence += 1;
        if (item.confidenceLevel) confidentItems++;
    });
    const maxConfidenceForLpItems = confidentItems * 2; 
    const lpConfidenceProgress = maxConfidenceForLpItems > 0 ? Math.round((sumConfidence / maxConfidenceForLpItems) * 100) : 0;
    
    return {
      name: lp,
      totalStories,
      masteredStories: masteredLpItems,
      masteryProgress: totalStories > 0 ? Math.round((masteredLpItems / totalStories) * 100) : 0,
      confidenceProgress: lpConfidenceProgress,
    };
  });
  
  let totalConfidenceSum = 0;
  let itemsWithConfidence = 0;
  items.forEach(item => {
      if (item.confidenceLevel === 'high') totalConfidenceSum += 2;
      else if (item.confidenceLevel === 'medium') totalConfidenceSum += 1;
      if (item.confidenceLevel) itemsWithConfidence++;
  });
  const maxPossibleTotalConfidence = itemsWithConfidence * 2;
  const overallConfidenceProgress = maxPossibleTotalConfidence > 0 ? Math.round((totalConfidenceSum / maxPossibleTotalConfidence) * 100) : 0;

  const freestyleItems = items.filter(item => item.type === QuestionType.FREESTYLE);
  const masteredFreestyle = freestyleItems.filter(item => item.mastered).length;
  const freestyleMasteryProgress = freestyleItems.length > 0 ? Math.round((masteredFreestyle / freestyleItems.length) * 100) : 0;
  
  // Panel Simulation KPIs Calculation
  const panelKpis = useMemo(() => {
    if (panelSimulationHistory.length === 0) {
      return null;
    }
    let totalSimulatedQuestions = 0;
    let totalLpInSim = 0;
    let totalFreestyleInSim = 0;
    const lpFrequency: { [key: string]: number } = {};

    panelSimulationHistory.forEach(session => {
      totalSimulatedQuestions += session.questions.length;
      session.questions.forEach(q => {
        if (q.type === QuestionType.LEADERSHIP_PRINCIPLE) {
          totalLpInSim++;
          lpFrequency[q.principleOrCategory] = (lpFrequency[q.principleOrCategory] || 0) + 1;
        } else {
          totalFreestyleInSim++;
        }
      });
    });

    const averageQuestionsPerSession = totalSimulatedQuestions / panelSimulationHistory.length;
    const lpPercentage = totalSimulatedQuestions > 0 ? (totalLpInSim / totalSimulatedQuestions) * 100 : 0;
    const freestylePercentage = totalSimulatedQuestions > 0 ? (totalFreestyleInSim / totalSimulatedQuestions) * 100 : 0;

    const sortedLpFrequency = Object.entries(lpFrequency).sort(([,a],[,b]) => b-a);

    return {
      totalSessions: panelSimulationHistory.length,
      lastSessionDate: new Date(panelSimulationHistory[0].completedAt).toLocaleString(),
      averageQuestionsPerSession,
      totalLpInSim,
      lpPercentage,
      totalFreestyleInSim,
      freestylePercentage,
      sortedLpFrequency,
    };
  }, [panelSimulationHistory]);


  if (totalQuestions === 0 && panelSimulationHistory.length === 0) {
    return (
        <div className="text-center py-10 px-4">
            <svg className="mx-auto h-16 w-16 text-theme-border-color dark:text-theme-dark-border-color mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                 <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="font-serif text-xl font-semibold text-theme-text-primary dark:text-theme-dark-text-primary mb-2">No Progress Yet</h3>
            <p className="text-theme-text-secondary dark:text-theme-dark-text-secondary">Add some questions or complete a panel simulation to see your preparation tracker.</p>
        </div>
    );
  }
  
  const displayedLpStats = showAllLPs ? lpStats : lpStats.filter(lp => lp.totalStories > 0 || lp.confidenceProgress > 0);

  return (
    <div className="space-y-6 sm:space-y-8 p-1">
      {/* Panel Simulation Performance Section */}
      <div className="bg-theme-bg-card dark:bg-theme-dark-bg-card shadow-xl dark:shadow-dark-lg rounded-lg p-5 sm:p-6 border border-theme-accent-primary dark:border-theme-dark-accent-primary">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-5">
            <h2 className="font-serif text-2xl font-bold text-theme-text-primary dark:text-theme-dark-text-primary flex items-center">
              <ClipboardCheckIcon className="w-7 h-7 mr-2.5 text-theme-accent-primary dark:text-theme-dark-accent-primary"/>
              Panel Simulation Performance
            </h2>
            <Button onClick={onInitiatePanelSession} variant="primary" size="lg" className="w-full sm:w-auto">
              Start 30-Min Guided Panel
            </Button>
          </div>
          
          {panelKpis ? (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-theme-bg-main dark:bg-theme-dark-bg-main p-3 rounded-md shadow-sm">
                  <p className="text-theme-text-secondary dark:text-theme-dark-text-secondary">Simulations Completed: <strong className="text-theme-text-primary dark:text-theme-dark-text-primary">{panelKpis.totalSessions}</strong></p>
                </div>
                <div className="bg-theme-bg-main dark:bg-theme-dark-bg-main p-3 rounded-md shadow-sm">
                  <p className="text-theme-text-secondary dark:text-theme-dark-text-secondary">Last Session: <strong className="text-theme-text-primary dark:text-theme-dark-text-primary">{panelKpis.lastSessionDate}</strong></p>
                </div>
                <div className="bg-theme-bg-main dark:bg-theme-dark-bg-main p-3 rounded-md shadow-sm">
                  <p className="text-theme-text-secondary dark:text-theme-dark-text-secondary">Avg. Questions per Session: <strong className="text-theme-text-primary dark:text-theme-dark-text-primary">{panelKpis.averageQuestionsPerSession.toFixed(1)}</strong></p>
                </div>
                 <div className="bg-theme-bg-main dark:bg-theme-dark-bg-main p-3 rounded-md shadow-sm">
                   <p className="text-theme-text-secondary dark:text-theme-dark-text-secondary">Question Types in Simulations:</p>
                   <div className="flex justify-around mt-1">
                      <span className="text-theme-accent-primary dark:text-theme-dark-accent-primary">LP: <strong>{panelKpis.totalLpInSim}</strong> ({panelKpis.lpPercentage.toFixed(0)}%)</span>
                      <span className="text-theme-accent-ai dark:text-theme-dark-accent-ai">Freestyle: <strong>{panelKpis.totalFreestyleInSim}</strong> ({panelKpis.freestylePercentage.toFixed(0)}%)</span>
                   </div>
                </div>
              </div>

              {panelKpis.sortedLpFrequency.length > 0 && (
                <div>
                  <h4 className="font-serif text-md font-semibold text-theme-text-primary dark:text-theme-dark-text-primary mb-2">LP Frequency in Simulations:</h4>
                  <div className="max-h-40 overflow-y-auto space-y-1 pr-2 pretty-scrollbar-themed">
                    {panelKpis.sortedLpFrequency.map(([lp, count]) => (
                      <div key={lp} className="flex justify-between items-center text-xs p-1.5 bg-theme-bg-main dark:bg-theme-dark-bg-main rounded">
                        <span className="text-theme-text-secondary dark:text-theme-dark-text-secondary flex items-center"><StarIcon className="w-3 h-3 mr-1.5 text-theme-accent-secondary dark:text-theme-dark-accent-secondary"/>{lp}</span>
                        <strong className="text-theme-text-primary dark:text-theme-dark-text-primary">{count} appearance{count > 1 ? 's' : ''}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <Button onClick={onClearPanelHistory} variant="danger" size="sm" className="mt-3">
                Clear Simulation History
              </Button>
            </div>
          ) : (
            <p className="text-sm text-theme-text-secondary dark:text-theme-dark-text-secondary text-center py-4">
              No panel simulations completed yet. Click "Start Guided Panel" to begin your first session!
            </p>
          )}
      </div>

      {totalQuestions > 0 && (
        <>
          <div className="bg-theme-bg-card dark:bg-theme-dark-bg-card shadow-md dark:shadow-dark-md rounded-lg p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-theme-text-primary dark:text-theme-dark-text-primary">Overall Story Readiness</h2>
                <span className="text-sm text-theme-accent-primary dark:text-theme-dark-accent-primary font-semibold mt-1 sm:mt-0">{overallMasteryProgress}% Mastered</span>
            </div>
            <ProgressBar progress={overallMasteryProgress} height="h-8" barColorClass={progressBarColors.overall} />
            
            <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                     <p className="text-sm font-medium text-theme-text-primary dark:text-theme-dark-text-primary">Overall Story Confidence</p>
                     <span className="text-sm text-theme-accent-secondary dark:text-theme-dark-accent-secondary font-semibold">{overallConfidenceProgress}%</span>
                </div>
                <ProgressBar progress={overallConfidenceProgress} height="h-4" barColorClass={progressBarColors.lp} showTextInside={false}/>
            </div>
             <p className="text-xs text-theme-text-secondary dark:text-theme-dark-text-secondary mt-3">
              Mastered <strong className="text-theme-text-primary dark:text-theme-dark-text-primary">{masteredQuestions}</strong> of <strong className="text-theme-text-primary dark:text-theme-dark-text-primary">{totalQuestions}</strong> total stories.
            </p>
          </div>

          <div className="bg-theme-bg-card dark:bg-theme-dark-bg-card shadow-md dark:shadow-dark-md rounded-lg p-5 sm:p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-theme-text-primary dark:text-theme-dark-text-primary">Leadership Principle Readiness</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowAllLPs(!showAllLPs)}>
                    {showAllLPs ? "Show Active LPs" : "Show All LPs"}
                </Button>
            </div>
            {displayedLpStats.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {displayedLpStats.sort((a,b) => b.masteryProgress - a.masteryProgress).map(lp => (
                    <div key={lp.name} className="bg-theme-bg-main dark:bg-theme-dark-bg-main p-4 rounded-md border border-theme-border-color dark:border-theme-dark-border-color shadow-sm">
                        <h4 className="font-serif text-md font-semibold text-theme-text-primary dark:text-theme-dark-text-primary truncate" title={lp.name}>{lp.name}</h4>
                        <p className="text-xs text-theme-text-secondary dark:text-theme-dark-text-secondary mb-2">
                            {lp.masteredStories} / {lp.totalStories} stories mastered.
                        </p>
                        <ProgressBar progress={lp.masteryProgress} barColorClass={progressBarColors.lp} height="h-2.5" showTextInside={false} />
                        <p className="text-xs text-theme-text-secondary dark:text-theme-dark-text-secondary mt-2 mb-1">Story Confidence:</p>
                        <ProgressBar progress={lp.confidenceProgress} barColorClass={progressBarColors.overall} height="h-2.5" showTextInside={false} />
                    </div>
                ))}
                </div>
            ) : (
                <p className="text-theme-text-secondary dark:text-theme-dark-text-secondary py-3">No Leadership Principle stories added or progress marked yet.</p>
            )}
          </div>

          {freestyleItems.length > 0 && (
            <div className="bg-theme-bg-card dark:bg-theme-dark-bg-card shadow-md dark:shadow-dark-md rounded-lg p-5 sm:p-6">
              <h3 className="font-serif text-lg sm:text-xl font-bold text-theme-text-primary dark:text-theme-dark-text-primary mb-1">Freestyle & Fit Questions</h3>
               <p className="text-sm text-theme-text-secondary dark:text-theme-dark-text-secondary mb-3">
                {masteredFreestyle} / {freestyleItems.length} mastered ({freestyleMasteryProgress}%)
              </p>
              <ProgressBar progress={freestyleMasteryProgress} barColorClass={progressBarColors.freestyle} />
            </div>
          )}
        </>
      )}
      <style>{`
        .pretty-scrollbar-themed::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .pretty-scrollbar-themed::-webkit-scrollbar-track {
          background: transparent;
        }
        .pretty-scrollbar-themed::-webkit-scrollbar-thumb {
          background: var(--theme-accent-secondary, #8DB38B);
          border-radius: 3px;
        }
        .dark .pretty-scrollbar-themed::-webkit-scrollbar-thumb {
          background: var(--theme-dark-accent-secondary, #A0C79E);
        }
        .pretty-scrollbar-themed::-webkit-scrollbar-thumb:hover {
          background: var(--theme-accent-primary, #CC8B79);
        }
        .dark .pretty-scrollbar-themed::-webkit-scrollbar-thumb:hover {
          background: var(--theme-dark-accent-primary, #D99C8C);
        }
      `}</style>
    </div>
  );
};

export default ProgressDisplay;
