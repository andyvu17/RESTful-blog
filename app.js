var expressSanitizer = require("express-sanitizer"),
    bodyParser       = require("body-parser"),
    methodOverride   = require("method-override"),
    mongoose         = require("mongoose"),
    express          = require("express"),
    app              = express();
    
//APP CONFIGURATION
mongoose.connect("mongodb://localhost:27017/restful_blog", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
mongoose.set('useFindAndModify', false);


var blogSchema = new mongoose.Schema({
   title: String,
   image: String,
   body: String,
   created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//RESTFUL ROUTES

app.get("/", (req, res)=>{
    res.redirect("/blogs");
});

//INDEX
app.get("/blogs", (req, res) =>{
    //find all blogs
    Blog.find({}, (err, blogs) =>{
       if(err) {
           console.log("error");
       } else {
           //show all blogs
           res.render("index", {blogs: blogs});
       }
    });
});

//NEW
app.get("/blogs/new", (req, res)=>{
    res.render("new");
})

//CREATE
app.post("/blogs", (req, res)=> {
    req.body.blog.body = expressSanitizer(req.body.blog.body);
  //create blog
  Blog.create(req.body.blog, (err, newBlog)=> {
      if(err){
          console.log("error");
      } else{
          //redirect to index page
          res.redirect("/blogs");
      }
  });
});

//SHOW
app.get("/blogs/:id", (req, res)=>{
  //get specific blog
  Blog.findById(req.params.id, (err, foundBlog)=>{
      if(err){
          console.log("error");
      } else{
          //show specific blog page
            res.render("show",{blog: foundBlog});
      }
  });
});

//EDIT
app.get("/blogs/:id/edit", (req, res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if(err){
            console.log("error");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

//UPDATE
app.put("/blogs/:id", (req, res)=>{
    req.body.blog.body = expressSanitizer(req.body.blog.body);
    //Find specific page ID and Update with new info
    Blog.findOneAndUpdate({"_id": req.params.id}, req.body.blog, (err, updatedBlog)=>{
       if(err){
           console.log("error");
       } else{
           res.redirect("/blogs/" + req.params.id);
       }
    });
});

//DELETE
app.delete("/blogs/:id", (req, res)=>{
    //find specific blog to delete
    Blog.findOneAndDelete(req.params.id, (err)=>{
      if(err){
          console.log("error");
      } else{
          //redirect 
          res.redirect("/blogs");
      }
    });
   
});

app.listen(process.env.PORT, process.env.IP, () => {
    console.log("server is running");
});
                    