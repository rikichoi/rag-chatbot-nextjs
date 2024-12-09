import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import UserProfileButton from "./UserProfileButton";
import Link from "next/link";

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  const menuOptions = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Chat",
      link: "/chat",
    },
    {
      name: "Train",
      link: "/train",
    },
  ];
  return (
    <nav className="fixed top-0 mx-auto flex min-h-12 w-full items-center border-b bg-slate-50">
      <div className="mx-auto flex w-full max-w-4xl justify-between">
        {/* TODO: Add menu? */}
        <div className="items-center flex gap-5">
          {menuOptions.map((option, index) => (
            <Link key={index} href={option.link}>
              {option.name}
            </Link>
          ))}
        </div>
        <UserProfileButton session={session} />
      </div>
    </nav>
  );
}
