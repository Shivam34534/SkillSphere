import React, { useState } from 'react';
import { Star, X, Send, ShieldAlert } from 'lucide-react';
import { API_URL } from '../config';
import { useSelector } from 'react-redux';

const ReviewModal = ({ isOpen, onClose, revieweeId, revieweeName, matchId, gigId, onReviewPosted }) => {
  const { token } = useSelector((state) => state.auth);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ revieweeId, rating, comment, matchId, gigId })
      });

      if (response.ok) {
        alert('Review posted successfully!');
        if (onReviewPosted) onReviewPosted();
        onClose();
      }
    } catch (error) {
      alert('Failed to post review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="glass-card w-full max-w-md p-8 relative animate-in zoom-in duration-300">
        <button onClick={onClose} className="absolute top-6 right-6 text-text-muted hover:text-white transition-colors">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">Rate your experience</h2>
        <p className="text-sm text-text-muted mb-8">How was your session with <strong>{revieweeName}</strong>?</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex justify-center gap-3 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-transform hover:scale-110"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <Star
                  size={40}
                  className={`${(hover || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-white/10'}`}
                />
              </button>
            ))}
          </div>

          <div>
            <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2 block">Your Feedback</label>
            <textarea
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-primary outline-none min-h-[120px] text-sm"
              placeholder="What went well? What could be improved?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-3 font-bold">
            {loading ? <div className="spinner-sm"></div> : <><Send size={18} /> Submit Review</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
