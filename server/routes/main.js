const express = require("express");
const router = express.Router();
const Post = require("../models/post");

// function insertPostData () {
//   Post.insertMany([
//     {
//       title: "Building APIs with Node.js",
//       body: "Learn how to use Node.js to build RESTful APIs using frameworks like Express.js"
//     },
//     {
//       title: "Deployment of Node.js applications",
//       body: "Understand the different ways to deploy your Node.js applications, including on-premises, cloud, and container environments..."
//     },
//     {
//       title: "Authentication and Authorization in Node.js",
//       body: "Learn how to add authentication and authorization to your Node.js web applications using Passport.js or other authentication libraries."
//     },
//     {
//       title: "Understand how to work with MongoDB and Mongoose",
//       body: "Understand how to work with MongoDB and Mongoose, an Object Data Modeling (ODM) library, in Node.js applications."
//     },
//     {
//       title: "build real-time, event-driven applications in Node.js",
//       body: "Socket.io: Learn how to use Socket.io to build real-time, event-driven applications in Node.js."
//     },

//   ])
// }

// insertPostData()

/**
 * GET /
 * HOME
 */
router.get("", async (req, res) => {
  try {
    const locals = {
      title: "Home",
      desc: "This is a home page",
    };

    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    // Count is deprecated - please use countDocuments
    // const count = await Post.count();
    const count = await Post.countDocuments({});
    const lastPage = Math.ceil(count / perPage);
    // for previous page
    const previousPage = parseInt(page) + 1;
    const haspreviousPage = previousPage <= lastPage;
    // for next page
    const nextPage = parseInt(page) - 1;
    const hasNextPage = nextPage > 0;
    data.forEach( element  => {
      // let filesss = element.media
      element.media.forEach(f => {

        console.log(`data : ${f}`);
      })
    });
    
    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      previousPage: haspreviousPage ? previousPage : null,
      currentRoute: "/",
    });
  } catch (error) {
    console.log(
      `something worng while fetching post from databasse : ${error}`
    );
  }

  /**
   * GET /
   * HOME
   */

  router.get("/post/:id", async (req, res) => {
    try {
      const slug = req.params.id;

      const data = await Post.findById({ _id: slug });

      const locals = {
        title: data.title,
        descriptions: "your post",
      };

      res.render("post", { locals, data });
    } catch (error) {
      console.log(`something went worng while opening post link : ${error}`);
    }
  });

  /* without pagination */
  // try {
  //   const locals = {
  //     title : "Home",
  //     desc : "This is a home page"
  //   }
  //   const data = await Post.find();
  //   res.render('index', {locals, data})
  // } catch (error) {
  //   console.log(`something worng while fetching post from databasse : ${error}`);

  // }
});



/**
 * POST /
 * SEARCH
 */
router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "Search",
      descriptions: "searching data from data base",
    };

    let searchTerm = req.body.searchTerm.replace(/[^a-zA-Z09]/g, "");
    console.log(searchTerm);

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchTerm, "i") } },
        { body: { $regex: new RegExp(searchTerm, "i") } },
      ],
    });

    res.render("search", { locals, data });
  } catch (error) {
    console.log(`something went worng while searching : ${error}`);
  }
});

/**
 * GET /
 * ABOUT
 */

router.get("/about", (req, res) => {
  const locals = {
    title: "About",
    desc: "This is a About page",
  };

  res.render("about", { locals });
});

/**
 * GET /
 * CONTACT
 */

router.get("/contact", (req, res) => {
  const locals = {
    title: "Contact",
    desc: "This is a Contact page",
  };

  res.render("contact", { locals });
});

module.exports = router;
