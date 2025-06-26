import Container from "@/components/global/container";
import Wrapper from "@/components/global/wrapper";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import BorderBeam from "@/components/ui/border-beam";
import Navbar from '@/components/navigation/navbar';
import {motion} from "framer-motion"
export default function Homepage() {
  return (
    <section className="w-full relative flex flex-col items-center justify-center px-4 md:px-0 py-8 dark:bg-black
     "    >
        <Navbar/>
      <Wrapper>
        <Container>
          <div className="flex flex-col items-center justify-center py-15 h-full">
            {/* Heading & Description */}
            <div className="flex flex-col items-center justify-center text-washed-purple-700items-center max-w-5xl w-11/12 md:w-full">
              <h1 className="text-4xl  md:text-6xl font-bold text-center bg-clip-text bg-gradient-to-b  leading-tight">
                Interactive spaces for teamwork, networking, and socializing
              </h1>
              <p className="text-base font-semibold  md:text-lg text-foreground/80 mt-9 text-center w-80">
                Engage, collaborate, and communicate effortlessly in a virtual
                space built for meaningful interactions.
              </p>
              <div className="hidden md:flex relative items-center justify-center mt-8 md:mt-12 w-full">
                <Link
                  href="#"
                  className="flex items-center justify-center w-max rounded-full border-t border-foreground/30 bg-white/20 backdrop-blur-lg px-2 py-1 md:py-2 gap-2 md:gap-8 shadow-3xl shadow-background/40 cursor-grab select-none"
                >
                  <p className="text-foreground text-sm text-center md:text-base font-medium pl-4 pr-4 lg:pr-0">
                    ✨ Start building your virtual space today!
                  </p>
                  <Button size="sm" className="rounded-full hidden lg:flex border border-foreground/20">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Centered Image with Blurred Background */}
            <div className="relative flex items-center justify-center py-10 md:py-20 w-full">
              {/* Blurred Background Layer */}
              <div className="absolute top-1/2 left-1/2 z-0 w-3/4 -translate-x-1/2 h-3/4 -translate-y-1/2 inset-0 blur-[8rem] bg-[#7000ff] backdrop-blur-3xl"></div>

              {/* Centered Image Container */}
              <div className="flex justify-center items-center w-full">
                <div className="rounded-xl p-2 ring-1 ring-inset ring-foreground/20 lg:rounded-3xl bg-primary-blue-500/10 backdrop-blur-3xl">
                  <Image
                    src="/dashboard.svg"
                    alt="banner image"
                    width={800}
                    height={400}
                    quality={100}
                    className="rounded-md lg:rounded-xl bg-foreground/10 shadow-2xl ring-1 ring-border mx-auto"
                  />
                  <BorderBeam size={250} duration={12} delay={9} />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Wrapper>
    </section>
  );
};


