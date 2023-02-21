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
  //console.log(req.params);
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
router.post("/", async (req, res) => {
  const { title, contents } = req.body;
  //let post = req.body;
  if (!title || !contents) {
    res
      .status(400)
      .json({ message: "Lütfen gönderi için bir title ve contents sağlayın" });
  } else {
    try {
      let { id } = await Posts.insert({ title, contents });
      let insertedPost = await Posts.findById(id); //veritabanında var mı diye baktık
      res.status(201).json(insertedPost);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
    }
  }
});

// router.post("/", (req, res) => {
//   const { title, contents } = req.body;
//   //let post = req.body;
//   if (!title || !contents) {
//     res
//       .status(400)
//       .json({ message: "Lütfen gönderi için bir title ve contents sağlayın" });
//   } else {
//     Posts.insert({ title, contents })
//       .then(({ id }) => {
//         Posts.findById(id).then((newPost) => {
//           res.status(201).json(newPost);
//         });
//       })
//       .catch((err) => {
//         res
//           .status(500)
//           .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
//       });
//   }
// });

// 4 [PUT] /api/posts/:id
router.put("/:id", async (req, res) => {
  try {
    let existPost = await Posts.findById(req.params.id);
    if (!existPost) {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    } else {
      let { title, contents } = req.body;
      if (!title || !contents) {
        res
          .status(400)
          .json({ message: "Lütfen gönderi için title ve contents sağlayın" });
      } else {
        let updatePostid = await Posts.update(req.params.id, req.body); //bu satır sadece id getirdi. postun tamamı dönsün istiyoruz
        let updatedPost = await Posts.findById(updatePostid); //postun tamamını döndürdük
        res.status(200).json(updatedPost);
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
      res.status(200).json(willBeDeletePost); //silinecek gönderiyi de döndük
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi silinemedi" });
  }
});

//6 [GET] /api/posts/:id/comments
router.get("/:id/comments", async (req, res) => {
  try {
    let commentsPost = await Posts.findById(req.params.id);
    if (!commentsPost) {
      res.status(404).json({ message: "Girilen ID'li gönderi bulunamadı." });
    } else {
      let comments = await Posts.findPostComments(req.params.id);
      res.status(200).json(comments);
    }
  } catch (error) {
    res.status(500).json({ message: "Yorumlar bilgisi getirilemedi" });
  }
});
module.exports = router;
