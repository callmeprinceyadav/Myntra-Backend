require("dotenv").config();
const mongoose = require("mongoose");
const ProductModel = require("./Models/productModel");

const products = [
  // Diverse categories matching homepage
  ...["Shirts", "Kurtas", "Casual Shoes", "Flip Flops", "Watches", "Sports Shoes", "Track Pants", "T-Shirts", "Jeans"].flatMap((sub) =>
    Array.from({ length: 12 }).map((_, i) => ({
      image: `https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/product/${sub.replace(/ /g, "-")}/${i + 1}/img.jpg`,
      title: `${sub} Style ${i + 1}`,
      brand: ["Roadster", "WROGN", "Puma", "Casio", "Adidas", "Levis", "HRX"][i % 7],
      description: `A premium ${sub} for style and comfort. Perfect for everyday wear.`,
      sizes: sub.includes("Shoes") ? ["7", "8", "9", "10"] : ["S", "M", "L", "XL"],
      price: 999 + i * 300,
      subcategory: sub,
      category: i % 3 === 0 ? "Kids" : i % 2 === 0 ? "Men" : "Women",
      stock: 30,
    }))
  ),

  ...["Dresses", "Handbags", "Jewellery", "Sarees", "Kurtas", "Innerwear"].flatMap((sub) =>
    Array.from({ length: 10 }).map((_, i) => ({
      image: `https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/women/${sub.replace(/ /g, "-")}/${i + 1}/img.jpg`,
      title: `Women's ${sub} ${i + 1}`,
      brand: ["Biba", "Libas", "Anouk", "Zaveri Pearls", "Lavie", "Sangria"][i % 6],
      description: `Elegant ${sub} for women. Crafted with high-quality materials.`,
      sizes: sub === "Jewellery" || sub === "Handbags" ? ["Onesize"] : ["S", "M", "L", "XL"],
      price: 1499 + i * 500,
      subcategory: sub,
      category: "Women",
      stock: 20,
    }))
  ),

  ...["T-Shirts", "Infant Essentials", "Bath Essentials"].flatMap((sub) =>
    Array.from({ length: 8 }).map((_, i) => ({
      image: `https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/kids/${sub.replace(/ /g, "-")}/${i + 1}/img.jpg`,
      title: `Kids ${sub} ${i + 1}`,
      brand: ["U.S. Polo Assn. Kids", "Max", "Mothercare", "Gini & Jony"][i % 4],
      description: `Comfortable and adorable ${sub} for children.`,
      sizes: ["0-1Y", "1-2Y", "2-3Y", "4-5Y"],
      price: 499 + i * 150,
      subcategory: sub,
      category: "Kids",
      stock: 40,
    }))
  ),
];

const seedDB = async () => {
  try {
    if (!process.env.mongoURL) {
       console.error("Error: mongoURL not found in environment variables.");
       process.exit(1);
    }
    await mongoose.connect(process.env.mongoURL);
    console.log("Connected to MongoDB for seeding...");

    await ProductModel.deleteMany({});
    console.log("Cleared existing products.");

    await ProductModel.insertMany(products);
    console.log(`Seeding successful! Total items: ${products.length}`);

    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDB();
