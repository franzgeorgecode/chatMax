import axios from 'axios';
import { formatRelative } from 'date-fns';
import { useState } from 'react';

const SendIcon = props => (
<svg viewBox="0 0 24 24" {...props}>
<path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
</svg>
);

export default function Form({ setMessages }) {
const [message, setMessage] = useState('');
const [loading, setLoading] = useState(false);

const messageResponse = async () => {
setLoading(true);
const { data } = await axios.post('https://chatmax-production.up.railway.app/message', {
message
});
setLoading(false);
setMessages(prev => [
...prev,
{
msg: data.message,
type: 'bot',
time: formatRelative(new Date(), new Date())
}
]);
};

const sendMessage = async e => {
e.preventDefault();
if (!message) return;setMessages(prev => [
  ...prev,
  {
    msg: message,
    type: 'user',
    time: formatRelative(new Date(), new Date())
  }
]);
setMessage('');

await messageResponse();
};

return (
<>
{loading ? (
  <span className="text-[#541690] ml-2">Max escribiendo...</span>
) : null}
<form className="relative flex items-center">
<input
type="text"
value={message}
onChange={e => setMessage(e.target.value)}
className="bg-[#541690] text-white placeholder:text-[#e2dddd] text-2xl rounded-2xl p-4 w-full md:w-64 outline-none"
placeholder="Escribe aqui..."
/>
<button
       type="submit"
       onClick={sendMessage}
       className="ml-2 bg-white hover:opacity-50 active:opacity-100 transition-colors py-2 px-3 rounded-xl"
     >
<SendIcon className="w-5 h-5 fill-[#541690]" />
</button>
</form>
</>
);
}
