const Published = require("../models/NhaXuatBan");
const NhaXuatBan = require("../models/NhaXuatBan");

class PublishedController {
  async listPublisher(req, res, next) {
    const searchQuery = req.query.search;
    console.log("OKE");
    if (searchQuery) {
      const published = await Published.find();
      console.log(published);
      if (published.length > 0) {
        res.json(published);
      } else {
        res.json({ message: "Không tìm thấy nhà xuất bản" });
      }
    } else {
      Published.find()
        .then((nxbs) => {
          return res.send(nxbs);
        })
        .catch((err) => console.log(err));
    }
  }

  async addPublisher(req, res, next) {
    try {
      const { TenNxb, DiaChi } = req.body;

      if (!TenNxb || !DiaChi) {
        return res.status(400).json({ error: "Thiếu thông tin bắt buộc" });
      }

      const existingPublisher = await NhaXuatBan.findOne({ TenNxb });
      if (existingPublisher) {
        return res.json({
          update: "Nhà Xuất bản đã tồn tại",
          data: existingPublisher,
        });
      } else {
        const newPublisher = new NhaXuatBan({ TenNxb, DiaChi });
        await newPublisher.save();
        console.log("New publisher added:", newPublisher);
        return res
          .status(201)
          .json({ message: "Đã thêm nhà xuất bản", data: newPublisher });
      }
    } catch (error) {
      console.log("Lỗi khi thêm nhà xuất bản:", error);
      res
        .status(500)
        .json({ message: "Lỗi khi thêm nhà xuất bản", error: error.message });
    }
  }

  async updateProduct(req, res, next) {
    try {
      const id = req.params.id;
      const existingPublished = await Published.findById(id);
      if (existingPublished) {
        if (req.body.tenNxb) {
          existingPublished.TenNxb = req.body.tenNxb;
        }
        if (req.body.diaChi) {
          existingPublished.DiaChi = req.body.diaChi;
        }
        await existingPublished.save();
        return res.json({ message: "Nhà xuất bản đã được cập nhật" });
      } else {
        return res.send({ error: "Cập nhật thất bại" });
      }
    } catch (error) {
      console.log("Lỗi khi cập nhật nhà xuất bản", error);
      res.status(500).json({ message: "Lỗi khi cập nhật nhà xuất bản" });
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const id = req.params.id;
      const existingPublished = await Published.findById(id);
      if (!existingPublished) {
        return res.status(404).json({ error: "Không tìm thấy nhà xuất bản" });
      } else {
        await Published.findByIdAndDelete(id);
        return res.send({ message: "Xóa nhà xuất bản thành công" });
      }
    } catch (error) {
      console.log("Lỗi khi xóa nhà xuất bản", error);
      res.status(500).json({ message: "Lỗi khi xóa nhà xuất bản" });
    }
  }
}

module.exports = new PublishedController();
