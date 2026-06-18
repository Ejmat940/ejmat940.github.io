const express = require('express');
const router = express.Router();
const Song = require('../models/Song');

/* GET songs index */
router.get('/', (req, res) => {
  Song.findAll((err, songs) => {
    if (err) {
      res.status(500).render('error', { message: err.message, error: err });
      return;
    }
    res.render('songs/index', { title: 'Songs List', songs: songs });
  });
});

/* GET create song form */
router.get('/create', (req, res) => {
  res.render('songs/create', { title: 'Create Song', song: null });
});

/* POST create song */
router.post('/create', (req, res) => {
  const formData = req.body.song || {};
  const song = new Song({
    title: formData.title,
    artist: formData.artist,
    year: parseInt(formData.year) || null
  });

  song.save((err, id) => {
    if (err) {
      res.status(500).render('error', { message: err.message, error: err });
      return;
    }
    res.redirect('/songs');
  });
});

/* GET show song */
router.get('/:id', (req, res) => {
  Song.findById(req.params.id, (err, song) => {
    if (err) {
      res.status(500).render('error', { message: err.message, error: err });
      return;
    }
    if (!song) {
      res.status(404).render('error', {
        message: 'Song not found',
        error: { status: 404, message: 'Song not found' }
      });
      return;
    }
    res.render('songs/show', { title: `${song.title} (${song.id})`, song: song });
  });
});

/* GET edit song form */
router.get('/:id/edit', (req, res) => {
  Song.findById(req.params.id, (err, song) => {
    if (err) {
      res.status(500).render('error', { message: err.message, error: err });
      return;
    }
    if (!song) {
      res.status(404).render('error', {
        message: 'Song not found',
        error: { status: 404, message: 'Song not found' }
      });
      return;
    }
    res.render('songs/edit', { title: `Edit Song ${song.title} (${song.id})`, song: song });
  });
});

/* POST update song (from edit form) */
router.post('/edit', (req, res) => {
  const formData = req.body.song || {};
  const id = req.body.id;

  Song.findById(id, (err, song) => {
    if (err) {
      res.status(500).render('error', { message: err.message, error: err });
      return;
    }
    if (!song) {
      res.status(404).render('error', {
        message: 'Song not found',
        error: { status: 404, message: 'Song not found' }
      });
      return;
    }

    song.title = formData.title;
    song.artist = formData.artist;
    song.year = parseInt(formData.year) || null;

    song.save((err) => {
      if (err) {
        res.status(500).render('error', { message: err.message, error: err });
        return;
      }
      res.redirect('/songs');
    });
  });
});

/* POST delete song */
router.post('/delete', (req, res) => {
  const id = req.body.id;

  Song.findById(id, (err, song) => {
    if (err) {
      res.status(500).render('error', { message: err.message, error: err });
      return;
    }
    if (!song) {
      res.status(404).render('error', {
        message: 'Song not found',
        error: { status: 404, message: 'Song not found' }
      });
      return;
    }

    song.delete((err) => {
      if (err) {
        res.status(500).render('error', { message: err.message, error: err });
        return;
      }
      res.redirect('/songs');
    });
  });
});

module.exports = router;





