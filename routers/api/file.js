const express = require('express');
const router = new express.Router();
const File = require('../../models/File');
const parser = require('../../middleware/cloudinary');
const auth = require('../../middleware/auth');

const returnRouter = (io) => {
  router.post('/files/upload/:projectId/:taskId', auth, parser.any('file'), async (req, res) => {
    try {
      if (req.user) {
        req.files.forEach(async file => {
          const newFile = new File({
            name: file.original_filename,
            url: file.url,
            public_id: file.public_id,
            task: req.params.taskId
          });

          await newFile.save();
        });

        io.in(req.params.projectId).emit('file_uploaded', newFile);
      }
    } catch (err) {
      res.status(500).send('Error uploading attachment. Please try again');
    }
  })

  return router;
};


module.exports = returnRouter;