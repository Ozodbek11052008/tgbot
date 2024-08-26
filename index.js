const { Telegraf } = require('telegraf');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Comment = require('./models/Comment');

const bot = new Telegraf('7256535711:AAG9UDLj6GES5o8O2hH0BRCFBP4CgsaOfV8'); // Replace with your bot token
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://yosh_dasturchi:11052008ozod@cluster0.qih2a9m.mongodb.net', { useNewUrlParser: true, useUnifiedTopology: true });

// Serve the web app
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Movie options
const movies = ['Batman', 'Joker', 'Superman', 'Marvel'];

// Start command
bot.start((ctx) => {
    const movieButtons = movies.map((movie) => ({
        text: movie,
        web_app: { url: `https://ozimooviestest.onrender.com/webapp.html?username=${ctx.from.username}&movie=${movie}` } // Replace YOUR_SERVER_URL with your actual server URL
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

// Launch bot
bot.launch();

// Express server to serve the web app
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
