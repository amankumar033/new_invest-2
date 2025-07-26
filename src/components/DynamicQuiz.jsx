import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DynamicQuestionComponent from './DynamicQuestionComponent';
import CompletionScreen from './Complete';
import quizData1 from './quizData';
import quizData2 from './quizData2';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'https://backend.myinvestoryy.com/api/';

const questionOrder1 = [
  'start', 'gender', 'married', 'kids', 'onekid', 'twokid', 'twokidage',
  'threekid', 'threekidsecondage', 'threekidthirdage', 'fourkid',
  'fourkidsecondage', 'fourkidthirdage', 'fourkidfourthage', 'income',
  'profession', 'insurance', 'insurancetype', 'termold', 'terminsurancecover',
  'ropold', 'ropinsurancecover', 'termunitold', 'termunitcover', 'ulipold', 'ulipcover', 'pensioncover', 'pensionold', 'healthold', 'healthcover', 'guarantee', 'notmonthly', 'oldgurantee', 'proposal', 'secure', 'goal', 'guaranteereturn', 'pension',
  'coverage', 'fixed', 'monthlyfixed', 'medical', 'plan', 'medicalcoverage', 'betterplan',
  'claim', 'medicalplan', 'medicoverage'
];

const questionOrder2 = [
  'newStart', 'how', 'invested', 'lumpsum', 'sip', 'longterm', 'startinvest',
  'lumpsumamount', 'sipamount', 'realstate', 'realstatetype', 'moreinvest',
  'interest', 'investseek', 'interested', 'explore', 'optioninvest',
  'optioninterested', 'optioninterest', 'ending'
];

const DynamicQuiz = ({ name, phone, startKey }) => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [quizData, setQuizData] = useState(quizData1);
  const [questionOrder, setQuestionOrder] = useState(questionOrder1);
  const [currentKey, setCurrentKey] = useState(questionOrder1[0]);
  const [answers, setAnswers] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizPhase, setQuizPhase] = useState(1);
  const [loading, setLoading] = useState(false);

  const currentQuestionObj = quizData[currentKey];
  
  const insuranceFollowUps = {
    'Term': ['termold', 'terminsurancecover'],
    'Term - ROP': ['ropold', 'ropinsurancecover'],
    'Term-Unit linked': ['termunitold', 'termunitcover'],
    'ULIP': ['ulipold', 'ulipcover'],
    'Pension': ['pensioncover', 'pensionold'],
    'Guaranteed Return': ['guarantee', 'notmonthly', 'oldgurantee'],
    'Health': ['healthold', 'healthcover'],
  };

  const investmentFollowUps = {
    'Real Estate': ['realstate', 'realstatetype'],
    'Gold': ['goldtype'],
    'Stocks': ['stocktype'],
    'Mutual Funds': ['mftype'],
    'Fixed Deposits': ['fdtype']
  };

  // Helper to get all pending follow-up keys based on current answers
  function getPendingFollowUps(answers) {
    let pending = [];
    
    // Insurance type follow-ups
    if (answers.insurancetype) {
      const selected = Array.isArray(answers.insurancetype) ? answers.insurancetype : [answers.insurancetype];
      selected.forEach(option => {
        if (insuranceFollowUps[option]) {
          insuranceFollowUps[option].forEach(fu => {
            if (!pending.includes(fu)) {
              pending.push(fu);
            }
          });
        }
      });
    }
    
    // Investment follow-ups (for phase 2)
    if (answers.invested) {
      const selected = Array.isArray(answers.invested) ? answers.invested : [answers.invested];
      selected.forEach(option => {
        if (investmentFollowUps[option]) {
          investmentFollowUps[option].forEach(fu => {
            if (!pending.includes(fu)) {
              pending.push(fu);
            }
          });
        }
      });
    }
    
    return pending;
  }

  // Check if all insurance follow-ups are completed
  function areInsuranceFollowUpsComplete(answers) {
    if (!answers.insurancetype) return false;
    
    const selected = Array.isArray(answers.insurancetype) ? answers.insurancetype : [answers.insurancetype];
    for (const option of selected) {
      if (insuranceFollowUps[option]) {
        for (const followUp of insuranceFollowUps[option]) {
          if (!answers[followUp]) {
            return false;
          }
        }
      }
    }
    return true;
  }

  // Helper to get the next follow-up question in sequence
  function getNextFollowUpInSequence(answers, currentKey) {
    const allFollowUps = getPendingFollowUps(answers);
    
    // If we're currently on a follow-up question, find the next one in sequence
    if (allFollowUps.includes(currentKey)) {
      const currentIndex = allFollowUps.indexOf(currentKey);
      if (currentIndex < allFollowUps.length - 1) {
        return allFollowUps[currentIndex + 1];
      }
    } else {
      // If we're not on a follow-up question, return the first one
      if (allFollowUps.length > 0) {
        return allFollowUps[0];
      }
    }
    
    return null;
  }

  // Handle if quiz needs to start from 'ending'
  useEffect(() => {
    if (startKey === 'ending') {
      navigate('/again', { state: { name, phone } });
    }
  }, [startKey, name, phone, navigate]);

  // Set correct starting key if provided
  useEffect(() => {
    if (startKey) {
      if (questionOrder1.includes(startKey)) {
        setQuizData(quizData1);
        setQuestionOrder(questionOrder1);
        setCurrentKey(startKey);
        setQuestionIndex(questionOrder1.indexOf(startKey));
        setQuizPhase(1);
      } else if (questionOrder2.includes(startKey)) {
        setQuizData(quizData2);
        setQuestionOrder(questionOrder2);
        setCurrentKey(startKey);
        setQuestionIndex(questionOrder2.indexOf(startKey));
        setQuizPhase(2);
      }
    }
  }, [startKey]);

  // Handle Phase 2 Completion
  useEffect(() => {
    if (quizCompleted && quizPhase === 2) {
      navigate('/thank-you', { state: { name, phone } });
    }
  }, [quizCompleted, quizPhase, navigate, name, phone]);

  const handleOptionSelect = async (selectedOption) => {
    try {
      setLoading(true);
      const isMultiple = Array.isArray(selectedOption);
      const selectedOptions = isMultiple ? selectedOption : [selectedOption];
      const newAnswers = {
        ...answers,
        [currentKey]: selectedOption,
      };

      // Save to backend
      await axios.post(`${API_BASE}save-response`, {
        phone,
        question_index: currentQuestionObj.question,
        response: selectedOptions.join(', '),
      });
      await axios.post(`${API_BASE}save-progress`, {
        phone,
        current_question_index: {
          key: currentKey,
          option: selectedOption,
        },
      });

      // Get all follow-up questions and next one in sequence
      const allFollowUps = getPendingFollowUps(newAnswers);
      const nextFollowUpInSequence = getNextFollowUpInSequence(newAnswers, currentKey);
      
      // Determine next question
      let nextKey = null;
      
      // Only check for follow-up questions if we're on insurance-related questions
      const isInsuranceQuestion = ['insurancetype', 'termold', 'terminsurancecover', 'ropold', 'ropinsurancecover', 'termunitold', 'termunitcover', 'ulipold', 'ulipcover', 'pensioncover', 'pensionold', 'healthold', 'healthcover', 'guarantee', 'notmonthly', 'oldgurantee'].includes(currentKey);
      
      if (isInsuranceQuestion && nextFollowUpInSequence) {
        // If there are follow-ups and we're on an insurance question, show the next one in sequence
        nextKey = nextFollowUpInSequence;
      } else {
        // Check if current question has a next value
        if (currentQuestionObj.next) {
          // For single-select questions, use the selected option's next value
          if (!isMultiple && currentQuestionObj.next[selectedOption]) {
            nextKey = currentQuestionObj.next[selectedOption];
          }
          // For multi-select questions, find common next question if all options lead to same next
          else if (isMultiple) {
            const nextKeys = selectedOptions
              .map(option => currentQuestionObj.next[option])
              .filter(Boolean);
            
            if (nextKeys.length > 0 && new Set(nextKeys).size === 1) {
              nextKey = nextKeys[0];
            }
          }
        }
        
        // Special handling for certain questions
        if (!nextKey) {
          if (currentKey === 'insurancetype' && quizPhase === 1) {
            // After insurance type, check if there are follow-ups
            if (nextFollowUpInSequence) {
              nextKey = nextFollowUpInSequence;
            } else {
              // If no follow-ups, go to proposal question
              nextKey = 'proposal';
            }
          } else if (quizPhase === 1 && areInsuranceFollowUpsComplete(newAnswers) && 
                     ['terminsurancecover', 'ropinsurancecover', 'termunitcover', 'ulipcover', 'pensionold', 'healthcover', 'oldgurantee'].includes(currentKey)) {
            // If we're on the last insurance follow-up question and all follow-ups are complete, go to proposal
            nextKey = 'proposal';
          } else if (currentKey === 'invested' && quizPhase === 2) {
            // After investment selection, check if any investment type was selected
            const hasInvestmentFollowUps = selectedOptions.some(option => investmentFollowUps[option]);
            if (hasInvestmentFollowUps) {
              // Let the follow-up system handle it
              if (nextFollowUpInSequence) {
                nextKey = nextFollowUpInSequence;
              }
            } else {
              // Otherwise go to next general question
              const currentIdx = questionOrder2.indexOf(currentKey);
              if (currentIdx < questionOrder2.length - 1) {
                nextKey = questionOrder2[currentIdx + 1];
              }
            }
          } else if (currentKey === 'guarantee' && quizPhase === 1) {
            // Handle Guaranteed Return flow
            nextKey = 'notmonthly';
          }
        }
      }

      if (nextKey) {
        setCurrentKey(nextKey);
        setQuestionIndex(questionOrder.indexOf(nextKey));
        setHistory(prev => [...prev, currentKey]); // Add current to history before moving to next
      } else {
        // No next question means we're at the end
        setQuizCompleted(true);
      }
      
      setAnswers(newAnswers);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    if (quizPhase === 1) {
      setQuizData(quizData2);
      setQuestionOrder(questionOrder2);
      setCurrentKey(questionOrder2[0]);
      setQuestionIndex(0);
      setQuizCompleted(false);
      setQuizPhase(2);
      setHistory(prev => [...prev, currentKey]); // Add last phase 1 question to history
    }
  };

  const handleBack = () => {
    if (history.length === 0) return;
    
    // Get the previous key from history
    const prevKey = history[history.length - 1];
    
    // Update state
    setCurrentKey(prevKey);
    setQuestionIndex(questionOrder.indexOf(prevKey));
    
    // Update history by removing the last entry
    setHistory(prev => prev.slice(0, -1));
    
    // Don't remove the answer for the current question when going back
    // This preserves the user's selections when navigating back
    
    // Ensure the quiz data is set correctly based on phase
    if (questionOrder1.includes(prevKey)) {
      setQuizData(quizData1);
      setQuestionOrder(questionOrder1);
      setQuizPhase(1);
    } else if (questionOrder2.includes(prevKey)) {
      setQuizData(quizData2);
      setQuestionOrder(questionOrder2);
      setQuizPhase(2);
    }
  };

  if (quizCompleted && quizPhase === 1) {
    return <CompletionScreen userName={name} onComplete={handleComplete} />;
  }

  return (
    <>
      <DynamicQuestionComponent
        userName={name}
        question={currentQuestionObj?.question || ''}
        options={currentQuestionObj?.options || []}
        onSelectOption={handleOptionSelect}
        onBack={handleBack}
        showBack={history.length > 0}
        multiple={currentQuestionObj?.multiple}
        disabled={loading}
        previousAnswer={answers[currentKey]}
        key={currentKey}
      />
    </>
  );
};

export default DynamicQuiz;