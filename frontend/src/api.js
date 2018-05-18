import openSocket from "socket.io-client";
const socket = openSocket("http://10.65.108.139:8000");

// function messages(cb) {
//     console.log('xyz')
//   socket.on("timer", timestamp => cb(null, timestamp));
//   socket.emit("messages", 1000);
// }
// export { messages};
