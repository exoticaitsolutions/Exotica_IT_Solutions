const express = require('express');
const router = express.Router();
const Future = require('../../models/home/Future');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      
      cb(null, path.join(__dirname, '../../../exotica-app/public'));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
  const upload = multer({ storage });

  router.get('/', async (req, res) => {
    try {
        const futures = await Future.find();
        res.json(futures);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new future section with image upload
router.post('/', upload.fields([{ name: 'image' }, { name: 'mainimage' }]), async (req, res) => {
    const future = new Future({
        text: req.body.text,
        btntext: req.body.btntext,
        btnurl: req.body.btnurl,
        image: req.files['image'][0].filename,      
        mainimage: req.files['mainimage'][0].filename  
    });

    try {
        const newFuture = await future.save();
        res.status(201).json(newFuture);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update a future section with image upload
router.put('/:id', upload.fields([{ name: 'image' }, { name: 'mainimage' }]), async (req, res) => {
    
    try {
        const updatedData = {
            text: req.body.text,
            btntext: req.body.btntext,
            btnurl: req.body.btnurl,
        };

        // If images are uploaded, update their filenames
        if (req.files['image']) updatedData.image = req.files['image'][0].filename;
        if (req.files['mainimage']) updatedData.mainimage = req.files['mainimage'][0].filename;

        const updatedFuture = await Future.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        res.json(updatedFuture);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a future section and remove the images
router.delete('/:id', async (req, res) => {
    try {
        await Future.findByIdAndDelete(req.params.id);
        res.json({ message: 'Future removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;
