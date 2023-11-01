import React from "react";

export default function Layout({ children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="h-screen w-full  flex items-center justify-center">
      {children}
    </div>
  );
}

