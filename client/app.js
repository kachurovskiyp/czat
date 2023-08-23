const socket = io();

const loginForm = document.querySelector('#welcome-form');
const messagesSection = document.querySelector('#messages-section');
const messagesList = document.querySelector('#messages-list');
const addMessageForm = document.querySelector('#add-messages-form');
const userNameInput = document.querySelector('#username');
const messageContentInput = document.querySelector('#message-content');

let userName = '';

const login = (evt) => {
  evt.preventDefault();

  if (!userNameInput.value) {
    alert('Tou need choose a login!');
    return;
  }
  userName = userNameInput.value;

  loginForm.classList.remove('show');
  messagesSection.classList.add('show');
  socket.emit('join', (userName));
  messagesList.innerHTML = '';
};

const addMessage = (author, content, type = 'normal') => {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');
  if (type === 'cursive') message.classList.add('message--cursive');
  if (author === userName) message.classList.add('message--self');
  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author}</h3>
    <div class="message__content">
      ${content}
    </div>
  `;
  messagesList.appendChild(message);
};

const sendMessage = (evt) => {
  evt.preventDefault();

  if (!messageContentInput.value) {
    alert('Massage field is empty!');
    return;
  }

  addMessage(userName, messageContentInput.value);
  socket.emit('message', { author: userName, content: messageContentInput.value });
  messageContentInput.value = '';
};

socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('join', (name) => {addMessage('Chat Bot', `${name} has joined the conversation!`, 'cursive')});
socket.on('left', (name) => {addMessage('Chat Bot', `${name} has left the conversation... :(`, 'cursive')})

loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);