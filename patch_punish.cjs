const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const getPunishmentsStr = `
  const systemPunishments = Array.from({ length: state.pendingPunishmentsCount || (state.pendingPunishment ? 1 : 0) }).map((_, i) => ({
    id: \`sys-\${i}\`,
    type: 'system',
    reason: 'لم تنهي ٢٠ درسًا في اليومين الماضيين🔪',
    sender: 'لجنة العقوبات'
  }));
  const supPunishments = state.supervisorPunishments || [];
  const allPunishments = [...systemPunishments, ...supPunishments];
`;

const handlePunishmentOld = `  const handlePunishmentAction = (index: number, fulfilled: boolean) => {
    setPunishmentUIStates(prev => ({ ...prev, [index]: fulfilled ? 'resolving_done' : 'resolving_failed' }));
    if (punishmentTimeoutRefs.current[index]) clearTimeout(punishmentTimeoutRefs.current[index]);
    
    punishmentTimeoutRefs.current[index] = setTimeout(() => {
      const today = getTodayDateString();
      setState(prev => {
        const newCount = Math.max(0, (prev.pendingPunishmentsCount || (prev.pendingPunishment ? 1 : 0)) - 1);
        return { 
          ...prev, 
          pendingPunishment: newCount > 0,
          pendingPunishmentsCount: newCount,
          history: fulfilled ? {`;

const handlePunishmentNew = `  const handlePunishmentAction = (index: number, fulfilled: boolean, pId: string, isSystem: boolean) => {
    setPunishmentUIStates(prev => ({ ...prev, [index]: fulfilled ? 'resolving_done' : 'resolving_failed' }));
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
          history: fulfilled ? {`;

const handleCardOld = `  const handleUseCardAction = (index: number) => {
    setPunishmentUIStates(prev => ({ ...prev, [index]: 'resolving_card' }));
    if (punishmentTimeoutRefs.current[index]) clearTimeout(punishmentTimeoutRefs.current[index]);
    
    punishmentTimeoutRefs.current[index] = setTimeout(() => {
      const today = getTodayDateString();
      setState(prev => {
        const newCount = Math.max(0, (prev.pendingPunishmentsCount || (prev.pendingPunishment ? 1 : 0)) - 1);
        return {
          ...prev,
          immunityCards: Math.max(0, (prev.immunityCards || 0) - 1),
          pendingPunishment: newCount > 0,
          pendingPunishmentsCount: newCount,
          history: {`;

const handleCardNew = `  const handleUseCardAction = (index: number, pId: string, isSystem: boolean) => {
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
          immunityCards: Math.max(0, (prev.immunityCards || 0) - 1),
          pendingPunishment: newCount > 0,
          pendingPunishmentsCount: newCount,
          supervisorPunishments: newSupPuns,
          history: {`;

code = code.replace(handlePunishmentOld, handlePunishmentNew);
code = code.replace(handleCardOld, handleCardNew);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched handlers");
