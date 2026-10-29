const button = document.getElementById('clickMe');
const message = document.getElementById('message');

if (button && message) {
  button.addEventListener('click', () => {
    message.textContent = 'JavaScript is connected and working!';
    button.textContent = 'Clicked';
  });
}
