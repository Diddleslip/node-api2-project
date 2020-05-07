const router = require("express").Router();
const Db = require("../data/db");

router.get("/", (req, res) => {
    Db.find()
    .then(response => {
        console.log(response);
        res.status(201).json({ message: response })
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ message: error.message })
    })
})

router.post("/", (req, res) => {
    const {title, contents} = req.body;

    if(!title || !contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post."})
    } 
    Db.insert({ title, contents})
    .then(({id}) => {
        Db.findById(id)
        .then(([posts]) => {
            res.status(201).json(posts)
        })
    })
    .catch(error => {
        res.status(500).json({ error: "There was an error while saving the post to the database" }, error.message)
    })
})

router.post("/:id/comments", (req, res) => {
    const post_id = req.params.id;
    const text = req.body.text;

    if(!text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." });
    }
    Db.insertComment({post_id, text})
    .then(({id: comment_id}) => {
        Db.findCommentById(comment_id)
        .then(([comment]) => {
            if(comment) {
                res.status(201).json(comment)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
    })
    .catch(error => {
        res.status(500).json({ error: "There was an error while saving the comment to the database" })
    })
})

router.get("/:id", (req, res) => {
    const id = req.params.id;

    Db.findById(id)
    .then(response => {
        const findMethod = response.find(item => item.id == id)
        if(findMethod) {
            res.status(200).json(response)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ message: error.message})
    })
})

router.get("/:id/comments", (req, res) => {
    const id = req.params.id;

    Db.findPostComments(id)
    .then(response => {
        const findMethod = response.find(item => item.post_id == id);
        console.log(response);
        if(!findMethod) {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
            res.status(200).json(response)
        }
    })
    .catch(error => {
        res.sendStatus(500).json({ error: "The comments information could not be retrieved." })
        console.log(error);
    })
})

router.delete("/:id", (req, res) => {
    const id = req.params.id;

    Db.remove(id)
    .then(response => {
        if(response === 0) {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
            res.status(201).json(`This post was deleted: ${id}`);
        }
        // console.log(response);
    })
    .catch(error => {
        res.status(500).json({ error: "The post could not be removed" });
        console.log(error);
    })
})

router.put("/:id", (req, res) => {
    const id = req.params.id;
    const post = req.body;

    if(!post.title || !post.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
    Db.update(id, post)
    .then(response => {
        if(response === 0) {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
            res.status(200).json(response)
        }
        console.log(response);
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ error: "The post information could not be modified." })
    })
    }
})

module.exports = router;