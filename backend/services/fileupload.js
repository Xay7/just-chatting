const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3-transform')
const config = require('../config/index');
const sharp = require('sharp');

aws.config.update({
    secretAccessKey: config.aws.secretAccessKey,
    accessKeyId: config.aws.accessKeyId,
    region: "eu-west-3"
})

const s3 = new aws.S3()

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'justchattingbucket',
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        cacheControl: "max-age 0,no-cache,no-store,must-revalidate",
        shouldTransform: function (req, file, cb) {
            cb(null, /^image/i.test(file.mimetype))
        },
        transforms: [{
            id: 'original',
            key: function (req, file, cb) {
                cb(null, req.params.id)
            },
            transform: function (req, file, cb) {
                cb(null, sharp().resize({
                    width: 128,
                    height: 128,
                    fit: sharp.fit.cover
                }))
            }
        }]
    })
});

module.exports = upload;