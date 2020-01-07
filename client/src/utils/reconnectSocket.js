export default (socket) => {
  let token = localStorage.getItem('token');
  socket.io.opts.query = `token=${token}`
  socket.query = `token=${token}`
  socket.close();
  socket.open();
}