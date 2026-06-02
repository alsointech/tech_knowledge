const userInput = '<script>alert("hacked")</script>';
const html = sanitize`<div>User said: ${userInput}</div>`;
// Expected: <div>User said: &lt;script&gt;alert("hacked")&lt;/script&gt;</div>

function sanitize(strings, ...keys) {

    const sanitizedCharacters = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    const result = [strings];
    keys.forEach(e => {
        const sanitizedInput = e.replace(reg, (match) => sanitizedCharacters[match]);
        result.push(sanitizedIn
            put)
    });
    return result.join("");
}

console.log(html);
