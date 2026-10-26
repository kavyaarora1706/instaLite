const service = require("../services/users.service");

const parseId = (value) => {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
};

const create = async (req, res) => {
  try {
    const { username, email, fullname, bio } = req.body;

    if (!username || !email || !fullname) {
      return res.status(400).json({
        error: "username, email and fullname are required",
      });
    }

    const data = { username, email, fullname };

    if (bio !== undefined) data.bio = bio;

    const user = await service.createUser(data);

    return res.status(201).json(user);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        error: "username or email already taken",
      });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};

const list = async (req, res) => {
  try {
    const users = await service.listUsers();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getOne = async (req, res) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = await service.getUserById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const update = async (req, res) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(404).json({ error: "User not found" });
    }

    const { fullname, bio, isPrivate } = req.body;
    const data = {};

    if (fullname !== undefined) data.fullname = fullname;
    if (bio !== undefined) data.bio = bio;
    if (isPrivate !== undefined) data.isPrivate = isPrivate;

    const user = await service.updateUser(id, data);

    return res.status(200).json(user);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};

const remove = async (req, res) => {
  try {
    const id = parseId(req.params.id);

    if (id === null) {
      return res.status(404).json({ error: "User not found" });
    }

    await service.deleteUser(id);

    return res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { create, list, getOne, update, remove };