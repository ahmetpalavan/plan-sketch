import { Navbar } from './_components/navbar';
import { OrgSidebar } from './_components/org-sidebar';
import { Sidebar } from './_components/sidebar';

interface Props {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: Props) => {
  return (
    <main className='h-full dark:bg-gray-900'>
      <Sidebar />
      <div className='pl-[60px] h-full'>
        <div className='flex gap-x-3 h-screen'>
          <OrgSidebar />
          <div className='h-full flex-1'>
            <Navbar />
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;
