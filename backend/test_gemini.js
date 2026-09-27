import 'dotenv/config';
import { LangGraphInterviewService } from './src/services/langgraphInterviewService.js';

(async () => {
  try {
    const report = await LangGraphInterviewService.generateFinalReport({
      sessionId: 'TEST',
      answersHistory: [{"sender": "interviewer", "text": "What is Node.js?"}, {"sender": "candidate", "text": "Node.js is a JavaScript runtime built on Chromes V8 engine."}]
    });
    console.log("REPORT:", report);
  } catch(e) {
    console.error("ERROR:", e);
  }
})();
