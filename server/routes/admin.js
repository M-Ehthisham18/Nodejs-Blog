const express = require("express");
const { uploadOnCloudinary , deleteFromCloudinary } = require('../utils/cloudinay')
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Post = require("../models/post");
const {message} = require('../middlewares/sendAlert')
const {upload} = require('../middlewares/multer')
const {authMiddleware, isLoggedIn} = require('../middlewares/authMiddleware');
// const upload = require('../utils/multer')

const adminLayout = "../views/layouts/admin"; // this is essential to display through layouts/admin.js
const jwtSecret = process.env.JWT_SECRET;



// updating field in model
/**
 * async function addMediaFieldToExistingPosts() {
  try {
    // Add the media field to all existing posts
    const result = await Post.updateMany(
      { media: { $exists: false } }, // Check if the 'media' field doesn't exist
      { $set: { media: [] } } // Set the 'media' field as an empty array
    );
    console.log("Updated documents:", result);
  } catch (error) {
    console.error("Error updating documents:", error);
  }
}

addMediaFieldToExistingPosts(); 
 */


// multer
/**
 * 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../../public/img"))
      },
  filename: function (req, file, cb) {
    
        cb(null, file.originalname);
    //     // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //     // cb(null, file.fieldname + '-' + uniqueSuffix)
      }
});
const upload = multer({ storage });
 */


//auth middle ware
/**
 * middleware
 * check login
 */
/**
 * const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token; // Use 'cookies' to fetch the token
    if (!token) {
      //send the alert msg, url , time in seconds
      return res.send(message('Sign In to visit Dashboard 🗓️','/admin/',3));
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded; // Attach decoded user info to the request object

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(403).json({ message: "Forbidden" });
  }
};

// Middleware to check if user is logged in
const isLoggedIn = (req, res, next) => {
  const token = req.cookies.token; // Retrieve the token from cookies

  if (token) {
    try {
      // Verify the token
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded; // Attach the decoded user data to the request
      return res.redirect("/admin/dashboard"); // Redirect to the dashboard if logged in
    } catch (error) {
      console.log("Invalid or expired token:", error);
    }
  }

  next(); // Proceed to the login page if not logged in
};

 */


/**
 * GET /
 * ADMIN - register page
 */
router.get("/register", async (req, res) => {
  try {
    const locals = {
      title: "Register",
      desc: "This is a register page",
    };

    // res.render("admin/register", { locals, layout: adminLayout });
    return res.send('User Registered successfully.','admin/register',2)
  } catch (error) {
    console.log(`something worng while admin page : ${error}`);
  }
});

/**
 * POST /
 * Admin - create user
 */
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password: hashedPassword });
      res.status(201).json({ message: "User created", user });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: "User already in use" });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.log('something went worng whiel registering. ',error);
  }
});


/**
 * GET /
 * ADMIN - login page
 */
router.get("/", isLoggedIn,async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      desc: "This is a home page",
      signIn: "signIn",
    };

    res.render("admin/index", { locals, layout: adminLayout }); 
  

  } catch (error) {
    console.log(`something worng while admin page : ${error}`);
  }
});

/**
 * POST /
 * ADMIN - cheack for login (existing user)
 */
router.post("/", async (req, res) => {
  try {

    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // cookie
    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    
    // Save adminName in the session
    req.session.adminName = username;
    res.redirect("admin/dashboard");
  } catch (error) {
    console.log(`something worng while admin page in post method: ${error}`);
  }
});

/**
 * GET /
 * ADMIN - dashboard
 */
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "Welcome to the admin dashboard",
      adminName: req.session.adminName || "Admin",
    };
  

    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Post.countDocuments({});
    const lastPage = Math.ceil(count / perPage);

    const previousPage = parseInt(page) + 1;
    const haspreviousPage = previousPage <= lastPage;

    const nextPage = parseInt(page) - 1;
    const hasNextPage = nextPage > 0;

    res.render("admin/dashboard", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      previousPage: haspreviousPage ? previousPage : null,
      currentRoute: "/",
      layout: adminLayout,
    });
  } catch (error) {
    console.log('error in dashboard : ',error);
  }
});

/**
 * GET /
 * vist POST - PAGE
 */
// router.get("/post/:id", authMiddleware, async (req, res) => {
router.get("/admin-post/:id", authMiddleware, async (req, res) => {
  try {
    const slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      descriptions: "your post",
    };

    res.render("admin/admin-post", { locals, data, layout:adminLayout });
  } catch (error) {
    console.log(`something went worng while opening post link : ${error}`);
  }
});


/*
 * GET /
 * ADD POST - PAGE (create new post)
 */
router.get("/add-post", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Add new Post",
      description: "creating new post.",
    };

    const data = await Post.find();

    res.render("admin/add-post", {
      locals,
      layout: adminLayout,
    });
  } catch (error) {
    console.log('(get) error in add post : ',error);
  }
});

/**
 * POST /
 * ADD POST
 */
router.post(
  "/add-post",
  authMiddleware,
  upload.array("media", 10), // Accept up to 10 files
  async (req, res) => {
    try {
      const { title, body } = req.body;
      const mediaUrls = [];
      
      // Access files from req.files
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          // Upload each file to Cloudinary
          const result = await uploadOnCloudinary(file.path);
          if (result) {
            mediaUrls.push(result.secure_url); // Save Cloudinary URL
          } else {
            console.log("Error uploading file to Cloudinary");
          }
        }
      }

      // Create a new post with the uploaded media URLs
      const newPost = new Post({
        title,
        body,
        media: mediaUrls, // Store media URLs in the database
      });
      
      await newPost.save(); // Save the post in the database
      // res.redirect("dashboard");
      return res.send(message('Post add Successfully.', 'dashboard', 1))
    } catch (error) {
      console.log("Error creating post:", error);
      res.status(500).send(message('Failed to add post.', 'dashboard', 1))
    }
  }
);

/*
 * GET /
 * edit POST - PAGE
 */

router.get("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Edit Post",
      body: "editing post",
    };
    const data = await Post.findOne({ _id: req.params.id });
    
    res.render("admin/edit-post", { data, locals, layout: adminLayout });
  } catch (error) {
    console.log('error in edit post (get) : ',error);
  }
});

/*
 * PUT /
 * edit POST - PAGE
 */
router.put("/edit-post/:id", authMiddleware, upload.array("media", 10), async (req, res) => {
  try {

    const postId = req.params.id;

    // Fetch the existing post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    let mediaUrls = post.media || []; // Retain existing media

    // Upload new files to Cloudinary
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await uploadOnCloudinary(file.path);
          if (result) {
            mediaUrls.push(result.secure_url); // Add new media URL
          } else {
            console.error("Error uploading file to Cloudinary:", file.path);
          }
        } catch (error) {
          console.error("Error uploading to Cloudinary:", error);
        }
      }
    }

    // Update the post in the database
    await Post.findByIdAndUpdate(postId, {
      title: req.body.title,
      body: req.body.body,
      media: mediaUrls,
      updatedAt: Date.now(),
    });

    // res.redirect("/admin/dashboard");
    return res.send(message('Post updated Successfully.', '/admin/dashboard', 1))
  } catch (error) {
    console.error("Error editing post:", error);
    res.status(500).send(message('Failed to update post.', 'dashboard', 1))

  }
});


/**
 * GET /
 * DELETE all
 */
router.get("/delete-all-post", authMiddleware, async (req, res) => {
  // for deleting all post
  async function deletePost() {
    try {
      const deletedPost = await Post.deleteMany({});
    } catch (error) {
      console.log(`error in deleting post : ${error}`);
    }
  }
  deletePost();
  res.send("deletd successfully");
});

/**
 * DELETE /
 * DELETE POST
 */

router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
  try {
    // Retrieve the post to access media URLs
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Extract media URLs and delete each media from Cloudinary
    const mediaUrls = post.media; // Assuming 'media' stores an array of Cloudinary URLs
    const deletePromises = mediaUrls.map((url) => {
      const parts = url.split('/');
      const publicIdWithExtension = parts[parts.length - 1]; // Get the file name with extension

      // Extract public ID without file extension
      const deletingFile = publicIdWithExtension.split('.')[0];
      const fileType = publicIdWithExtension.split('.')[1];

      // Determine the resource type (image or video)
      let resourceType;
      if (['mp4', 'avi', 'mov'].includes(fileType)) {
        resourceType = 'video';
      } else {
        resourceType = 'image';
      }

      // Delete the media from Cloudinary
      return deleteFromCloudinary(deletingFile, resourceType);
    });

    // Wait for all deletions to complete
    await Promise.all(deletePromises);

    // Delete the post from the database
    await Post.deleteOne({ _id: req.params.id });

    // Send success message after successful deletion
    return res.send(message('Post Deleted Successfully.', '/admin/dashboard', 2));
  } catch (error) {
    console.log("Error deleting post:", error);
    res.status(500).send("An error occurred while deleting the post.");
  }
});



/**
 * GET /
 * Admin logout
 */
router.get("/logout", authMiddleware, async (req, res) => {
  res.clearCookie("token");
  // res.redirect("/admin/");
  return res.send(message('user logout successfully.','/admin/',1))
});

module.exports = router;
