import React from "react";
import Link from "next/link";
import Image from "next/image";
import icon from "../../../public/icon.png";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
const Navbar = () => {
  return (
    <header className="px-4 h-14 sticky top-0 inset-x-0 w-full dark:bg-black  backdrop-blur-lg  z-50">
      <div className="flex items-center justify-between h-full mx-auto md:max-w-screen-xl">
        <div className="flex items-start text-2xl font-semibold ">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/icon.png" alt="" width={32} height={32} />

            <div className="text-washed-blue-600">NeoGather</div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <>
            <Button>
              <Link href="/admin/createRoom">Get Started</Link>
            </Button>
          </>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
