var express = require('express');
var Article = require("../models/article");
var Comment = require("../models/comment")
var router = express.Router();

/* GET articles listing. */
router.get('/', function(req, res, next) {
    if(!req.session.userId){
        req.flash("error","User is not logged in")
        return res.redirect("/users/login")
    }
    Article.find({},(err,articlesList)=>{
        if(err) return next(err);
        res.render("articles",{articlesList : articlesList });
    })
});
router.get('/new', function(req, res, next) {
    if(!req.session.userId){
        req.flash("error","User is not logged in")
        return res.redirect("/users/login")
    }
    res.render("articleForm");

});
//submit 
router.post('/', function(req, res, next) {
    var { title,description,author } = req.body;
  Article.create(req.body,(err,articleAdd)=>{
      console.log(err,articleAdd)
      res.redirect("/articles")
})
})
// router.get('/:id', function(req, res, next) {
//     var id = req.params.id;
//     Article.findById(id,(err,article)=>{
//         if(err) return next(err);
//         Comment.find({articleId:id},(err,comments)=>{
//             res.render("articlesDetail",{article,comments})
//         })
//   })
// });

// or using populate
// get detail
router.get('/:slug', function(req, res, next) {
    if(!req.session.userId){
        req.flash("error","User is not logged in")
        return res.redirect("/users/login")
    }
    var slug = req.params.slug;
    Article.findOne({slug}
        ).populate('comments').exec((err,article)=>{
        if(err) return next(err);
        console.log(article);
            res.render("articlesDetail",{article})
        })
  });
//edit
router.get('/:slug/edit', function(req, res, next) {
    if(!req.session.userId){
        req.flash("error","User is not logged in")
        return res.redirect("/users/login")
    }
    var slug = req.params.slug;
    Article.findOne({slug},(err,article)=>{
        if(err) return next(err);
        res.render("articleUpdateForm",{article:article})
  })
});
//update 
router.post('/:slug', function(req, res, next) {
    var slug = req.params.slug;
    Article.findOneAndUpdate({slug},req.body,(err,article)=>{
        if(err) return next(err);
        res.redirect("/articles")
  })
});
//delete
router.get("/:slug/delete", (req, res) => {
    if(!req.session.userId){
        req.flash("error","User is not logged in,log in first")
        return res.redirect("/users/login")
    }
    var slug = req.params.slug
    Article.findOneAndDelete({slug}, (err, article) => {
        if (err) return next(err);
        Comment.deleteMany({articleId:article.id},(err,comment)=>{
            res.redirect("/articles")
        })
    })
})

//like
router.get("/:slug/likes", (req, res) => {
    if(!req.session.userId){
        req.flash("error","User is not logged in")
        return res.redirect("/users/login")
    }
    var slug = req.params.slug
    Article.findOneAndUpdate({slug},{$inc:{likes:1}} ,(err, article) => {
        if (err) return next(err);
        res.redirect("/articles/"+slug)
    })
})

//comments
router.post("/:id/comments", (req, res) => {
    if(!req.session.userId){
        req.flash("error","User is not logged in")
        return res.redirect("/users/login")
    }
    var id = req.params.id;
    req.body.articleId = id;
    Comment.create(req.body,(err,comment)=>{
        if (err) return next(err);
        Article.findByIdAndUpdate(id,{$push:{comments:comment.id}},(err,comment)=>{
            if (err) return next(err);  
            res.redirect("/articles/"+ id)
        })
    })
})




module.exports = router;