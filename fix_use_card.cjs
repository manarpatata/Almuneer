const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldFunc = `  const handleUseCardAction = (index: number) => {
    if ((state.immunityCards || 0) <= 0) return;
    
    setState(prev => ({
      ...prev,
      immunityCards: Math.max(0, (prev.immunityCards || 0) - 1)
    }));
    
    setPunishmentUIStates(prev => ({ ...prev, [index]: 'resolving_card' }));
    if (punishmentTimeoutRefs.current[index]) clearTimeout(punishmentTimeoutRefs.current[index]);
    
    punishmentTimeoutRefs.current[index] = setTimeout(() => {
      const today = getTodayDateString();
      setState(prev => {
        const newCount = Math.max(0, (prev.pendingPunishmentsCount || (prev.pendingPunishment ? 1 : 0)) - 1);
        return {
          ...prev,
          pendingPunishment: newCount > 0,
          pendingPunishmentsCount: newCount,
          history: {`;

const newFunc = `  const handleUseCardAction = (index: number, pId: string, isSystem: boolean) => {
    if ((state.immunityCards || 0) <= 0) return;
    
    setState(prev => ({
      ...prev,
      immunityCards: Math.max(0, (prev.immunityCards || 0) - 1)
    }));
    
    setPunishmentUIStates(prev => ({ ...prev, [index]: 'resolving_card' }));
    if (punishmentTimeoutRefs.current[index]) clearTimeout(punishmentTimeoutRefs.current[index]);
    
    punishmentTimeoutRefs.current[index] = setTimeout(() => {
      const today = getTodayDateString();
      setState(prev => {
        let newCount = prev.pendingPunishmentsCount || (prev.pendingPunishment ? 1 : 0);
        let newSupPuns = prev.supervisorPunishments || [];
        if (isSystem) {
          newCount = Math.max(0, newCount - 1);
        } else {
          newSupPuns = newSupPuns.filter(p => p.id !== pId);
        }
        return {
          ...prev,
          pendingPunishment: newCount > 0,
          pendingPunishmentsCount: newCount,
          supervisorPunishments: newSupPuns,
          history: {`;

code = code.replace(oldFunc, newFunc);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched handleUseCardAction");
