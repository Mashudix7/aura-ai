"use client";

import { usePathname } from "next/navigation";

export default function SelectionGuard() {
    const pathname = usePathname();
    const isChat = pathname?.startsWith("/chat");

    if (isChat) return null;

    return (
        <style dangerouslySetInnerHTML={{
            __html: `
                body {
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                    user-select: none;
                }
                
                input, textarea {
                    -webkit-user-select: auto;
                    -moz-user-select: auto;
                    -ms-user-select: auto;
                    user-select: auto;
                }
            `
        }} />
    );
}
