import Link from "next/link";
import React from "react";
import { IconType } from "react-icons";

// ==============================
// Types
// ==============================
interface LinkCardProps {
  href: string;
  Icon: IconType;
  title: string;
  description: string;
  iconClass?: string;
}

// ==============================
// Component
// ==============================
const LinkCard: React.FC<LinkCardProps> = ({
  href,
  Icon,
  title,
  description,
  iconClass,
}) => {
  return (
    <Link
      href={href}
      className="border rounded-lg p-6 text-center bg-white shadow hover:shadow-lg transition"
    >
      <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-1">
        {Icon && <Icon className={`w-6 h-6 ${iconClass || ""}`} />}
        {title}
      </h3>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
};

export default LinkCard;
