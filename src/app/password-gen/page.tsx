import ToolLayout from "@/components/ToolLayout";
import { Metadata } from "next";
import PasswordClient from "./Client";

export const metadata: Metadata = {
  title: "Password Generator | FreeTools.lk",
  description: "Generate military-grade secure passwords locally on your device.",
};

export default function PasswordGeneratorPage() {
  return (
    <ToolLayout
      title="Password Generator"
      description="Generate military-grade secure passwords instantly"
      icon="🔑"
    >
      <PasswordClient />
    </ToolLayout>
  );
}
