const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  "import { SupervisorDashboard } from './components/SupervisorDashboard';",
  "import { SupervisorDashboard } from './components/SupervisorDashboard';\nimport { SupervisorGiftOverlay } from './components/SupervisorGiftOverlay';"
);

const handleClaimGiftLogic = `
  const handleClaimSupervisorGift = (giftId: string) => {
    setState(prev => {
      const newGifts = (prev.supervisorGifts || []).map(g => 
        g.id === giftId ? { ...g, claimed: true } : g
      );
      return {
        ...prev,
        supervisorGifts: newGifts,
        points: (prev.points || 0) + 300 // default reward for supervisor gift
      };
    });
    setToastMessage("تم استلام هدية المشرف! ✨");
    setTimeout(() => setToastMessage(""), 3000);
  };
`;

code = code.replace("  const executeReset = () => {", handleClaimSupervisorGift + "\n  const executeReset = () => {");

const renderGift = "{showDashboard && <SupervisorDashboard onClose={() => setShowDashboard(false)} />}";
const newRenderGift = renderGift + "\n      <SupervisorGiftOverlay gifts={state.supervisorGifts || []} onClaim={handleClaimSupervisorGift} />";

code = code.replace(renderGift, newRenderGift);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx for Gifts");
