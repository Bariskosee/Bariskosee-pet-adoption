import { ReactNode } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "wouter";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
  linkHref: string;
  linkText: string;
}

const StatCard = ({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  linkHref,
  linkText,
}: StatCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${iconBgColor} rounded-md p-3`}>
            <div className={`text-xl ${iconColor}`}>{icon}</div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-4">
        <div className="text-sm">
          <Link href={linkHref}>
            <span className="font-medium text-primary-600 hover:text-primary-500 cursor-pointer">
              {linkText}
            </span>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default StatCard;
