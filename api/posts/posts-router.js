// post routerları buraya yazın
const express = require("express");
const Posts = require("./posts-model"); //posts-model dosyasını import ettik çünkü burada kullanacağız.

const router = express.Router();
router.use(express.json());

//1 [GET] /api/posts
router.get("/", (req, res) => {
  Posts.find()
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((err) => {
      res.status(500).json({ message: "Gönderiler alınamadı" });
    });
});

//2 [GET] /api/posts/:id
router.get("/:id", (req, res) => {
  Posts.findById(req.params.id)
    .then((post) => {
      if (!post) {
        res
          .status(404)
          .json({ message: "Belirtilen ID'li gönderi bulunamadı" });
      } else {
        res.status(200).json(post);
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Gönderi bilgisi alınamadı" });
    });
});

//3 [POST] /api/posts
router.post("/", (req, res) => {
  let post = req.body;
  if (!post.title || !post.contents) {
    res
      .status(400)
      .json({ message: "Lütfen gönderi için bir title ve contents sağlayın" });
  } else {
    Posts.insert(post)
      .then((newPost) => {
        res.status(201).json(newPost);
      })
      .catch((err) => {
        res
          .status(500)
          .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
      });
  }
});

// 4 [PUT] /api/posts/:id
router.put("/:id", async (req, res) => {
  try {
    let willBeUpdatePost = await Posts.findById(req.params.id);
    if (!willBeUpdatePost) {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    } else {
      if (!req.body.title || !req.body.contents) {
        res
          .status(400)
          .json({ message: "Lütfen gönderi için title ve contents sağlayın" });
      } else {
        let updatePost = await Posts.update(req.params.id, req.body);
        res.status(200).json(updatePost);
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi bilgileri güncellenemedi" });
  }
});

//5 [DELETE] /api/posts/:id
router.delete("/:id", async (req, res) => {
  try {
    let willBeDeletePost = await Posts.findById(req.params.id);
    if (!willBeDeletePost) {
      res.status(404).json({ message: "Belirtilen ID li gönderi bulunamadı" });
    } else {
      await Posts.remove(req.params.id);
      res.status(200).json(willBeDeletePost);
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi silinemedi" });
  }
});

//6 [GET] /api/posts/:id/comments
router.get(":id/comments", async (req, res) => {
  try {
    let commentsPost = await Posts.findCommentById(req.params.id);
    if (!commentsPost) {
      res.status(404).json({ message: "Girilen ID'li gönderi bulunamadı." });
    } else {
      await Posts.findPostComments(req.params.id).then((post) => {
        res.status(200).json(post);
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Yorumlar bilgisi getirilemedi" });
  }
});
module.exports = router;
