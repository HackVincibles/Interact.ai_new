import { CertificateModel } from '../models/certificateModel.js';
import { InterviewModel } from '../models/interviewModel.js';
import crypto from 'crypto';

function generateVerificationId() {
  return 'IA-' + new Date().getFullYear() + '-' + crypto.randomBytes(3).toString('hex').toUpperCase();
}

export const checkAndIssueInterviewCertificates = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user.id;

    if (!sessionId) {
      return res.status(400).json({ message: 'Missing sessionId' });
    }

    const interview = await InterviewModel.getInterviewById(sessionId);
    if (!interview || interview.user_id !== userId) {
      return res.status(404).json({ message: 'Interview not found or unauthorized' });
    }

    const issuedCertificates = [];
    
    let compType = 'INTERVIEW_COMPLETION';
    let perfType = 'INTERVIEW_PERFORMANCE';
    let compTitle = 'AI Mock Interview Completion';
    let perfTitle = 'Outstanding Interview Performance';
    let compDesc = 'Successfully completed a comprehensive AI-driven mock interview.';
    let perfDesc = 'Demonstrated exceptional skills and achieved a high score in an AI-driven mock interview.';
    let compAchieve = `Completed ${interview.target_role || 'Mock'} Interview`;
    let perfAchieve = `Scored ${interview.score}% in ${interview.target_role || 'Mock'} Interview`;

    if (interview.round_type === 'GD') {
      compType = 'GD_COMPLETION';
      perfType = 'GD_PERFORMANCE';
      compTitle = 'Group Discussion Completion';
      perfTitle = 'Outstanding GD Performance';
      compDesc = 'Successfully participated in and completed an AI-driven Group Discussion.';
      perfDesc = 'Demonstrated exceptional communication and teamwork in a Group Discussion.';
      compAchieve = `Completed GD for ${interview.target_role || 'Mock'} Role`;
      perfAchieve = `Scored ${interview.score}% in Group Discussion`;
    } else if (interview.round_type === 'Coding') {
      compType = 'CODING_COMPLETION';
      perfType = 'CODING_PERFORMANCE';
      compTitle = 'Coding Assessment Completion';
      perfTitle = 'Outstanding Coding Performance';
      compDesc = 'Successfully completed a rigorous AI-driven coding assessment.';
      perfDesc = 'Demonstrated exceptional problem-solving and coding skills.';
      compAchieve = `Completed Coding Round for ${interview.target_role || 'Mock'} Role`;
      perfAchieve = `Scored ${interview.score}% in Coding Assessment`;
    }

    // 1. Completion Certificate
    const completionCert = await CertificateModel.createCertificate({
      userId,
      certificateType: compType,
      title: compTitle,
      description: compDesc,
      achievement: compAchieve,
      score: null,
      sourceSessionId: sessionId,
      verificationId: generateVerificationId()
    });
    issuedCertificates.push(completionCert);

    // 2. Performance Certificate (e.g., score >= 75)
    if (interview.score >= 75) {
      const performanceCert = await CertificateModel.createCertificate({
        userId,
        certificateType: perfType,
        title: perfTitle,
        description: perfDesc,
        achievement: perfAchieve,
        score: interview.score,
        sourceSessionId: sessionId,
        verificationId: generateVerificationId()
      });
      issuedCertificates.push(performanceCert);
    }

    res.status(200).json({ success: true, issuedCertificates });
  } catch (err) {
    console.error('Error in checkAndIssueInterviewCertificates:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMyCertificates = async (req, res) => {
  try {
    const userId = req.user.id;
    const certificates = await CertificateModel.getCertificatesByUserId(userId);
    res.status(200).json({ success: true, certificates });
  } catch (err) {
    console.error('Error in getMyCertificates:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const verifyCertificate = async (req, res) => {
  try {
    const { verificationId } = req.params;
    const certificate = await CertificateModel.getCertificateByVerificationId(verificationId);
    
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    res.status(200).json({ success: true, certificate });
  } catch (err) {
    console.error('Error in verifyCertificate:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
