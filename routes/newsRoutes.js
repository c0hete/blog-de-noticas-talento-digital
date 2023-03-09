const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const getNews = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM news');
    res.render('dashboard', { news: rows });
    const news = await news.findAll();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener noticias');
  }
};

module.exports = { getNews };

router.post('/news/create', (req, res) => {

    const { title, image, content, category_id } = req.body;
  

    const author_id = req.user.id;
  

    const query = `
      INSERT INTO news (title, image, content, author_id, category_id)
      VALUES ($1, $2, $3, $4, $5)
    `;
    const values = [title, image, content, author_id, category_id];
    pool.query(query, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al crear la noticia');
      }
      res.redirect('/dashboard');
    });
  });

  module.exports = router;


