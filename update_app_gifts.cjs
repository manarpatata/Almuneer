const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Update imports
code = code.replace("import { getTodayDateString, processMissedDays, addDays } from './utils';", "import { getTodayDateString, processMissedDays, addDays, calculateStreak } from './utils';");

// Insert the streak calculation and follow-up gift computation
const targetStr = `  const totalGiftsToday = availableGiftsCount + openedGiftsToday;`;
const replacementStr = `  const totalGiftsToday = availableGiftsCount + openedGiftsToday;

  const { currentStreak, freezesAvailable, longestStreak, earnedFollowUpGifts } = useMemo(() => {
     return calculateStreak(state.history, state.startDate || state.lastLoginDate, todayStr, state.extraStreakFreezes || 0);
  }, [state.history, state.startDate, state.lastLoginDate, todayStr, state.extraStreakFreezes]);

  const availableFollowUpGifts = Math.max(0, earnedFollowUpGifts - (state.claimedFollowUpGifts || 0));
  const openedFollowUpGiftsTodayList = state.claimedFollowUpGiftsByDate?.[todayStr] || [];
  const openedFollowUpGiftsToday = openedFollowUpGiftsTodayList.length;
  const totalFollowUpGiftsToday = availableFollowUpGifts + openedFollowUpGiftsToday;

  const [openedFollowUpBoxes, setOpenedFollowUpBoxes] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setOpenedFollowUpBoxes(prev => {
      const currentOpenedCount = Object.values(prev).filter(Boolean).length;
      if (currentOpenedCount === openedFollowUpGiftsToday) {
        return prev;
      }
      
      const newState: Record<number, boolean> = {};
      for (let i = 0; i < totalFollowUpGiftsToday; i++) {
        if (i >= availableFollowUpGifts) {
          newState[i] = true;
        } else {
          newState[i] = false;
        }
      }
      return newState;
    });
  }, [availableFollowUpGifts, openedFollowUpGiftsToday, totalFollowUpGiftsToday]);

  const handleClaimFollowUpGift = (idx: number) => {
    if (openedFollowUpBoxes[idx]) return;
    
    setOpenedFollowUpBoxes(prev => ({ ...prev, [idx]: true }));
    const outcome = Math.random() > 0.5 ? 'points' : 'freeze';
    
    setState(prev => {
      const currentList = prev.claimedFollowUpGiftsByDate?.[todayStr] || [];
      return {
        ...prev,
        claimedFollowUpGifts: (prev.claimedFollowUpGifts || 0) + 1,
        points: (prev.points || 0) + (outcome === 'points' ? 300 : 0),
        extraStreakFreezes: (prev.extraStreakFreezes || 0) + (outcome === 'freeze' ? 1 : 0),
        claimedFollowUpGiftsByDate: {
          ...(prev.claimedFollowUpGiftsByDate || {}),
          [todayStr]: [...currentList, outcome]
        }
      };
    });
    setToastMessage(outcome === 'points' ? "تم إضافة 300 نقطة! 🌟" : "تم إضافة كرت استعادة الستريك! 🧊");
    setTimeout(() => setToastMessage(""), 3000);
  };
`;
code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/App.tsx', code);
