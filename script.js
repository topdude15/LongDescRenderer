const editor = document.getElementById('htmlEditor');
const previewFrame = document.getElementById('previewFrame');
const suggestionsContainer = document.getElementById('suggestions');
const autoCompleteTags = ['div', 'span', 'p', 'a', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'tr', 'td', 'th', 'form', 'input', 'button'];

editor.addEventListener('input', () => {
    const content = editor.value;
    updatePreview(content);
    showSuggestions(content);
});

editor.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
        event.preventDefault();
        const selectedItem = document.querySelector('.suggestion-item.selected');
        if (selectedItem) {
            editor.value += selectedItem.innerText + '>';
            suggestionsContainer.style.display = 'none';
            updatePreview(editor.value);
        }
    }
});

suggestionsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('suggestion-item')) {
        editor.value += event.target.innerText + '>';
        suggestionsContainer.style.display = 'none';
        updatePreview(editor.value);
    }
});

function updatePreview(content) {
    const previewDocument = previewFrame.contentDocument || previewFrame.contentWindow.document;
    previewDocument.open();
    previewDocument.write(content);
    previewDocument.close();
}

function showSuggestions(content) {
    const cursorPosition = editor.selectionStart;
    const textBeforeCursor = content.substring(0, cursorPosition);
    const lastTag = textBeforeCursor.match(/<(\w*)$/);

    if (lastTag) {
        const tagName = lastTag[1];
        const suggestions = autoCompleteTags.filter(tag => tag.startsWith(tagName));

        if (suggestions.length) {
            suggestionsContainer.innerHTML = suggestions.map(tag => `<div class="suggestion-item">${tag}</div>`).join('');
            suggestionsContainer.style.display = 'block';

            const { top, left, height } = editor.getBoundingClientRect();
            suggestionsContainer.style.top = `${top + height}px`;
            suggestionsContainer.style.left = `${left}px`;
        } else {
            suggestionsContainer.style.display = 'none';
        }
    } else {
        suggestionsContainer.style.display = 'none';
    }
}

// Close suggestions when clicking outside
document.addEventListener('click', (event) => {
    if (!suggestionsContainer.contains(event.target) && event.target !== editor) {
        suggestionsContainer.style.display = 'none';
    }
});

// Handle highlighting of suggestions
suggestionsContainer.addEventListener('mouseover', (event) => {
    if (event.target.classList.contains('suggestion-item')) {
        const items = suggestionsContainer.querySelectorAll('.suggestion-item');
        items.forEach(item => item.classList.remove('selected'));
        event.target.classList.add('selected');
    }
});
