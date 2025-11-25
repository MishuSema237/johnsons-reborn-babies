"use client";

import { Button } from "@/components/ui/button";
import { FaPrint } from "react-icons/fa";

export function PrintButton() {
    return (
        <Button
            variant="outline"
            onClick={() => window.print()}
            className="flex items-center gap-2 print:hidden"
        >
            <FaPrint />
            Print Receipt
        </Button>
    );
}
