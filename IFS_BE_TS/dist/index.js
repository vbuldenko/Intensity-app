import { createApp } from './app';
const PORT = process.env.PORT || 10000;
const app = createApp();
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
//# sourceMappingURL=index.js.map