// server.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// MySQL 连接配置
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // 替换为你的 MySQL 用户名
  password: 'admin123', // 替换为你的 MySQL 密码
  database: 'contactDB'
});

db.connect((err) => {
  if (err) throw err;
  console.log('数据库连接成功');
});

// 获取联系人信息的 API
app.get('/contacts', (req, res) => {
  const sql = 'SELECT * FROM contacts';
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// 新增联系人
app.post('/contacts', (req, res) => {
  const { name, email, phone } = req.body;
  const sql = 'INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)';
  db.query(sql, [name, email, phone], (err, result) => {
    if (err) throw err;
    res.send('联系人添加成功');
  });
});

// 更新联系人
app.put('/contacts/:id', (req, res) => {
  const { name, email, phone } = req.body;
  const sql = 'UPDATE contacts SET name = ?, email = ?, phone = ? WHERE id = ?';
  db.query(sql, [name, email, phone, req.params.id], (err, result) => {
    if (err) throw err;
    res.send('联系人更新成功');
  });
});

// 删除联系人
app.delete('/contacts/:id', (req, res) => {
  const sql = 'DELETE FROM contacts WHERE id = ?';
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.send('联系人删除成功');
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
