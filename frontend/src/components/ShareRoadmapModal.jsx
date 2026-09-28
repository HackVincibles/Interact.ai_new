import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Copy, Check, Download, Link as LinkIcon, Share2, Lock } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import './ShareRoadmapModal.css';

export default function ShareRoadmapModal({ isOpen, onClose, activeDomain, progress }) {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);



  const shareUrl = activeDomain ? `${window.location.origin}/career-paths?domain=${activeDomain.id}` : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      alert("Failed to copy link.");
    });
  };

  const handleDownloadQR = () => {
    if (!qrRef.current) return;
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `roadmap-qr-${activeDomain?.id || 'share'}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${activeDomain?.title} Roadmap`,
        text: `Check out my progress on the ${activeDomain?.title} roadmap!`,
        url: shareUrl,
      }).catch((err) => {
        if (err.name !== 'AbortError') {
          console.warn('Native share failed:', err);
        }
      });
    }
  };

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen || !activeDomain) return null;

  return createPortal(
    <div className="share-modal-overlay animate-fade-in" onClick={onClose}>
      <div className="share-modal-container" onClick={e => e.stopPropagation()}>
        <div className="share-modal-header">
          <div className="header-title">
            <div className="share-icon-wrapper">
              <Share2 size={20} />
            </div>
            <h2>Share Your Roadmap</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="share-modal-body">
          <p className="share-description">
            Let others view your career roadmap and current learning progress.
          </p>

          <div className="roadmap-preview-card">
            <h4 className="preview-title">{activeDomain.title}</h4>
            <p className="preview-stats">
              {activeDomain.stages.length} milestones • {progress}% complete
            </p>
          </div>

          <div className="share-url-container">
            <div className="url-input-group">
              <div className="url-icon"><LinkIcon size={16} /></div>
              <input type="text" value={shareUrl} readOnly className="url-input" />
              <button 
                className={`copy-url-btn ${copied ? 'copied' : ''}`} 
                onClick={handleCopyLink}
              >
                {copied ? (
                  <><Check size={16} /> Copied</>
                ) : (
                  <><Copy size={16} /> Copy</>
                )}
              </button>
            </div>
          </div>

          <div className="qr-section">
            <div className="qr-code-wrapper" ref={qrRef}>
              <QRCodeCanvas 
                value={shareUrl} 
                size={180} 
                bgColor={"#ffffff"}
                fgColor={"#111827"}
                level={"H"}
                includeMargin={true}
              />
            </div>
            <p className="qr-helper-text">Scan to open roadmap directly</p>
            
            <div className="qr-actions">
              <button className="btn-outline-secondary" onClick={handleDownloadQR}>
                <Download size={16} /> Download QR
              </button>
              {navigator.share && (
                <button className="btn-outline-secondary" onClick={handleNativeShare}>
                  <Share2 size={16} /> Share Link
                </button>
              )}
            </div>
          </div>

          <div className="share-privacy-note">
            <Lock size={14} className="privacy-icon" />
            <span>Anyone with the link can view this shared roadmap</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
