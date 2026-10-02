import React, { useState, useEffect, useRef, useCallback } from 'react';
import Vapi from '@vapi-ai/web';
import { 
  Bot, User, Mic, MicOff, Video, VideoOff, Play, Code, CheckSquare, 
  Clock, ArrowRight, MessageSquare, AlertCircle, StopCircle, Maximize2, 
  Settings, ChevronRight, ShieldCheck, Lightbulb, PhoneOff, Terminal, 
  Sparkles, GripVertical, Send, RefreshCw, AlertTriangle, Code2, Network, Brain, Database,
  Save, CheckCircle2, Volume2, VolumeX, ShieldAlert, Lock
} from 'lucide-react';
import API_BASE_URL from '../config/api';
import { auth } from '../services/firebase';
import './LiveInterviewStudio.css';

import { selectCodingProblem, CODING_PROBLEMS } from '../data/codingProblems';

// Standard Starter Boilerplate Code per language fallback
const BOILERPLATE_CODE = CODING_PROBLEMS[0].boilerplate;

export default function LiveInterviewStudio({ currentUser, initialStream, interviewConfig, onFinishInterview }) {
  // Session ID determination for backend persistence & recovery
  const sessionId = interviewConfig?.sessionId || interviewConfig?.id || `SESSION_${currentUser?.id || 'ANON'}_${interviewConfig?.roundType || 'CODING'}`;

  // Version counter for monotonic autosave sequence (Phase 4)
  const versionRef = useRef(1);

  // 1. Retrieve or restore active problem
  const [activeProblem, setActiveProblem] = useState(() => {
    try {
      const savedRaw = localStorage.getItem(`interactai_coding_${sessionId}`);
      if (savedRaw) {
        const savedData = JSON.parse(savedRaw);
        if (savedData?.problemId) {
          const found = CODING_PROBLEMS.find(p => p.id === savedData.problemId);
          if (found) return found;
        }
      }
    } catch (e) {}

    let usedIds = [];
    try {
      usedIds = JSON.parse(sessionStorage.getItem('interactai_used_coding_ids') || '[]');
    } catch (e) {}

    const selected = selectCodingProblem(
      interviewConfig?.difficulty || 'Medium',
      interviewConfig?.targetRole || '',
      interviewConfig?.roundType || '',
      usedIds
    );

    try {
      const updatedUsed = [...new Set([...usedIds, selected.id])];
      sessionStorage.setItem('interactai_used_coding_ids', JSON.stringify(updatedUsed));
    } catch (e) {}

    return selected;
  });

  // Round type checks
  const roundType = interviewConfig?.roundType || interviewConfig?.stage || 'Technical';
  const isTechnicalRound = roundType === 'Technical' || roundType === 'Aptitude';
  const isHrRound = roundType === 'HR';
  const isCodingRound = roundType === 'Coding';

  // 2. Coding Phase State Machine: INTRO -> CODING -> DISCUSSION -> EVALUATING -> COMPLETED
  const [codingPhase, setCodingPhase] = useState(() => {
    if (!isCodingRound) return 'NORMAL';
    try {
      const savedRaw = localStorage.getItem(`interactai_coding_${sessionId}`);
      if (savedRaw) {
        const savedData = JSON.parse(savedRaw);
        if (savedData?.codingPhase && ['INTRO', 'CODING', 'DISCUSSION'].includes(savedData.codingPhase)) {
          return savedData.codingPhase;
        }
      }
    } catch (e) {}
    return 'INTRO';
  });

  // 3. Timing & Timestamp-based Deadline (Phase 7)
  const durationMins = parseInt(interviewConfig?.duration || '30', 10);
  const totalSeconds = durationMins * 60;
  
  const [remainingSeconds, setRemainingSeconds] = useState(() => {
    try {
      const savedRaw = localStorage.getItem(`interactai_coding_${sessionId}`);
      if (savedRaw) {
        const savedData = JSON.parse(savedRaw);
        if (savedData?.codingDeadline) {
          const diff = Math.max(0, Math.floor((savedData.codingDeadline - Date.now()) / 1000));
          return diff;
        }
        if (typeof savedData?.remainingSeconds === 'number' && savedData.remainingSeconds > 0) {
          return savedData.remainingSeconds;
        }
      }
    } catch (e) {}
    return totalSeconds;
  });

  const codingDeadlineRef = useRef(Date.now() + remainingSeconds * 1000);

  const getInitialQuestionText = () => {
    if (interviewConfig?.initialQuestion) {
      return interviewConfig.initialQuestion;
    }
    const candidateName = currentUser?.fullName || 'Candidate';
    if (interviewConfig?.practiceMode === 'targeted' && interviewConfig?.roundType) {
      const round = interviewConfig.roundType;
      return `Welcome ${candidateName} to your targeted ${round} practice session. Connecting to your AI Interviewer...`;
    }
    if (isCodingRound) {
      return `Welcome ${candidateName}. Problem Statement: ${activeProblem.title}. Please review the problem statement and ask any clarifying questions before beginning your coding time.`;
    }
    return `Welcome ${candidateName} to your live ${interviewConfig?.targetRole || 'Software Development Engineer'} interview. Connecting to your AI Interviewer...`;
  };

  const getInitialCodeContent = () => {
    try {
      const savedRaw = localStorage.getItem(`interactai_coding_${sessionId}`);
      if (savedRaw) {
        const savedData = JSON.parse(savedRaw);
        if (savedData?.codeContent) return savedData.codeContent;
      }
    } catch (e) {}

    if (interviewConfig?.practiceMode === 'targeted' && interviewConfig?.roundType) {
      const round = interviewConfig.roundType;
      if (round === 'Aptitude') {
        return `// 🧮 Aptitude Rough Work & Calculation Scratchpad\n// Write your calculations or rough notes below:`;
      }
      if (round === 'HR') {
        return `// 💬 HR & Behavioral Interview Notes (STAR Method)\n// Outline your points here while speaking:`;
      }
      if (round === 'Technical') {
        return `// ⚙️ Technical Architecture & Concepts Workspace\n// Write your technical notes or pseudocode here:`;
      }
    }
    return activeProblem?.boilerplate?.javascript || BOILERPLATE_CODE.javascript;
  };

  const getInitialConsoleOutput = () => {
    if (isCodingRound) {
      return `[CODING SESSION INITIALIZED]\nActive Problem: ${activeProblem.title} (${activeProblem.difficulty})\nCategory: ${activeProblem.category}\n\nPhase: ${codingPhase.toUpperCase()}\nStatus: Code editor ready.`;
    }
    return `Vapi AI Voice Engine connected.`;
  };

  // Question & Transcript state
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [currentQuestionText, setCurrentQuestionText] = useState(getInitialQuestionText);
  
  const [candidateAnswer, setCandidateAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const transcriptRef = useRef([]);

  // Live Captions state
  const [interviewerCaption, setInterviewerCaption] = useState(getInitialQuestionText);
  const [userCaption, setUserCaption] = useState('');

  // Vapi Call & Media State
  const [callStatus, setCallStatus] = useState('connecting'); // 'connecting', 'active', 'ended', 'error'
  const [vapiError, setVapiError] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListeningUser, setIsListeningUser] = useState(false);
  const [tabSwitchWarning, setTabSwitchWarning] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  // Coding Mode State
  const [codeLanguage, setCodeLanguage] = useState(() => {
    try {
      const savedRaw = localStorage.getItem(`interactai_coding_${sessionId}`);
      if (savedRaw) {
        const savedData = JSON.parse(savedRaw);
        if (savedData?.codeLanguage) return savedData.codeLanguage;
      }
    } catch (e) {}
    return 'javascript';
  });

  const [codeContent, setCodeContent] = useState(getInitialCodeContent);
  const [consoleOutput, setConsoleOutput] = useState(getInitialConsoleOutput);
  const [isAnalyzingCode, setIsAnalyzingCode] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  // Problem Pane Interactive Tabs & Test Cases
  const [activeProblemTab, setActiveProblemTab] = useState('description');
  const [testCases, setTestCases] = useState(() => {
    try {
      const savedRaw = localStorage.getItem(`interactai_coding_${sessionId}`);
      if (savedRaw) {
        const savedData = JSON.parse(savedRaw);
        if (savedData?.testCases) return savedData.testCases;
      }
    } catch (e) {}
    return activeProblem.testCases || [];
  });

  const [executionMetrics, setExecutionMetrics] = useState(() => ({
    executionStatus: codeLanguage === 'javascript' ? 'pending' : 'unavailable',
    testsPassed: null,
    testsFailed: null,
    totalTests: testCases.length
  }));

  const [customInput, setCustomInput] = useState('');
  const [customExpected, setCustomExpected] = useState('');
  const [showAddTest, setShowAddTest] = useState(false);

  // Autosave & Telemetry State
  const [autosaveStatus, setAutosaveStatus] = useState('saved'); // 'saved' | 'saving' | 'error'
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const [runCount, setRunCount] = useState(0);
  const [telemetry, setTelemetry] = useState({
    firstRunAt: null,
    lastRunAt: null,
    runCount: 0,
    languageChanges: 0
  });

  const videoRef = useRef(null);
  const vapiRef = useRef(null);
  const isEndingRef = useRef(false);
  const containerRef = useRef(null);
  const remainingRef = useRef(remainingSeconds);

  useEffect(() => {
    remainingRef.current = remainingSeconds;
  }, [remainingSeconds]);

  // Sync transcript state with ref
  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // Auth Bearer Token Fetch Helper
  const getAuthToken = async () => {
    try {
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        return await firebaseUser.getIdToken();
      }
    } catch (e) {}
    return null;
  };

  // 4. Recovery On Mount: Restore active session state from backend
  useEffect(() => {
    if (!isCodingRound || !sessionId) return;
    
    let isCancelled = false;
    const fetchBackendSession = async () => {
      try {
        const token = await getAuthToken();
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_BASE_URL}/api/interview/session/${sessionId}`, { headers });
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && data?.success && data?.state) {
            const st = data.state;
            console.log('[CODING RECOVERY] Backend session state recovered:', st);
            if (st.problemId) {
              const prob = CODING_PROBLEMS.find(p => p.id === st.problemId);
              if (prob) setActiveProblem(prob);
            }
            if (st.codeContent) setCodeContent(st.codeContent);
            if (st.codeLanguage) setCodeLanguage(st.codeLanguage);
            if (st.codingDeadline) {
              codingDeadlineRef.current = st.codingDeadline;
              const diff = Math.max(0, Math.floor((st.codingDeadline - Date.now()) / 1000));
              setRemainingSeconds(diff);
            } else if (typeof st.remainingSeconds === 'number') {
              setRemainingSeconds(st.remainingSeconds);
            }
            if (st.codingPhase && ['INTRO', 'CODING', 'DISCUSSION'].includes(st.codingPhase)) {
              setCodingPhase(st.codingPhase);
            }
            if (st.testCases) setTestCases(st.testCases);
            if (typeof st.runCount === 'number') setRunCount(st.runCount);
            if (typeof st.version === 'number') versionRef.current = Math.max(versionRef.current, st.version);
          }
        }
      } catch (err) {
        console.warn('[CODING RECOVERY] Backend restoration notice (using local cache):', err.message);
      }
    };

    fetchBackendSession();
    return () => { isCancelled = true; };
  }, [sessionId, isCodingRound]);

  // 5. Monotonic Autosave Function with Versioning & Bearer Token (Phase 1, 3 & 4)
  const saveCodingSession = useCallback(async (overrides = {}) => {
    if (!isCodingRound) return;

    setAutosaveStatus('saving');
    const currentVersion = versionRef.current++;

    const stateToSave = {
      sessionId,
      problemId: activeProblem.id,
      codeContent: overrides.codeContent !== undefined ? overrides.codeContent : codeContent,
      codeLanguage: overrides.codeLanguage !== undefined ? overrides.codeLanguage : codeLanguage,
      remainingSeconds: remainingRef.current,
      codingDeadline: codingDeadlineRef.current,
      codingPhase: overrides.codingPhase !== undefined ? overrides.codingPhase : codingPhase,
      testCases: overrides.testCases !== undefined ? overrides.testCases : testCases,
      runCount: overrides.runCount !== undefined ? overrides.runCount : runCount,
      version: currentVersion,
      savedAt: new Date().toISOString()
    };

    // Save locally
    try {
      localStorage.setItem(`interactai_coding_${sessionId}`, JSON.stringify(stateToSave));
    } catch (e) {}

    // Save to backend with auth token
    try {
      const token = await getAuthToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/api/interview/session/autosave`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          sessionId,
          codingState: stateToSave
        })
      });

      if (res.ok) {
        setAutosaveStatus('saved');
        setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } else {
        setAutosaveStatus('error');
      }
    } catch (e) {
      console.warn('[AUTOSAVE] Network notification:', e.message);
      setAutosaveStatus('saved'); // Local cache succeeded
    }
  }, [isCodingRound, sessionId, activeProblem.id, codeContent, codeLanguage, codingPhase, testCases, runCount]);

  // Debounced Autosave Effect: 1000ms delay after candidate stops typing (Phase 3)
  useEffect(() => {
    if (!isCodingRound || codingPhase !== 'CODING') return;

    const timer = setTimeout(() => {
      saveCodingSession();
    }, 1000);

    return () => clearTimeout(timer);
  }, [codeContent, isCodingRound, codingPhase, saveCodingSession]);

  // Periodic safety autosave every 8 seconds during active coding phase
  useEffect(() => {
    if (!isCodingRound || codingPhase !== 'CODING') return;

    const interval = setInterval(() => {
      saveCodingSession();
    }, 8000);

    return () => clearInterval(interval);
  }, [isCodingRound, codingPhase, saveCodingSession]);

  // Fullscreen Request & Tab Switch Blur Guard
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => prev + 1);
        setTabSwitchWarning(true);
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleVisibilityChange);

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleVisibilityChange);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, []);

  // Setup Webcam Stream
  useEffect(() => {
    if (initialStream && videoRef.current) {
      videoRef.current.srcObject = initialStream;
      videoRef.current.play().catch(e => console.warn('Camera video play warning:', e));
    }
  }, [initialStream]);

  // Synchronize Microphone with Stream & Vapi
  const toggleMic = () => {
    const nextState = !isMicOn;
    setIsMicOn(nextState);

    if (initialStream) {
      initialStream.getAudioTracks().forEach(t => t.enabled = nextState);
    }
    if (vapiRef.current) {
      try {
        vapiRef.current.setMuted(!nextState);
      } catch (e) {
        console.warn('Vapi mic toggle warning:', e);
      }
    }
  };

  // Synchronize Video Camera
  const toggleVideo = () => {
    const nextState = !isVideoOn;
    setIsVideoOn(nextState);

    if (initialStream) {
      initialStream.getVideoTracks().forEach(t => t.enabled = nextState);
    }
  };

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Vapi AI Voice Engine Initialization per Phase (Phase A INTRO & Phase C DISCUSSION)
  const isStartedRef = useRef(false);
  const lifecycleIdRef = useRef(0);

  const startVapiVoicePhase = useCallback((phaseName) => {
    const lifecycleId = ++lifecycleIdRef.current;
    const instanceId = Math.random().toString(36).substring(2, 9);

    console.log(`[VAPI PHASE START] ${phaseName} | lifecycleId: ${lifecycleId} | instance: ${instanceId}`);

    const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
    const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;

    if (!publicKey || !assistantId || publicKey.includes('your-vapi') || assistantId.includes('your-assistant')) {
      console.warn('[VAPI ERROR] environment variables missing or unconfigured.');
      setVapiError('Vapi AI Voice configuration is missing. Operating session in sandbox mode.');
      setCallStatus('error');
      return;
    }

    let vapi = null;
    try {
      const VapiClass = Vapi.default || Vapi;
      vapi = new VapiClass(publicKey);
      vapiRef.current = vapi;
      setCallStatus('connecting');
    } catch (err) {
      console.warn('[VAPI ERROR] SDK initialization error:', err);
      setVapiError('Failed to initialize Vapi voice client.');
      setCallStatus('error');
      return;
    }

    // Register Supported Vapi Listeners
    vapi.on('call-start', () => {
      if (lifecycleId !== lifecycleIdRef.current) return;
      console.log(`[VAPI EVENT] call-start | phase: ${phaseName} | instance: ${instanceId}`);
      setCallStatus('active');
      setVapiError(null);
      if (initialStream) {
        initialStream.getAudioTracks().forEach(t => t.enabled = isMicOn);
      }
      if (vapiRef.current) {
        try { vapiRef.current.setMuted(!isMicOn); } catch (e) {}
      }
    });

    vapi.on('call-end', () => {
      if (lifecycleId !== lifecycleIdRef.current) return;
      console.log(`[VAPI EVENT] call-end | phase: ${phaseName}`);
      setCallStatus('ended');
      setIsAiSpeaking(false);
      setIsListeningUser(false);
    });

    vapi.on('speech-start', () => {
      if (lifecycleId !== lifecycleIdRef.current) return;
      setIsAiSpeaking(true);
      setIsListeningUser(false);
    });

    vapi.on('speech-end', () => {
      if (lifecycleId !== lifecycleIdRef.current) return;
      setIsAiSpeaking(false);
      setIsListeningUser(true);
    });

    vapi.on('message', (message) => {
      if (lifecycleId !== lifecycleIdRef.current) return;
      const msgType = message?.type;
      const role = message?.role;
      const transcriptType = message?.transcriptType;

      if (msgType === 'transcript') {
        const text =
          typeof message === 'string'
            ? message
            : typeof message?.transcript === 'string'
              ? message.transcript
              : typeof message?.text === 'string'
                ? message.text
                : '';

        const isFinal = transcriptType === 'final';

        if (text && text.trim()) {
          const curTime = formatCountdown(totalSeconds - remainingRef.current);
          if (role === 'assistant') {
            setInterviewerCaption(text);
            setCurrentQuestionText(text);
            if (isFinal) {
              const entry = { sender: 'interviewer', text: text.trim(), time: curTime };
              setTranscript(prev => {
                const last = prev[prev.length - 1];
                if (last && last.sender === 'interviewer' && last.text === entry.text) return prev;
                const updated = [...prev, entry];
                transcriptRef.current = updated;
                return updated;
              });
            }
          } else if (role === 'user') {
            setUserCaption(text);
            if (isFinal) {
              const entry = { sender: 'candidate', text: text.trim(), time: curTime };
              setTranscript(prev => {
                const last = prev[prev.length - 1];
                if (last && last.sender === 'candidate' && last.text === entry.text) return prev;
                const updated = [...prev, entry];
                transcriptRef.current = updated;
                return updated;
              });
            }
          }
        }
      }
    });

    vapi.on('error', (err) => {
      if (lifecycleId !== lifecycleIdRef.current) return;
      const safeMsg = typeof err === 'string' ? err : (err?.error?.message || err?.message || '');
      if (safeMsg && !safeMsg.toLowerCase().includes('destroy') && !safeMsg.toLowerCase().includes('aborted')) {
        setVapiError('Voice Session Notice: ' + safeMsg);
      }
    });

    const sanitizeVar = (str, maxLen = 600) => {
      if (!str || typeof str !== 'string') return '';
      return str
        .replace(/[\r\n\t]+/g, ' ')
        .replace(/["'\\]/g, '')
        .replace(/[^\x20-\x7E]/g, '')
        .trim()
        .slice(0, maxLen);
    };

    const candidateName = sanitizeVar(currentUser?.fullName || 'Candidate', 100);
    const targetRole = sanitizeVar(interviewConfig?.targetRole || 'Software Engineer', 100);
    const difficulty = sanitizeVar(interviewConfig?.difficulty || 'Medium', 50);

    const variableValues = {};
    if (candidateName) variableValues.candidateName = candidateName;
    if (targetRole) variableValues.targetRole = targetRole;
    if (difficulty) variableValues.difficulty = difficulty;

    if (isCodingRound) {
      variableValues.problemTitle = sanitizeVar(activeProblem.title, 100);
      variableValues.codingPhase = phaseName;
      if (phaseName === 'DISCUSSION') {
        const isCompleted = executionMetrics.executionStatus === 'completed';
        variableValues.candidateCode = sanitizeVar(codeContent, 500);
        variableValues.testResultsSummary = isCompleted ? `${executionMetrics.testsPassed}/${executionMetrics.totalTests} tests passed` : 'Execution unavailable (Submission Mode)';
        variableValues.codeLanguage = codeLanguage;
      }
    }

    const assistantOverrides = Object.keys(variableValues).length > 0 ? { variableValues } : undefined;

    console.log(`[VAPI STARTING] phase: ${phaseName} | variables:`, variableValues);
    vapi.start(assistantId, assistantOverrides).then(() => {
      if (lifecycleId !== lifecycleIdRef.current) {
        try { vapi.stop(); } catch (e) {}
      }
    }).catch((err) => {
      if (lifecycleId !== lifecycleIdRef.current) return;
      console.warn('[VAPI START ERROR]', err);
      setCallStatus('error');
    });

  }, [currentUser, interviewConfig, isCodingRound, activeProblem, codeContent, codeLanguage, executionMetrics, totalSeconds, remainingSeconds, isMicOn, initialStream]);

  // Cleanly stop Vapi WebRTC session
  const stopVapiVoicePhase = useCallback(() => {
    lifecycleIdRef.current++;
    if (vapiRef.current) {
      try {
        vapiRef.current.removeAllListeners();
        vapiRef.current.stop();
      } catch (e) {}
      vapiRef.current = null;
    }
    setCallStatus('ended');
    setIsAiSpeaking(false);
    setIsListeningUser(false);
  }, []);

  // Initialize Vapi on mount or phase change
  useEffect(() => {
    if (!isCodingRound) {
      if (!isStartedRef.current) {
        isStartedRef.current = true;
        startVapiVoicePhase('NORMAL');
      }
      return () => { stopVapiVoicePhase(); };
    }

    // CODING ROUND PHASE ORCHESTRATION:
    if (codingPhase === 'INTRO') {
      startVapiVoicePhase('INTRO');
    } else if (codingPhase === 'CODING') {
      stopVapiVoicePhase(); // Vapi OFF during coding (0 Vapi cost!)
    } else if (codingPhase === 'DISCUSSION') {
      startVapiVoicePhase('DISCUSSION');
    } else if (codingPhase === 'EVALUATING') {
      stopVapiVoicePhase();
    }

    return () => {
      stopVapiVoicePhase();
    };
  }, [isCodingRound, codingPhase]);

  // Phase Transition Handlers
  const handleStartCodingPhase = () => {
    stopVapiVoicePhase();
    codingDeadlineRef.current = Date.now() + remainingSeconds * 1000;
    setCodingPhase('CODING');
    setConsoleOutput(`[PHASE SWITCH → CODING SANDBOX]\nVapi voice disconnected (0 API cost mode).\nTimer active. You may now program your solution below.`);
    saveCodingSession({ codingPhase: 'CODING', codingDeadline: codingDeadlineRef.current });
  };

  const handleSubmitSolutionPhase = () => {
    saveCodingSession({ codingPhase: 'DISCUSSION' });
    setCodingPhase('DISCUSSION');
    setConsoleOutput(`[PHASE SWITCH → SOLUTION DISCUSSION]\nSolution submitted successfully.\nConnecting Vapi Voice AI for post-solution technical discussion.`);
  };

  // Centralized Safe Interview End Handler
  const handleEndInterview = async () => {
    if (isEndingRef.current) return;
    isEndingRef.current = true;

    // 1. Stop Vapi call gracefully
    stopVapiVoicePhase();

    // 2. Wait for any pending final transcript events to settle
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 3. Stop camera/mic media tracks if active
    if (initialStream) {
      initialStream.getTracks().forEach(t => t.stop());
    }

    // 4. Capture final transcript & metrics
    const finalTranscript = transcriptRef.current || [];
    const elapsedSeconds = totalSeconds - remainingRef.current;

    const codingMetrics = {
      problemId: activeProblem.id,
      problemTitle: activeProblem.title,
      difficulty: activeProblem.difficulty,
      language: codeLanguage,
      codeContent,
      runCount,
      executionStatus: executionMetrics.executionStatus,
      testsPassed: executionMetrics.testsPassed,
      testsFailed: executionMetrics.testsFailed,
      totalTests: executionMetrics.totalTests,
      timeSpentSeconds: elapsedSeconds,
      telemetry
    };

    console.log('[INTERVIEW REPORT] Finalizing interview with metrics:', codingMetrics);

    onFinishInterview({
      elapsedSeconds,
      transcript: finalTranscript,
      codingMetrics
    });
  };

  // Timestamp-Based Clock Countdown Timer (Phase 7)
  useEffect(() => {
    const timer = setInterval(() => {
      if (codingDeadlineRef.current) {
        const diff = Math.max(0, Math.floor((codingDeadlineRef.current - Date.now()) / 1000));
        setRemainingSeconds(diff);
        if (diff <= 0) {
          clearInterval(timer);
          if (isCodingRound && codingPhase === 'CODING') {
            handleSubmitSolutionPhase();
          } else {
            handleEndInterview();
          }
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isCodingRound, codingPhase]);

  // Language Dropdown Selector Handler
  const handleLanguageChange = (newLang) => {
    setCodeLanguage(newLang);
    const codeSnippet = activeProblem?.boilerplate?.[newLang] || activeProblem?.boilerplate?.javascript || BOILERPLATE_CODE.javascript;
    setCodeContent(codeSnippet);
    
    if (newLang === 'javascript') {
      setConsoleOutput(`✓ Environment switched to JAVASCRIPT.\nWeb Worker Isolated Sandbox active for test execution.`);
      setExecutionMetrics({ executionStatus: 'pending', testsPassed: null, testsFailed: null, totalTests: testCases.length });
    } else {
      setConsoleOutput(`⚠️ Environment switched to ${newLang.toUpperCase()}.\nNotice: Multi-language execution sandbox is disabled in this environment. Code saved for submission & AI code review.`);
      setExecutionMetrics({ executionStatus: 'unavailable', testsPassed: null, testsFailed: null, totalTests: testCases.length });
    }
    
    setTelemetry(prev => ({ ...prev, languageChanges: prev.languageChanges + 1 }));
    saveCodingSession({ codeLanguage: newLang, codeContent: codeSnippet });
  };

  // Custom Test Case Add Handler
  const handleAddTestCase = () => {
    if (!customInput.trim()) return;
    const newCase = {
      id: Date.now(),
      name: `Test ${testCases.length + 1}`,
      input: customInput.trim(),
      expected: customExpected.trim() || 'Expected Output',
      status: 'pending'
    };
    const updated = [...testCases, newCase];
    setTestCases(updated);
    setCustomInput('');
    setCustomExpected('');
    setShowAddTest(false);
    saveCodingSession({ testCases: updated });
  };

  // Isolated Web Worker JS Sandbox Execution Helper (Phase 6)
  const runJsInWorker = (code, fnName, currentTestCases, timeoutMs = 2000) => {
    return new Promise((resolve) => {
      const workerBlob = new Blob([`
        self.onmessage = function(e) {
          const { code, fnName, testCases } = e.data;
          try {
            const userFn = new Function(code + "\\nreturn " + (fnName || "solveProblem") + ";")();
            if (typeof userFn !== 'function') {
              self.postMessage({ success: false, error: (fnName || "solveProblem") + " function is not defined." });
              return;
            }
            let passedCount = 0;
            const results = testCases.map(t => {
              try {
                const args = t.args || [];
                const res = userFn(...args);
                const resStr = JSON.stringify(res);
                const isPass = resStr === t.expected || String(res) === t.expected;
                if (isPass) passedCount++;
                return { ...t, status: isPass ? 'pass' : 'fail', actual: resStr };
              } catch (err) {
                return { ...t, status: 'fail', error: err.message };
              }
            });
            self.postMessage({ success: true, results, passedCount, totalCount: testCases.length });
          } catch (err) {
            self.postMessage({ success: false, error: err.message });
          }
        };
      `], { type: 'application/javascript' });

      const workerUrl = URL.createObjectURL(workerBlob);
      const worker = new Worker(workerUrl);

      let isSettled = false;
      const timer = setTimeout(() => {
        if (!isSettled) {
          isSettled = true;
          worker.terminate();
          URL.revokeObjectURL(workerUrl);
          resolve({ executionStatus: 'timeout', error: 'Execution Timed Out (Possible Infinite Loop exceeded 2000ms limit).' });
        }
      }, timeoutMs);

      worker.onmessage = (e) => {
        if (isSettled) return;
        isSettled = true;
        clearTimeout(timer);
        worker.terminate();
        URL.revokeObjectURL(workerUrl);

        if (e.data.success) {
          resolve({
            executionStatus: 'completed',
            results: e.data.results,
            passedCount: e.data.passedCount,
            totalCount: e.data.totalCount
          });
        } else {
          resolve({
            executionStatus: 'error',
            error: e.data.error
          });
        }
      };

      worker.onerror = (err) => {
        if (isSettled) return;
        isSettled = true;
        clearTimeout(timer);
        worker.terminate();
        URL.revokeObjectURL(workerUrl);
        resolve({ executionStatus: 'error', error: err.message });
      };

      worker.postMessage({ code, fnName: activeProblem.fnName || 'solveProblem', testCases: currentTestCases });
    });
  };

  // Run Code Test Suite Execution Handler (Phase 5 & 6)
  const handleRunCodeWithTests = async () => {
    const newRunCount = runCount + 1;
    setRunCount(newRunCount);
    setIsAnalyzingCode(true);

    const now = new Date().toISOString();
    setTelemetry(prev => ({
      ...prev,
      firstRunAt: prev.firstRunAt || now,
      lastRunAt: now,
      runCount: newRunCount
    }));

    if (codeLanguage !== 'javascript') {
      setIsAnalyzingCode(false);
      const outputText = 
        `⚠️ Language Execution Notice (${codeLanguage.toUpperCase()}):\n` +
        `Multi-language sandbox execution (Python, C++, Java, SQL) is currently disabled in this environment.\n` +
        `Your code has been saved for solution discussion and qualitative AI code review.\n\n` +
        `Status: Editor & Submission Mode Active (No automated test execution).`;

      setConsoleOutput(outputText);
      setExecutionMetrics({
        executionStatus: 'unavailable',
        testsPassed: null,
        testsFailed: null,
        totalTests: testCases.length
      });
      saveCodingSession({ runCount: newRunCount });
      return;
    }

    setConsoleOutput(`Compiling JavaScript code and executing test suite inside isolated Web Worker sandbox...`);
    const evalRes = await runJsInWorker(codeContent, activeProblem.fnName, testCases);
    setIsAnalyzingCode(false);

    if (evalRes.executionStatus === 'completed') {
      const updatedTests = evalRes.results;
      setTestCases(updatedTests);
      const allPassed = evalRes.passedCount === evalRes.totalCount;

      const outputText = 
        `${allPassed ? '✓' : '✕'} Test Suite Results (${evalRes.passedCount}/${evalRes.totalCount} Passed):\n` +
        updatedTests.map(t => `  ${t.status === 'pass' ? '✓' : '✕'} ${t.name}: (${t.input}) → Expected: ${t.expected} | Status: ${t.status.toUpperCase()}`).join('\n') +
        `\n\n🤖 Web Worker Isolated Execution Output:\n- Problem: ${activeProblem.title}\n- Environment: JS Web Worker Sandbox\n- Status: ${allPassed ? '100% Passed Test Suite' : `${evalRes.passedCount}/${evalRes.totalCount} Passed`}`;

      setConsoleOutput(outputText);
      setExecutionMetrics({
        executionStatus: 'completed',
        testsPassed: evalRes.passedCount,
        testsFailed: evalRes.totalCount - evalRes.passedCount,
        totalTests: evalRes.totalCount
      });
      saveCodingSession({ testCases: updatedTests, runCount: newRunCount });
    } else if (evalRes.executionStatus === 'timeout') {
      setConsoleOutput(`❌ Execution Timeout (2000ms Limit Exceeded):\n${evalRes.error}\n\n🤖 Sandbox Safeguard: Worker process terminated to prevent infinite loop.`);
      setExecutionMetrics({
        executionStatus: 'timeout',
        error: evalRes.error,
        testsPassed: null,
        testsFailed: null,
        totalTests: testCases.length
      });
      saveCodingSession({ runCount: newRunCount });
    } else {
      setConsoleOutput(`❌ Execution Error:\n${evalRes.error}\n\n🤖 Syntax Warning: Please fix execution error before submitting.`);
      setExecutionMetrics({
        executionStatus: 'error',
        error: evalRes.error,
        testsPassed: null,
        testsFailed: null,
        totalTests: testCases.length
      });
      saveCodingSession({ runCount: newRunCount });
    }
  };

  return (
    <div className="live-studio-container full-viewport-locked" ref={containerRef}>
      
      {/* Tab Switch Warning Overlay */}
      {tabSwitchWarning && (
        <div className="tab-warning-banner">
          <div className="warning-content">
            <AlertTriangle size={20} className="warning-icon" />
            <span>
              <strong>Warning ({tabSwitchCount} alert):</strong> Tab switching or leaving window is restricted during live interview!
            </span>
            <button className="dismiss-warning-btn" onClick={() => setTabSwitchWarning(false)}>
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* Vapi Error Notice Banner */}
      {vapiError && (
        <div className="tab-warning-banner" style={{ background: 'rgba(239, 68, 68, 0.95)', borderBottom: '1px solid #dc2626' }}>
          <div className="warning-content" style={{ color: '#fff' }}>
            <AlertCircle size={20} />
            <span><strong>Voice Session Notice:</strong> {vapiError}</span>
            <button className="dismiss-warning-btn" style={{ background: '#fff', color: '#dc2626' }} onClick={() => setVapiError(null)}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 1: TECHNICAL INTERVIEW WORKSPACE                                     */}
      {/* ========================================================================= */}
      {isTechnicalRound && (
        <div className="studio-workspace technical-workspace">
          <header className="studio-header">
            <div className="header-left">
              <button className="exit-btn" onClick={handleEndInterview}>
                ← Exit Session
              </button>
              <div className="header-title-group">
                <span className="round-badge technical">Round 2 • Technical Interview</span>
                <h2 className="header-title">{interviewConfig?.targetRole || 'Software Engineer'} Technical Stage</h2>
              </div>
            </div>
            <div className="header-right">
              <div className="timer-badge">
                <Clock size={16} /> {formatCountdown(remainingSeconds)}
              </div>
            </div>
          </header>

          <main className="studio-main-grid">
            <div className="main-stage-col">
              <div className="card-base video-stage-card">
                <div className="stage-card-header">
                  <span className="card-title">Technical Interview Session</span>
                  <span className="status-badge live">
                    {isAiSpeaking ? 'AI Speaking' : (isListeningUser ? 'Listening...' : 'Connected')}
                  </span>
                </div>

                <div className="stage-video-grid">
                  <div className="video-box candidate-box">
                    <video ref={videoRef} autoPlay playsInline muted className="webcam-feed" />
                    {!isVideoOn && (
                      <div className="video-off-notice">
                        <User size={40} />
                        <span>Camera Turned Off</span>
                      </div>
                    )}
                    <div className="video-audio-level">
                      <span className={`level-bar ${isListeningUser ? 'active' : ''}`} />
                      <span className="level-text">{isListeningUser ? 'Listening...' : 'Mic Ready'}</span>
                    </div>
                  </div>

                  <div className="video-box ai-avatar-box">
                    <div className={`avatar-ring ${isAiSpeaking ? 'speaking' : ''}`}>
                      <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80" alt="AI Technical Lead" />
                    </div>
                    <div className="ai-meta">
                      <h4>Alex Turner</h4>
                      <span>Senior AI Technical Lead</span>
                    </div>
                    {isAiSpeaking && (
                      <div className="speaking-wave">
                        <span /><span /><span />
                        <span>AI Speaking...</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="media-controls-bar">
                  <button className={`media-btn ${isVideoOn ? 'on' : 'off'}`} onClick={toggleVideo}>
                    {isVideoOn ? <Video size={16} /> : <VideoOff size={16} />} Camera {isVideoOn ? 'On' : 'Off'}
                  </button>
                  <button className={`media-btn ${isMicOn ? 'on' : 'off'}`} onClick={toggleMic}>
                    {isMicOn ? <Mic size={16} /> : <MicOff size={16} />} Mic {isMicOn ? 'On' : 'Off'}
                  </button>
                </div>
              </div>

              <div className="card-base action-controls-card">
                <div className="action-buttons-flex">
                  <button className={`primary-action-btn ${isMicOn ? '' : 'muted'}`} onClick={toggleMic}>
                    {isMicOn ? <Mic size={18} /> : <MicOff size={18} />} {isMicOn ? (isListeningUser ? 'Listening...' : 'Mic Active') : 'Mic Muted'}
                  </button>
                  <button className="end-session-btn" onClick={handleEndInterview}>
                    <PhoneOff size={18} /> End Interview
                  </button>
                </div>
              </div>

              <div className="card-base focus-areas-card">
                <div className="card-title-sm"><Code2 size={16} /> Core Technical Assessment Focus</div>
                <div className="focus-grid">
                  <div className="focus-item"><Code2 size={16} /> Fundamentals</div>
                  <div className="focus-item"><Network size={16} /> System Design</div>
                  <div className="focus-item"><Brain size={16} /> Problem Solving</div>
                  <div className="focus-item"><Database size={16} /> Architecture</div>
                </div>
              </div>
            </div>

            <div className="sidebar-stage-col">
              <div className="card-base transcript-sidebar-card">
                <div className="card-header-flex">
                  <span className="card-title"><MessageSquare size={16} /> Live Transcript</span>
                  <span className="count-badge">{transcript.length} entries</span>
                </div>
                <div className="transcript-scroll-list">
                  {transcript.map((t, idx) => (
                    <div key={idx} className={`t-entry ${t.sender}`}>
                      <div className="t-entry-header">
                        {t.sender === 'interviewer' ? <Bot size={13} /> : <User size={13} />}
                        <strong>{t.sender === 'interviewer' ? 'Alex (AI)' : 'Candidate'}</strong>
                        <span>{t.time}</span>
                      </div>
                      <p className="t-entry-text">{t.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-base ai-scorecard-card">
                <div className="card-title-sm"><Sparkles size={16} /> Active Question Prompt</div>
                <p className="scorecard-hint">
                  {interviewerCaption || currentQuestionText}
                </p>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: HR & BEHAVIORAL WORKSPACE                                         */}
      {/* ========================================================================= */}
      {isHrRound && (
        <div className="studio-workspace hr-workspace">
          <header className="studio-header">
            <div className="header-left">
              <button className="exit-btn" onClick={handleEndInterview}>
                ← Exit Session
              </button>
              <div className="header-title-group">
                <span className="round-badge hr">Round 1 • HR Screening</span>
                <h2 className="header-title">Behavioral & Cultural Fit Assessment</h2>
              </div>
            </div>
            <div className="header-right">
              <span className="question-progress-pill">Question {currentQuestionNumber} of 5</span>
              <div className="timer-badge">
                <Clock size={16} /> {formatCountdown(remainingSeconds)}
              </div>
            </div>
          </header>

          <main className="studio-main-grid">
            <div className="main-stage-col">
              <div className="card-base hr-question-banner-card">
                <span className="question-num-tag">CURRENT BEHAVIORAL QUESTION</span>
                <h3 className="active-question-text">{interviewerCaption || currentQuestionText}</h3>
              </div>

              <div className="card-base hr-video-stage-card">
                <div className="hr-avatar-central">
                  <div className={`avatar-ring large ${isAiSpeaking ? 'speaking' : ''}`}>
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80" alt="HR Interviewer" />
                  </div>
                  <div className="ai-meta">
                    <h3>Sarah Jenkins</h3>
                    <span>Head of Talent & Culture</span>
                  </div>
                  {isAiSpeaking ? (
                    <div className="speaking-wave"><span /><span /><span /><span>AI Interviewer Speaking...</span></div>
                  ) : (
                    <div className="listening-indicator">
                      <span className={`dot-green ${isListeningUser ? 'pulse' : ''}`} /> 
                      {isListeningUser ? 'Listening to your response...' : 'Ready for your answer'}
                    </div>
                  )}
                </div>

                <div className="hr-pip-webcam">
                  <video ref={videoRef} autoPlay playsInline muted className="pip-feed" />
                </div>
              </div>

              <div className="card-base hr-control-dock-card">
                <div className="dock-input-row">
                  <button className={`mic-trigger-btn ${isMicOn ? 'active' : ''}`} onClick={toggleMic}>
                    {isMicOn ? <Mic size={18} /> : <MicOff size={18} />} {isMicOn ? 'Mic Active' : 'Mic Muted'}
                  </button>
                  <button className="dock-submit-btn end-session-btn" onClick={handleEndInterview}>
                    <PhoneOff size={16} /> End Interview
                  </button>
                </div>
              </div>

            </div>

            <div className="sidebar-stage-col">
              <div className="card-base transcript-sidebar-card">
                <div className="card-header-flex">
                  <span className="card-title"><MessageSquare size={16} /> HR Interview Log</span>
                  <span className="count-badge">{transcript.length} turns</span>
                </div>
                <div className="transcript-scroll-list">
                  {transcript.map((t, idx) => (
                    <div key={idx} className={`t-entry ${t.sender}`}>
                      <div className="t-entry-header">
                        <strong>{t.sender === 'interviewer' ? 'Sarah (HR)' : 'Candidate'}</strong>
                        <span>{t.time}</span>
                      </div>
                      <p className="t-entry-text">{t.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: PHASE-BASED CODING INTERVIEW WORKSPACE                            */}
      {/* ========================================================================= */}
      {isCodingRound && (
        <div className="studio-workspace coding-workspace">
          {/* Top Header Bar */}
          <header className="coding-header">
            <div className="header-left">
              <button className="exit-btn" onClick={handleEndInterview}>
                ← Exit Session
              </button>
              <div className="header-title-group">
                <span className="round-badge coding">Round 3 • Coding Sandbox</span>
                <h2 className="header-title">Data Structures & Algorithm Assessment</h2>
              </div>
            </div>

            <div className="header-actions">
              {/* Phase Banner Badge */}
              <div className={`phase-status-badge ${codingPhase.toLowerCase()}`}>
                {codingPhase === 'INTRO' && <><Volume2 size={14} /> Phase 1: Problem Intro (Voice ON)</>}
                {codingPhase === 'CODING' && <><VolumeX size={14} /> Phase 2: Independent Coding (Voice OFF - 0 Cost)</>}
                {codingPhase === 'DISCUSSION' && <><MessageSquare size={14} /> Phase 3: Solution Discussion (Voice ON)</>}
              </div>

              {/* Autosave Indicator */}
              <div className="autosave-badge">
                {autosaveStatus === 'saving' ? (
                  <><RefreshCw size={13} className="spin" /> Saving...</>
                ) : autosaveStatus === 'saved' ? (
                  <><CheckCircle2 size={13} color="#10b981" /> Cloud Saved {lastSavedTime ? `at ${lastSavedTime}` : ''}</>
                ) : (
                  <><ShieldAlert size={13} color="#f59e0b" /> Local Cache Active</>
                )}
              </div>

              <div className="timer-badge"><Clock size={16} /> {formatCountdown(remainingSeconds)}</div>
              
              {/* Dynamic Language Selector Dropdown */}
              <select className="lang-select" value={codeLanguage} onChange={(e) => handleLanguageChange(e.target.value)}>
                <option value="javascript">JavaScript (Worker Sandbox)</option>
                <option value="python">Python 3 (Editor Mode)</option>
                <option value="cpp">C++ 17 (Editor Mode)</option>
                <option value="java">Java 17 (Editor Mode)</option>
                <option value="sql">SQL Query (Editor Mode)</option>
              </select>

              {/* Phase Control Action Buttons */}
              {codingPhase === 'INTRO' && (
                <button className="run-code-btn" style={{ background: '#10b981' }} onClick={handleStartCodingPhase}>
                  <Play size={15} /> Start Coding Challenge (Voice Off)
                </button>
              )}

              {codingPhase === 'CODING' && (
                <>
                  <button className="run-code-btn" onClick={handleRunCodeWithTests} disabled={isAnalyzingCode}>
                    <Play size={15} /> Run Code
                  </button>
                  <button className="submit-code-btn" onClick={handleSubmitSolutionPhase}>
                    <Send size={15} /> Submit Solution
                  </button>
                </>
              )}

              {codingPhase === 'DISCUSSION' && (
                <button className="submit-code-btn" style={{ background: '#6366f1' }} onClick={handleEndInterview}>
                  <CheckSquare size={15} /> Finish & Generate Report
                </button>
              )}
            </div>
          </header>

          {/* Main IDE 2-Pane Split */}
          <div className="coding-ide-container">
            {/* Left Pane (400px): Interactive Problem Tabs */}
            <div className="problem-pane card-base">
              <div className="pane-tabs-header">
                <button type="button" className={`tab-btn ${activeProblemTab === 'description' ? 'active' : ''}`} onClick={() => setActiveProblemTab('description')}>Description</button>
                <button type="button" className={`tab-btn ${activeProblemTab === 'examples' ? 'active' : ''}`} onClick={() => setActiveProblemTab('examples')}>Examples</button>
                <button type="button" className={`tab-btn ${activeProblemTab === 'constraints' ? 'active' : ''}`} onClick={() => setActiveProblemTab('constraints')}>Constraints</button>
                <button type="button" className={`tab-btn ${activeProblemTab === 'testcases' ? 'active' : ''}`} onClick={() => setActiveProblemTab('testcases')}>Test Suite ({testCases.length})</button>
              </div>

              <div className="problem-pane-content">
                
                {/* TAB 1: Description */}
                {activeProblemTab === 'description' && (
                  <div className="tab-pane-view">
                    <h3 className="problem-title-text">{activeProblem.title}</h3>
                    <span className={`diff-pill ${activeProblem.difficulty.toLowerCase().includes('easy') ? 'easy' : (activeProblem.difficulty.toLowerCase().includes('hard') || activeProblem.difficulty.toLowerCase().includes('faang') ? 'hard' : 'medium')}`}>
                      {activeProblem.difficulty}
                    </span>

                    <p className="p-desc" style={{ whiteSpace: 'pre-line' }}>
                      {activeProblem.description}
                    </p>

                    <div className="p-section">
                      <h4>💡 Problem Category:</h4>
                      <ul>
                        <li>Category: <strong>{activeProblem.category}</strong></li>
                        <li>Optimal Time & Space Complexity expected.</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* TAB 2: Examples */}
                {activeProblemTab === 'examples' && (
                  <div className="tab-pane-view">
                    {activeProblem.examples.map((ex, idx) => (
                      <div key={idx} className="p-section">
                        <h4>Example {idx + 1}:</h4>
                        <pre>Input: {ex.input}{"\n"}Output: {ex.output}{"\n"}{ex.explanation ? `Explanation: ${ex.explanation}` : ''}</pre>
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 3: Constraints */}
                {activeProblemTab === 'constraints' && (
                  <div className="tab-pane-view">
                    <div className="p-section">
                      <h4>Problem Constraints:</h4>
                      <ul>
                        {activeProblem.constraints.map((c, idx) => (
                          <li key={idx}><code>{c}</code></li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* TAB 4: Interactive Test Cases & Custom Test Case Form */}
                {activeProblemTab === 'testcases' && (
                  <div className="tab-pane-view">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h4 style={{ margin: 0, fontSize: '0.9rem', color: 'white' }}>Test Suite</h4>
                      <button type="button" className="add-testcase-btn" onClick={() => setShowAddTest(!showAddTest)}>
                        {showAddTest ? 'Cancel' : '+ Add Test Case'}
                      </button>
                    </div>

                    {/* Form to Add Custom Test Case */}
                    {showAddTest && (
                      <div className="add-test-form-box">
                        <label>Input (e.g. nums = [1, 5, 9], target = 14):</label>
                        <input 
                          type="text" 
                          placeholder="nums = [1, 5, 9], target = 14"
                          value={customInput} 
                          onChange={(e) => setCustomInput(e.target.value)}
                        />
                        <label>Expected Output (e.g. [1, 2]):</label>
                        <input 
                          type="text" 
                          placeholder="[1, 2]"
                          value={customExpected} 
                          onChange={(e) => setCustomExpected(e.target.value)}
                        />
                        <button type="button" className="save-test-btn" onClick={handleAddTestCase}>Add Case</button>
                      </div>
                    )}

                    {/* Test Cases List */}
                    <div className="test-cases-list">
                      {testCases.map(t => (
                        <div key={t.id} className="test-case-item">
                          <div className="tc-header">
                            <strong>{t.name}</strong>
                            <span className={`tc-status-pill ${t.status}`}>
                              {t.status === 'pass' ? '✓ Passed' : t.status === 'fail' ? '✕ Failed' : '● Pending'}
                            </span>
                          </div>
                          <div className="tc-detail">
                            <code>Input: {t.input}</code>
                          </div>
                          <div className="tc-detail">
                            <code>Expected: {t.expected}</code>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Right Pane (Flex-1): Editor & Test Runner Console */}
            <div className="editor-pane card-base">
              <div className="editor-area">
                <div className="line-numbers-col">
                  {codeContent.split('\n').map((_, idx) => <span key={idx}>{idx + 1}</span>)}
                </div>
                <textarea 
                  className="code-textarea"
                  value={codeContent}
                  onChange={(e) => setCodeContent(e.target.value)}
                  spellCheck="false"
                />
              </div>

              {/* Bottom Console Runner */}
              <div className="console-runner-box">
                <div className="console-title"><Terminal size={14} /> Isolated Execution Console ({codeLanguage === 'javascript' ? 'Web Worker Sandbox' : 'Editor & Submission Mode'})</div>
                <pre className="console-output">{consoleOutput}</pre>
              </div>
            </div>
          </div>

          {/* Floating Candidate PIP Webcam */}
          <div className="floating-pip-webcam card-base">
            <div className="pip-header">Candidate Cam</div>
            <video ref={videoRef} autoPlay playsInline muted className="pip-video-stream" />
          </div>

          {/* Slide-Out Transcript Drawer */}
          <div className={`transcript-drawer ${showTranscript ? 'open' : ''}`}>
            <button className="drawer-toggle-btn" onClick={() => setShowTranscript(!showTranscript)}>
              <MessageSquare size={16} /> {showTranscript ? 'Close Transcript' : `Transcript (${transcript.length})`}
            </button>
            {showTranscript && (
              <div className="drawer-content">
                {transcript.map((t, idx) => (
                  <div key={idx} className={`t-entry ${t.sender}`}>
                    <strong>{t.sender === 'interviewer' ? 'AI' : 'You'}:</strong> {t.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
