"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const handleLogin = () => {
    if (code === "1234") {
      router.push("/showallkinkun");
    } else {
      alert("Invalid code");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      
      {/* Card */}
      <div className="bg-white p-8 rounded-xl shadow-md w-[420px] text-center">
        
        {/* Title */}
        <h1 className="text-blue-600 font-bold text-xl">
          Kinkun APP (Supabase)
        </h1>
        <p className="text-blue-600 mb-4">บันทึกการกิน</p>

        {/* รูป */}
        <div className="flex justify-center mb-4">
          <Image
            src="/foods.png"
            alt="food"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>

        {/* input */}
        <input
          type="text"
          placeholder="Enter secure code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded mb-4 text-gray-700 placeholder-gray-400"
        />

        {/* button */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
        >
          เข้าใช้งาน
        </button>
      </div>

      {/* footer */}
      <div className="text-center mt-6 text-sm text-gray-600">
        <p>Created by SAU</p>
        <p>Copyright © 2025 All rights reserved.</p>
      </div>
    </div>
  );
}