"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { useRouter } from "next/navigation";

export default function ShowAllKinkun() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("kinkun_tb")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("DATA:", data); // 🔥 debug ดู URL รูป

    if (!error) {
      setData(data || []);
    }
  };

  useEffect(() => {
    fetchData();

    const handleFocus = () => {
      fetchData();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const handleDelete = async (id: string, image_url: string) => {
    if (!confirm("คุณแน่ใจว่าต้องการลบรายการนี้?")) return;

    await supabase.from("kinkun_tb").delete().eq("id", id);

    const fileName = image_url?.split("/").pop();
    if (fileName) {
      await supabase.storage.from("kinkun_bk").remove([fileName]);
    }

    fetchData();
  };

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      
      <div className="bg-white p-6 rounded-xl shadow-md w-[800px]">

        <h1 className="text-center text-blue-500 font-bold text-lg mb-4">
          Kinkun APP (Supabase) <br /> ข้อมูลการกิน
        </h1>

        <div className="flex justify-center mb-4">
          <img src="/foods.png" alt="food" className="w-20" />
        </div>

        <div className="flex justify-end mb-3">
          <button
            onClick={() => router.push("/addkinkun")}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            เพิ่มการกิน
          </button>
        </div>

        <table className="w-full border text-sm">
          <thead className="bg-gray-200 text-gray-800">
            <tr>
              <th className="border p-2">รูป</th>
              <th className="border p-2">ร้าน</th>
              <th className="border p-2">เมนู</th>
              <th className="border p-2">ราคา</th>
              <th className="border p-2">ACTION</th>
            </tr>
          </thead>

          <tbody className="text-gray-700">
            {data.map((item) => (
              <tr key={item.id}>
                
                {/* รูป (กันพัง + debug) */}
                <td className="border p-2 text-center">
                  <div className="w-16 h-16 mx-auto overflow-hidden rounded">
                  <img
                       src={item.food_image_url || "/foods.png"}
                        onError={(e) => {
                      console.log("โหลดรูปไม่ได้:", item.food_image_url);
                     (e.target as HTMLImageElement).src = "/foods.png";
                      }}
                      className="w-full h-full object-cover"
                 />
                </div>
                </td>

                <td className="border p-2">{item.food_where}</td>
                <td className="border p-2">{item.food_name}</td>
                <td className="border p-2">{item.food_pay}</td>

                <td className="border p-2 text-center">
                  <button
                    onClick={() =>
                      router.push(`/updatekinkun/${item.id}`)
                    }
                    className="text-green-700 mr-2"
                  >
                    แก้ไข
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(item.id, item.food_image_url)
                    }
                    className="text-red-700"
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p
          onClick={handleLogout}
          className="text-center mt-4 text-blue-500 cursor-pointer hover:underline"
        >
          ออกจากการใช้งาน
        </p>

        <div className="text-center mt-4 text-sm text-gray-500">
          <p>Created by SAU</p>
          <p>Copyright © 2025 All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}