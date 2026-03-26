import { useEffect, useRef } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

export default function WebcamProctor({ examId }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    let interval;
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        // Capture snapshot every 10 seconds
        interval = setInterval(() => captureSnapshot(), 10000);
      })
      .catch((err) => console.error('Webcam error:', err));

    return () => {
      clearInterval(interval);
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const captureSnapshot = async () => {
    if (!videoRef.current || !user || !examId) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        const path = `snapshots/${examId}/${user.uid}/${Date.now()}.jpg`;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, blob);
        const imageUrl = await getDownloadURL(storageRef);
        await addDoc(collection(db, 'snapshots'), {
          userId: user.uid,
          examId,
          imageUrl,
          timestamp: serverTimestamp(),
        });
      } catch (e) {
        console.error('Snapshot upload failed:', e);
      }
    }, 'image/jpeg', 0.6);
  };

  return (
    <div className="fixed top-16 right-4 z-40
                    w-44 h-28 rounded-xl overflow-hidden
                    border border-outline-variant/30
                    shadow-lg bg-surface-highest">
      <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2
                      flex items-center gap-1 px-2 py-0.5 rounded-full
                      bg-error/20 backdrop-blur-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
        <span className="text-error text-[10px] font-medium">LIVE</span>
      </div>
    </div>
  );
}
