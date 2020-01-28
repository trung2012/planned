const fs = require('fs');
const express = require('express');
const router = new express.Router();
const File = require('../../models/File');
const Task = require('../../models/Task');
const parser = require('../../middleware/multer');
const auth = require('../../middleware/auth');
const cloudinary = require('cloudinary');

const returnRouter = (io) => {
  router.post('/upload/:projectId/:taskId/:fileName', [auth, parser.single('file')], async (req, res) => {
    try {
      if (req.user) {
        const { file } = req;

        cloudinary.v2.uploader.upload(file.path, { resource_type: 'raw', use_filename: true, folder: 'planned_files' }, async (error, result) => {
          if (error) {
            if (error.message.toLowerCase().includes('too large')) {
              return res.status(400).send('File size too large. Maximum allowed is 10MB.')
            } else {
              return res.status(400).send('Invalid file input');
            }
          }

          fs.unlinkSync(file.path);

          const newFile = new File({
            name: req.params.fileName,
            url: result.secure_url,
            public_id: result.public_id,
            task: req.params.taskId
          });

          await Promise.all([
            newFile.save(),
            Task.updateOne(
              { _id: newFile.task },
              { $set: { updatedAt: Date.now() } }
            )
          ]);

          res.send('File uploaded successfully');
          io.in(req.params.projectId).emit('file_uploaded', newFile);
        })
      }
    } catch (err) {
      console.log(err)
      res.status(500).send(err);
    }
  })

  return router;
};


module.exports = returnRouter;