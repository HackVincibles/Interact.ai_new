import React, { useState, useEffect } from 'react';
import { ShieldCheck, Award, Calendar, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import './VerifyCertificatePage.css';

export default function VerifyCertificatePage({ verificationId, onNavigate }) {
  const [loading, setLoading] = useState(true);
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/certificates/verify/${verificationId}`);
        const data = await res.json();
        
        if (res.ok && data.success) {
          setCertificate(data.certificate);
        } else {
          setError(data.message || 'Certificate Not Found');
        }
      } catch (err) {
        setError('Connection Error');
      } finally {
        setLoading(false);
      }
    };
    
    verify();
  }, [verificationId]);

  if (loading) {
    return (
      <div className="verify-page-container">
        <div className="verify-card loading">
           <h2>Verifying...</h2>
           <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="verify-page-container">
        <div className="verify-card error">
           <AlertCircle size={48} color="var(--accent-red)" />
           <h2>Certificate Not Found</h2>
           <p>{error}</p>
           <button className="btn-primary-purple" onClick={() => onNavigate('home')}>Go to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="verify-page-container">
      <div className="verify-actions no-print">
         <button className="btn-primary-purple" onClick={() => window.print()}>
            <Download size={16} /> Download as PDF
         </button>
      </div>
      <div className="verify-card success certificate-layout">
        <div className="cert-border">
          <div className="cert-header">
             <img src="/logo.svg" alt="InteractAI Logo" style={{height: '40px'}} onError={(e) => e.target.style.display='none'}/>
             <h2>InteractAI</h2>
          </div>
          
          <div className="cert-body">
             <h3>CERTIFICATE OF ACHIEVEMENT</h3>
             <p className="cert-presented-to">This is proudly presented to</p>
             <h1 className="cert-recipient">{certificate.recipient_name}</h1>
             
             <p className="cert-description">For successfully completing the</p>
             <h2 className="cert-title">{certificate.title}</h2>
             
             <p className="cert-achievement">{certificate.achievement}</p>
          </div>
          
          <div className="cert-footer">
             <div className="cert-date">
                <span className="value">{new Date(certificate.issued_at).toLocaleDateString()}</span>
                <span className="label">Date Issued</span>
             </div>
             
             <div className="cert-qr">
                <QRCodeSVG 
                  value={`${window.location.origin}/verify/${certificate.verification_id}`} 
                  size={80} 
                  level="M" 
                  includeMargin={false}
                />
                <span className="cert-id">ID: {certificate.verification_id}</span>
             </div>
             
             <div className="cert-signature">
                <div className="signature-line"></div>
                <span className="label">InteractAI Platform</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
