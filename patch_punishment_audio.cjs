const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const audioEffect = `
  const prevPunishmentCount = useRef(0);
  useEffect(() => {
    const currentCount = (state.supervisorPunishments || []).length + (state.pendingPunishmentsCount || (state.pendingPunishment ? 1 : 0));
    if (currentCount > prevPunishmentCount.current) {
      try {
        const audioCtx = new (window.AudioContext || (window).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
      } catch (e) {
        // Browser might block audio without interaction
      }
    }
    prevPunishmentCount.current = currentCount;
  }, [state.supervisorPunishments, state.pendingPunishmentsCount, state.pendingPunishment]);
`;

code = code.replace(
  "const punishmentTimeoutRefs = useRef<Record<number, NodeJS.Timeout>>({});",
  "const punishmentTimeoutRefs = useRef<Record<number, NodeJS.Timeout>>({});" + audioEffect
);

code = code.replace(
  "const handleOpenPunishmentBox = (index: number) => {",
  "const handleOpenPunishmentBox = (index: number) => {\n    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate([200, 100, 200]);"
);

fs.writeFileSync('src/App.tsx', code);
