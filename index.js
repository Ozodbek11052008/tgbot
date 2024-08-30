
const { Telegraf } = require('telegraf');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Comment = require('./models/Comment');

const bot = new Telegraf('7256535711:AAG9UDLj6GES5o8O2hH0BRCFBP4CgsaOfV8');
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://yosh_dasturchi:11052008ozod@cluster0.qih2a9m.mongodb.net', { useNewUrlParser: true, useUnifiedTopology: true });
let moovies = ['batman', 'spiderman', 'joker']
// Serve the web app
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Function to get user photo URL
async function getUserPhoto(ctx) {
    try {
        const userPhotos = await ctx.telegram.getUserProfilePhotos(ctx.from.id);
        if (userPhotos.total_count > 0) {
            const fileId = userPhotos.photos[0][0].file_id;
            const file = await ctx.telegram.getFileLink(fileId);
            return file.href;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching user photo:', error);
        return null;
    }
}
let moovies = ["batman","joker","superman";
// Start command
bot.start(async (ctx) => {
    const username = ctx.from.username;
    const photoUrl = await getUserPhoto(ctx);

    const movieButtons = moovies.map((movie) => ({
        text: movie,
        web_app: { url: `https://tgbot-t567.onrender.com/webapp.html?username=${username}&photoUrl=${encodeURIComponent(photoUrl)}&movie=${movie}` }
    }));

    ctx.reply('Choose a movie:', {
        reply_markup: {
            inline_keyboard: [movieButtons]
        }
    });
});

// API to save comments
app.post('/save-comment', async (req, res) => {
    const { username, movie, comment } = req.body;

    try {
        const newComment = new Comment({ username, movie, comment });
        await newComment.save();
        res.status(200).send('Comment saved successfully!');
    } catch (error) {
        res.status(500).send('Failed to save comment.');
    }
});

// API to get comments
app.get('/get-comments', async (req, res) => {
    try {
        const comments = await Comment.find().sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).send('Failed to retrieve comments.');
    }
});

// Launch bot
bot.launch();

// Express server to serve the web app
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
