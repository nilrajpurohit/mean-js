const express = require('express')
const router = express.Router();

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
// var Post = mongoose.model('Post');

router.use(function(req,res,next){
    if(req.method === 'GET'){
        //continue to the next middleware or request handler
        return next();
    }
    if(!req.isAuthenticated()){
        //user not auth then redirect
        return res.redirect('/#login');
    }
    return next();
})

router.route('/posts')
//return all posts
.get(function(req,res){
    Post.find(function(err,posts){
        if(err){
           return res.send(500,err);
        }
        return res.json(posts);
    })
    // res.send({message:'TODO return all posts'});
})
//create a post
.post(function(req,res){
    // console.log(req.body);
    // res.send(200,"Ok");
    var post = new Post();
    post.text = req.body.text;
    post.username = req.body.created_by;
    post.save(function(err,post){
        if(err){
            // console.log('error');
            return res.send(500,err);
        }
        // console.log('success');
        return res.json(post);
    });
    // res.send({message:'TODO create a new post'});
})


router.route('/posts/:id')
//fetch specific post by id
.get(function(req,res){
    Post.findById(req.params.id,function(err,post){
        if(err){
            return res.send(500,err);
        }
        return res.json(post);
    });
    // res.send({message:'TODO return post with ID '+ req.params.id})
})
//update specific post by id
.put(function(req,res){
    Post.findById(req.params.id,function(err,post){
        if(err){
            return res.send(500,err);
        }
        post.username = req.body.created_by;
        post.text = req.body.text;
        post.save(function(err,post){
            if(err){
                return res.send(500,err);
            }
            return res.json(post);
        })
    })
    // res.send({message:'TODO updated post with ID '+ req.params.id})
})
//delete specific post by id
.delete(function(req,res){
    Post.remove({_id:req.params.id},function(err){
        if(err){
            return res.send(500,err);
        }
        return res.json("post deleted!")
    })
    // res.send({message:'TODO deleted post with ID '+ req.params.id})
})

module.exports = router;