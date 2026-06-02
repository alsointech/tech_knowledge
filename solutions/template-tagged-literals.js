function sanitize(strings, ...values) {
  // 1. Create escapeHTML function that converts:
  const escape = (str) => String(str)  
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27');
  
  // 2. Escape all values
  
  // 3. Interleave strings and escaped values
  
  // 4. Return the final string
  return strings.reduce((result, str, i) => 
    result + str + (values[i] !== undefined ? escape(values[i]) : ''), ''
  );
}

const userInput = '<script>alert("hacked")</script>';
const html = sanitize`<div>User said: ${userInput}</div>`;
console.log(html);
// Expected: <div>User said: &lt;script&gt;alert("hacked")&lt;/script&gt;</div>