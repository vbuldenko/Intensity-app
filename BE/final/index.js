import { createApp } from './app.js';
const PORT = process.env.PORT || 10000;
const app = createApp();
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
