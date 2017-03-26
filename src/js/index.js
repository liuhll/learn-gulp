var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var client = mysql.createConnection({
    user: 'root',
    password: 'ehqps2m7'
});

/* GET home page. */
router.get('/', function(req, res, next) {
    //  res.render('index', { title: 'Express' });
    res.json({ result: 'success' });
});

router.post("/", function(req, res, next) {
    res.json({ title: req.body.title });
});

/* WRITE */
router.post('/write/article', function(req, res, next) {
    client.query('USE ucampus_db');
    client.query('INSERT INTO articles(title, content, student_id) VALUES (?, ?, ?)', [req.body.title, req.body.content, req.body.nickname],
        function(error, data) {
            if (error) res.sendStatus(400);
            else {
                client.query('SELECT id FROM articles WHERE student_id=? ORDER BY id DESC LIMIT 1', [req.body.nickname],
                    function(error, data) {
                        res.send(data)
                    });
            }
        });
});

router.post('/write/reply', function(req, res, next) {
    client.query('USE ucampus');
    client.query('UPDATE articles SET reply_count = reply_count + 1 WHERE id = ?', [req.body.id_article]);
    client.query('INSERT INTO replys(content, id_article) VALUES (?, ?)', [req.body.content, req.body.id_article],
        function(error, data) {
            if (error) res.sendStatus(400);
            else res.sendStatus(200);
        });
});

/* READ */
router.get('/read/list', function(req, res, next) {
    client.query('USE ucampus');
    //client.query('SELECT title, DATE_FORMAT(CONVERT_TZ(date, \'+00:00\', \'+09:00\'), \'%Y.%m.%d\') date FROM articles ORDER BY id DESC LIMIT ?, ?',
    client.query('SELECT title, reply_count, view_count, DATE_FORMAT(date, \'%Y.%m.%d\') date, id FROM articles ORDER BY id DESC LIMIT ?, ?', [(req.query.page - 1) * req.query.num, Number(req.query.num)],
        function(error, data) {
            if (error) res.send(error);
            else res.send(data);
            // res.send("page = " + req.query.page + "num = " + req.query.num);
        });
});

router.get('/read/article', function(req, res, next) {
    client.query('USE ucampus');
    client.query('UPDATE articles SET view_count = view_count + 1 WHERE id = ?', [req.query.article_id]);
    client.query('SELECT title, view_count, reply_count, content, DATE_FORMAT(date, \'%Y.%m.%d %H:%i\') date FROM articles WHERE id = ?', [req.query.article_id],
        function(error, data) {
            res.send(data);
        });
});

router.get('/read/reply', function(req, res, next) {
    client.query('USE ucampus');
    client.query('SELECT DATE_FORMAT(date, \'%Y.%m.%d %H:%i \') date, nickname, content from replys where id_article = ?', [req.query.id_article],
        function(error, data) {
            res.send(data);
        });
});

/* DELETE */
router.get('/delete/article', function(req, res, next) {
    client.query('USE ucampus');
    client.query('DELETE FROM articles WHERE id = ?', [req.query.article_id],
        function(error, data) {});
});

router.get('/delete/reply', function(req, res, next) {
    client.query('USE ucampus');
    client.query('DELETE FROM replys WHERE id = ?', [req.query.reply_id],
        function(error, data) {});
});

module.exports = router;