// Sidebar.tsx
import { FC } from "react";
import {
  AiOutlineHome,
  AiOutlineFolder,
  AiOutlineDownload,
  AiOutlineHeart,
  AiOutlineSetting,
  AiOutlineQuestionCircle,
  AiOutlineLogout,
} from "react-icons/ai";

const Sidebar: FC = () => (
  <aside className="w-64 bg-gray-100 h-screen p-5">
    <h2 className="text-xl font-bold mb-5">The Books</h2>
    <nav className="space-y-4">
      <SidebarLink Icon={AiOutlineHome} label="Discover" />
      <SidebarLink Icon={AiOutlineFolder} label="Category" />
      <SidebarLink Icon={AiOutlineDownload} label="My Library" />
      <SidebarLink Icon={AiOutlineHeart} label="Favorite" />
      <SidebarLink Icon={AiOutlineSetting} label="Setting" />
      <SidebarLink Icon={AiOutlineQuestionCircle} label="Help" />
      <SidebarLink Icon={AiOutlineLogout} label="Log out" />
    </nav>
  </aside>
);

interface SidebarLinkProps {
  Icon: FC;
  label: string;
}

const SidebarLink: FC<SidebarLinkProps> = ({ Icon, label }) => (
  <div className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-200 rounded-lg">
    <Icon />
    <span>{label}</span>
  </div>
);

export default Sidebar;
