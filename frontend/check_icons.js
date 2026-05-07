
import * as Lucide from './node_modules/lucide-react/dist/esm/lucide-react.js';

const iconsToCheck = [
  'Activity', 'Pill', 'Stethoscope', 'ArrowLeftRight', 'Sparkles', 
  'ShieldCheck', 'Sun', 'Moon', 'Menu', 'X', 'ChevronRight', 'Zap',
  'Mail', 'Phone', 'MapPin', 'Globe', 'Instagram', 'Facebook', 'Twitter'
];

iconsToCheck.forEach(icon => {
  if (Lucide[icon]) {
    console.log(`${icon}: OK`);
  } else {
    console.log(`${icon}: MISSING`);
  }
});
