const url = window.location.href

const statsButton = document.getElementById('stats-btn')
const nicknameField = document.getElementById('nickname-input')

async function copyTextToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Text successfully copied to clipboard');
  } catch (err) {
    console.error('Could not copy text: ', err);
  }
}

statsButton.addEventListener('click', function() {
    const copyUrl = url + '?nickname=' + nicknameField.value;
    copyTextToClipboard(copyUrl)
})
