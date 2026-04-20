"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/services/supabaseClient";

export default function AddKinkun() {
  const router = useRouter();

  const [shop, setShop] = useState("");
  const [menu, setMenu] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!shop || !menu || !price || !imageFile) {
      alert("กรอกข้อมูลให้ครบ");
      return;
    }

    const fileName = `${Date.now()}_${imageFile.name}`;

    const { error: uploadError } = await supabase.storage
      .from("kinkun_bk")
      .upload(fileName, imageFile);

    if (uploadError) {
      alert("อัพโหลดรูปไม่สำเร็จ");
      return;
    }

    const { data } = supabase.storage
      .from("kinkun_bk")
      .getPublicUrl(fileName);

    const image_url = data.publicUrl;

    const { error: insertError } = await supabase
      .from("kinkun_tb")
      .insert([
        {
          food_name: shop,
          food_where: menu,
          food_pay: Number(price),
          food_image_url: image_url,
        },
      ]);

    if (insertError) {
      alert("บันทึกไม่สำเร็จ");
      return;
    }

    alert("บันทึกสำเร็จ");
    router.push("/showallkinkun");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      
      <div className="bg-white p-8 rounded-xl shadow-md w-[500px]">
        
        <h1 className="text-center text-blue-600 font-bold text-lg">
          Kinkun APP (Supabase)
        </h1>
        <p className="text-center text-blue-600 mb-4">
          เพิ่มข้อมูลการกิน
        </p>

        <div className="flex justify-center mb-4">
          <img src="/foods.png" className="w-20" />
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="กินอะไร"
            value={shop}
            onChange={(e) => setShop(e.target.value)}
            className="w-full border p-2 rounded text-gray-900"
          />

          <input
            type="text"
            placeholder="กินที่ไหน"
            value={menu}
            onChange={(e) => setMenu(e.target.value)}
            className="w-full border p-2 rounded text-gray-900"
          />

          <input
            type="number"
            placeholder="ราคา"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border p-2 rounded text-gray-900"
          />

          <div>
            <label className="text-sm text-black block mb-1">รูปกิน</label>

            <label className="bg-blue-500 text-white px-4 py-1 rounded cursor-pointer inline-block">
              เลือกรูป
              <input
                type="file"
                onChange={handleImage}
                className="hidden"
              />
            </label>
          </div>

          {imagePreview && (
            <img src={imagePreview} className="w-24 mt-2" />
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            บันทึกการกิน
          </button>

          <p
            onClick={() => router.push("/showallkinkun")}
            className="text-center text-blue-500 cursor-pointer hover:underline"
          >
            กลับ
          </p>
        </div>
      </div>

      <div className="text-center mt-6 text-sm text-gray-500">
        <p>Created by SAU</p>
        <p>Copyright © 2025 All rights reserved.</p>
      </div>
    </div>
  );
}