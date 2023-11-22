const express = require('express');
const methodOverride = require('method-override');
const cors = require('cors');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');
const User = require('./models/user.js');
const Post = require('./models/Post.js');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');
const Category = require('./models/Category.js'); 
require("dotenv").config(); 


const salt = bcrypt.genSaltSync(10);
const secret = 'mywebblogsecret';

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use('/uploads', express.static(__dirname + '/uploads'));

const PORT = process.env.PORT || 4000;

mongoose.connect('mongodb://localhost:27017/Nkiriclone');

app.post('/adminReg', async (req, res) => {
    const { username, password } = req.body;
    try {
        const newUser = await User.create({
            username: req.body.username,
            password: bcrypt.hashSync(password, salt),
        });
        console.log(newUser);
        res.json(newUser);
    } catch (e) {
        console.log(e);
        res.status(400).json(e);
    }
});

app.post('/admin', async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, { httpOnly: true }).json({
                id: userDoc._id,
                username,
            });
        });
    } else {
        res.status(400).json('wrong credentials');
    }
});

app.get('/profile', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, secret, {}, (err, info) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        res.json(info);
    });
});

app.post('/logout', (req, res) => {
    res.clearCookie('token').json('ok');
});


app.post('/post', uploadMiddleware.fields([{ name: 'cover', maxCount: 1 }, { name: 'mp4file', maxCount: 1 }]), async (req, res) => {
    try {
        const { originalname: coverName, path: coverPath } = req.files['cover'][0];
        const coverParts = coverName.split('.');
        const coverExt = coverParts[coverParts.length - 1];
        const coverNewPath = coverPath + '.' + coverExt;
        fs.renameSync(coverPath, coverNewPath);

        const { originalname: mp4Name, path: mp4Path } = req.files['mp4file'][0];
        const mp4Parts = mp4Name.split('.');
        const mp4Ext = mp4Parts[mp4Parts.length - 1];
        const mp4NewPath = mp4Path + '.' + mp4Ext;
        fs.renameSync(mp4Path, mp4NewPath);

        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const { title, summary, content, category } = req.body;

            // Check if the category is provided
            if (!category) {
                return res.status(400).json({ error: 'Category is required for creating a post.' });
            }

            const postDoc = await Post.create({
                title,
                summary,
                content,
                cover: coverNewPath,
                mp4file: mp4NewPath,
                author: info.id,
                category,
            });

            res.json({ postDoc });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.get('/post', async (req, res) => {
    res.json(await Post.find()
        .populate('author', ['username'])
        .sort({ createdAt: -1 })
        .limit(12)
    );
});


app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    const postDoc = await Post.findById(id).populate('author', ['username']);
    res.json(postDoc);
});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    try {
        let newPath = null;
        if (req.file) {
            const { originalname, path } = req.file;
            const parts = originalname.split('.');
            const ext = parts[parts.length - 1];
            newPath = path + '.' + ext;

            // Rename the file synchronously
            fs.renameSync(path, newPath);
        }

        const { token } = req.cookies;
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) {
                throw err;
            }

            const { id, title, summary, content } = req.body;
            const postDoc = await Post.findById(id);

            if (!postDoc) {
                return res.status(404).json({ error: 'Post not found' });
            }

            const isAuthor = postDoc.author.toString() === info.id;

            if (!isAuthor) {
                return res.status(403).json({ error: 'You are not the author' });
            }

            postDoc.title = title;
            postDoc.summary = summary;
            postDoc.content = content;
            postDoc.cover = newPath ? newPath : postDoc.cover;
            
            await postDoc.save();

            res.json(postDoc);
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/download-mp4/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post || !post.mp4file) {
            return res.status(404).json({ message: 'MP4 file not found' });
        }

        const buffer = fs.readFileSync(post.mp4file);
        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Content-Disposition', `attachment; filename="${post.title}.mp4"`);
        res.send(buffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error downloading MP4 file' });
    }
});

const File = mongoose.model('File', {
    filename: String,
    path: String,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });


app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const { originalname } = req.file;
        const file = new File({
            filename: originalname,
            path: req.file.buffer.toString('base64'),
        });
        await file.save();
        res.status(201).json({ message: 'File uploaded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error uploading file' });
    }
});



app.delete('/delete-post/:id', async (req, res) => {
    try {
      const postId = req.params.id;
      const result = await Post.deleteOne({ _id: postId });
  
      if (result.deletedCount === 1) {
        // Post deleted successfully
        res.sendStatus(204);
      } else {
        // Post not found
        res.sendStatus(404);
      }
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

  app.get('/', async (req, res) => {
    try {
      let perPage = 8;
      let page = parseInt(req.query.page) || 1;
      let categoryFilter = req.query.category ? { categories: req.query.category } : {};
  
       // Check if a category filter is provided
       const { category } = req.query;
       const filter = category ? { category: new ObjectId(category) } : {};

       const data = await Post.aggregate([
           { $match: filter }, // Add this filter stage
           { $sort: { createdAt: -1 } },
           { $skip: perPage * (page - 1) },
           { $limit: perPage }
       ]).exec();

      const count = await Post.countDocuments(categoryFilter);
      const totalLoaded = perPage * page;
      const hasMorePosts = totalLoaded < count;
  
      res.json({
        data,
        current: page,
        nextPage: hasMorePosts ? page + 1 : null,
    });
} catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
}
});
  


 // Endpoint to create a new category
app.post('/categories', async (req, res) => {
    try {
        const { name } = req.body;

        // Check if the category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ error: 'Category already exists' });
        }

        const newCategory = await Category.create({ name });

        res.status(201).json(newCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all categories
app.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// route to handle post views
app.post('/post/:postId/view', async (req, res) => {
  try {
    const postId = req.params.postId;

    // Find the post by ID and update the views
    const post = await Post.findByIdAndUpdate(postId, { $inc: { views: 1 } }, { new: true });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ views: post.views });
  } catch (error) {
    console.error('Error updating post views:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/homepage2', async (req, res) => {
    try {
      let perPage = 8;
      let page = parseInt(req.query.page) || 1;
      let categoryFilter = req.query.category ? { categories: req.query.category } : {};
  
      // Check if a category filter is provided
      const { category } = req.query;
      const filter = category ? { category: new ObjectId(category) } : {};
  
      const data = await Post.aggregate([
        { $match: filter }, // Add this filter stage
        { $sort: { views: -1 } }, // Add this sort stage for views in descending order
        { $skip: perPage * (page - 1) },
        { $limit: perPage }
      ]).exec();
  
      const count = await Post.countDocuments(categoryFilter);
      const totalLoaded = perPage * page;
      const hasMorePosts = totalLoaded < count;
  
      res.json({
        data,
        current: page,
        nextPage: hasMorePosts ? page + 1 : null,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  });
  
  // Add this endpoint to your server code
app.get('/related-posts', async (req, res) => {
    try {
      const { title, category } = req.query;
  
      // Use title or category to find related posts
      const relatedPosts = await Post.find({
        $or: [
          { title: { $regex: title, $options: 'i' } },
          { category: category },
        ],
      }).limit(3); // Adjust the limit as needed
  
      res.json(relatedPosts);
    } catch (error) {
      console.error('Error fetching related posts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  


  

app.listen(process.env.PORT || 4000, () => {
    console.log('Server is running on port 4000');
});
