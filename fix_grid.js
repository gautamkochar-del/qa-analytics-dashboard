const fs = require('fs');
const path = require('path');

const files = [
  'client/src/components/TestResults/StatusSummary.jsx',
  'client/src/components/TestResults/TestResultDetails.jsx',
  'client/src/pages/GitHub.jsx',
  'client/src/pages/CicdDashboard.jsx',
  'client/src/pages/TestRunDetails.jsx',
  'client/src/pages/Settings.jsx'
];

files.forEach(file => {
  const filePath = path.resolve('/home/gautam.kochar/mobile-automation-framework/tests/qa-analytics-dashboard', file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find all `<Grid item ...>` instances
  content = content.replace(/<Grid\s+item\s+([^>]+)>/g, (match, propsStr) => {
    // extract xs, sm, md, lg, xl
    const sizes = {};
    let newPropsStr = propsStr;
    ['xs', 'sm', 'md', 'lg', 'xl'].forEach(bp => {
      const regex = new RegExp(`${bp}=\{([^}]+)\}`);
      const m = newPropsStr.match(regex);
      if (m) {
        sizes[bp] = m[1];
        newPropsStr = newPropsStr.replace(regex, '');
      }
    });
    
    newPropsStr = newPropsStr.trim();
    
    if (Object.keys(sizes).length > 0) {
      const sizeStr = Object.entries(sizes).map(([k,v]) => `${k}: ${v}`).join(', ');
      return `<Grid size={{${sizeStr}}} ${newPropsStr}>`.replace(/\s+>/, '>');
    } else {
      return match.replace('item ', '');
    }
  });
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});
