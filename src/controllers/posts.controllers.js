const service = require("../services/posts.service");

const parseId = (value) => {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};

const create = async (req, res) => {
  try {
    const { imageUrl, caption, location } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        error: "imageUrl is required",
      });
    }

    const data = { imageUrl };

    if (caption !== undefined) data.caption = caption;
    if (location !== undefined) data.location = location;

    const post = await service.createPost(data);

    return res.status(201).json(post);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const list = async (req, res) => {
  try {
    const posts = await service.listPosts();
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getOne = async (req, res) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(404).json({ error: "Post not found" });
    }

    const post = await service.getPostById(id);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const update = async (req, res) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(404).json({ error: "Post not found" });
    }

    const { caption, location } = req.body;
    const data = {};

    if (caption !== undefined) data.caption = caption;
    if (location !== undefined) data.location = location;

    const post = await service.updatePost(id, data);

    return res.status(200).json(post);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};

const remove = async (req, res) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(404).json({ error: "Post not found" });
    }

    await service.deletePost(id);

    return res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Post not found" });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { create, list, getOne, update, remove };