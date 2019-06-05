const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
const config = require('../config/index');

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
        cacheControl: "max-age 0,no-cache,no-store,must-revalidate",
        metadata: function (req, file, cb) {
            cb(null, { fieldName: "avatar" });
        },
        key: function (req, file, cb) {
            cb(null, req.params.username)
        }
    })
})

module.exports = upload;