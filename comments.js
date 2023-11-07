// Create web server

// Import express module
const express = require('express');

// Import router
const router = express.Router();

// Import comment model
const Comment = require('../models/comment');

// Import article model
const Article = require('../models/article');

// Import user model
const User = require('../models/user');

// Import middleware
const { ensureAuthenticated } = require('../config/auth');

// @route   GET /comments/:articleId
// @desc    Show comment page
// @access  Private
router.get('/:articleId', ensureAuthenticated, async (req, res) => {
  try {
    const article = await Article.findById(req.params.articleId);
    if (!article) {
      return res.render('error', {
        message: 'Article not found',
        error: { status: 404 },
      });
    }

    const comments = await Comment.find({ article: article._id })
      .sort({ createdAt: -1 })
      .populate('user', 'username')
      .exec();

    res.render('comments', {
      article: article,
      comments: comments,
      user: req.user,
    });
  } catch (err) {
    console.log(err);
    res.render('error', {
      message: 'Server error',
      error: { status: 500 },
    });
  }
});

// @route   POST /comments/:articleId
// @desc    Create new comment
// @access  Private
router.post('/:articleId', ensureAuthenticated, async (req, res) => {
  try {
    const article = await Article.findById(req.params.articleId);
    if (!article) {
      return res.render('error', {
        message: 'Article not found',
        error: { status: 404 },
      });
    }

    const comment = new Comment({
      user: req.user._id,
      article: article._id,
      content: req.body.content,
    });

    await comment.save();

    res.redirect(`/comments/${article._id}`);
  } catch (err) {
    console.log(err);
    res.render('error', {
      message: 'Server error',
      error: { status: 500 },
    });
  }
});

// @route   GET /comments/:articleId/:commentId/edit
// @desc    Show edit comment page
// @access  Private
router.get('/:articleId/:commentId/edit', ensureAuthenticated, async (req, res) => {