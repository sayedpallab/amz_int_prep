
import React from 'react';
import { QuestionAnswerItem, QuestionType, ConfidenceLevel, STARL } from './types';
import { v4 as uuidv4 } from 'uuid';

export const AMAZON_LEADERSHIP_PRINCIPLES: string[] = [
  "Customer Obsession", "Ownership", "Invent and Simplify", "Are Right, A Lot", "Learn and Be Curious", "Hire and Develop the Best", 
  "Insist on the Highest Standards", "Think Big", "Bias for Action", "Frugality", "Earn Trust", "Dive Deep", 
  "Have Backbone; Disagree and Commit", "Deliver Results", "Strive to be Earth’s Best Employer", "Success and Scale Bring Broad Responsibility"
];

const userLPData: Omit<QuestionAnswerItem, 'id' | 'mastered' | 'createdAt' | 'updatedAt' | 'flaggedForInterview' | 'confidenceLevel' | 'type'>[] = [
  {
      question: 'Tell me about a time you developed your team and improved their performance.',
      principleOrCategory: 'Hire and Develop the Best',
      tags: ['Job Satisfaction 57% to 79%', 'Team Lead Development', 'Interim AM', '100 Associates', 'Throughput 8%'],
      answerSTARL: {
          situation: "As the Interim Pick Area Manager for a department of 100 associates and 2 Team Leads, I inherited a team where job satisfaction was at 57%. While my Team Leads were strong operationally, I saw an opportunity to develop their leadership skills further to truly uplift the entire department.",
          task: "My goal was to 'Hire and Develop the Best' by not only improving my Team Leads' capabilities in areas like time management and associate coaching but also by significantly boosting overall team morale and directly impacting our department's performance.",
          action: "I shifted from just assigning tasks to holding dedicated weekly 1-on-1s with each Team Lead, focusing on their individual development areas. We created personalized action plans. For instance, I coached them on effective delegation and how to run more engaging stand-up meetings. I also empowered them by giving them ownership of projects, such as leading a 5S initiative, acting as their mentor throughout.",
          result: "This focused development had a profound impact. In just two months, our department's job satisfaction score soared from 57% to 79%, and it continues to climb. My Team Leads are now more effective, taking greater initiative, and their teams are more engaged. This directly contributed to our department's total throughput increasing by 8% in the same period.",
          learning: "I learned that investing deeply in your direct reports—your Team Leads—is the most powerful lever for transforming an entire department. Their growth directly translates to improved morale and measurable operational success for everyone."
      }
  },
  {
      question: 'Describe a time you took on a significant challenge and delivered impactful results.',
      principleOrCategory: 'Deliver Results',
      tags: ['OM Proxy', 'Idle Time Reduction 7%', '€7500 Savings', 'Senior Manager Appreciation', '97% Planning', 'TPH Increase 1.56%'],
      answerSTARL: {
          situation: "For three weeks, I was given the responsibility to act as the Operations Manager's proxy, overseeing the entire outbound operation. During this period, I had identified a significant issue: considerable productive hours were being lost at the start of every shift across multiple departments due to system latency and uncoordinated start-ups.",
          task: "My primary objective was to deliver results by maintaining seamless operations building-wide while also tackling this specific idle time issue. I set a target to reduce this lost time by at least 5%, aiming for substantial efficiency gains and cost savings.",
          action: "I spearheaded a project to analyze and streamline the shift start-up process. This involved collaborating with other AMs to implement a more rigorous 'Start of Shift' checklist and optimizing stand-up meeting timings to ensure associates could engage in productive work immediately. Alongside this project, I managed all daily operational planning and CPT chasing for outbound.",
          result: "The project was a resounding success. We reduced start-of-shift idle time by 7%, which translated into a direct cost saving of approximately €7,500 per month for the FC. My overall planning and execution during the OM proxy period were 97% on target, and we achieved an increase in total outbound TPH by 1.56%. This performance earned a direct commendation from our Senior Operations Manager.",
          learning: "This experience proved my capability to operate effectively at a broader strategic level, managing complex operations and delivering measurable financial and productivity improvements. It also reinforced that addressing foundational process inefficiencies can yield significant, widespread benefits."
      }
  },
  {
      question: 'Describe a time when you made a mistake. How did you handle it?',
      principleOrCategory: 'Earn Trust',
      tags: ['Flow Lead', 'Bad Call', 'Pack Backlog', 'Owning Mistake', 'Peer Trust'],
      answerSTARL: {
          situation: "When I was the Outbound Flow Lead, we were approaching a critical CPT deadline. To try and get ahead, I made the call to release a massive wave of work from Pick to the Pack department, assuming the simple orders would fly through.",
          task: "My task was to manage the outbound flow to meet our shipping promise. However, my decision, which I didn't communicate clearly to the Pack Area Manager, had the opposite effect.",
          action: "The massive wave of work completely overwhelmed the sorter and the re-bin walls in Pack, creating a huge bottleneck. Instead of making excuses, I immediately walked over to the Pack AM's desk, got their attention and said, 'This is on me. I made a bad call. What's the best way I can help you clear it?' I then got on the radio with my former Pick team and had them stage the next wave of work differently to give Pack time to recover.",
          result: "By owning the mistake instantly Dịchand offering help, we diffused a tense situation. The Pack AM and I worked together to clear the backlog, and we successfully met the CPT. The most important result was that my relationship with that AM became much stronger because they knew I was an honest partner.",
          learning: "I learned that trust isn't about being perfect; it's about being accountable. I also learned that proactive, cross-departmental communication before making a major flow decision is non-negotiable."
      }
  },
  {
      question: 'Tell me about a time you took on a problem outside of your direct responsibilities.',
      principleOrCategory: 'Ownership',
      tags: ['Flow Lead', 'Ship Dock Bottleneck', 'Cross-Departmental', 'Proactive Meeting', 'CPT Chase'],
      answerSTARL: {
          situation: "As Outbound Flow Lead, I saw a recurring pattern where the Ship Dock would be overwhelmed in the last two hours of the shift, putting our final CPTs at high risk. The Ship Dock AM was constantly firefighting.",
          task: "Although I didn't manage any of these teams directly, I took ownership of the entire outbound flow. My goal was to smooth out the workflow to prevent this end-of-shift bottleneck, directly tying into my project of improving CPT chasing productivity.",
          action: "I analyzed the timing of work release from Pick and Pack. I took the initiative to schedule a brief daily meeting with the AMs from Pick, Pack, and Ship Dock to review the plan for the end of the shift. Using data, I proposed a more staggered release of work from Pack, preventing a single massive wave from hitting the dock.",
          result: "After implementing the daily check-in, the end-of-shift CPT risk was significantly reduced. The Ship Dock had a much more manageable workload, and our CPT chasing became more proactive than reactive. The other AMs appreciated me taking the initiative to solve a problem that was affecting all of them.",
          learning: "I learned that ownership often means looking at the entire process stream, not just your own area. It's about identifying and solving problems for the good of the entire facility, even if you don't have direct authority."
      }
  },
  {
      question: 'Describe a time when you used customer feedback to drive an improvement.',
      principleOrCategory: 'Customer Obsession',
      tags: ['Pick AM', 'Customer Complaints', 'Wrong Item', 'Bin Storage', 'Inbound Collaboration'],
      answerSTARL: {
          situation: "As the Pick Interim AM, I saw a spike in customer complaints for an ASIN where a mug came in four different colors but shared a barcode. Customers were ordering blue but receiving red. This was a clear failure to deliver on the customer promise.",
          task: "My task was to work backwards from these customer complaints and implement a process change that would reduce the pick error rate for this ASIN to zero.",
          action: "I did a Gemba walk and saw all four colors were mixed in one bin. It was a stowing issue causing a picking problem. I didn't just file a ticket; I found the Inbound AM, showed them the customer complaint data, and walked them to the bin. Together, we created a plan to separate the items into four clearly labeled bins.",
          result: "The Inbound team re-stowed the items. I showed the change to my team. In the following month, customer complaints and pick errors for that ASIN dropped to zero, directly improving the customer experience.",
          learning: "I learned that Customer Obsession in an FC means treating process defects as customer problems. It also taught me that the best way to solve a cross-departmental issue is to go talk to your peer, present them with the customer data, and solve it together as one team."
      }
  },
];

const userFreestyleData: Omit<QuestionAnswerItem, 'id' | 'mastered' | 'createdAt' | 'updatedAt' | 'flaggedForInterview' | 'confidenceLevel' | 'type' | 'answerSTARL'>[] = [
  {
      question: "Why do you want to be an Area Manager at Amazon?",
      principleOrCategory: "Motivation & Fit",
      answerFreestyle: "I'm eager to be a permanent Area Manager because my experience as an Interim AM has solidified my passion for leading operational teams and delivering tangible results in Amazon's dynamic environment.\n\nI'm not just managing my department of 100 associates; I'm actively transforming it. For instance, I've driven our team's job satisfaction from 57% to 79% in just two months, while simultaneously increasing departmental throughput by 8%.\n\nI thrive on the responsibility of developing my two Team Leads and empowering them to succeed. The permanent role will allow me to take greater long-term strategic ownership, build on these successes, and continue to drive impactful improvements for both my team and the wider FC."
  },
  {
      question: "Why do you want to step up now?",
      principleOrCategory: "Motivation & Fit",
      answerFreestyle: "I'm ready to officially step up now because I'm already consistently performing at the Area Manager level and have a proven track record of exceeding expectations. My project to reduce start-of-shift idle time by 7% resulted in €7,500 monthly savings.\n\nCrucially, during my three weeks as Operations Manager proxy, I demonstrated my ability to manage complex, building-wide operations with 97% planning and execution accuracy, earning appreciation from senior leadership.\n\nI've shown I can handle the strategic and leadership demands, and moving into the permanent role is the logical progression to fully leverage my capabilities for the FC's success."
  },
  {
      question: "What is the biggest difference between being an Interim Area Manager and a permanent Area Manager?",
      principleOrCategory: "Role Understanding",
      answerFreestyle: "The most significant difference lies in the scope and depth of strategic ownership and long-term impact. As an Interim AM, while I take full responsibility and have delivered results like an 8% throughput increase and a jump in job satisfaction to 79%, there's often an implicit focus on maintaining stability and hitting immediate targets.\n\nAs a permanent Area Manager, the expectation—and my ambition—is to drive more profound, sustainable change. This includes spearheading more strategic projects, like my €7,500/month cost-saving initiative on idle time, and, importantly, having the runway to deeply invest in the long-term career development of my Team Leads and high-potential associates over several performance cycles, truly building a talent pipeline."
  },
  {
      question: "What could you do better or differently after getting promoted to Area Manager?",
      principleOrCategory: "Self-Reflection & Growth",
      answerFreestyle: "As a permanent Area Manager, I would leverage the broader platform to drive more cross-departmental collaboration and process optimization building-wide. While as an Interim I've successfully focused on transforming my own department—evidenced by the 8% throughput increase and 79% job satisfaction—I see many opportunities where a more integrated approach with Inbound, other Outbound areas, and support functions could yield even greater efficiencies for the entire FC.\n\nFor example, building on my project that reduced idle time by 7%, I'd want to champion similar initiatives that tackle systemic bottlenecks, ensuring that the excellent work within individual departments translates into even smoother end-to-end flow. I also want to dedicate more formal time to mentoring upcoming talent across shifts."
  },
  {
      question: "What is the biggest difference between your position as a (Outbound Flow) Team Lead and Area Manager? What scope do you have to change?",
      principleOrCategory: "Role Understanding",
      answerFreestyle: "The transition from Outbound Flow Lead to Area Manager has been a significant shift from tactical execution to strategic leadership and empowerment. As a Flow Lead, my primary focus was on the real-time execution of the shift plan, problem-solving on the floor, and ensuring my immediate team had what they needed. My scope was largely within that shift and that specific process path.\n\nAs an Area Manager, particularly in my Interim role where I'm responsible for 100 associates and 2 Team Leads, my scope is far broader. I'm now responsible for setting the vision for the entire department, analyzing performance data to identify strategic opportunities (like achieving an 8% throughput increase), developing my Team Leads into effective leaders, and managing projects with significant financial impact, such as the €7,500 monthly saving from reducing idle time.\n\nThe change I can effect is much larger: I'm not just influencing a single process but the performance, morale (improving it from 57% to 79%), and development culture of an entire department."
  }
];

const lpConfidenceValuesForInit: Exclude<ConfidenceLevel, null>[] = ['low', 'medium', 'high'];
const freestyleConfidenceValuesForInit: Exclude<ConfidenceLevel, null>[] = ['medium', 'high'];


export const INITIAL_QUESTIONS: QuestionAnswerItem[] = [
  // Original questions for variety
    {
    id: uuidv4(),
    question: "Tell me about a time you went above and beyond for a customer.",
    type: QuestionType.LEADERSHIP_PRINCIPLE,
    principleOrCategory: "Customer Obsession",
    answerSTARL: {
      situation: "A customer reported a critical issue with a shipment that was preventing their operations.",
      task: "My goal was to resolve the issue ASAP and ensure the customer's operations could resume, minimizing downtime.",
      action: "I immediately escalated to the logistics team, tracked the shipment personally, arranged for an expedited alternative, and kept the customer updated every 30 minutes.",
      result: "The alternative shipment arrived within 4 hours, and the customer was able to resume operations. They sent a commendation for the swift action.",
      learning: "Proactive communication and taking full ownership, even if it means going outside normal channels, builds immense customer trust."
    },
    mastered: false,
    flaggedForInterview: true,
    confidenceLevel: 'medium' as ConfidenceLevel,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
  },
  {
    id: uuidv4(),
    question: "Describe a time you had to make a decision with incomplete data.",
    type: QuestionType.LEADERSHIP_PRINCIPLE,
    principleOrCategory: "Bias for Action",
     answerSTARL: {
      situation: "During a peak period, a key sorting machine malfunctioned, and immediate diagnosis data was unavailable.",
      task: "I needed to decide whether to divert all flow, causing significant backlog, or attempt a partial manual sort with available staff, risking errors but maintaining some throughput.",
      action: "Assessing the immediate staffing levels and the critical packages in queue, I opted for a controlled manual sort for high-priority items while engineers were en route. I communicated clearly with the team about the temporary process and potential risks.",
      result: "We managed to process 70% of critical packages with minimal errors before the machine was fixed, preventing a complete standstill. The backlog was manageable.",
      learning: "In high-pressure situations with imperfect information, it's crucial to make a calculated risk based on priorities and available resources, and to communicate transparently."
    },
    mastered: true,
    flaggedForInterview: true,
    confidenceLevel: 'high' as ConfidenceLevel,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
    updatedAt: new Date().toISOString(),
  },
  // Merged User's LP Data
  ...userLPData.map((item, index) => {
    const confidenceLevelValue = lpConfidenceValuesForInit[index % lpConfidenceValuesForInit.length];
    return {
      ...item,
      id: uuidv4(),
      type: QuestionType.LEADERSHIP_PRINCIPLE,
      mastered: index % 3 === 0, // Some variety
      flaggedForInterview: index < 2, // Flag first two
      confidenceLevel: confidenceLevelValue as ConfidenceLevel,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (index + 1)).toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }),
  // Merged User's Freestyle Data
  ...userFreestyleData.map((item, index) => {
    const confidenceLevelValue = freestyleConfidenceValuesForInit[index % freestyleConfidenceValuesForInit.length];
    return {
      ...item,
      id: uuidv4(),
      type: QuestionType.FREESTYLE,
      mastered: index % 2 === 0,
      flaggedForInterview: index === 0, // Flag first one
      confidenceLevel: confidenceLevelValue as ConfidenceLevel,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12 * (index + 1)).toISOString(),
      updatedAt: new Date().toISOString(),
    };
  })
].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());


// New Typographic Logo - More Stylized
export const AppLogo: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`flex items-center ${className}`}>
    <svg width="36" height="36" viewBox="0 0 40 40" className="mr-2 text-theme-text-on-sidebar dark:text-theme-dark-text-on-sidebar" fill="currentColor">
      <path d="M20 4C10.059 4 2 12.059 2 22C2 30.28 7.03 37.019 14.5 39.195C14.5 36.106 13.03 33.332 10.864 31.75C12.375 32.357 14.015 32.75 15.75 32.75C17.485 32.75 19.125 32.357 20.636 31.75C21.046 31.583 21.447 31.401 21.839 31.205C21.839 32.795 21.839 35.979 21.839 39.195C29.97 37.019 35 30.28 35 22C35 12.059 26.941 4 20 4ZM15.75 10.75C17.96 10.75 19.75 12.54 19.75 14.75C19.75 16.96 17.96 18.75 15.75 18.75C13.54 18.75 11.75 16.96 11.75 14.75C11.75 12.54 13.54 10.75 15.75 10.75ZM24.25 19.25C26.46 19.25 28.25 21.04 28.25 23.25C28.25 25.46 26.46 27.25 24.25 27.25C22.04 27.25 20.25 25.46 20.25 23.25C20.25 21.04 22.04 19.25 24.25 19.25Z" />
       <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fontSize="38" fontFamily="Lato, sans-serif" fontWeight="bold" className="fill-current text-theme-accent-primary dark:text-theme-dark-accent-primary hidden">
        AIH
      </text>
    </svg>
    <div className="flex flex-col leading-tight">
         <span className="font-sans text-xs text-theme-text-on-sidebar dark:text-theme-dark-text-on-sidebar opacity-90 tracking-wider">
            AMAZON
        </span>
        <span className="font-serif text-xl font-bold text-theme-text-on-sidebar dark:text-theme-dark-text-on-sidebar -mt-0.5">
            Interview Hub
        </span>
    </div>
  </div>
);


export const PlusIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const SearchIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

export const EditIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
  </svg>
);

export const DeleteIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c1.153 0 2.243.032 3.223.094M7.5 3.75l.608 .608m0 0v2.5m0-2.5L7.5 3.75M3.75 6H20.25" />
  </svg>
);

export const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

export const ChevronRightIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </svg>
);

export const LightModeIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M12 12a2.25 2.25 0 0 0-2.25 2.25c0 1.31.97 2.482 2.25 2.482s2.25-1.172 2.25-2.482A2.25 2.25 0 0 0 12 12Z" />
  </svg>
);

export const DarkModeIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
  </svg>
);

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const XCircleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => ( 
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);

export const StarIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => ( 
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.82.61l-4.725-2.885a.562.562 0 0 0-.652 0l-4.725 2.885a.562.562 0 0 1-.82-.61l1.285-5.385a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
  </svg>
);

export const BookOpenIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

export const ChartBarIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
     <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125Z" />
  </svg>
);

export const CardsIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5Z" />
  </svg>
);

export const BookmarkIcon: React.FC<{ className?: string; filled?: boolean }> = ({ className = "w-5 h-5", filled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill={filled ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
  </svg>
);

export const BrainIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 13.5a1.5 1.5 0 0 0 -1.5 1.5v1.5a1.5 1.5 0 0 0 1.5 1.5h1.5a1.5 1.5 0 0 0 1.5 -1.5v-1.5a1.5 1.5 0 0 0 -1.5 -1.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.5 13.5a1.5 1.5 0 0 1 -1.5 -1.5v-2a1.5 1.5 0 0 1 1.5 -1.5h1.5a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1 -1.5 1.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 13.5a1.5 1.5 0 0 0 -1.5 1.5v1.5a1.5 1.5 0 0 0 1.5 1.5h1.5a1.5 1.5 0 0 0 1.5 -1.5v-1.5a1.5 1.5 0 0 0 -1.5 -1.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 13.5a1.5 1.5 0 0 1 -1.5 -1.5v-2a1.5 1.5 0 0 1 1.5 -1.5h1.5a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1 -1.5 1.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11.5a1 1 0 0 0 -1 -1h-1.5a1.5 1.5 0 0 0 0 3h1.5a1 1 0 0 0 1 -1z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.5a1 1 0 0 0 -1 -1h-1.5a1.5 1.5 0 0 0 0 3h1.5a1 1 0 0 0 1 -1z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11.5a1 1 0 0 1 1 -1h1.5a1.5 1.5 0 0 1 0 3h-1.5a1 1 0 0 1 -1 -1z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v-1.5a1 1 0 0 1 1 -1h1.5a2.5 2.5 0 0 1 2.5 2.5v1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v-1.5a1 1 0 0 0 -1 -1h-1.5a2.5 2.5 0 0 0 -2.5 2.5v1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.5v1.5a1 1 0 0 0 1 1h1.5a2.5 2.5 0 0 0 2.5 -2.5v-1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.5v1.5a1 1 0 0 1 -1 1h-1.5a2.5 2.5 0 0 1 -2.5 -2.5v-1.5" />
  </svg>
);

export const ClipboardCheckIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} >
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" />
  </svg>
);

export const GaugeIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm0 2.25a7.5 7.5 0 0 1 7.5 7.5c0 1.836-.66 3.528-1.758 4.829l-1.061-1.06A5.23 5.23 0 0 0 17.25 12a5.25 5.25 0 0 0-10.5 0c0 1.3.473 2.489 1.243 3.383l-1.06 1.061A7.477 7.477 0 0 1 4.5 12a7.5 7.5 0 0 1 7.5-7.5Zm0 10.5a.75.75 0 0 0 0 1.5.75.75 0 0 0 0-1.5Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75a.75.75 0 0 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 12a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.348 9.075 12 11.423l-2.348-2.348" />
  </svg>
);

export const confidenceColors: Record<string, { bg: string; text: string; darkBg: string; darkText: string; border?: string; darkBorder?: string }> = {
  low: { 
    bg: 'bg-red-100', text: 'text-red-700', 
    darkBg: 'dark:bg-red-700 dark:bg-opacity-30', darkText: 'dark:text-red-200',
    border: 'border-red-500', darkBorder: 'dark:border-red-500'
  },
  medium: { 
    bg: 'bg-yellow-100', text: 'text-yellow-700', 
    darkBg: 'dark:bg-yellow-600 dark:bg-opacity-30', darkText: 'dark:text-yellow-100',
    border: 'border-yellow-500', darkBorder: 'dark:border-yellow-500'
  },
  high: { 
    bg: 'bg-green-100', text: 'text-green-700', 
    darkBg: 'dark:bg-green-600 dark:bg-opacity-30', darkText: 'dark:text-green-100',
    border: 'border-green-500', darkBorder: 'dark:border-green-500'
  },
};
