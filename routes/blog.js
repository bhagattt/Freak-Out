const express = require('express');
const mongodb = require('mongodb');
const router = express.Router();
const db = require('../data/database');
const ObjectId = mongodb.ObjectId;

router.get('/', function(req, res) {
  res.redirect('/posts');
});

router.get('/posts', async function(req, res) {
  try {
    const posts = await db.getDb().collection('posts').find({}, { projection: { 'title': 1, 'summary': 1, 'author.name': 1 } }).toArray();
    res.render('posts-list', { posts: posts });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

router.get('/new-post', async function(req, res) {
  try {
    const authors = await db.getDb().collection('authors').find().toArray();
    res.render('create-post', { authors: authors });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

router.post('/posts', async function(req, res) {
  try {
    const authorId = new ObjectId(req.body.author);
    const author = await db.getDb().collection('authors').findOne({ _id: authorId });

    if (!author) {
      return res.status(404).send('Author not found');
    }

    const newPost = {
      title: req.body.title,
      summary: req.body.summary,
      body: req.body.content,
      date: new Date(),
      author: {
        id: authorId,
        
        name: author.name,
        email: author.email,
      },
    };

    const result = await db.getDb().collection('posts').insertOne(newPost);
    console.log(result);
    res.redirect('/posts');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

router.get('/posts/:id', async function(req, res) {
  try {
    const postId = req.params.id;
    const post = await db.getDb().collection('posts').findOne({ _id: new ObjectId(postId) }, { projection: { 'summary': 0 } });

    if (!post) {
      return res.status(404).render('404');
    }

    post.date = post.date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      day: 'numeric',
      month: 'long'
    });

    res.render('post-detail', { post: post });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

router.get('/posts/:id/edit', async function(req, res) {
  try {
    const postId = req.params.id;
    const post = await db.getDb().collection('posts').findOne({ _id: new ObjectId(postId) }, { projection: { 'title': 1, 'summary': 1, 'body': 1 } });

    if (!post) {
      return res.status(404).render('404');
    }

    res.render('update-post', { post: post });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

router.post('/posts/:id/edit', async function(req, res) {
  try {
    const postId = new ObjectId(req.params.id);
    const result = await db.getDb().collection('posts').updateOne(
      { _id: postId },
      {
        $set: {
          title: req.body.title,
          summary: req.body.summary,
          body: req.body.content,
        }
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).send('Post not found');
    }

    res.redirect('/posts');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

router.get('/test', (req, res) => {
  console.log('Test route hit');
  res.render('test', { message: 'This is a test' });
});
router.post('/posts/:id/delete', async (req, res) => {
  try {
    const postId = new ObjectId(req.params.id); // Convert postId to ObjectId
    console.log(`Deleting post with ID: ${postId}`);

    const result = await db.getDb().collection('posts').deleteOne({ _id: postId });

    if (result.deletedCount === 0) {
      console.log('No post found with that ID');
      return res.status(404).send('Post not found');
    }

    console.log('Post deleted successfully');
    res.redirect('/posts');
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).send('Server error');
  }
});


module.exports = router;
