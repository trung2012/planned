const express = require('express');
const router = new express.Router();
const File = require('../../models/File');
const parser = require('../../middleware/cloudinary');
const auth = require('../../middleware/auth');
const cloudinary = require('cloudinary');

const returnRouter = (io) => {
  router.post('/upload/:projectId/:taskId/:fileName', [auth, parser.single('file')], async (req, res) => {
    try {
      if (req.user) {
        const { file } = req;
        cloudinary.v2.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
          console.log(result)
        }).end(file.buffer);

        // const newFile = new File({
        //   name: req.params.fileName,
        //   url: file.url,
        //   public_id: file.public_id,
        //   task: req.params.taskId
        // });

        // await newFile.save();
        // res.send('File uploaded successfully');
        // io.in(req.params.projectId).emit('file_uploaded', newFile);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  })

  return router;
};


module.exports = returnRouter;