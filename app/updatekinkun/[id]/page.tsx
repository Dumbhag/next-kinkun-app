"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";

export default function UpdateKinkun() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [foodName, setFoodName] = useState("");
  const [foodWhere, setFoodWhere] = useState("");
  const [foodPay, setFoodPay] = useState("");
  const [imageFile, setImageFile] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 🔥 โหลดข้อมูลเดิม
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("kinkun_tb")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setFoodName(data.food_name);
        setFoodWhere(data.food_where);
        setFoodPay(data.food_pay);
        setImagePreview(data.food_image_url);
      }
    };

    if (id) fetchData();
  }, [id]);

  // 📸 เลือกรูป
  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 💾 บันทึกการแก้ไข
  const handleUpdate = async () => {
    if (!foodName || !foodWhere || !foodPay) {
      alert("กรอกข้อมูลให้ครบ");
      return;
    }

    let image_url = imagePreview;

    // 🔥 ถ้ามีเปลี่ยนรูป
    if (imageFile) {
      const oldName = imagePreview?.split("/").pop() || "";

      // ลบรูปเก่า
      await supabase.storage.from("kinkun").remove([oldName]);

      const newName = `${Date.now()}_${imageFile.name}`;

      // upload ใหม่
      const { error } = await supabase.storage
        .from("kinkun_bk")
        .upload(newName, imageFile);

      if (error) {
        alert("อัพรูปไม่ได้");
        return;
      }

      const { data } = supabase.storage
        .from("kinkun_bk")
        .getPublicUrl(newName);

      image_url = data.publicUrl;
    }

    // update DB
    const { error } = await supabase
      .from("kinkun_tb")
      .update({
        food_name: foodName,
        food_where: foodWhere,
        food_pay: Number(foodPay),
        food_image_url: image_url,
      })
      .eq("id", id);

    if (error) {
      alert("แก้ไขไม่สำเร็จ");
      return;
    }

    alert("แก้ไขสำเร็จ");
    router.push("/showallkinkun");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      
      <div className="bg-white p-8 rounded-xl shadow-md w-[500px] text-center">

        <h1 className="text-blue-500 font-bold text-lg">
          Kinkun APP (Supabase)
        </h1>
        <p className="text-blue-500 mb-4">แก้ไขข้อมูลการกิน</p>

        <div className="flex justify-center mb-4">
          <img src="/foods.png" alt="food" className="w-20" />
        </div>

        <div className="text-left">

          <label className="text-sm text-black">กินอะไร</label>
          <input
            type="text"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-3"
          />

          <label className="text-sm text-black">กินที่ไหน</label>
          <input
            type="text"
            value={foodWhere}
            onChange={(e) => setFoodWhere(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-3"
          />

          <label className="text-sm text-black">กินไปเท่าไร (บาท)</label>
          <input
            type="number"
            value={foodPay}
            onChange={(e) => setFoodPay(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded mb-3"
          />

          {/* upload */}
          <label className="text-sm text-black">รูปกิน</label>
          <div className="mb-3">
            <label className="bg-blue-500 text-white px-4 py-1 rounded cursor-pointer inline-block">
              เลือกรูป
              <input
                type="file"
                onChange={handleImage}
                className="hidden"
              />
            </label>
          </div>

          {/* preview */}
          {imagePreview && (
            <img src={imagePreview} className="w-24 mb-3" />
          )}
        </div>

        <button
          onClick={handleUpdate}
          className="w-full bg-blue-600 text-white py-2 rounded mt-2"
        >
          บันทึกการแก้ไข
        </button>

        <p
          onClick={() => router.push("/showallkinkun")}
          className="text-blue-500 mt-4 cursor-pointer hover:underline"
        >
          กลับไปหน้าข้อมูลการกิน
        </p>
      </div>

      <div className="text-center mt-6 text-sm text-gray-500">
        <p>Created by SAU</p>
        <p>Copyright © 2025 All rights reserved.</p>
      </div>
    </div>
  );
}